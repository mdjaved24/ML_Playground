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
class UploadedDataset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    dataset = models.FileField(upload_to='uploads/')
    dataset_hash = models.CharField(max_length=64, unique=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name+" | "+self.user.username


class ModelConfig(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset = models.ForeignKey(UploadedDataset, on_delete=models.CASCADE)
    target_column = models.CharField(max_length=250)
    features = JSONField()
    feature_types = models.JSONField(default=dict)
    encoder = models.CharField(max_length=50)
    scaler = models.CharField(max_length=50)
    test_size = models.FloatField(default=0.2)
    random_state = models.IntegerField(default=4)
    stratify = models.BooleanField(default=False)
    model_type = models.CharField(max_length=250)
    parameters = JSONField()
    accuracy = JSONField()  
    problem_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.dataset.name+" | "+self.user.username
    
    def save(self, *args, **kwargs):
        # Ensure feature_types has entries for all features
        if not all(f in self.feature_types for f in self.features):
            for feature in self.features:
                if feature not in self.feature_types:
                    self.feature_types[feature] = 'numeric'  # Default to numeric
        super().save(*args, **kwargs)


class SavedModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dataset = models.ForeignKey(UploadedDataset, on_delete=models.CASCADE)
    algorithm = models.CharField(max_length=50)
    accuracy = models.JSONField(default=dict)
    config = models.ForeignKey(ModelConfig, on_delete=models.CASCADE)
    model_file = models.FileField(upload_to='saved_models/')
    encoder_file = models.FileField(upload_to='saved_encoders/', null=True, blank=True)
    scaler_file = models.FileField(upload_to='saved_scalers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Saved Model'
        verbose_name_plural = 'Saved Models'

    def __str__(self):
        return f"{self.dataset.name} | {self.user.username} | {self.algorithm}"


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