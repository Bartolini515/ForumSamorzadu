from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from knox.models import AuthToken
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
        
    @action(detail=False, methods=["post"], url_path="change_password/(?P<token>[^/.]+)")
    def change_password(self, request, token=None):
        serializer = Login_password_changeSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data['password']
            
            try:
                auth_token = AuthToken.objects.get(token_key=token[:15])
                user = auth_token.user
            except AuthToken.DoesNotExist:
                return Response({"message": "Invalid token"}, status=400)
            
            user.set_password(password)
            user.last_login = timezone.now()
            user.save()
            return Response({"message": "Hasło zmienione"})
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
    
    @action(detail=False, methods=["post"], url_path="create/(?P<token>[^/.]+)")
    def createEvent(self, request, token=None):
        try:
            auth_token = AuthToken.objects.get(token_key=token[:15])
            user = auth_token.user
            data = request.data
            data['start_date'] = request.data['start_date'][:10]
            if 'end_date' in request.data and request.data['end_date'] not in [None, "", "null"]:
                data['end_date'] = request.data['end_date'][:10]
            data['created_by'] = user.id
        except AuthToken.DoesNotExist:
            return Response({"message": "Invalid token"}, status=400)
        
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
    
class ModeratorPanelViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]
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
        serializer = Event_typesSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="event_types/create")
    def createEvent_type(self, request):
        serializer = Event_typesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return message_response(serializer.data, "Dodano typ wydarzenia")
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
    def deleteUser(self, request, pk=None):
        user = Profile.objects.get(pk=pk)
        user.delete()
        return Response({"message": "Użytkownik usunięty"})
    
    @action(detail=False, methods=["delete"], url_path="event_types/delete/(?P<pk>[^/.]+)")
    def deleteEvent_type(self, request, pk=None):
        event_type = Event_types.objects.get(pk=pk)
        event_type.delete()
        return Response({"message": "Typ wydarzenia usunięty"})
    
    