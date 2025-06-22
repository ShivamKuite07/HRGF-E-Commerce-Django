from rest_framework import serializers
from .models import CartItem
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    price = serializers.ReadOnlyField(source='product.price')  
    poster_image = serializers.ImageField(source='product.poster_image', read_only=True)


    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'price', 'quantity', 'added_at', 'poster_image']
        read_only_fields = ['id', 'added_at', 'product_title']
        
    def get_product_image(self, obj):
        return obj.product.poster_image.url if obj.product.poster_image else None
