from django.urls import path
from .views import PlaceOrderView, UserOrderListView, admin_order_list, update_order_status

urlpatterns = [
    path('place/', PlaceOrderView.as_view(), name='place-order'),
    path('my/', UserOrderListView.as_view(), name='my-orders'),
    path('admin/orders/', admin_order_list),
    path('admin/orders/<int:pk>/status/', update_order_status),

]
