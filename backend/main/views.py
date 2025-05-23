from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from knox.models import AuthToken
from PIL import Image
import os
from django.core.files.base import ContentFile
User = get_user_model()

def message_response(data, message="Operacja się powiodła"):
    return Response({
        "result": data,
        "message": message
    })

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
                if user.last_login is not None:
                    user.last_login = timezone.now()
                    user.save()
                _, token=AuthToken.objects.create(user)
                return Response({
                    'user': self.serializer_class(user).data,
                    'token': token,
                    'isAdmin': user.is_staff,
                    'message': "Zalogowano pomyślnie"
                    })
            else:
                return Response({"message": "Nieprawidłowe dane"}, status=401)
        else:
            return Response(serializer.errors, status=400)

class TimetableViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Timetable_events.objects.all()
    serializer_class = Timetable_eventsSerializer
    
    def list(self, request):
        queryset = Timetable_events.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        data = serializer.data
        
        if data['creator_id'] == user.id:
            data['is_creator'] = True
        else:
            data['is_creator'] = False
            
        return Response(data)
    
    @action(detail=False, methods=["delete"], url_path="delete/(?P<pk>[^/.]+)")
    def deleteEvent(self, request, pk=None):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        event = Timetable_events.objects.get(pk=pk)
        
        if serializer.data['creator_id'] == user.id or user.is_staff:
            event.delete()
            return Response({"message": "Wydarzenie usunięte"})
        else:
            return Response({"message": "Użytkownik nie zgodny"}, status=403)
    
    @action(detail=False, methods=["post"], url_path="create")
    def createEvent(self, request, token=None):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
        data = request.data
        data['created_by'] = user.id
        serializer = Timetable_eventsCreateSerializer(data=data)
        if serializer.is_valid():
            return message_response(Timetable_eventsDetailsSerializer(serializer.save()).data, "Wydarzenie utworzone")
        else:
            return Response(serializer.errors, status=400)
        
    @action(detail=False, methods=["get"], url_path="event_types")
    def listEvent_types(self, request):
        queryset = Event_types.objects.all()
        serializer = Event_typesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="event_colors")
    def listEvent_colors(self, request):
        queryset = Event_colors.objects.all()
        serializer = Event_colorsSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["put"], url_path="(?P<pk>[^/.]+)/update")
    def updateEvent(self, request, pk=None):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
        event = Timetable_events.objects.get(pk=pk)
        if event.created_by != user and not user.is_staff:
            return Response({"message": "Użytkownik nie zgodny"}, status=403)
        
        serializer = Timetable_eventsCreateSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return message_response(Timetable_eventsDetailsSerializer(event).data, "Wydarzenie zaktualizowane")
        else:
            return Response(serializer.errors, status=400)
    
class ModeratorPanelViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = Profile.objects.all()
    serializer_class = Profiles_moderatorPanelSerializer
    
    
    # Sekcja profili
    @action(detail=False, methods=["get"], url_path="user")
    def listProfiles(self, request):
        queryset = Profile.objects.all()
        serializer = Profiles_moderatorPanelSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="user/(?P<pk>[^/.]+)")
    def requestProfile(self, request, pk=None):
        queryset = Profile.objects.get(pk=pk)
        serializer = Profiles_moderatorPanelSerializer(queryset)
        return Response(serializer.data)
    
    @action(detail=False, methods=["put"], url_path="user/(?P<pk>[^/.]+)/update")
    def updateProfile(self, request, pk=None):
        queryset = Profile.objects.get(pk=pk)
        serializer = Profiles_moderatorPanelSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Profil zaktualizowany")
        else:
            return Response(serializer.errors, status=400)
        
    @action(detail=False, methods=["post"], url_path="user/create")
    def createProfile(self, request):
        serializer = Profiles_moderatorPanelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Dodano użytkownika")
        else:
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=["delete"], url_path="user/delete/(?P<pk>[^/.]+)")
    def deleteProfile(self, request, pk=None):
        user = Profile.objects.get(pk=pk)
        user.delete()
        return Response({"message": "Użytkownik usunięty"})
    
    
    # Sekcja typów wydarzeń
    @action(detail=False, methods=["get"], url_path="event_types")
    def listEvent_types(self, request):
        queryset = Event_types.objects.all()
        serializer = Event_typesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="event_types/(?P<pk>[^/.]+)")
    def requestEvent_type(self, request, pk=None):
        queryset = Event_types.objects.get(pk=pk)
        serializer = Event_typesSerializer(queryset)
        return Response(serializer.data)
    
    @action(detail=False, methods=["put"], url_path="event_types/(?P<pk>[^/.]+)/update")
    def updateEvent_types(self, request, pk=None):
        queryset = Event_types.objects.get(pk=pk)
        serializer = Event_typesSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Typ wydarzenia zaktualizowany")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["post"], url_path="event_types/create")
    def createEvent_type(self, request):
        serializer = Event_typesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Dodano typ wydarzenia")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["delete"], url_path="event_types/delete/(?P<pk>[^/.]+)")
    def deleteEvent_type(self, request, pk=None):
        event_type = Event_types.objects.get(pk=pk)
        event_type.delete()
        return Response({"message": "Typ wydarzenia usunięty"})
    
    
    #Sekcja kolorów wydarzeń
    @action(detail=False, methods=["get"], url_path="event_colors")
    def listEvent_colors(self, request):
        queryset = Event_colors.objects.all()
        serializer = Event_colorsSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="event_colors/(?P<pk>[^/.]+)")
    def requestEvent_color(self, request, pk=None):
        queryset = Event_colors.objects.get(pk=pk)
        serializer = Event_colorsSerializer(queryset)
        return Response(serializer.data)
    
    @action(detail=False, methods=["put"], url_path="event_colors/(?P<pk>[^/.]+)/update")
    def updateEvent_colors(self, request, pk=None):
        queryset = Event_colors.objects.get(pk=pk)
        serializer = Event_colorsSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Kolor zaktualizowany")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["post"], url_path="event_colors/create")
    def createEvent_color(self, request):
        serializer = Event_colorsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Dodano kolor wydarzenia")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["delete"], url_path="event_colors/delete/(?P<pk>[^/.]+)")
    def deleteEvent_color(self, request, pk=None):
        event_color = Event_colors.objects.get(pk=pk)
        event_color.delete()
        return Response({"message": "Kolor wydarzenia usunięty"})
    
    
class AccountViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    
    def list(self, request):
        queryset = Profile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="change_password")
    def change_password(self, request, token=None):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
        serializer = Password_changeSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']   
            user.set_password(password)
            user.last_login = timezone.now()
            user.save()
            return Response({"message": "Hasło zmienione"})
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["get"], url_path="getuser")
    def getUser(self, request):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        serializer = ProfileSerializer(self.queryset.get(pk=user.id))
        data = serializer.data
            
        return Response({'user': data, 'isAdmin': user.is_staff})
    
    @action(detail=False, methods=["post"], url_path="change_profile_picture")
    def change_profile_picture(self, request):
        try:
            token = request.headers['Authorization'][6:21]
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
        queryset = Profile.objects.get(pk=user.id)
        serializer = ProfileSerializer(queryset, data=request.data, partial=True)
        
        if serializer.is_valid():
            profile_picture = request.data.get('profile_picture')
            # Modyfikacja zdjęcia profilowego do preferowanych wymiarów
            if profile_picture:
                image = Image.open(profile_picture)
                image = image.resize((256, 256))
                temp_file = ContentFile(b"")
                image.save(temp_file, format="PNG")
                temp_file.seek(0)
                temp_file.name = f"user_{user.id}_profile_picture.png"
                serializer.validated_data['profile_picture'] = temp_file  
                
            serializer.save()
            
            return message_response(serializer.data, "Zmieniono zdjęcie profilowe")
        else:
            return Response(serializer.errors, status=400)
    
class TasksViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()
    
    def list(self, request):
        queryset = Tasks.objects.all()
        serializer = Tasks_for_displaySerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="create")
    def createEvent_type(self, request):
        serializer = TasksSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Dodano zadanie")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["put"], url_path="(?P<pk>[^/.]+)/update_status")
    def updateStatus(self, request, pk=None):
        queryset = Tasks.objects.get(pk=pk)
        serializer = TasksSerializer(queryset, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Status zmieniony")
        else:
            return Response(serializer.errors, status=400)
        
    @action(detail=False, methods=["put"], url_path="(?P<pk>[^/.]+)/update_assigned")
    def updateAssigned(self, request, pk=None):
        queryset = Tasks.objects.get(pk=pk)
        serializer = TasksSerializer(queryset, data=request.data, partial=True)

        
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Przypisanie zmienione")
        else:
            return Response(serializer.errors, status=400)