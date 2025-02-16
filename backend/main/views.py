from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.contrib.auth import get_user_model, authenticate
from knox.models import AuthToken
User = get_user_model()

class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(request, email=email, password=password)
            
            if user:
                _, token=AuthToken.objects.create(user)
                return Response({
                    'user': self.serializer_class(user).data,
                    'token': token
                    })
            else:
                return Response({"error": "Nieprawidłowe dane"}, status=401)
        else:
            return Response(serializer.errors, status=400)

class TimetableViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated] # TODO Tylko na czas testowania
    queryset = Timetable_events.objects.all()
    serializer_class = Timetable_eventsSerializer
    
    def list(self, request):
        queryset = Timetable_events.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        return Response(serializer.data)
    
class ModeratorPanelViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser] # TODO Tylko na czas testowania
    queryset = Profile.objects.all()
    serializer_class = Profiles_moderatorPanelSerializer
    
    @action(detail=False, methods=["get"], url_path="user")
    def listProfiles(self, request):
        queryset = Profile.objects.all()
        serializer = Profiles_moderatorPanelSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="event_types")
    def listEvent_types(self, request):
        queryset = Event_types.objects.all()
        serializer = Event_types_moderatorPanelSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="event_types/create")
    def createEvent_type(self, request):
        serializer = Event_types_moderatorPanelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    @action(detail=False, methods=["post"], url_path="user/create")
    def createProfile(self, request):
        serializer = Profiles_moderatorPanelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=["delete"], url_path="user/delete/(?P<pk>[^/.]+)")
    def deleteUser(self, request, pk=None):
        user = Profile.objects.get(pk=pk)
        user.delete()
        return Response({"message": "Użytkownik usunięty"})
    
    @action(detail=False, methods=["delete"], url_path="event_types/delete/(?P<pk>[^/.]+)")
    def deleteEvent_type(self, request, pk=None):
        event_type = Event_types.objects.get(pk=pk)
        event_type.delete()
        return Response({"message": "Typ wydarzenia usunięty"})
    
    