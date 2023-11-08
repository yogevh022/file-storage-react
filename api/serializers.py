from rest_framework import serializers
from fileuploadtron_app.models import storedFile
from fileuploadtron_app.models import CustomUser


class storedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = storedFile
        fields= '__all__'
        extra_kwargs = {
            'expirationDateTime': {'required': False},
            'fileSize': {'required': False},
            #'fileData': {'required': False} #temp this one is mandatory
        }


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }
        # exclude = ['password']