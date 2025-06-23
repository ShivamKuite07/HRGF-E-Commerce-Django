from rest_framework import generics, permissions
from cart.models import CartItem
from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .utils import calling_razorpay
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser

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



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Order

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    data = []
    for order in orders:
        items = []
        for item in order.items.all():
            items.append({
                'product_title': item.product.title if item.product else 'Deleted Product',
                'quantity': item.quantity,
                'price': item.price,
            })
        data.append({
            'id': order.id,
            'user': order.user.username,
            'total_amount': order.total_amount,
            'created_at': order.created_at,
            'items': items
        })
    return Response(data)





@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

    new_status = request.data.get('status')
    if new_status not in dict(Order.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=400)

    order.status = new_status
    order.save()
    return Response({'message': f'Status updated to {new_status}'})

