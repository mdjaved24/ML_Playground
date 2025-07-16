from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from django.contrib.auth.models import User
from backend_app.users.serializers import (LoginSerializer, LogoutSerializer, UserSerializer, SecretQuestionSerializer,
                                           UserRegistrationSerializer,UserProfileSerializer, PasswordResetRequestSerializer, VerifySecretAnswerSerializer,SetNewPasswordSerializer, ChangePasswordSerializer, UserSecretAnswerSerailizer)
                                           

from backend_app.models import SecretQuestion, UserSecretAnswer



class SecretQuestionListView(APIView):
    def get(self, request):
        questions = SecretQuestion.objects.all()
        serializer = SecretQuestionSerializer(questions, many=True)
        return Response(serializer.data)
    
class GetSecretQuestion(APIView):

    def get(self, request, username):
        queryset = UserSecretAnswer.objects.filter(user__username=username)
        if queryset.exists():
            serializer = UserSecretAnswerSerailizer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error':'User not found'},status=status.HTTP_404_NOT_FOUND)


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
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
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)

        return Response(serializer.data)
    
    def put(self, request):
        user=request.user
        serializer = UserProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'User details updated successfully','user':serializer.data})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User with this username does not exist.'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            # Get one of the user's secret questions randomly
            secret_answers = UserSecretAnswer.objects.filter(user=user)
            if not secret_answers.exists():
                return Response({'error': 'No secret questions set for this user.'},
                              status=status.HTTP_400_BAD_REQUEST)
            
            question = secret_answers.first().question
            return Response({
                'question_id': question.id,
                'question': question.question,
                'username': username
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifySecretAnswerView(APIView):
    def post(self, request, username):

        # 1. Check if request data is a list
        if not isinstance(request.data, list):
            return Response(
                {"error": "Please provide question-answer pairs as a list"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 2. Find the user
        try:
            user = User.objects.get(username=username)
            print(f"Found user: {user.username}")  # Debug
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # 3. Check each question-answer pair
        wrong_answers = []
        
        for item in request.data:
            question_id = item.get("question_id")
            user_answer = item.get("answer", "").lower().strip()
            
            print(f"Checking question ID: {question_id}")  # Debug
            
            # 3a. Check if question exists for this user
            try:
                stored_answer = UserSecretAnswer.objects.get(
                    user=user,
                    id=question_id
                )
                print(f"Found stored answer: {stored_answer.answer}")  # Debug
                
                # 3b. Compare answers
                if stored_answer.answer.lower() != user_answer:
                    wrong_answers.append({
                        "question_id": question_id,
                        "message": "Incorrect answer"
                    })
                    
            except UserSecretAnswer.DoesNotExist:
                # Debug why question wasn't found
                print(f"Question {question_id} not found for user {username}")
                
                # Check if question exists at all in the system
                if not UserSecretAnswer.objects.filter(id=question_id).exists():
                    print(f"Question ID {question_id} doesn't exist in system")
                
                wrong_answers.append({
                    "question_id": question_id,
                    "message": "Question not found for user"
                })
        
        # 4. Return result
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
                "user": username  # Added for debugging
            }, status=status.HTTP_400_BAD_REQUEST)
        
class SetNewPasswordView(APIView):
    def post(self, request, username):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']
            
            try:
                user = User.objects.get(username=username)
                print('user:',user)
            except User.DoesNotExist:
                return Response({'error': 'User with this username does not exist.'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if user.password == new_password:
                return Response({'error': 'Password is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password reset successfully.'},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            
            user.set_password(new_password)
            user.save()
            
            return Response({'message': 'Password changed successfully.'},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def login_view(request):
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
            return Response({"detail": "No active account found with the given credentials."}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def logout_view(request):
    serializer = LogoutSerializer(data=request.data)
    if serializer.is_valid():
        refresh_token = serializer.validated_data['refresh_token']
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)