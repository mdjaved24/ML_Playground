"""
Django REST API for a machine learning model training and prediction system.

This module provides endpoints for:
- Uploading and previewing datasets
- Training machine learning models
- Saving and managing trained models
- Making predictions with saved models
- Downloading models
- Dashboard statistics
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.cache import cache
from django.http import HttpResponse
from django.conf import settings
from django.core.files.base import ContentFile
import uuid
from django.db.models import Avg, Count, Case, When, Value, CharField
from sklearn import logger

from backend_app.models import UploadedDataset, ModelConfig, SavedModel
from backend_app.files.serializers import (
    UploadFileSerializer, 
    ModelConfigSerializer, 
    SaveModelSerializer, 
    PredictionSerializer, 
    DatasetPreviewSerializer
)
from backend_app.files.utils import read_file, preprocess_and_train, load_model_and_predict
from backend_app.files.permissions import IsCreatedUser

import pandas as pd
import joblib
import os
import json
import hashlib
import zipfile
import io
from django.utils.text import slugify
from urllib.parse import quote


class UploadFileView(APIView):
    """
    API endpoint for uploading dataset files.
    
    Handles POST requests to upload files and associate them with the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handle file upload.
        
        Args:
            request: Django request object containing the file and user info
            
        Returns:
            Response: Serialized file data or validation errors
        """
        request.data['user'] = request.user.id
        serializer = UploadFileSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DatasetPreviewAPI(APIView):
    """
    API endpoint for previewing dataset contents before processing.
    
    Provides statistics, column information, and sample data.
    """
    def post(self, request):
        """
        Generate preview of dataset including statistics and sample data.
        
        Args:
            request: Django request object containing the dataset file
            
        Returns:
            Response: Dataset preview data or error message
        """
        serializer = DatasetPreviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        dataset_obj = request.FILES.get('dataset')
        rows_count = int(request.data.get('row_count', 5))  # Default to 5 rows

        if not dataset_obj:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Read file based on extension
            if dataset_obj.name.endswith('.csv'):
                df = pd.read_csv(dataset_obj)
            elif dataset_obj.name.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(dataset_obj)
            else:
                return Response(
                    {"error": "Unsupported file format. Only CSV and Excel files are supported"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Limit preview rows to actual dataset size
            if rows_count > df.shape[0]:
                rows_count = df.shape[0]
                
            # Prepare preview data
            preview_data = df.head(rows_count).fillna('').to_dict(orient='records')
            columns = list(df.columns)
            
            # Generate statistics
            try:
                stats = df.describe()
            except Exception as e:
                stats = {"error": f"Could not generate stats: {str(e)}"}

            # Generate correlations
            try:
                correlation = df.corr(numeric_only=True).fillna('').to_dict()
            except Exception as e:
                correlation = {"error": f"Could not generate correlation: {str(e)}"}
            
            # Detect column types
            column_types = {}
            for col in columns:
                unique_values = df[col].dropna().unique()
                
                if pd.api.types.is_numeric_dtype(df[col]):
                    # Treat binary numeric columns as categorical
                    column_types[col] = 'categorical' if len(unique_values) <= 5 else 'numeric'
                else:
                    column_types[col] = 'categorical'

            return Response({
                "data": preview_data,
                "columns": columns,
                "column_types": column_types,
                "stats": stats,
                "correlation": correlation
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Error processing file: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ModelTrainigView(APIView):
    """
    API endpoint for training machine learning models.
    
    Handles the complete model training pipeline including validation, preprocessing,
    training, and caching of trained models.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Train a machine learning model with the provided dataset and configuration.
        
        Args:
            request: Django request object containing dataset and training config
            
        Returns:
            Response: Training results including model cache keys or error message
        """
        try:
            # 1. Validate file exists
            if 'dataset' not in request.FILES:
                return Response({"error": "No file uploaded"}, status=400)

            dataset = request.FILES['dataset']
            name = request.data.get('name')

            # 2. Validate config exists and is valid JSON
            if 'config' not in request.data:
                return Response({"error": "No config provided"}, status=400)

            try:
                config = json.loads(request.data.get('config'))
            except json.JSONDecodeError as e:
                return Response({"error": f"Invalid JSON config: {str(e)}"}, status=400)

            # 3. Validate required config fields
            required_fields = ['features', 'target_column', 'model_type']
            missing_fields = [field for field in required_fields if field not in config]
            if missing_fields:
                return Response({
                    "error": "Missing required fields in config",
                    "missing_fields": missing_fields
                }, status=400)

            # 4. Compute hash and check if file already exists
            dataset_hash = calculate_dataset_hash(dataset=dataset)

            file_instance, created = UploadedDataset.objects.get_or_create(
                dataset_hash=dataset_hash,
                defaults={
                    'dataset': dataset,
                    'name': name,
                    'user': request.user
                }
            )

            # 5. Prepare data for config serializer
            serializer_data = {
                'dataset': file_instance.id,
                'user': request.user.id,
                **config
            }

            serializer = ModelConfigSerializer(data=serializer_data)
            if not serializer.is_valid():
                return Response({
                    "error": "Validation error",
                    "details": serializer.errors
                }, status=400)

            # 6. Read and validate the dataset
            try:
                df = pd.read_csv(file_instance.dataset)

                if df.empty:
                    return Response({"error": "Uploaded file is empty"}, status=400)

                # Validate features and target exist in dataset
                missing_features = [f for f in config['features'] if f not in df.columns]
                if missing_features:
                    return Response({
                        "error": "Some features not found in dataset",
                        "missing_features": missing_features
                    }, status=400)

                if config['target_column'] not in df.columns:
                    return Response({
                        "error": f"Target column '{config['target_column']}' not found in dataset"
                    }, status=400)

                # 7. Train the model
                feature_types, categorical_values, training_time, model, feature_encoder, scaler, target_encoder, accuracy = preprocess_and_train(
                    df,
                    config={
                        'features': config['features'],
                        'target': config['target_column'],
                        'encoder': config['encoder'],
                        'scaler': config['scaler'],
                        'test_size': float(config['test_size']),
                        'random_state': int(config['random_state']),
                        'model_type': config['model_type'],
                        'stratify': config.get('stratify', False),
                        'problem_type': config.get('problem_type'),
                        "parameters": clean_parameters(config.get("parameters", {}))
                    }
                )

                config['feature_types'] = feature_types
                config['categorical_values'] = categorical_values
                config['training_time'] = training_time

                # 8. Cache trained components
                model_cache_key = f'trained_model_{uuid.uuid4()}'
                encoder_cache_key = f'trained_encoder_{uuid.uuid4()}'
                scaler_cache_key = f'trained_scaler_{uuid.uuid4()}'
                target_encoder_cache_key = f'target_encoder_{uuid.uuid4()}'

                cache.set(model_cache_key, model, timeout=3600)
                cache.set(encoder_cache_key, feature_encoder, timeout=3600)
                cache.set(scaler_cache_key, scaler, timeout=3600)
                cache.set(target_encoder_cache_key, target_encoder, timeout=3600)

                # 9. Save config to DB
                serializer.validated_data['accuracy'] = accuracy

                # 10. Return response
                return Response({
                    'name': name,
                    'dataset': file_instance.id,
                    'config': {
                        'model_type': config['model_type'],
                        'features': config['features'],
                        'feature_types': config['feature_types'],
                        'categorical_values': config['categorical_values'],
                        'training_time': config['training_time'],
                        'target_column': config['target_column'],
                        'encoder': config['encoder'],
                        'scaler': config['scaler'],
                        'test_size': config['test_size'],
                        'random_state': config['random_state'],
                        'stratify': config.get('stratify', False),
                        'parameters': config.get('parameters', {}),
                        'problem_type': config.get('problem_type', ''),
                        'accuracy': accuracy
                    },
                    "file_status": "new" if created else "existing",
                    'accuracy': accuracy,
                    'model_cache_key': model_cache_key,
                    'encoder_cache_key': encoder_cache_key,
                    'scaler_cache_key': scaler_cache_key,
                    'target_encoder_cache_key': target_encoder_cache_key
                })

            except Exception as e:
                return Response({"error": f"Model training failed: {str(e)}"}, status=400)

        except Exception as e:
            return Response({"error": f"Server error: {str(e)}"}, status=500)


class SaveModelView(APIView):
    """
    API endpoint for saving trained models to persistent storage.
    
    Handles serialization of trained models and associated preprocessing objects.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save a trained model to persistent storage.
        
        Args:
            request: Django request object containing model cache keys and config
            
        Returns:
            Response: Serialized model data or error message
        """
        # Validate required fields
        required_fields = ['name', 'dataset', 'config', 'accuracy', 
                         'model_cache_key', 'encoder_cache_key', 
                         'scaler_cache_key', 'target_encoder_cache_key']
        
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {'error': f'Missing required field: {field}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Get cache keys
        model_cache_key = request.data.get('model_cache_key')
        encoder_cache_key = request.data.get('encoder_cache_key')
        scaler_cache_key = request.data.get('scaler_cache_key')
        target_encoder_cache_key = request.data.get('target_encoder_cache_key')

        config = request.data.get('config')
        dataset = request.data.get('dataset')
        name = request.data.get('name')
        accuracy = request.data.get('accuracy')

        try:
            if isinstance(config, str):
                config = json.loads(config)
        except Exception as e:
            return Response({'error': f'Invalid config format: {str(e)}'}, status=400)

        # Retrieve objects from cache
        try:
            model = cache.get(model_cache_key)
            if not model:
                return Response(
                    {'error': 'Model not found in cache. Please train the model first.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            encoder = cache.get(encoder_cache_key)
            scaler = cache.get(scaler_cache_key)
            target_encoder = cache.get(target_encoder_cache_key)

        except Exception as e:
            return Response(
                {'error': f'Error retrieving from cache: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save model file
        try:
            model_file_name = f'{name}_{uuid.uuid4().hex[:8]}.joblib'
            model_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_models', model_file_name)
            os.makedirs(os.path.dirname(model_file_path), exist_ok=True)
            joblib.dump(model, model_file_path)
            with open(model_file_path, 'rb') as f:
                model_file_content = ContentFile(f.read(), name=model_file_name)
        except Exception as e:
            return Response(
                {'error': f'Error saving model: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save encoder file if exists
        encoder_file_content = None
        if encoder:
            try:
                encoder_file_name = f'{name}_encoder_{uuid.uuid4().hex[:8]}.joblib'
                encoder_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_encoders', encoder_file_name)
                os.makedirs(os.path.dirname(encoder_file_path), exist_ok=True)
                joblib.dump(encoder, encoder_file_path)
                with open(encoder_file_path, 'rb') as f:
                    encoder_file_content = ContentFile(f.read(), name=encoder_file_name)
            except Exception as e:
                return Response(
                    {'error': f'Error saving encoder: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        # Save scaler file if exists
        scaler_file_content = None
        if scaler:
            try:
                scaler_file_name = f'{name}_scaler_{uuid.uuid4().hex[:8]}.joblib'
                scaler_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_scalers', scaler_file_name)
                os.makedirs(os.path.dirname(scaler_file_path), exist_ok=True)
                joblib.dump(scaler, scaler_file_path)
                with open(scaler_file_path, 'rb') as f:
                    scaler_file_content = ContentFile(f.read(), name=scaler_file_name)
            except Exception as e:
                return Response(
                    {'error': f'Error saving scaler: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        # Save target encoder file if exists
        target_encoder_content = None
        if target_encoder:
            try:
                target_encoder_name = f'{name}_target_encoder_{uuid.uuid4().hex[:8]}.joblib'
                target_encoder_path = os.path.join(settings.MEDIA_ROOT, 'saved_target_encoders', target_encoder_name)
                os.makedirs(os.path.dirname(target_encoder_path), exist_ok=True)
                joblib.dump(target_encoder, target_encoder_path)
                with open(target_encoder_path, 'rb') as f:
                    target_encoder_content = ContentFile(f.read(), name=target_encoder_name)
            except Exception as e:
                return Response(
                    {'error': f'Error saving target encoder: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        # Calculate accuracy value based on problem type
        accuracy_val = 0.0
        if config.get('problem_type') == 'regression':
            r2_score = accuracy.get('r2_score') if accuracy else None
            try:
                accuracy_val = float(r2_score) if r2_score is not None else 0.0
            except (TypeError, ValueError):
                accuracy_val = 0.0
        else:
            if isinstance(accuracy, dict):
                accuracy_val = accuracy.get('accuracy_score', 0.0)
            try:
                accuracy_val = float(accuracy_val)
            except (TypeError, ValueError):
                return Response({"error": "Invalid accuracy value"}, status=400)
        
        accuracy_val = round(accuracy_val * 100, 2)

        # Save the model config
        try:
            config_obj = ModelConfig.objects.create(
                dataset_id=dataset,
                user=request.user,
                model_type=config.get('model_type'),
                features=config.get('features'),
                feature_types=config.get('feature_types'),
                categorical_values=config.get('categorical_values'),
                training_time=config.get('training_time'),
                target_column=config.get('target_column'),
                encoder=config.get('encoder'),
                scaler=config.get('scaler'),
                test_size=float(config.get('test_size')),
                random_state=config.get('random_state'),
                stratify=config.get('stratify'),
                accuracy=accuracy_val,
                parameters=config.get("parameters", {}),
                problem_type=config.get("problem_type", "")
            )
        except Exception as e:
            return Response({"error": f"Failed to save model config: {str(e)}"}, status=500)

        # Prepare data for serializer
        data = {
            "name": name,
            "user": request.user.id,
            "dataset": dataset,
            "algorithm": config_obj.model_type,
            "accuracy": config_obj.accuracy,
            "config": config_obj.id,
            "model_file": model_file_content,
            "encoder_file": encoder_file_content,
            "scaler_file": scaler_file_content,
            "target_encoder": target_encoder_content
        }

        # Validate and save
        serializer = SaveModelSerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': f'Error saving to database: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request):
        """
        Retrieve all saved models for the authenticated user.
        
        Args:
            request: Django request object
            
        Returns:
            Response: List of serialized saved models
        """
        try:
            models = SavedModel.objects.filter(
                user=request.user, 
                is_active=True
            ).select_related(
                'dataset',
                'config'
            ).order_by('-created_at')
            
            serializer = SaveModelSerializer(models, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Error retrieving models: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SavedModelDetailView(APIView):
    """
    API endpoint for managing individual saved models.
    
    Supports retrieving and deleting specific models.
    Handles associated file cleanup including:
    - Model files
    - Encoder files
    - Scaler files
    - Target encoder files
    - Uploaded dataset (if not used by other models)
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """
        Delete a saved model and its associated files.
        Also deletes the uploaded dataset if it's not used by any other models.
        
        Args:
            request: Django request object
            pk: Primary key of the model to delete
            
        Returns:
            Response: Success or error message
        """
        try:
            # Get model and verify ownership
            model = SavedModel.objects.get(pk=pk, user=request.user)
            config = model.config
            dataset = config.dataset if config else None

            # Delete associated files
            if model.model_file:
                model.model_file.delete()
            if model.encoder_file:
                model.encoder_file.delete()
            if model.scaler_file:
                model.scaler_file.delete()
            if model.target_encoder:
                model.target_encoder.delete()

            # Delete the model record
            model.delete()

            if config:
                config.delete()

            # Check if we should delete the dataset
            if dataset:
                # Count how many configs are using this dataset
                config_count = ModelConfig.objects.filter(dataset=dataset).count()
                
                # If this was the only config using the dataset, delete the dataset
                if config_count == 0:
                    # Delete the dataset file first
                    if dataset.dataset:
                        dataset.dataset.delete()
                    # Then delete the dataset record
                    dataset.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except SavedModel.DoesNotExist:
            return Response(
                {'error': 'Model not found or you don\'t have permission'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PredictionView(APIView):
    """
    API endpoint for making predictions with saved models.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """
        Make a prediction using a saved model.
        
        Args:
            request: Django request object containing input data
            pk: Primary key of the model to use for prediction
            
        Returns:
            Response: Prediction result or error message
        """
        try:
            # 1. Get the saved model and config
            saved_model = SavedModel.objects.select_related('config').get(pk=pk, user=request.user)
            config = saved_model.config
            
            # 2. Get the expected columns from the model's config
            expected_columns = config.features
            
            # 3. Process input data
            input_data = request.data
            features = []
            provided_columns = []
            
            # Handle dictionary input
            if 'inputs' in input_data and isinstance(input_data['inputs'], dict):
                input_dict = input_data['inputs']
                features = [input_dict.get(col) for col in expected_columns]
                provided_columns = expected_columns
            
            # Handle array input with columns
            elif 'values' in input_data and 'columns' in input_data:
                features = input_data['values']
                provided_columns = input_data['columns']
                
                # Create mapping from provided columns to expected columns
                input_dict = dict(zip(provided_columns, features))
                features = [input_dict.get(col) for col in expected_columns]
                provided_columns = expected_columns
            
            else:
                return Response(
                    {"error": "Invalid input format. Use either {'inputs': {}} or {'values': [], 'columns': []}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 4. Validate we have all required features
            missing_features = [col for col, val in zip(expected_columns, features) if val is None]
            if missing_features:
                return Response(
                    {"error": f"Missing required features: {', '.join(missing_features)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 5. Make prediction
            prediction = load_model_and_predict(
                model_path=saved_model.model_file.path,
                features=features,
                columns=expected_columns,
                encoder=saved_model.encoder_file.path if saved_model.encoder_file else None,
                scaler=saved_model.scaler_file.path if saved_model.scaler_file else None,
                target_encoder=saved_model.target_encoder.path if saved_model.target_encoder else None
            )
            
            return Response({
                'prediction': prediction,
                'status': 'success'
            })

        except SavedModel.DoesNotExist:
            return Response(
                {"error": "Model not found or access denied"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Prediction failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ModelDownloadView(APIView):
    """
    API endpoint for downloading saved models as zip files.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Download a saved model and its associated files as a zip archive.
        
        Args:
            request: Django request object
            pk: Primary key of the model to download
            
        Returns:
            Response: Zip file download or error message
        """
        try:
            saved_model = SavedModel.objects.get(pk=pk, user=request.user)
            
            # Create filename using model name
            filename = f"{slugify(saved_model.name)}_{pk}.zip" 
            
            # Create in-memory zip
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Add model file
                if saved_model.model_file and os.path.exists(saved_model.model_file.path):
                    zip_file.write(saved_model.model_file.path, 'model.joblib')
                if saved_model.encoder_file and os.path.exists(saved_model.encoder_file.path):
                    zip_file.write(saved_model.encoder_file.path, 'encoder.joblib')
                if saved_model.scaler_file and os.path.exists(saved_model.scaler_file.path):
                    zip_file.write(saved_model.scaler_file.path, 'scaler.joblib')
                if saved_model.target_encoder and os.path.exists(saved_model.target_encoder.path):
                    zip_file.write(saved_model.target_encoder.path, 'target_encoder.joblib')
            
            zip_buffer.seek(0)
            response = HttpResponse(zip_buffer, content_type='application/zip')
            
            # Set filename in header
            response['Content-Disposition'] = (
                f"attachment; "
                f"filename*=UTF-8''{quote(filename)};"
                f'filename="{filename}"'
            )
            return response
            
        except SavedModel.DoesNotExist:
            return Response({"error": "Model not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Download failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStats(APIView):
    """
    API endpoint for retrieving dashboard statistics about user's models.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve statistics about the authenticated user's models.
        
        Args:
            request: Django request object
            
        Returns:
            Response: Statistics including counts, averages, and distributions
        """
        queryset = SavedModel.objects.filter(user=request.user)
        total_models = queryset.count()
        active_models = queryset.filter(is_active=True).count()

        accuracy_stats = queryset.aggregate(
            avg_accuracy=Avg('accuracy'),
            avg_training_time=Avg('config__training_time')
        )

        model_types = queryset.values('config__problem_type').annotate(count=Count('id'))
        recent_models = queryset.order_by('-created_at')[:3].values(
            'name',
            'config__problem_type',
            'accuracy',
            'created_at'
        )

        performance = queryset.annotate(
            performance_range=Case(
                When(accuracy__gt=90, then=Value('High (>90%)')),
                When(accuracy__gt=80, then=Value('Good (80-90%)')),
                When(accuracy__gt=70, then=Value('Fair (70-80%)')),
                default=Value('Poor (<70%)'),
                output_field=CharField()
            )
        ).values('performance_range').annotate(
            count=Count('id'),
            avg_accuracy=Avg('accuracy')
        ).order_by('-avg_accuracy')

        return Response({
            'total_models': total_models,
            'active_models': active_models,
            'avg_accuracy': accuracy_stats['avg_accuracy'] or 0,
            'avg_training_time': accuracy_stats['avg_training_time'] or 0,
            'model_types': {item['config__problem_type'].lower(): item['count'] for item in model_types},
            'recent_activity': list(recent_models),
            'performance_distribution': list(performance)
        })


def calculate_dataset_hash(dataset):
    """
    Calculate SHA256 hash of a dataset file for deduplication.
    
    Args:
        dataset: File object to hash
        
    Returns:
        str: Hex digest of the file's SHA256 hash
    """
    hasher = hashlib.sha256()
    for chunk in dataset.chunks():
        hasher.update(chunk)
    return hasher.hexdigest()


def clean_parameters(params):
    """
    Clean model parameters by removing empty values and converting numbers.
    
    Args:
        params: Dictionary of model parameters
        
    Returns:
        dict: Cleaned parameters dictionary
    """
    cleaned = {}
    for k, v in params.items():
        if v in [None, ""]:
            continue
        try:
            cleaned[k] = int(v) if str(v).isdigit() else float(v)
        except ValueError:
            cleaned[k] = v 
    return cleaned