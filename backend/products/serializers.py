from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    poster_image = serializers.ImageField(required=False)

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'stock', 'created_by', 'poster_image']
        read_only_fields = ['created_by']


