from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Timetable_events, Tasks
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model


@shared_task
def send_email_notification(subject, message, recipient_list):
    User = get_user_model()
    match recipient_list:
        case ["all"]:
            recipient_list = list(User.objects.values_list('email', flat=True))
        case ["admins"]:
            recipient_list = list(User.objects.filter(is_superuser=True).values_list('email', flat=True))
        case _:
            recipient_list = [email for email in recipient_list if User.objects.filter(email=email).exists()]
        
    full_message = f"{message}{settings.EMAIL_FOOTER}"
        
    send_mail(
        subject=subject,
        message=full_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )

@shared_task
def send_event_reminders():
    # Calculate the date 3 days from now
    reminder_date = timezone.now().date() + timedelta(days=3)
    
    # Filter events that start on the reminder_date
    upcoming_events = Timetable_events.objects.filter(start_date__date=reminder_date)
    
    for event in upcoming_events:
        subject = f"Przypomnienie: wydarzenie '{event.event_name}' za 3 dni!"
        message = (
            f"Wydarzenie '{event.event_name}', utworzone przez {event.created_by.first_name} {event.created_by.last_name}, "
            f"odbędzie się {event.start_date.strftime('%Y-%m-%d')}.\n\n"
            f"Szczegóły wydarzenia: {event.description or 'Brak opisu'}"
        )
        
        # Send notification to all users
        send_email_notification.delay(
            subject=subject,
            message=message,
            recipient_list=["all"]
        )

@shared_task
def send_task_reminders():
    # Calculate the date 3 days from now
    reminder_date = timezone.now().date() + timedelta(days=3)
    
    # Filter tasks that have a deadline on the reminder_date
    upcoming_tasks = Tasks.objects.filter(due_date__date=reminder_date, completed=False)
    
    for task in upcoming_tasks:
        if task.user and task.user.email:
            subject = f"Przypomnienie: zadanie '{task.task_name}' do wykonania za 3 dni!"
            message = (
                f"Zadanie '{task.task_name}', przypisane do Ciebie, "
                f"ma termin wykonania na {task.due_date.strftime('%Y-%m-%d')}.\n\n"
                f"Szczegóły zadania: {task.description or 'Brak opisu'}"
            )
            
            send_email_notification.delay(
                subject=subject,
                message=message,
                recipient_list=[task.user.email]
            )