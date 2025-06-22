import { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosInstance';
import {
  Container,
  Card,
  Spinner,
  Alert,
  ListGroup,
  Badge
} from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  useEffect(() => {
    axios.get('/orders/my/')
      .then(res => setOrders(res.data))
      .catch(() => setMessage('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4">🧾 My Orders</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant={isDark ? 'light' : 'dark'} />
        </div>
      ) : message ? (
        <Alert variant="danger">{message}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="info">You have no orders yet.</Alert>
      ) : (
        orders.map(order => (
          <Card
            key={order.id}
            className="mb-4"
            bg={isDark ? 'dark' : 'light'}
            text={isDark ? 'light' : 'dark'}
          >
            <Card.Body>
              <Card.Title>Order #{order.id}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Date: {new Date(order.created_at).toLocaleString()}
              </Card.Subtitle>
              <Card.Text><strong>Total:</strong> ₹{order.total_amount}</Card.Text>

              <ListGroup variant="flush" className="mb-2">
                {order.items.map(item => (
                  <ListGroup.Item
                    key={item.id}
                    className={isDark ? 'bg-dark text-light' : ''}
                  >
                    {item.product_title} — ₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Badge
                bg={
                  order.status === 'pending' ? 'warning' :
                  order.status === 'shipped' ? 'primary' :
                  order.status === 'delivered' ? 'success' :
                  order.status === 'cancelled' ? 'danger' : 'secondary'
                }
              >
                {order.status.toUpperCase()}
              </Badge>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
