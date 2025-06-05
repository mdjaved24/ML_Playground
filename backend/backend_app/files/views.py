from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.core.cache import cache
from django.conf import settings
from django.core.files.base import ContentFile
import uuid

from backend_app.models import UploadedFile, ModelConfig, SavedModel
from backend_app.files.serializers import UploadFileSerializer, ModelConfigSerializer, SaveModelSerializer, PredictionSerializer
from backend_app.files.utils import read_file, preprocess_and_train, load_model_and_predict
from backend_app.files.permissions import IsCreatedUser

import pandas as pd
import joblib
import os

class UploadFileView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        request.data['user'] = request.user.id
        serializer = UploadFileSerializer(data=request.data)

        if serializer.is_valid():
            # extension = serializer.validated_data['file_path'].split('.')[-1]
            file_path = serializer.validated_data['file_path']
            file_name = file_path.name
            print(file_name)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ColumnsView(APIView):

    def get(self,request,pk):
        try:
            uploaded_file = UploadedFile.objects.get(pk=pk)
            # extension = os.path.splitext(uploaded_file.file_name)[1].lower()
            file_path = uploaded_file.file_path.path
            df = read_file(file_path)

            columns = df.columns.tolist()  # Convert Index object to a list

            return Response({'columns':columns}, status=status.HTTP_200_OK)

        except UploadedFile.DoesNotExist:
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)
        except pd.errors.EmptyDataError:
            return Response({"error": "The file is empty."}, status=status.HTTP_400_BAD_REQUEST)
        except pd.errors.ParserError:
            return Response({"error": "The file is not a valid CSV or Excel file."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to process the file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        

class ModelTrainigView(APIView):

    permission_classes = [IsAuthenticated, IsCreatedUser]

    def post(self,request, pk):
        try:
            uploaded_file = UploadedFile.objects.get(pk=pk)
            file_path = uploaded_file.file_path.path
            df = read_file(file_path)

            request.data['user'] = request.user.id  # Automatically set user_id
            request.data['file'] = uploaded_file.id  # Set file_id from URL parameter
            print(request.data)

            serializer = ModelConfigSerializer(data=request.data)
            config = {}
            if serializer.is_valid():
                
                config['features'] = serializer.validated_data['features']
                config['target'] = serializer.validated_data['target_column']
                config['encoder'] = serializer.validated_data['encoder']
                config['scaler'] = serializer.validated_data['scaler']
                config['test_size'] = serializer.validated_data['test_size']
                config['random_state'] = serializer.validated_data['random_state']
                config['model_type'] = serializer.validated_data['model_type']

                model, encoder, scaler, accuracy = preprocess_and_train(df, config)

                print(model)
                print(encoder)
                print(scaler)

                model_cache_key = f'trained_model_{uuid.uuid4()}'
                encoder_cache_key = f'trained_encoder_{uuid.uuid4()}'
                scaler_cache_key = f'trained_scaler_{uuid.uuid4()}'

                print('train cache_key: ',model_cache_key)

                cache.set(model_cache_key,model,timeout=3600)
                cache.set(encoder_cache_key,encoder,timeout=3600)
                cache.set(scaler_cache_key,scaler,timeout=3600)

                # print('Serialized-',serializer.validated_data)

                serializer.validated_data['accuracy'] = accuracy

                serializer.save()
                
                return Response({'accuracy':accuracy,'model_cache_key':model_cache_key,'encoder_cache_key':encoder_cache_key,'scaler_cache_key':scaler_cache_key},status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"Failed to process the file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


class SaveModelView(APIView):

    permission_classes = [IsAuthenticated, IsCreatedUser]

    def post(self, request):
        model_cache_key = request.data.get('model_cache_key')
        encoder_cache_key = request.data.get('encoder_cache_key')
        scaler_cache_key = request.data.get('scaler_cache_key')
        print('Recieved cache_key: ',model_cache_key)
        if not (model_cache_key or encoder_cache_key or scaler_cache_key):
            return Response({'error:':'Cache key is required'},status=status.HTTP_404_NOT_FOUND)
        
        model = cache.get(model_cache_key)
        encoder = cache.get(encoder_cache_key)
        scaler = cache.get(scaler_cache_key)

        print("Model from Cache:", model)  # Debugging
        print("Encoder from Cache:", encoder)  # Debugging
        print("Scaler from Cache:", scaler)  # Debugging

        if not model:
            return Response({'error:':'Train the model first'},status=status.HTTP_404_NOT_FOUND)
        

        saved_file_name = request.data.get('saved_file_name').lower()
        saved_file_name_lst = saved_file_name.split(' ')
        saved_file_name = '_'.join(saved_file_name_lst)

        # Model ----------------------------------------------------------------------
        # file_id = str(uuid.uuid4())
        model_file_name = f'{saved_file_name}.joblib'
        model_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_models', model_file_name)

        # Create the 'saved_models' directory if it doesn't exist
        os.makedirs(os.path.dirname(model_file_path), exist_ok=True)

        # file_path = f'saved_models/{file_id}.joblib'
        print('---Model----',model)
        joblib.dump(model,model_file_path)

        # Create a ContentFile object for Django's FileField
        with open(model_file_path, 'rb') as f:
            model_file_content = ContentFile(f.read(),name=model_file_name)

        # Encoder -----------------------------------------------------------------------
        # file_id = str(uuid.uuid4())
        encoder_file = saved_file_name + '_encoder'
        encoder_file_name = f'{encoder_file}.joblib'
        encoder_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_encoders', encoder_file_name)

        # Create the 'saved_models' directory if it doesn't exist
        os.makedirs(os.path.dirname(encoder_file_path), exist_ok=True)

        # file_path = f'saved_models/{file_id}.joblib'
        joblib.dump(encoder,encoder_file_path)

        # Create a ContentFile object for Django's FileField
        with open(encoder_file_path, 'rb') as f:
            encoder_file_content = ContentFile(f.read(),name=encoder_file_name)

        # Scaler ----------------------------------------------------------------------
        # file_id = str(uuid.uuid4())
        scaler_file = saved_file_name + '_scaler'
        scaler_file_name = f'{scaler_file}.joblib'
        scaler_file_path = os.path.join(settings.MEDIA_ROOT, 'saved_scalers', scaler_file_name)

        # Create the 'saved_models' directory if it doesn't exist
        os.makedirs(os.path.dirname(scaler_file_path), exist_ok=True)

        # file_path = f'saved_models/{file_id}.joblib'
        joblib.dump(scaler,scaler_file_path)

        # Create a ContentFile object for Django's FileField
        with open(scaler_file_path, 'rb') as f:
            scaler_file_content = ContentFile(f.read(),name=scaler_file_name)


        data = {
            "user": request.user.id,  # User ID from the request
            "file": request.data.get("file"),  # File ID from the request
            "saved_file_name":saved_file_name,
            "config": request.data.get("config"),  # Config ID from the request
            "model_file": model_file_content,  # Path to the saved model file
            "encoder_file": encoder_file_content,  # Path to the saved model file
            "scaler_file": scaler_file_content,  # Path to the saved model file
        }

        serializer = SaveModelSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        files = SavedModel.objects.all()
        serializer = SaveModelSerializer(files, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class PredictionView(APIView):

    permission_classes = [IsAuthenticated, IsCreatedUser]

    def post(self, request):

        serializer = PredictionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            id = serializer.validated_data['id']
            features = serializer.validated_data['features']
            
            # Get the saved model instance
            try:
                joblib_file = SavedModel.objects.get(pk=id)
            except SavedModel.DoesNotExist:
                return Response(
                    {"error": f"Model with id {id} not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
             # Get configuration
            try:
                configs = ModelConfig.objects.get(pk=joblib_file.config_id)
                columns = configs.features
                # columns = configs.features
                if len(features) != len(columns):
                    return Response(
                        {
                        "error": f"Feature count mismatch. Expected {len(columns)} features ({columns}), got {len(features)}"
                        },
                         status=status.HTTP_400_BAD_REQUEST
                         )
            except ModelConfig.DoesNotExist:
                return Response(
                    {"error": "Model configuration not found"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Validate feature length matches columns
            if len(features) != len(columns):
                return Response(
                    {"error": f"Expected {len(columns)} features, got {len(features)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Make prediction
            try:
                predicted_output = load_model_and_predict(
                    joblib_file.model_file,
                    features,
                    columns,
                    joblib_file.encoder_file,
                    joblib_file.scaler_file
                )
                return Response(
                    {'prediction': predicted_output},
                    status=status.HTTP_200_OK
                )
            except Exception as e:
                return Response(
                    {"error": f"Prediction failed: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    

@api_view(['GET'])
def get_all_files(request):
    files = UploadedFile.objects.all()
    serializer = UploadFileSerializer(files, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_config(request):
    configs = ModelConfig.objects.all()
    serializer = ModelConfigSerializer(configs, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_files(request,pk):
    files = UploadedFile.objects.filter(user=pk)
    serializer = UploadFileSerializer(files, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_user_config(request, pk):
    configs = ModelConfig.objects.filter(user=pk)
    serializer = ModelConfigSerializer(configs, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_user_models(request,pk):
    files = SavedModel.objects.filter(user=pk)
    serializer = SaveModelSerializer(files, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

