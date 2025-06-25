from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from celery import shared_task

@shared_task
def send_email_notification(subject, message, recipient_list):
    User = get_user_model()
    match recipient_list:
        case ["all"]:
            recipient_list = list(User.objects.values_list('email', flat=True))
        case ["admins"]:
            recipient_list = list(User.objects.filter(is_superuser=True).values_list('email', flat=True))
        case _:
            pass
        
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
    )