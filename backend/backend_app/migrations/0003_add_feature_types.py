from django.db import migrations

def add_default_feature_types(apps, schema_editor):
    ModelConfig = apps.get_model('backend_app', 'ModelConfig')
    for config in ModelConfig.objects.all():
        if not hasattr(config, 'feature_types'):
            config.feature_types = {f: 'numeric' for f in config.features}
            config.save()

class Migration(migrations.Migration):
    dependencies = [
        ('backend_app','0002_modelconfig_problem_type')
    ]
    
    operations = [
        migrations.RunPython(add_default_feature_types),
    ]