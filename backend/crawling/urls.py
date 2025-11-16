from django.urls import path
from .views.test_views import test
from .views.stock_price_view import get_stock_price

urlpatterns = [
    path('toss/<str:subject_id>/', test, name='toss_comments_crawler'),
    path('stock-price/<str:stock_code>/', get_stock_price, name='stock_price'),
]