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
    
    def update(self, instance, validated_data):
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.save()
        return instance
    
    class Meta:
        model = Profile
        fields = ('id', 'first_name', 'last_name', 'email', 'last_login', 'profile_picture')

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        ret['last_login'] = instance.last_login
        return ret
    
    class Meta:
        model = Profile
        fields = ('id', 'first_name', 'last_name', 'email', 'password', "profile_picture")
    
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
        
        
# TasksSerializers
class TasksSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(allow_null=True)
    
    def create(self, validated_data):
        return Tasks.objects.create_task(**validated_data)
    
    def update(self, instance, validated_data):
        instance.completion_status = validated_data.get('completion_status', instance.completion_status)
        instance.user_id = validated_data.get('user_id', instance.user_id)
        instance.save()
        return instance
    
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'description', 'user', 'completion_status', 'due_date', 'event', 'user_id')
        
class Tasks_for_displaySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    event = serializers.StringRelatedField()
    color = serializers.StringRelatedField(source='event.event_color')
    
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'description', 'user', 'completion_status', 'due_date', 'event', 'user_id', 'event_id', "color")

class Tasks_for_eventSerializer(serializers.ModelSerializer):
    task_description = serializers.CharField(source='description')
    assigned = serializers.StringRelatedField(source='user')
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'task_description', 'assigned', 'completion_status', 'due_date')


# Timetable_eventsSerializers
class Timetable_eventsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    event_type = serializers.StringRelatedField()
    event_color = serializers.StringRelatedField()
    
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
    tasks = Tasks_for_eventSerializer(many=True)
    event_color = serializers.StringRelatedField()
    
    class Meta:
        model = Timetable_events
        fields = ("id", "title", "start", "end", "event_type", "description", "creator", "creator_id", "tasks", "event_color")


# moderatorPanelSerializers
class Profiles_moderatorPanelSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    
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
        fields = ("id" , "first_name", "last_name", "email", "last_login", "password")
        
        
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
            

# Event_colorsSerializers
class Event_colorsSerializer(serializers.ModelSerializer):
    event_color = serializers.CharField()
    
    def validate_event_color(self, value):
        if Event_colors.objects.filter(event_color=value).exists():
            raise serializers.ValidationError("Hex koloru nie może się powtarzać")
        if value > 'FFFFFF' or value < '000000':
            raise serializers.ValidationError("Hex koloru musi być w formacie RRGGBB")
        if len(value) != 6:
            raise serializers.ValidationError("Hex koloru musi mieć długość 6 znaków")
        return value
    
    def create(self, validated_data):
        return Event_colors.objects.create_event_color(**validated_data)
    
    def update(self, instance, validated_data):
        instance.event_color = validated_data.get('event_color', instance.event_color)
        instance.save()
        return instance
    
    class Meta:
            model = Event_colors
            fields = ("id", "event_color")