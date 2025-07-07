from django.urls import path

from backend_app.files.views import UploadFileView, ColumnsView, ModelTrainigView, SaveModelView,SavedModelDetailView, PredictionView, get_all_files, get_all_config, get_user_config, get_user_files, DatasetPreviewAPI, UserTrainedModelsView, ModelFeaturesView


urlpatterns = [
    path('upload/', UploadFileView.as_view(), name='upload-file'),  
    path('dataset-preview/', DatasetPreviewAPI.as_view(), name='dataset-preview'),  
    path('columns/', ColumnsView.as_view(), name='upload-file-columns'),  
    path('train/', ModelTrainigView.as_view(), name='train-model'),  
    path('save/', SaveModelView.as_view(), name='save-model'),  
    path('saved-model/<int:pk>/', SavedModelDetailView.as_view(), name='save-model-detail'),  
    path('predict/<int:pk>/', PredictionView.as_view(), name='predict'),  
    path('model-features/<int:pk>/', ModelFeaturesView.as_view(), name='model-features'),  
    path('getfiles/', get_all_files, name='get-file'),  
    path('getconfigs/', get_all_config, name='get-configs'),  
    path('getuserfiles/<int:pk>/', get_user_files, name='get-user-file'),  
    path('getuserconfigs/<int:pk>/', get_user_config, name='get-user-configs'),  
    path('getusermodels/', UserTrainedModelsView.as_view(), name='get-user-models'),  
]