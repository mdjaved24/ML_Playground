# Generated by Django 5.1.6 on 2025-07-11 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_app', '0002_alter_savedmodel_accuracy'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savedmodel',
            name='accuracy',
            field=models.DecimalField(decimal_places=2, max_digits=6),
        ),
    ]
