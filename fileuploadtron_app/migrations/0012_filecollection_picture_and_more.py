# Generated by Django 4.0.1 on 2023-11-11 20:45

from django.db import migrations, models
import fileuploadtron_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('fileuploadtron_app', '0011_alter_filecollection_hashed_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='filecollection',
            name='picture',
            field=models.FileField(blank=True, default=fileuploadtron_app.models.default_None, null=True, upload_to='collection_pictures/'),
        ),
        migrations.AlterField(
            model_name='filecollection',
            name='hashed_password',
            field=models.CharField(default='pbkdf2_sha256$320000$xtvZ86Yn1lZ9gewecQ6gEZ$4UBSO7jK8kyCsdau2cMtkf1HcCTBDkoWUGM33r6LwTE=', max_length=128),
        ),
    ]
