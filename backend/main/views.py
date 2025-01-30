from rest_framework import viewsets, permissions
from .serializers import *
from rest_framework.response import Response
from .models import *

class TimetableViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny] # TODO Tylko na czas testowania
    queryset = Timetable_events.objects.all()
    serializer_class = Timetable_eventsSerializer
    
    def list(self, request):
        queryset = Timetable_events.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        return Response(serializer.data)