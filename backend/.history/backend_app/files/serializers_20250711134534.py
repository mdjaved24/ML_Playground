from rest_framework import serializers
import os

# from django.contrib.auth.models import User

from backend_app.models import UploadedDataset, ModelConfig, SavedModel

class UploadFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UploadedDataset
        fields = '__all__'

    def create(self, validated_data):
        """
        Validate the file extension after the file is uploaded.
        """
        # Get the file path from the validated data
        file_path = validated_data.get('file_path')

        # Extract the file extension from the file path
        file_name = file_path.name  # Get the file name (e.g., "diamonds_NTCVX9F.csv.zip")
        extension = file_name.split('.')[-1].lower()  # Get the file extension in lowercase

        # List of valid extensions
        valid_extensions = ['csv', 'xls', 'xlsx']

        # Check if the file extension is valid
        if extension not in valid_extensions:
            raise serializers.ValidationError("Only CSV, XLS, and XLSX files are allowed.")

        # Save the UploadedDataset instance
        return UploadedDataset.objects.create(**validated_data)

class ModelConfigSerializer(serializers.ModelSerializer):
    dataset = serializers.PrimaryKeyRelatedField(queryset=UploadedDataset.objects.all())
    class Meta:
        model = ModelConfig
        fields = '__all__'
        extra_kwargs = {
            'accuracy': {'required': False},   # Will be set after training
            'dataset': {'required': True, 'write_only': True},
            'user': {'required': False}  # Will be set from request
        }
        
class DatasetPreviewSerializer(serializers.Serializer):
    dataset = serializers.FileField()
    row_count = serializers.IntegerField()

class SaveModelSerializer(serializers.ModelSerializer):
    # dataset_name = serializers.CharField(source='dataset.name', read_only=True)
    features = serializers.JSONField(source='config.features', read_only=True)
    feature_types = serializers.JSONField(source='config.feature_types', read_only=True)
    categorical_values = serializers.JSONField(source='config.categorical_values', read_only=True)
    target_column = serializers.CharField(source='config.target_column', read_only=True)
    problem_type = serializers.CharField(source='config.problem_type', read_only=True)

    class Meta:
        model = SavedModel
        fields = [
            'id',
            'user',
            'dataset',
            'name',
            'algorithm',
            'accuracy',
            'config',
            'features',
            'feature_types',
            'categorical_values'
            'target_column',
            'problem_type',
            'model_file',
            'encoder_file',
            'scaler_file',
            'created_at',
            'updated_at',
            'is_active'
        ]


class PredictionSerializer(serializers.Serializer):
    inputs = serializers.DictField(
        child=serializers.CharField(allow_blank=True),
        allow_empty=False
    )
    predicted_output = serializers.CharField(max_length=255, read_only=True)