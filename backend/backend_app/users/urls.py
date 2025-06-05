from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from backend_app.users.views import (logout_view, login_view, get_all_users,SecretQuestionListView, UserRegistrationView,
                                     PasswordResetRequestView, VerifySecretAnswerView, SetNewPasswordView, ChangePasswordView)

urlpatterns = [
    # JWT Authentication URLs - 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access & refresh token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Get a new access token
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('allusers/', get_all_users, name='get-all-users'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('secret-questions/', SecretQuestionListView.as_view(), name='secret-questions'),
    path('verify-secret-answer/', VerifySecretAnswerView.as_view(), name='verify-secret-answer'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]