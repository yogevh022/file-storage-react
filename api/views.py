from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import HttpResponse, redirect, get_object_or_404
from fileuploadtron_app.models import storedFile, CustomUser, FileCollection
from .serializers import storedFileSerializer, CustomUserSerializer, CustomUserMinimalSerializer, FileCollectionSerializer
from .forms import RegistrationForm
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import FileResponse
from django.conf import settings
from .jwt_config import JWTConfig
import jwt
import os
import datetime

index_html_path = "fileuploadtron-frontend/build/index.html"
if settings.DEBUG == True:
    index_html_path = "fileuploadtron-frontend/public/index.html"


class AuthContext:
    user = None
    new_tokens = False

    def __init__(self, user=None, new_tokens=False):
        self.user = user
        self.new_tokens = new_tokens


def get_jwt_token(user_id, **expiration_delta):
    payload = {
        'id': user_id,
        'exp': timezone.now() + datetime.timedelta(**expiration_delta),
        'iat': timezone.now()
    }
    token = jwt.encode(payload, JWTConfig.SECRET, algorithm=JWTConfig.ALGORITHM) #.decode('utf-8')
    return token


def get_user(**column):
    return CustomUser.objects.filter(**column).first()

def get_all_files(**column):
    return storedFile.objects.filter(**column)

def get_file_collection(**column):
    return get_object_or_404(FileCollection, **column)
    # return FileCollection.objects.filter(**column).first()

def get_file_collections(**column):
    return FileCollection.objects.filter(**column)

def user_is_in_collection(user_id, collection_id):
    return get_file_collection(id=collection_id).users.filter(id=user_id).exists()


def get_authenticated_user_or_raise_exception(req):
    token = req.COOKIES.get('jwt')
    refresh_token = req.COOKIES.get('refresh_token')
    auth_context = AuthContext()
    if not token:
        raise AuthenticationFailed('Unauthenticated! No token')
    
    try:
        payload = jwt.decode(token, JWTConfig.SECRET, algorithms=[JWTConfig.ALGORITHM])
    except jwt.ExpiredSignatureError:
        try:
            payload = jwt.decode(refresh_token, JWTConfig.SECRET, algorithms=[JWTConfig.ALGORITHM])
            auth_context.new_tokens = True
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated! Expired')

    user = get_user(id=payload['id'])
    if not user:
        raise AuthenticationFailed('User does not exist!')
    auth_context.user = user
    return auth_context


def refresh_tokens_if_needed(response, auth_context):
    if auth_context.new_tokens:
        new_jwt_token = get_jwt_token(auth_context.user.id, **JWTConfig.JWT_EXP)
        new_refresh_token = get_jwt_token(auth_context.user.id, **JWTConfig.REFRESH_TOKEN_EXP)
        response.set_cookie(key='jwt', value=new_jwt_token, httponly=True)
        response.set_cookie(key='refresh_token', value=new_refresh_token, httponly=True)
    return response

def login_required(redirect_url=None):
    def decorator(func):
        def wrapper(*args, **kwargs):
            req = args[0]
            try:
                auth_context = get_authenticated_user_or_raise_exception(req)
                result = func(*args, **kwargs, auth_context=auth_context)
                return result
            except TypeError as e:
                if "unexpected keyword argument 'auth_context'" in str(e):
                    raise Exception("Every view that is login_required must take in 'auth_context' arg")
            except AuthenticationFailed:
                if not redirect_url:
                    return Response(status=status.HTTP_403_FORBIDDEN)
                return redirect(redirect_url)
        return wrapper
    return decorator


def logout_required(func):
    def wrapper(*args, **kwargs):
        req = args[0]
        try:
            get_authenticated_user_or_raise_exception(req)
        except AuthenticationFailed:
            result = func(*args, **kwargs)
            return result
        raise Exception("There is already a user logged in, log out first.")
    return wrapper


@login_required(redirect_url="/login")
def mainView(req, auth_context, collection_id=None):
    with open(os.path.join(settings.BASE_DIR, index_html_path), 'r') as f:
        html = f.read()

    response = HttpResponse(html)
    response = refresh_tokens_if_needed(response, auth_context)
    return response


def loginView(req):
    with open(os.path.join(settings.BASE_DIR, index_html_path), 'r') as f:
        html = f.read()
    
    return HttpResponse(html)


def registerView(req):
    with open(os.path.join(settings.BASE_DIR, index_html_path), 'r') as f:
        html = f.read()
    
    return HttpResponse(html)


