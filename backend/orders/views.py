from rest_framework import generics, permissions
from cart.models import CartItem
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .utils import calling_razorpay
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=400)

        total = 0
        for item in cart_items:
            if item.quantity > item.product.stock:
                return Response({'error': f"Not enough stock for {item.product.title}"}, status=400)
            total += item.product.price * item.quantity

        if not calling_razorpay(user, total):
            return Response({'error': 'Payment failed'}, status=402)

        order = Order.objects.create(user=user, total_amount=total)

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )
            # reduce stock
            item.product.stock -= item.quantity
            item.product.save()

        cart_items.delete()

        return Response({'message': 'Order placed successfully', 'order_id': order.id})

class UserOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
