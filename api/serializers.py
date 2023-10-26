from rest_framework import serializers
from winrates_app.models import storedFile
import base64

class storedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = storedFile
        fields= '__all__'
        extra_kwargs = {
            'expirationDateTime': {'required': False},
            'fileSize': {'required': False},
            #'fileData': {'required': False} #temp this one is mandatory
        }
    
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     file_field = representation['fileData']

    #     if instance.fileData:
    #         with instance.fileData.open('rb') as file:
    #             file_data = file.read()
    #             file_data_base64 = base64.b64encode(file_data).decode('utf-8')
    #             representation['fileData'] = file_data_base64

    #     return representation