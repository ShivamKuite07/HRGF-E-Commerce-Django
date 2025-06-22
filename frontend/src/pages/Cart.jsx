import { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Table,
  Button,
  Form,
  Image,
  Alert
} from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get('/cart/')
      .then(res => setCartItems(res.data))
      .catch(err => console.error('Failed to fetch cart', err));
  };

  const handleQuantityChange = (id, quantity) => {
    axios.patch(`/cart/${id}/`, { quantity: parseInt(quantity) })
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

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#121212' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        paddingTop: '40px',
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <h2 className="mb-4">🛒 Your Cart</h2>
        {message && <Alert variant="danger">{message}</Alert>}

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <Table
              responsive
              striped
              bordered
              hover
              variant={isDark ? 'dark' : 'light'}
              className="align-middle"
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td className="d-flex align-items-center gap-3">
                      {item.poster_image ? (
                        <Image
                          src={item.poster_image}
                          alt={item.product_title}
                          rounded
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          className="bg-secondary d-flex align-items-center justify-content-center text-light"
                          style={{ width: '60px', height: '60px', borderRadius: '6px' }}
                        >
                          N/A
                        </div>
                      )}
                      <span>{item.product_title}</span>
                    </td>
                    <td>₹{item.price}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        ❌
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="mt-4">
              <h5>Total: ₹{total.toFixed(2)}</h5>
              <Button
                onClick={handleCheckout}
                variant={isDark ? 'outline-light' : 'primary'}
                className="mt-3"
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default Cart;
