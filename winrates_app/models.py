from django.db import models
from django.utils import timezone
import datetime

def default_expiration_date():
    #by default expiration datetime is now+1hour
    return timezone.now() + datetime.timedelta(hours=1)

def default_integer():
    return 0

class storedFile(models.Model):
    uploaderName = models.CharField(max_length=64)
    title = models.CharField(max_length=260)    # 260 is max windows file name limit
    fileData = models.FileField(upload_to="stored_files/")
    fileSize = models.BigIntegerField(default=default_integer)
    expirationDateTime = models.DateTimeField(default=default_expiration_date)

    def delete(self, *args, **kwargs):
        if self.fileData:
            self.fileData.delete(save=False)
        super().delete(*args, **kwargs)