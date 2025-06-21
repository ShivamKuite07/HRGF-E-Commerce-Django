import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/cart/')
      .then(res => setCartItems(res.data))
      .catch(err => setMessage('Failed to fetch cart'));
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

  const handlePlaceOrder = () => {
    setPlacing(true);
    axios.post('/orders/place/')
      .then(res => {
        setMessage('✅ Order placed successfully!');
        setTimeout(() => {
          navigate('/'); // or `/orders` if you make an order history page
        }, 2000);
      })
      .catch(err => {
        setMessage('❌ Order failed. ' + (err.response?.data?.error || ''));
        setPlacing(false);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Checkout</h2>
      {message && <p style={{ margin: '10px 0', color: message.includes('✅') ? 'green' : 'red' }}>{message}</p>}

      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                {item.product_title} - ₹{item.price} × {item.quantity} = ₹{(item.quantity * item.price).toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
          <button onClick={handlePlaceOrder} disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
