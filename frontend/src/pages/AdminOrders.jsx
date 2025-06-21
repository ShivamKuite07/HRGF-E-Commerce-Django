import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/orders/admin/orders/')
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
            <p><strong>Order #{order.id}</strong></p>
            <p>User: {order.user}</p>
            <p>Total: ₹{order.total_amount}</p>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product_title} - ₹{item.price} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
