from django.urls import path

from backend_app.files.views import UploadFileView, ModelTrainigView, SaveModelView,SavedModelDetailView, PredictionView, DatasetPreviewAPI, ModelFeaturesView, ModelDownloadView, DashboardStats


urlpatterns = [
    path('upload/', UploadFileView.as_view(), name='upload-file'),  
    path('dataset-preview/', DatasetPreviewAPI.as_view(), name='dataset-preview'),  
    path('columns/', ColumnsView.as_view(), name='upload-file-columns'),  
    path('train/', ModelTrainigView.as_view(), name='train-model'),  
    path('save/', SaveModelView.as_view(), name='save-model'),  
    path('saved-model/<int:pk>/', SavedModelDetailView.as_view(), name='save-model-detail'), 
    path('download-model/<int:pk>/', ModelDownloadView.as_view(), name='download-model'), 
    path('predict/<int:pk>/', PredictionView.as_view(), name='predict'),  
    path('model-features/<int:pk>/', ModelFeaturesView.as_view(), name='model-features'),  
    path('getusermodels/', UserTrainedModelsView.as_view(), name='get-user-models'),  
    path('dashboard-stats/', DashboardStats.as_view(), name='dashboard-stats'),  
]