from django.urls import path
from . import views

urlpatterns = [
    path('files/<int:fileid>', views.downloadView),
    path('files/', views.storedFiles),
    path('users/<int:user_id>', views.getUser),
    path('users/', views.getAllUsers),
    path('api/current_user/', views.get_current_user),
    path('api/register/', views.register),
    path('api/login/', views.login),
    path('api/logout/', views.logout),
    path('login/', views.loginView),
    path('', views.mainView),
    # path('test/', views.testv),
]