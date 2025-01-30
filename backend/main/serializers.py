from rest_framework import serializers
from .models import *

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

class Timetable_eventsDetailsSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='event_name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    className = serializers.StringRelatedField(source='event_type')
    creator = serializers.StringRelatedField(source='created_by')
    tasks = TasksSerializer(many=True)
    
    class Meta:
        model = Timetable_events
        fields = ("id", "title", "start", "end", "className", "description", "creator", "tasks")
