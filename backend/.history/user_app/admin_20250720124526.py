from django.contrib import admin

# Register your models here.
from user_app.models import SecretQuestion, UserSecretAnswer
# Register your models here.

admin.site.register(SecretQuestion)
admin.site.register(UserSecretAnswer)