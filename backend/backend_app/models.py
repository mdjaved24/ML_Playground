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
    

#------------------------------Application-----------------------#
class UploadedFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=250)
    file_path = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name+" | "+self.user.username


class ModelConfig(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE)
    target_column = models.CharField(max_length=250)
    features = JSONField()
    encoder = models.CharField(max_length=50)
    scaler = models.CharField(max_length=50)
    test_size = models.FloatField(default=0.2)
    random_state = models.IntegerField(default=4)
    model_type = models.CharField(max_length=250)
    parameters = JSONField()
    accuracy = JSONField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.file_name+" | "+self.user.username


class SavedModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.ForeignKey(UploadedFile, on_delete=models.CASCADE)
    saved_file_name = models.CharField(max_length=255, default='Untitled')
    config = models.ForeignKey(ModelConfig, on_delete=models.CASCADE)
    model_file = models.FileField(upload_to='saved_models/')
    encoder_file = models.FileField(upload_to='saved_encoders/')
    scaler_file = models.FileField(upload_to='saved_scalers/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.file_name+" | "+self.user.username


class Badges(models.Model):
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=250)

    def __str__(self):
        return self.name
    

class Achievements(models.Model):
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=250)
    criteria = JSONField()
    points = models.IntegerField()

    def __str__(self):
        return self.name
    

class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    achievement = models.OneToOneField(Achievements, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.achievement.name
    

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge = models.OneToOneField(Badges, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.badge.name
    

class LeaderBoard(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points = models.IntegerField()
    last_updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username