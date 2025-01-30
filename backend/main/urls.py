from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('timetable', TimetableViewset, basename='timetable')
urlpatterns = router.urls