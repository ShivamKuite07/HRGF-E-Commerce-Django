import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios.get('/orders/admin/orders/')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to load orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '8px'
            }}
          >
            <p><strong>Order #{order.id}</strong></p>
            <p>User: {order.user}</p>
            <p>Total: ₹{order.total_amount}</p>
            <p>Date: {new Date(order.created_at).toLocaleString()}</p>

            <ul style={{ paddingLeft: '20px' }}>
              {order.items.map(item => (
                <li key={item.id}>
                  {item.product_title} — ₹{item.price} × {item.quantity}
                </li>
              ))}
            </ul>

            <label>Status:</label>{' '}
            <select
              value={order.status}
              onChange={e => {
                axios
                  .patch(`/orders/admin/orders/${order.id}/status/`, {
                    status: e.target.value
                  })
                  .then(fetchOrders)
                  .catch(err => console.error('Failed to update status:', err));
              }}
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
