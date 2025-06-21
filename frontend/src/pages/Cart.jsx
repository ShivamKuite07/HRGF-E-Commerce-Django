import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get('/cart/')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('Failed to fetch cart', err));
  };

  const handleQuantityChange = (id, quantity) => {
    axios.patch(`/cart/${id}/`, { quantity })
      .then(fetchCart)
      .catch(() => setMessage('Failed to update quantity'));
  };

  const handleRemove = (id) => {
    axios.delete(`/cart/${id}/`)
      .then(fetchCart)
      .catch(() => setMessage('Failed to remove item'));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const total = cartItems.reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td>{item.product_title}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemove(item.id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px' }}>
            <strong>Total: ₹{total.toFixed(2)}</strong><br />
            <button onClick={handleCheckout} style={{ marginTop: '10px' }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
