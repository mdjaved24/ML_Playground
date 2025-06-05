from rest_framework import serializers
import os

# from django.contrib.auth.models import User

from backend_app.models import UploadedFile, ModelConfig, SavedModel

class UploadFileSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UploadedFile
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

        # Save the UploadedFile instance
        return UploadedFile.objects.create(**validated_data)


class ModelConfigSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModelConfig
        fields = '__all__'
        # exclude = ['accuracy']
        read_only_fields = ['accuracy']


class SaveModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = SavedModel
        fields = '__all__'


class PredictionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    features = serializers.ListField()
    predicted_output = serializers.CharField(max_length=255,read_only=True)