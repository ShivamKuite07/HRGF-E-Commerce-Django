import { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  ListGroup,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    axios.get('/cart/')
      .then(res => setCartItems(res.data))
      .catch(() => setMessage('❌ Failed to fetch cart'));
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price),
    0
  );

  const handlePlaceOrder = () => {
    setPlacing(true);
    axios.post('/orders/place/')
      .then(() => {
        setMessage('✅ Order placed successfully!');
        setTimeout(() => navigate('/orders'), 2000);
      })
      .catch(err => {
        setMessage('❌ Order failed. ' + (err.response?.data?.error || ''));
        setPlacing(false);
      });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">🛒 Checkout</h2>

      {message && (
        <Alert variant={message.includes('✅') ? 'success' : 'danger'}>
          {message}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Alert variant="info">No items in your cart.</Alert>
      ) : (
        <Card
          bg={isDark ? 'dark' : 'light'}
          text={isDark ? 'light' : 'dark'}
          className="shadow-sm"
        >
          <Card.Body>
            <Card.Title>Order Summary</Card.Title>
            <ListGroup variant="flush" className="mb-3">
              {cartItems.map(item => (
                <ListGroup.Item
                  key={item.id}
                  className={isDark ? 'bg-dark text-light' : ''}
                >
                  {item.product_title} — ₹{item.price} × {item.quantity} = ₹
                  {(item.quantity * item.price).toFixed(2)}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <h5>Total: ₹{total.toFixed(2)}</h5>

            <div className="mt-3">
              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                variant="primary"
              >
                {placing ? (
                  <>
                    <Spinner
                      size="sm"
                      animation="border"
                      className="me-2"
                    />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Checkout;
