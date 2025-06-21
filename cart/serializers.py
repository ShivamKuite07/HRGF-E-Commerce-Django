from rest_framework import serializers
from .models import CartItem
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at', 'product_title']
