import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils import timezone
from datetime import timedelta
import uuid

class ProfileManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault( 'is_staff', True )
        extra_fields.setdefault( 'is_superuser', True )
        return self.create_user(email, password, **extra_fields)
        

def user_profile_picture(instance, filename):
    return os.path.join('profile_pictures', filename)

class Profile(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, null=True, blank=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=50, null=True, blank=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to=user_profile_picture)
    
    
    objects = ProfileManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def save(self, *args, **kwargs):
        # Check if the instance already has a file and delete it if a new file is being uploaded
        if self.pk:
            old_instance = Profile.objects.filter(pk=self.pk).first()
            if old_instance and old_instance.profile_picture and self.profile_picture != old_instance.profile_picture:
                if os.path.isfile(old_instance.profile_picture.path):
                    os.remove(old_instance.profile_picture.path)
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            self.first_name + ' ' + self.last_name
            if self.first_name and self.last_name is not None
            else self.username
            if self.username is not None
            else self.email
        )


class PasswordResetToken(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return self.created_at < timezone.now() - timedelta(hours=1)

    def __str__(self):
        return f"Password reset token for {self.user}"


class Event_typesManager(models.Manager):
    def create_event_type(self, event_type):
        event_type = self.model(event_type=event_type)
        event_type.save(using=self._db)
        return event_type

class Event_types(models.Model):
    event_type = models.CharField(max_length=20, unique=True, null=False, blank=False)
    
    objects = Event_typesManager()
    def __str__(self):
        return self.event_type
    
    
class Timetable_events(models.Model):
    event_name = models.CharField(max_length=255)
    start_date = models.DateField(null=False, blank=False)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    event_type = models.ForeignKey(Event_types, on_delete=models.CASCADE, related_name='events_of_type', null=False, blank=False)
    event_color = models.CharField(max_length=6, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, related_name='created_events', null=True, blank=False)
    do_notify = models.BooleanField(default=False)
    
    def __str__(self):
        return self.event_name
    
    
class Notes(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    event = models.ForeignKey(Timetable_events, on_delete=models.CASCADE, related_name='notes')
    created_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, related_name='created_notes', null=True, blank=True)
    
    def __str__(self):
        return self.title


class TasksManager(models.Manager):
    def create_task(self, task_name, description, users, due_date, event, max_users=1):
        task = self.model(task_name=task_name, description=description, completion_status=False, due_date=due_date, event=event, max_users=max_users)
        task.save(using=self._db)
        if users:
            task.users.set(users)
        return task

class Tasks(models.Model):
    task_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    users = models.ManyToManyField(Profile, related_name='tasks', blank=True)
    completion_status = models.BooleanField(default=False)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    event = models.ForeignKey(Timetable_events, on_delete=models.CASCADE, related_name='tasks')
    max_users = models.IntegerField(default=1)
    
    objects = TasksManager()
    def __str__(self):
        return self.task_name