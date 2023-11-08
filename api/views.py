from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import HttpResponse, redirect, get_object_or_404
from fileuploadtron_app.models import storedFile, CustomUser
from .serializers import storedFileSerializer, CustomUserSerializer
from .forms import RegistrationForm
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import FileResponse
from django.conf import settings
from .jwt_config import JWTConfig
import jwt
import os
import datetime


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
    auth_context.user = user
    return auth_context


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
def mainView(req, auth_context):
    with open(os.path.join(settings.BASE_DIR, 'fileuploadtron-frontend/build/index.html'), 'r') as f:
        html = f.read()
    
    return HttpResponse(html)


def loginView(req):
    with open(os.path.join(settings.BASE_DIR, 'fileuploadtron-frontend/build/index.html'), 'r') as f:
        html = f.read()
    
    return HttpResponse(html)


@api_view(['GET', 'POST'])
def storedFiles(req):
    if req.method == 'GET':
        stored_files = storedFile.objects.all()
        serializer = storedFileSerializer(stored_files, many=True)
        return Response(serializer.data)
    elif req.method == 'POST':
        dataCopy = req.data.copy()
        dataCopy['expirationDateTime'] = timezone.now() + datetime.timedelta(days=int(dataCopy["expiresInDays"]))
        serializer = storedFileSerializer(data=dataCopy)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        return Response(serializer.data)


@api_view(['GET'])
def downloadView(req, fileid):
    sf = get_object_or_404(storedFile, pk=fileid)
    res = FileResponse(open(sf.fileData.path, 'rb'))
    res['Content-Disposition'] = f'attachment; filename="{sf.title}"'
    return res


@api_view(['POST'])
def register(req):
    form = RegistrationForm(req.data)
    if form.is_valid():
        username = form.cleaned_data['username']
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']

        CustomUser.objects.create_user(username=username, email=email, password=password)

        return Response(form.data, status=status.HTTP_201_CREATED)
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


@api_view(['GET'])
@login_required(redirect_url="/login")
def get_current_user(req, auth_context):
    user = auth_context.user
    serializer = CustomUserSerializer(user)

    return Response(serializer.data)


@login_required(redirect_url="/")
def testv(req, auth_context):
    return HttpResponse('some')
