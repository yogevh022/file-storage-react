from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import HttpResponse, get_object_or_404
from winrates_app.models import storedFile
from .serializers import storedFileSerializer
from django.utils import timezone
from django.http import FileResponse
from django.conf import settings
import os
import datetime

@api_view(['GET', 'POST'])
def getStoredFiles(req):
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

@api_view(['GET'])
def mainView(req):
    with open(os.path.join(settings.BASE_DIR, 'winrates-frontend/build/index.html'), 'r') as f:
        html = f.read()
    
    return HttpResponse(html)

def testv(req):
    return HttpResponse('some')