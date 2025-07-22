from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError
import logging

class BackendAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend_app'

    def ready(self):
        try:
            User = get_user_model()
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@example.com',
                    password='admin123'
                )
                print("✅ Superuser created!")
        except OperationalError as e:
            logging.warning(f"Skipping superuser creation: {e}")
