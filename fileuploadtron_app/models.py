from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.contrib.auth.hashers import make_password
import datetime

def current_date():
    return timezone.now()

def default_expiration_date():
    #by default expiration datetime is now+1hour
    return timezone.now() + datetime.timedelta(hours=1)

def default_integer():
    return 0

def default_None():
    return None

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        if not email:
            raise ValueError('no email entered')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)
    favorite_collections = models.ManyToManyField('fileuploadtron_app.FileCollection', related_name='favorited_by', blank=True)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(Group, related_name="custom_users", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_users_permissions", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


class FileCollection(models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(CustomUser, related_name='file_collections', blank=True)
    picture = models.FileField(upload_to="collection_pictures/", null=True, blank=True, default=default_None)
    hashed_password = models.CharField(max_length=128, default=make_password(''))

    def set_password(self, raw_password):
        self.hashed_password = make_password(raw_password)
    
    def check_password(self, raw_password):
        return self.hashed_password == make_password(raw_password)
    

class storedFile(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    collection = models.ForeignKey(FileCollection, on_delete=models.CASCADE, null=True,default=default_None)
    title = models.CharField(max_length=260)    # 260 is max windows file name limit
    fileData = models.FileField(upload_to="stored_files/")
    fileSize = models.BigIntegerField(default=default_integer)
    uploadDateTime = models.DateTimeField(default=current_date)
    expirationDateTime = models.DateTimeField(default=default_expiration_date)

    def delete(self, *args, **kwargs):
        if self.fileData:
            self.fileData.delete(save=False)
        super().delete(*args, **kwargs)

