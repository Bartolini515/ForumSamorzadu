import json
import os
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .serializers import *
from rest_framework.response import Response
from .models import *
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from knox.models import AuthToken
from PIL import Image
from django.core.files.base import ContentFile
from .utils.schedule_scrapper import schedule_scrapper_main
from .tasks import send_email_notification
from django.core.cache import cache
from django.conf import settings
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
                    'user': ProfileSerializer(user).data,
                    'token': token,
                    'isAdmin': user.is_staff,
                    'message': "Zalogowano pomyślnie"
                    })
            else:
                return Response({"message": "Nieprawidłowe dane"}, status=401)
        else:
            return Response(serializer.errors, status=400)
        
class TimetableViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Timetable_events.objects.all()
    serializer_class = Timetable_eventsSerializer
    
    def list(self, request):
        cache_key = 'timetable_events_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)
            
        queryset = Timetable_events.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        user = self.request.user
        data = serializer.data
        
        if data['creator_id'] == user.id:
            data['is_creator'] = True
        else:
            data['is_creator'] = False
            
        return Response(data)
    
    def create(self, request):
        user = self.request.user
        
        data = request.data
        data['created_by'] = user.id
        serializer = Timetable_eventsCreateSerializer(data=data)
        if serializer.is_valid():
            if data.get('do_notify'):
                send_email_notification.delay(
                    subject="Nowe wydarzenie w kalendarzu",
                    message=f"Użytkownik {user.first_name} {user.last_name} utworzył nowe wydarzenie: {data['event_name']} o dacie {data['start_date']}.",
                    recipient_list=["all"]
                )
            cache.delete('timetable_events_list')
            return message_response(Timetable_eventsDetailsSerializer(serializer.save()).data, "Wydarzenie utworzone")
        else:
            return Response(serializer.errors, status=400)
    
    def update(self, request, pk=None):
        user = self.request.user
        
        event = self.queryset.get(pk=pk)
        if event.created_by != user and not user.is_staff:
            return Response({"message": "Użytkownik nie zgodny"}, status=403)
        
        serializer = Timetable_eventsCreateSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete('timetable_events_list')
            return message_response(Timetable_eventsDetailsSerializer(event).data, "Wydarzenie zaktualizowane")
        else:
            return Response(serializer.errors, status=400)
        
    def destroy(self, request, pk=None):
        user = self.request.user
        
        serializer = Timetable_eventsDetailsSerializer(self.queryset.get(pk=pk))
        event = self.queryset.get(pk=pk)
        
        if serializer.data['creator_id'] == user.id or user.is_staff:
            event.delete()
            cache.delete('timetable_events_list')
            return Response({"message": "Wydarzenie usunięte"})
        else:
            return Response({"message": "Użytkownik nie zgodny"}, status=403)
        
    @action(detail=False, methods=["get"], url_path="event_types")
    def listEvent_types(self, request):
        cache_key = 'event_types_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        queryset = Event_types.objects.all()
        serializer = Event_typesSerializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)
    
class ModeratorPanelViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]
    
    # Sekcja profili
    @action(detail=False, methods=["get"], url_path="user")
    def listProfiles(self, request):
        cache_key = 'profiles_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        queryset = Profile.objects.all()
        serializer = Profiles_moderatorPanelSerializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="user/(?P<pk>[^/.]+)")
    def requestProfile(self, request, pk=None):
        queryset = Profile.objects.get(pk=pk)
        serializer = Profiles_moderatorPanelSerializer(queryset)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="user/create")
    def createProfile(self, request):
        serializer = Profiles_moderatorPanelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            send_email_notification.delay(
                subject="Witamy w samorządzie szkolnym ZSET!",
                message=f"Twoje konto samorządowe zostało utworzone. \n"
                        f"Możesz się zalogować używając adresu email: \"{request.data.get('email')}\" oraz hasła \"{request.data.get('password')}\".\n"
                        f"Link do strony - https://samorzad.w.zset.leszno.pl",
                recipient_list=[request.data.get('email')]
            )
            cache.delete('profiles_list')
            return message_response(serializer.data, "Dodano użytkownika")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["put"], url_path="user/(?P<pk>[^/.]+)/update")
    def updateProfile(self, request, pk=None):
        queryset = Profile.objects.get(pk=pk)
        serializer = Profiles_moderatorPanelSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete('profiles_list')
            return message_response(serializer.data, "Profil zaktualizowany")
        else:
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=["delete"], url_path="user/delete/(?P<pk>[^/.]+)")
    def deleteProfile(self, request, pk=None):
        user = Profile.objects.get(pk=pk)
        user.delete()
        cache.delete('profiles_list')
        return Response({"message": "Użytkownik usunięty"})
    
    
    # Sekcja typów wydarzeń
    @action(detail=False, methods=["get"], url_path="event_types")
    def listEvent_types(self, request):
        cache_key = 'moderator_event_types_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        queryset = Event_types.objects.all()
        serializer = Event_typesSerializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="event_types/(?P<pk>[^/.]+)")
    def requestEvent_type(self, request, pk=None):
        queryset = Event_types.objects.get(pk=pk)
        serializer = Event_typesSerializer(queryset)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="event_types/create")
    def createEvent_type(self, request):
        serializer = Event_typesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete('moderator_event_types_list')
            cache.delete('event_types_list')
            return message_response(serializer.data, "Dodano typ wydarzenia")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["put"], url_path="event_types/(?P<pk>[^/.]+)/update")
    def updateEvent_types(self, request, pk=None):
        queryset = Event_types.objects.get(pk=pk)
        serializer = Event_typesSerializer(queryset, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            cache.delete('moderator_event_types_list')
            cache.delete('event_types_list')
            return message_response(serializer.data, "Typ wydarzenia zaktualizowany")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=["delete"], url_path="event_types/delete/(?P<pk>[^/.]+)")
    def deleteEvent_type(self, request, pk=None):
        event_type = Event_types.objects.get(pk=pk)
        event_type.delete()
        cache.delete('moderator_event_types_list')
        cache.delete('event_types_list')
        return Response({"message": "Typ wydarzenia usunięty"})
    
    
    # Sekcja planu lekcji
    @action(detail=False, methods=["post"], url_path="schedule/create", permission_classes=[permissions.IsAdminUser])
    def create_schedule(self, request):
        serializer = ScheduleURLSerializer(data=request.data)
        if serializer.is_valid():
            url = serializer.validated_data['url']
            success, message = schedule_scrapper_main(url)
            if success:
                cache.delete('schedule_data')
                return Response({"message": message})
            else:
                # If validation failed in the scrapper, return the error
                return Response({"error": message}, status=400)
        else:
            return Response(serializer.errors, status=400)
    
class AccountViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    
    def list(self, request):
        queryset = Profile.objects.filter(is_active=True, is_superuser=False)
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["post"], url_path="change_password")
    def change_password(self, request):
        user = self.request.user
        
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
        user = self.request.user
        serializer = ProfileSerializer(self.queryset.get(pk=user.id))
        data = serializer.data
            
        return Response({'user': data, 'isAdmin': user.is_staff})
    
    @action(detail=False, methods=["post"], url_path="change_profile_picture")
    def change_profile_picture(self, request):
        user = self.request.user
        
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

    @action(detail=False, methods=["post"], url_path="reset_password", permission_classes=[permissions.AllowAny])
    def reset_password(self, request):
        serializer = Password_resetSerializer(data=request.data)
        if serializer.is_valid():
            user = Profile.objects.get(email=serializer.validated_data['email'])
            token, created = PasswordResetToken.objects.get_or_create(user=user)

            origin = request.headers.get('Origin')
            reset_link = f"{origin}/reset-password?token={token.token}"

            send_email_notification.delay(
                subject="Resetowanie hasła",
                message=f"Aby zresetować hasło, kliknij w poniższy link: {reset_link}\nLink jest ważny przez 1 godzinę.",
                recipient_list=[user.email]
            )

            return Response({"message": "Link do resetowania hasła został wysłany na Twój adres email."})
        else:
            return Response(serializer.errors, status=400)

    @action(detail=False, methods=["post"], url_path="reset_password_confirm", permission_classes=[permissions.AllowAny])
    def reset_password_confirm(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token_obj = PasswordResetToken.objects.get(token=serializer.validated_data['token'])
            except PasswordResetToken.DoesNotExist:
                return Response({"message": "Nieprawidłowy token."}, status=404)

            if token_obj.is_expired():
                token_obj.delete()
                return Response({"message": "Token wygasł."}, status=400)

            user = token_obj.user
            user.set_password(serializer.validated_data['password'])
            user.save()
            token_obj.delete()

            return Response({"message": "Hasło zostało pomyślnie zmienione."})
        else:
            return Response(serializer.errors, status=400)
    
class TasksViewset(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TasksSerializer
    queryset = Tasks.objects.all()
    
    def list(self, request):
        cache_key = 'tasks_list'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        queryset = Tasks.objects.all()
        self.queryset = queryset
        serializer = Tasks_for_displaySerializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=3600)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            if serializer.data.get('user_id') is not None:
                user = User.objects.get(pk=serializer.data.get('user_id'))
                event = Timetable_events.objects.get(pk=serializer.data.get('event'))
                if user and event:
                    send_email_notification.delay(
                        subject="Zadanie zostało przypisane",
                        message=f"Przypisano do Ciebie zadanie: {serializer.data['task_name']} w wydarzeniu {event.event_name}.",
                        recipient_list=[user.email]
                    )
            else:
                send_email_notification.delay(
                    subject="Nowe zadanie do wykonania",
                    message=f"Użytkownik {request.user.first_name} {request.user.last_name} dodał nowe zadanie: {serializer.validated_data['task_name']}.",
                    recipient_list=["all"]
                )
            cache.delete('tasks_list')
            return message_response(serializer.data, "Dodano zadanie")
        else:
            return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=["put"], url_path=("update_status"))
    def updateStatus(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            if serializer.data.get('completion_status') and serializer.data.get('event'):
                event_id = serializer.data.get('event')
                if event_id:
                    try:
                        event = Timetable_events.objects.get(pk=event_id)
                        send_email_notification.delay(
                            subject="Zadanie zostało ukończone",
                            message=f'Użytkownik {request.user.first_name} {request.user.last_name} oznaczył zadanie "{serializer.data["task_name"]}" jako ukończone.',
                            recipient_list=[event.created_by.email]
                        )
                    except Timetable_events.DoesNotExist:
                        pass
            cache.delete('tasks_list')
            return message_response(serializer.data, "Status zmieniony")
        else:
            return Response(serializer.errors, status=400)
        
    @action(detail=True, methods=["put"], url_path="update_assigned")
    def updateAssigned(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            if serializer.data.get('user_id') is not None:
                user = User.objects.get(pk=serializer.data.get('user_id'))
                if (event_id := serializer.data.get('event')) and user:
                    try:
                        event = Timetable_events.objects.get(pk=event_id)
                        send_email_notification.delay(
                            subject="Zadanie twojego wydarzenia zostało przypisane",
                            message=f'Użytkownikowi {user.first_name} {user.last_name} zostało przypisane zadanie "{serializer.data["task_name"]}" do wydarzenia: {event.event_name}.',
                            recipient_list=[event.created_by.email]
                        )
                    except Timetable_events.DoesNotExist:
                        pass
            cache.delete('tasks_list')
            return message_response(serializer.data, "Przypisanie zmienione")
        else:
            return Response(serializer.errors, status=400)
        
    def destroy(self, request, pk=None):
        task = self.queryset.get(pk=pk)
        task.delete()
        cache.delete('tasks_list')
        return Response({"message": "Zadanie usunięte"})
        
class ScheduleViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        cache_key = 'schedule_data'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        try:
            script_dir = os.path.dirname(__file__)
            data_dir = os.path.join(script_dir, "..", "data")
            file_path = os.path.join(data_dir, "schedule.json")
            if not os.path.exists(file_path):
                return Response({"message": "Schedule file not found"}, status=404)
            with open(file_path, 'r', encoding='utf-8') as file:
                schedule_data = json.load(file)
            
            cache.set(cache_key, schedule_data, timeout=3600)
            return Response(schedule_data)
        except FileNotFoundError:
            return Response({"message": "Schedule file not found"}, status=404)
        except json.JSONDecodeError:
            return Response({"message": "Error decoding JSON"}, status=400)

class UtilitiesViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"], url_path="email/test")
    def test_email(self, request):
        send_email_notification.delay(
            subject="Test Email",
            message="This is a test email.",
            recipient_list=["b.jedrzychowski@zset.leszno.pl"]
        )
        return Response({"message": "Test email sent"}, status=200)