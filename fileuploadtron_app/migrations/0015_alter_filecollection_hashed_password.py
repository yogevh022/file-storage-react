# Generated by Django 4.0.1 on 2024-01-10 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fileuploadtron_app', '0014_alter_customuser_username_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='filecollection',
            name='hashed_password',
            field=models.CharField(default='pbkdf2_sha256$320000$TwVOsoj3QW95avbQVYYpWW$+/MfIVOmu/OEyXyOZDpoH5ALoAjvUYKs7arFnsXdROQ=', max_length=128),
        ),
    ]
