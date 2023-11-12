# Generated by Django 4.0.1 on 2023-11-09 21:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import fileuploadtron_app.models


class Migration(migrations.Migration):

    dependencies = [
        ('fileuploadtron_app', '0006_remove_storedfile_collection_delete_filecollection'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileCollection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('users', models.ManyToManyField(blank=True, related_name='file_collections', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='storedfile',
            name='collection',
            field=models.ForeignKey(default=fileuploadtron_app.models.default_None, null=True, on_delete=django.db.models.deletion.CASCADE, to='fileuploadtron_app.filecollection'),
        ),
    ]
