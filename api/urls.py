from django.urls import path
from . import views

urlpatterns = [
    path('files/<int:fileid>', views.downloadView),
    path('files/', views.getStoredFiles),
    path('test/', views.testv),
    path('', views.mainView),
]