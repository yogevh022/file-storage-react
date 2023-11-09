from rest_framework import serializers
from fileuploadtron_app.models import storedFile, CustomUser, FileCollection



class FileCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileCollection
        fields = '__all__'

    files = serializers.SerializerMethodField()

    def get_files(self, obj):
        files = storedFile.objects.filter(collection=obj)
        serializer = storedFileSerializer(files, many=True)
        return serializer.data


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