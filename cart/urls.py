from django.urls import path
from .views import CartListCreateView, CartItemUpdateDeleteView

urlpatterns = [
    path('', CartListCreateView.as_view(), name='cart-list-create'),
    path('<int:pk>/', CartItemUpdateDeleteView.as_view(), name='cart-item-update-delete'),
]