@api_view(['GET', 'POST'])
@login_required(redirect_url=None)
def storedFiles(req, auth_context, collection_id=None):
    if req.method == 'GET':
        stored_files = get_all_files(collection=collection_id)
        serializer = storedFileSerializer(stored_files, many=True)
        return Response(serializer.data)
    elif req.method == 'POST':
        collection_id = req.data['collection']
        if user_is_in_collection(auth_context.user.id ,collection_id):
            newFile = storedFile(
                user=auth_context.user,
                collection=get_file_collection(id=collection_id),
                title=req.data['title'],
                fileData=req.data['fileData'],
                fileSize=req.data['fileSize'],
                expirationDateTime=timezone.now() + datetime.timedelta(days=int(req.data["expiresInDays"]))
            )
            serializer = storedFileSerializer(newFile)
            newFile.save()
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'DELETE'])
def fileView(req, collection_id, file_id):
    if req.method == 'GET':
        sf = get_object_or_404(storedFile, pk=file_id)
        res = FileResponse(open(sf.fileData.path, 'rb'))
        res['Content-Disposition'] = f'attachment; filename="{sf.title}"'
        return res
    if req.method == 'DELETE':
        sf = get_object_or_404(storedFile, pk=file_id)
        sf.delete()
        return Response({"message": "deleted"},status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@login_required(redirect_url=None)
def collection_picture_view(req, auth_context, collection_id=None):
    collection = get_file_collection(id=collection_id)
    if collection and collection.picture:
        pic_path = collection.picture.path
        return FileResponse(open(pic_path, 'rb'), content_type='image/*')
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def register(req):
    form = RegistrationForm(req.data)
    if form.is_valid():
        username = form.cleaned_data['username']
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']

        user = CustomUser.objects.create_user(username=username, email=email, password=password)

        jwt_token = get_jwt_token(user.id, **JWTConfig.JWT_EXP)
        refresh_token = get_jwt_token(user.id, **JWTConfig.REFRESH_TOKEN_EXP)

        response = Response(form.data)
        response.set_cookie(key='jwt', value=jwt_token, httponly=True)
        response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)
        response.status_code = status.HTTP_201_CREATED
        return response
    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@logout_required
def login(req):
    username = req.data['username']
    password = req.data['password']
    user = get_user(username=username)
    if user is None:
        raise AuthenticationFailed('User not found!')
    if not user.check_password(password):
        raise AuthenticationFailed('Wrong password!')

    jwt_token = get_jwt_token(user.id, **JWTConfig.JWT_EXP)
    refresh_token = get_jwt_token(user.id, **JWTConfig.REFRESH_TOKEN_EXP)

    response = Response()
    response.set_cookie(key='jwt', value=jwt_token, httponly=True)
    response.set_cookie(key='refresh_token', value=refresh_token, httponly=True)

    response.status_code = status.HTTP_200_OK

    return response


@api_view(['POST'])
@login_required(redirect_url=None)
def logout(req, auth_context):
    response = Response()
    response.delete_cookie('jwt')
    response.delete_cookie('refresh_token')
    response.status_code = status.HTTP_200_OK
    return response


@api_view(['GET'])
def getAllUsers(req):
    users = CustomUser.objects.all()
    serializer = CustomUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
def getUser(req, user_id):
    user = get_object_or_404(CustomUser, id=user_id)

    if req.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    elif req.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST', 'PUT'])
@login_required(redirect_url=None)
def getAllCollections(req, auth_context):
    if req.method == 'GET':
        collections = get_file_collections(users__in=[auth_context.user.id])
        serializer = FileCollectionSerializer(collections, many=True)
        response = Response(serializer.data)
        response = refresh_tokens_if_needed(response, auth_context)
        return response
    elif req.method == 'POST':
        if (FileCollection.objects.filter(name=req.data['name']).exists()):
            return Response({'conflict': 'name'}, status=status.HTTP_409_CONFLICT)
        if (len(req.data['name']) < 1):
            return Response({'conflict': 'collectionnameshort'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        new_collection = FileCollection.objects.create(name=req.data['name'])
        new_collection.users.add(auth_context.user)
        if collection_password := req.data.get('password', None):
            new_collection.set_password(collection_password)
        if collection_picture := req.data.get('image', None):
            new_collection.picture = collection_picture
        new_collection.save()
        
        serialized_data = {
            'id': new_collection.id,
            'name': new_collection.name,
            'users': new_collection.users.values_list('id', flat=True),
            'files': []
        }

        response = Response(serialized_data)
        response = refresh_tokens_if_needed(response, auth_context)
        return response
    elif req.method == 'PUT':
        if (len(req.data['name']) < 1):
            return Response({'conflict': 'collectionnameshort'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        collection = get_file_collection(name=req.data['name'])
        if collection.users.filter(id=auth_context.user.id).exists():
            return Response({'conflict': 'exists'}, status=status.HTTP_409_CONFLICT)
        if collection.check_password(req.data['password']):
            collection.users.add(auth_context.user)
            collection.save()
            serialized_data = {
                'id': collection.id,
                'name': collection.name,
                "status": 0
            }
            return Response(serialized_data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
def getCollection(req, collection_id):
    collection = get_file_collection(id=collection_id)
    if req.method == 'GET':
        serializer = FileCollectionSerializer(collection)
        return Response(serializer.data)
        
    return Response()


@api_view(['GET', 'PUT', 'DELETE'])
@login_required(redirect_url="/login")
def get_current_user(req, auth_context):
    if req.method == 'GET':
        user = auth_context.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    elif req.method == 'PUT':
        if favoriteObj := req.data.get('favoriteCollection', None):
            if not get_file_collection(id=favoriteObj['id']):
                return Response(status=status.HTTP_404_NOT_FOUND)
            user = auth_context.user
            if favoriteObj['isFavorite'] == True:
                if favoriteObj['id'] not in user.favorite_collections.values_list('id', flat=True):
                    user.favorite_collections.add(favoriteObj['id'])
            else:
                if favoriteObj['id'] in user.favorite_collections.values_list('id', flat=True):
                    user.favorite_collections.remove(favoriteObj['id'])
                else:
                    print('already not favorited xd')
            user.save()
            serializer = CustomUserSerializer(user)
            return Response(serializer.data)
            # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif req.method == 'DELETE':
        auth_context.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@login_required(redirect_url="/")
def testv(req, auth_context):
    return HttpResponse('some')
