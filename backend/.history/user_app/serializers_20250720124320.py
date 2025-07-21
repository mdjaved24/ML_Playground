from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password  # To hash passwords
from django.contrib.auth.password_validation import validate_password


from backend_app.models import SecretQuestion, UserSecretAnswer

from django.contrib.auth.models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class SecretQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecretQuestion
        fields = ['id', 'question']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # fields = '__all__'
        fields = ['username','email','first_name', 'last_name','date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    secret_answers = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=True
    )

    class Meta:
        model = User
        fields = ('email','username', 'password', 'confirm_password', 'first_name', 'last_name','secret_answers')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }


    def validate(self, attrs):
        # Check if username already exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})

        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        # Check if password and confirm_password match
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if len(attrs['secret_answers']) < 2:
            raise serializers.ValidationError({"secret_answers": "At least two secret questions are required."})
        
        # Validate that question IDs exist
        question_ids = [q['question_id'] for q in attrs['secret_answers']]
        if SecretQuestion.objects.filter(id__in=question_ids).count() != len(set(question_ids)):
            raise serializers.ValidationError({"secret_answers": "One or more question IDs are invalid."})
            
        return attrs

    def create(self, validated_data):
        secret_answers_data = validated_data.pop('secret_answers')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )

        for answer_data in secret_answers_data:
            UserSecretAnswer.objects.create(
                user=user,
                question_id=answer_data['question_id'],
                answer=answer_data['answer'].lower().strip()
            )
            
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)

class VerifySecretAnswerSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', queryset=UserSecretAnswer.objects.all())
    class Meta:
        model = UserSecretAnswer
        fields = '__all__'


class UserSecretAnswerSerailizer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', queryset=UserSecretAnswer.objects.all())
    question = serializers.StringRelatedField()

    class Meta:
        model = UserSecretAnswer
        fields = '__all__'
        read_only_fields = ['id','question','answer']


class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if attrs['new_password'] == attrs['current_password']:
            raise serializers.ValidationError({"password": "New Password is same as current password."})
        return attrs


class LogoutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

