from django.urls import path
from .views import PlaceOrderView, UserOrderListView

urlpatterns = [
    path('place/', PlaceOrderView.as_view(), name='place-order'),
    path('my/', UserOrderListView.as_view(), name='my-orders'),
]
