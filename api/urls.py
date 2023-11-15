from django.urls import path
from . import views

urlpatterns = [
    path('api/collections/<int:collection_id>/files/<int:file_id>/', views.downloadView),
    path('api/collections/<int:collection_id>/files/', views.storedFiles),
    path('api/collections/<int:collection_id>/picture/', views.collection_picture_view),
    path('api/collections/<int:collection_id>/', views.getCollection),
    path('api/collections/', views.getAllCollections),
    path('api/current_user/', views.get_current_user),
    path('api/register/', views.register),
    path('api/login/', views.login),
    path('api/logout/', views.logout),
    path('api/users/<int:user_id>/', views.getUser),
    path('api/users/', views.getAllUsers),
    path('login/', views.loginView),
    path('register/', views.registerView),
    path('collections/', views.mainView),
    path('test/', views.testv),
    path('', views.mainView),
]