from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'), # Przekierowanie na stronę główną w przypadku wejścia na stronę
]