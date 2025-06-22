import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/orders/my/')
      .then(res => setOrders(res.data))
      .catch(err => setMessage('Failed to load orders.'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Orders</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
          }}>
            <p><strong>Order ID:</strong> #{order.id}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>

            <ul style={{ paddingLeft: '20px' }}>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product_title} - ₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
