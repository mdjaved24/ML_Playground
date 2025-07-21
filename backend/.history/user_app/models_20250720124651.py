from django.db import models
from django.db.models import JSONField

from django.contrib.auth.models import User

# Create your models here.

class SecretQuestion(models.Model):
    question = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.question

class UserSecretAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(SecretQuestion, on_delete=models.CASCADE)
    answer = models.CharField(max_length=255)
    
    class Meta:
        unique_together = ('user', 'question')

    def __str__(self):
        return f"{self.user.username}'s answer to {self.question.question}"
    
    