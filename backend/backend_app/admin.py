from django.contrib import admin

from backend_app.models import UploadedFile, ModelConfig, SavedModel, SecretQuestion, UserSecretAnswer
# Register your models here.

admin.site.register(UploadedFile)
admin.site.register(ModelConfig)
admin.site.register(SavedModel)
admin.site.register(SecretQuestion)
admin.site.register(UserSecretAnswer)

