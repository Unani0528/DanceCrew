from django.urls import path
from .views.test_views import test

urlpatterns = [
    path('toss/<str:subject_id>/', test, name='toss_comments_crawler'),
]