from rest_framework import serializers
from fileuploadtron_app.models import storedFile, CustomUser, FileCollection



class FileCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileCollection
        fields = '__all__'
        extra_kwargs = {
            'hashed_password': {'write_only': True}
        }
        # exclude = ['files']

    files = serializers.SerializerMethodField()

    def get_files(self, obj):
        file_id_list = storedFile.objects.filter(collection=obj).values_list('id', flat=True)
        # serializer = storedFileSerializer(files, many=True)
        return file_id_list


class CustomUserSerializer(serializers.ModelSerializer):
    file_collections = FileCollectionSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }
        # exclude = ['password']


class CustomUserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']

class storedFileSerializer(serializers.ModelSerializer):
    user = CustomUserMinimalSerializer()

    class Meta:
        model = storedFile
        fields= '__all__'
        extra_kwargs = {
            'expirationDateTime': {'required': False},
            'fileSize': {'required': False},
            'user': {'required': False}
            #'fileData': {'required': False} #temp this one is mandatory
        }
        # exclude = ['user']