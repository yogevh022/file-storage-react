from django.contrib import admin
from .models import storedFile, CustomUser, FileCollection

# Register your models here.

admin.site.register(storedFile)
admin.site.register(CustomUser)
admin.site.register(FileCollection)
