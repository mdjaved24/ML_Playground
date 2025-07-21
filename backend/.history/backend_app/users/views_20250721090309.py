"""
Authentication and User Management API Views

This module provides endpoints for:
- User registration and profile management
- Login/logout functionality
- Password reset and change flows
- Secret question management for password recovery
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from backend_app.models import SecretQuestion, UserSecretAnswer
from backend_app.users.serializers import (
    LoginSerializer, 
    LogoutSerializer, 
    UserSerializer, 
    SecretQuestionSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer, 
    PasswordResetRequestSerializer, 
    VerifySecretAnswerSerializer,
    SetNewPasswordSerializer, 
    ChangePasswordSerializer, 
    UserSecretAnswerSerailizer
)


class SecretQuestionListView(APIView):
    """
    API endpoint to list all available secret questions.
    """
    def get(self, request):
        """
        Retrieve all secret questions.
        
        Returns:
            Response: List of secret questions with IDs and text
        """
        questions = SecretQuestion.objects.all()
        serializer = SecretQuestionSerializer(questions, many=True)
        return Response(serializer.data)


class GetSecretQuestion(APIView):
    """
    API endpoint to get secret questions for a specific user.
    """
    def get(self, request, username):
        """
        Retrieve secret questions for password recovery.
        
        Args:
            username: Username to look up
            
        Returns:
            Response: User's secret questions or error if not found
        """
        queryset = UserSecretAnswer.objects.filter(user__username=username)
        if queryset.exists():
            serializer = UserSecretAnswerSerailizer(queryset, many=True)
            return Response(serializer.data)
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )


class UserRegistrationView(APIView):
    """
    API endpoint for new user registration.
    """
    def post(self, request):
        """
        Register a new user account.
        
        Request Body:
            - username
            - email
            - password
            - password2 (confirmation)
            - secret_questions: List of {question_id, answer} pairs
            
        Returns:
            Response: User data with JWT tokens or validation errors
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            return Response({
                'message': 'User registered successfully.',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'access': access_token,
                'refresh': refresh_token
            }, status=status.HTTP_201_CREATED)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileView(APIView):
    """
    API endpoint for user profile management.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve current user's profile information.
        
        Returns:
            Response: Serialized user profile data
        """
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    def put(self, request):
        """
        Update user profile information.
        
        Request Body:
            - username (optional)
            - email (optional)
            
        Returns:
            Response: Success message with updated data or validation errors
        """
        user = request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            username = serializer.validated_data.get('username', user.username)
            email = serializer.validated_data.get('email', user.email)
            
            # Check for existing users with new credentials
            if username != user.username and User.objects.filter(username=username).exists():
                return Response(
                    {'error': 'User with this username already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if email != user.email and User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'User with this email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            serializer.save()
            return Response({
                'msg': 'User details updated successfully',
                'user': serializer.data
            })
        
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


class PasswordResetRequestView(APIView):
    """
    API endpoint to initiate password reset process.
    """
    def post(self, request):
        """
        Start password reset by verifying username.
        
        Request Body:
            - username: User's username
            
        Returns:
            Response: User's secret question or error message
        """
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User with this username does not exist.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get one of the user's secret questions
            secret_answers = UserSecretAnswer.objects.filter(user=user)
            if not secret_answers.exists():
                return Response(
                    {'error': 'No secret questions set for this user.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            question = secret_answers.first().question
            return Response({
                'question_id': question.id,
                'question': question.question,
                'username': username
            }, status=status.HTTP_200_OK)
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


class VerifySecretAnswerView(APIView):
    """
    API endpoint to verify secret answers during password reset.
    """
    def post(self, request, username):
        """
        Verify user's secret answers.
        
        Args:
            username: Username to verify
            
        Request Body:
            List of {question_id, answer} pairs
            
        Returns:
            Response: Verification result with wrong answers if any
        """
        # Validate input format
        if not isinstance(request.data, list):
            return Response(
                {"error": "Please provide question-answer pairs as a list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find the user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check each question-answer pair
        wrong_answers = []
        
        for item in request.data:
            question_id = item.get("question_id")
            user_answer = item.get("answer", "").lower().strip()
            
            try:
                stored_answer = UserSecretAnswer.objects.get(
                    user=user,
                    id=question_id
                )
                
                # Compare answers case-insensitively
                if stored_answer.answer.lower() != user_answer:
                    wrong_answers.append({
                        "question_id": question_id,
                        "message": "Incorrect answer"
                    })
                    
            except UserSecretAnswer.DoesNotExist:
                wrong_answers.append({
                    "question_id": question_id,
                    "message": "Question not found for user"
                })
        
        # Return verification result
        if not wrong_answers:
            return Response({
                "success": True,
                "message": "All answers correct!"
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Some answers were wrong",
                "wrong_answers": wrong_answers,
            }, status=status.HTTP_400_BAD_REQUEST)


class SetNewPasswordView(APIView):
    """
    API endpoint to set new password after verification.
    """
    def post(self, request, username):
        """
        Set new password for verified user.
        
        Args:
            username: Username to update
            
        Request Body:
            - new_password: New password to set
            
        Returns:
            Response: Success or error message
        """
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User with this username does not exist.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Prevent setting same password
            if user.check_password(new_password):
                return Response(
                    {'error': 'Password is already in use.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.set_password(new_password)
            user.save()
            return Response(
                {'message': 'Password reset successfully.'},
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


class ChangePasswordView(APIView):
    """
    API endpoint for authenticated users to change password.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Change password for logged-in user.
        
        Request Body:
            - old_password: Current password
            - new_password: New password
            
        Returns:
            Response: Success or error message
        """
        serializer = ChangePasswordSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            
            user.set_password(new_password)
            user.save()
            
            return Response(
                {'message': 'Password changed successfully.'},
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def login_view(request):
    """
    Authenticate user and return JWT tokens.
    
    Request Body:
        - username
        - password
        
    Returns:
        Response: JWT tokens or authentication error
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": "No active account found with the given credentials."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['POST'])
def logout_view(request):
    """
    Invalidate refresh token (logout).
    
    Request Body:
        - refresh_token: JWT refresh token to invalidate
        
    Returns:
        Response: Success or error message
    """
    serializer = LogoutSerializer(data=request.data)
    if serializer.is_valid():
        refresh_token = serializer.validated_data['refresh_token']
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Invalidate the refresh token
            return Response(
                {"message": "Successfully logged out."}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": "Invalid or expired token."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(
        serializer.errors, 
        status=status.HTTP_400_BAD_REQUEST
    )