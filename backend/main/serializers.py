from datetime import datetime
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        ret['last_login'] = instance.last_login
        return ret
    
class Login_password_changeSerializer(serializers.Serializer):
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
    
# class ProfileSerializer(serializers.Serializer):
#     first_name = serializers.CharField()
#     last_name = serializers.CharField()
#     email = serializers.EmailField()
#     password = serializers.CharField()
    
#     def validate_password(self, value):
#         try:
#             validate_password(value)
#         except ValidationError as e:
#             raise serializers.ValidationError(e.messages)
#         return value
    
#     def create(self, validated_data):
#         return User.objects.create_user(**validated_data)
    
#     def update(self, instance, validated_data):
#         instance.first_name = validated_data.get('first_name', instance.first_name)
#         instance.last_name = validated_data.get('last_name', instance.last_name)
#         instance.email = validated_data.get('email', instance.email)
#         instance.set_password(validated_data.get('password', instance.password))
#         instance.save()
#         return instance
    
#     def to_representation(self, instance):
#         ret = super().to_representation(instance)
#         ret.pop('password', None)
#         return ret

class TasksSerializer(serializers.ModelSerializer):
    task_description = serializers.CharField(source='description')
    assigned = serializers.StringRelatedField(source='user')
    class Meta:
        model = Tasks
        fields = ('id', 'task_name', 'task_description', 'assigned', 'completion_status', 'due_date')

class Timetable_eventsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    className = serializers.StringRelatedField(source='event_type')
    
    class Meta:
        model = Timetable_events
        fields = ('id', 'title', 'start', 'end', 'className')
        
        
class Timetable_eventsCreateSerializer(serializers.ModelSerializer):
    # start_date = 
    # end_date = 
    
    class Meta:
        model = Timetable_events
        fields = ('id', 'event_name', 'start_date', 'end_date', 'event_type', 'description', 'created_by')

class Timetable_eventsDetailsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    className = serializers.StringRelatedField(source='event_type')
    creator = serializers.StringRelatedField(source='created_by')
    creator_id = serializers.IntegerField(source='created_by_id')
    tasks = TasksSerializer(many=True)
    
    class Meta:
        model = Timetable_events
        fields = ("id", "title", "start", "end", "className", "description", "creator", "creator_id", "tasks")


class Profiles_moderatorPanelSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    # def update(self, instance, validated_data):
    #     instance.first_name = validated_data.get('first_name', instance.first_name)
    #     instance.last_name = validated_data.get('last_name', instance.last_name)
    #     instance.email = validated_data.get('email', instance.email)
    #     instance.set_password(validated_data.get('password', instance.password))
    #     instance.save()
    #     return instance
    
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
    
    class Meta:
        model = Profile
        fields = ("id", "first_name", "last_name", "email", "last_login", "password")
        
class Event_typesSerializer(serializers.ModelSerializer):
    event_type = serializers.CharField()
    
    def validate_event_type(self, value):
        if Event_types.objects.filter(event_type=value).exists():
            raise serializers.ValidationError("Nazwy typów wydarzeń nie mogą się powtarzać")
        return value
    
    def create(self, validated_data):
        return Event_types.objects.create_event_type(**validated_data)
    
    class Meta:
            model = Event_types
            fields = ("id", "event_type")