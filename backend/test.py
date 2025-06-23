from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from products.models import Product
from cart.models import CartItem
from orders.models import Order
from rest_framework import status
import time

class FullEcommerceFlowTest(APITestCase):
                def setUp(self):
                    # Register admin user
                    self.admin = User.objects.create_user(username='admin', password='admin123', is_superuser=True, is_staff=True)

                    time.sleep(0.5)
                    print("\n[Setup] Admin user created successfully")

                    # Register customer
                    self.customer = User.objects.create_user(username='john', password='john123')

                    time.sleep(0.5)
                    print("\n[Setup] Customer user created successfully")

                def authenticate(self, username, password):
                    response = self.client.post('/api/token/', {
                        'username': username,
                        'password': password
                    })
                    self.assertEqual(response.status_code, 200)

                    time.sleep(0.5)
                    print(f"\n[Authentication] User '{username}' authenticated successfully")

                    return response.data['access']

                def test_full_flow(self):
                    # Admin login and create products
                    admin_token = self.authenticate('admin', 'admin123')
                    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')

                    response1 = self.client.post('/api/products/', {
                        'title': 'iPhone 15',
                        'description': 'Latest Apple iPhone',
                        'price': 80000,
                        'stock': 10
                    })
                    self.assertEqual(response1.status_code, 201)
                    product1_id = response1.data['id']

                    time.sleep(0.5)
                    print("\n[Product Creation] Product 1 created:", response1.data)

                    response2 = self.client.post('/api/products/', {
                        'title': 'Samsung TV',
                        'description': 'Smart LED 4K TV',
                        'price': 50000,
                        'stock': 5
                    })
                    self.assertEqual(response2.status_code, 201)
                    product2_id = response2.data['id']

                    time.sleep(0.5)
                    print("\n[Product Creation] Product 2 created:", response2.data)

                    # User login and add product to cart
                    user_token = self.authenticate('john', 'john123')
                    self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')

                    time.sleep(0.5)
                    print("\n[Authentication] User authenticated for cart operations")

                    cart_add = self.client.post('/api/cart/', {
                        'product': product1_id,
                        'quantity': 2
                    })
                    self.assertEqual(cart_add.status_code, 201)

                    time.sleep(0.5)
                    print("\n[Cart] Product added to cart:", cart_add.data)

                    # Checkout
                    checkout = self.client.post('/api/orders/place/')
                    self.assertEqual(checkout.status_code, 200)
                    self.assertTrue('order_id' in checkout.data)

                    time.sleep(0.5)
                    print("\n[Checkout] Checkout successful:", checkout.data)

                    # Confirm order created
                    order_exists = Order.objects.filter(user=self.customer).exists()
                    self.assertTrue(order_exists)

                    time.sleep(0.5)
                    print("\n[Order Confirmation] Order confirmed for user:", self.customer.username)

                    # Confirm cart is cleared
                    cart_empty = CartItem.objects.filter(user=self.customer).exists()
                    self.assertFalse(cart_empty)

                    time.sleep(0.5)
                    print("\n[Cart Status] Cart is empty after checkout")

                    # Confirm stock reduced
                    product = Product.objects.get(id=product1_id)
                    self.assertEqual(product.stock, 8)  # 10 - 2

                    time.sleep(0.5)
                    print("\n[Stock Update] Product stock reduced after checkout. Current stock:", product.stock)
