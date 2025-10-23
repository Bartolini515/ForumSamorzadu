from datetime import datetime
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()

# ProfilesSerializers
class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(allow_null=True)
    created_events = serializers.SlugRelatedField(
        many=True, read_only=True, allow_null=True, slug_field='id'
    )
    
    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
    
    class Meta:
        model = Profile
        fields = ('id', 'first_name', 'last_name', 'email', 'last_login', 'role', 'profile_picture', 'created_events')

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    class Meta:
        model = Profile
        fields = ('email', 'password')
    
class Password_changeSerializer(serializers.Serializer):
    password = serializers.CharField()
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
    
class Password_resetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate_email(self, value):
        if not Profile.objects.filter(email=value).exists():
            raise serializers.ValidationError("Użytkownik z podanym emailem nie istnieje")
        return value

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField()
    
    def validate_token(self, value):
        try:
            token_obj = PasswordResetToken.objects.get(token=value)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Nieprawidłowy token resetu hasła.")
        if token_obj.is_expired():
            raise serializers.ValidationError("Token resetu hasła wygasł.")
        return token_obj

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
        
# TasksSerializers
class TasksSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(many=True, queryset=Profile.objects.all(), allow_null=True)
    
    def validate(self, data):
        """
        Check that the number of users does not exceed max_users.
        """
        users = data.get('users')
        max_users = data.get('max_users')

        if users and max_users is not None and len(users) > max_users:
            raise serializers.ValidationError({'users': f"Liczba przypisanych użytkowników ({len(users)}) nie może przekraczać maksymalnej liczby użytkowników ({max_users})."})
        return data
    
    def create(self, validated_data):
        due_date = validated_data.get('due_date', None)
        event = validated_data.get('event', None)
        if not (due_date and event):
            raise serializers.ValidationError("Data terminu i wydarzenie muszą być podane")
        if not (due_date and due_date > datetime.now().date()):
            raise serializers.ValidationError("Data terminu musi być w przyszłości")
        return Tasks.objects.create_task(**validated_data)
    
    def update(self, instance, validated_data):
        instance.completion_status = validated_data.get('completion_status', instance.completion_status)
        instance.users.set(validated_data.get('users', instance.users.all()))
        instance.save()
        return instance
    
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'description', 'users', 'completion_status', 'due_date', 'event', 'max_users')
        
class Tasks_for_displaySerializer(serializers.ModelSerializer):
    class UserSerializer(serializers.ModelSerializer):
        class Meta:
            model = Profile
            fields = ('id', 'first_name', 'last_name', 'email')
    class EventSerializer(serializers.ModelSerializer):
        class Meta:
            model = Timetable_events
            fields = ('id', 'event_name', 'event_color')
    users = UserSerializer(many=True, read_only=True)
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'description', 'users', 'completion_status', 'due_date', 'event', 'max_users')


# NotesSerializers
class NotesSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    created_by_id = serializers.IntegerField(read_only=True, source='created_by.id')
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return Notes.objects.create(**validated_data)
    
    class Meta:
        model = Notes
        fields = ("id", "title", "content", "created_at", "updated_at", "created_by", "created_by_id", "event")


# Timetable_eventsSerializers
class Timetable_eventsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    event_type = serializers.StringRelatedField()
    
    class Meta:
        model = Timetable_events
        fields = ('id', 'title', 'start', 'end', 'event_color', 'event_type')
        
        
class Timetable_eventsCreateSerializer(serializers.ModelSerializer):
    def update(self, instance, validated_data):
        instance.event_name = validated_data.get('event_name', instance.event_name)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance
    
    class Meta:
        model = Timetable_events
        fields = ('id', 'event_name', 'start_date', 'end_date', 'event_type', 'event_color', 'description', 'created_by')

class Timetable_eventsDetailsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    event_type = serializers.StringRelatedField()
    creator = serializers.StringRelatedField(source='created_by')
    creator_id = serializers.IntegerField(source='created_by_id')
    tasks = Tasks_for_displaySerializer(many=True)
    notes = NotesSerializer(many=True)
    
    class Meta:
        model = Timetable_events
        fields = ("id", "title", "start", "end", "event_type", "description", "creator", "creator_id", "tasks", "event_color", "notes")


# moderatorPanelSerializers
class Profiles_moderatorPanelSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    role = serializers.CharField()
    
    def validate_password(self, value):
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.role = validated_data.get('role', instance.role)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
    
    class Meta:
        model = Profile
        fields = ("id" , "first_name", "last_name", "email", "role", "last_login", "is_active", "is_staff", "password")


# Event_typesSerializers
class Event_typesSerializer(serializers.ModelSerializer):
    event_type = serializers.CharField()
    
    def validate_event_type(self, value):
        if Event_types.objects.filter(event_type=value).exists():
            raise serializers.ValidationError("Nazwy typów wydarzeń nie mogą się powtarzać")
        return value
    
    def create(self, validated_data):
        return Event_types.objects.create_event_type(**validated_data)
    
    def update(self, instance, validated_data):
        instance.event_type = validated_data.get('event_type', instance.event_type)
        instance.save()
        return instance
    
    class Meta:
            model = Event_types
            fields = ("id", "event_type")


# ScheduleSerializers
class ScheduleURLSerializer(serializers.Serializer):
    url = serializers.URLField(required=True)
    
    def validate_url(self, value):
        if not value.startswith("http://") and not value.startswith("https://"):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value