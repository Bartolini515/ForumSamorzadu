from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('timetable', TimetableViewset, basename='timetable')
router.register('login', LoginViewset, basename='login')
router.register('moderator_panel', ModeratorPanelViewset, basename='moderator_panel')
urlpatterns = router.urls