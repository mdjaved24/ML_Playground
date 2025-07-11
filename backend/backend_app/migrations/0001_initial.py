# Generated by Django 5.1.6 on 2025-07-11 08:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Achievements',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=250)),
                ('criteria', models.JSONField()),
                ('points', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Badges',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('description', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='SecretQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='LeaderBoard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.IntegerField()),
                ('last_updated', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ModelConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_column', models.CharField(max_length=250)),
                ('features', models.JSONField()),
                ('feature_types', models.JSONField(default=dict)),
                ('categorical_values', models.JSONField(default=dict)),
                ('encoder', models.CharField(max_length=50)),
                ('scaler', models.CharField(max_length=50)),
                ('test_size', models.FloatField(default=0.2)),
                ('random_state', models.IntegerField(default=4)),
                ('stratify', models.BooleanField(default=False)),
                ('model_type', models.CharField(max_length=250)),
                ('parameters', models.JSONField()),
                ('accuracy', models.JSONField()),
                ('problem_type', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UploadedDataset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250)),
                ('dataset', models.FileField(upload_to='uploads/')),
                ('dataset_hash', models.CharField(max_length=64, unique=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SavedModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default=None, max_length=100)),
                ('algorithm', models.CharField(max_length=50)),
                ('accuracy', models.JSONField(default=dict)),
                ('model_file', models.FileField(upload_to='saved_models/')),
                ('encoder_file', models.FileField(blank=True, null=True, upload_to='saved_encoders/')),
                ('scaler_file', models.FileField(blank=True, null=True, upload_to='saved_scalers/')),
                ('target_encoder', models.FileField(blank=True, null=True, upload_to='saved_scalers/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend_app.modelconfig')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('dataset', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend_app.uploadeddataset')),
            ],
            options={
                'verbose_name': 'Saved Model',
                'verbose_name_plural': 'Saved Models',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='modelconfig',
            name='dataset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend_app.uploadeddataset'),
        ),
        migrations.CreateModel(
            name='UserAchievement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('earned_at', models.DateTimeField(auto_now_add=True)),
                ('achievement', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='backend_app.achievements')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserBadge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('earned_at', models.DateTimeField(auto_now_add=True)),
                ('badge', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='backend_app.badges')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserSecretAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(max_length=255)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend_app.secretquestion')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'question')},
            },
        ),
    ]
