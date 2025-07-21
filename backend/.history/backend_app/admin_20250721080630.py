from django.contrib import admin

from backend_app.models import UploadedDataset, ModelConfig, SavedModel
# Register your models here.

admin.site.register(UploadedDataset)
admin.site.register(ModelConfig)
admin.site.register(SavedModel)
# admin.site.register(SecretQuestion)
# admin.site.register(UserSecretAnswer)

