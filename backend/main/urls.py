from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register('timetable', TimetableViewset, basename='timetable')
router.register('login', LoginViewset, basename='login')
router.register('moderator_panel', ModeratorPanelViewset, basename='moderator_panel')
router.register('account', AccountViewset, basename='account')
router.register('tasks', TasksViewset, basename='tasks')
urlpatterns = router.urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)