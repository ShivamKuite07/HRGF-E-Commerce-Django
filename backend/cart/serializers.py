from rest_framework import serializers
from .models import CartItem
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    price = serializers.ReadOnlyField(source='product.price')  # ✅ Add this line

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'price', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at', 'product_title']
