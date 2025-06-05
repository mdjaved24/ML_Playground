from django.urls import path

from backend_app.files.views import UploadFileView, ColumnsView, ModelTrainigView, SaveModelView,PredictionView, get_all_files, get_all_config, get_user_config, get_user_files, get_user_models


urlpatterns = [
    path('upload/', UploadFileView.as_view(), name='upload-file'),  
    path('columns/<int:pk>/', ColumnsView.as_view(), name='upload-file-columns'),  
    path('train/<int:pk>/', ModelTrainigView.as_view(), name='train-model'),  
    path('save/', SaveModelView.as_view(), name='save-model'),  
    path('predict/', PredictionView.as_view(), name='predict'),  
    path('getfiles/', get_all_files, name='get-file'),  
    path('getconfigs/', get_all_config, name='get-configs'),  
    path('getuserfiles/<int:pk>/', get_user_files, name='get-user-file'),  
    path('getuserconfigs/<int:pk>/', get_user_config, name='get-user-configs'),  
    path('getusermodels/<int:pk>/', get_user_models, name='get-user-models'),  
]