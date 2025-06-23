import { useEffect, useState, useContext } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import AdminOrders from './AdminOrders';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fetchProducts = async (query = '') => {
    try {
      const res = await axios.get(`/products/?search=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(value);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#121212' : '#f8f9fa',
        color: isDark ? '#f8f9fa' : '#212529',
        transition: 'all 0.3s ease',
        paddingTop: '40px'
      }}
    >
      <Container>
        <h2 className="text-center mb-4">🛍️ Welcome to the Store</h2>


        <Form className="mb-5">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={isDark ? 'bg-dark text-light' : ''}
          />
        </Form>

        <Row className="g-4">
          {products.map(product => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="h-100 shadow-sm"
                bg={isDark ? 'dark' : 'light'}
                text={isDark ? 'light' : 'dark'}
              >
                {product.poster_image ? (
                  <Card.Img
                    variant="top"
                    src={product.poster_image}
                    style={{ height: '180px', objectFit: 'cover' }}
                    alt={product.title}
                  />
                ) : (
                  <div
                    style={{
                      height: '180px',
                      backgroundColor: isDark ? '#343a40' : '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: '#888'
                    }}
                  >
                    No Image
                  </div>
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem', color: isDark ? '#D3D3D3' : '#6c757d' }}>
                    {product.description.length > 60
                      ? product.description.slice(0, 60) + '...'
                      : product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <p className="mb-2 fw-semibold">₹{product.price}</p>
                    <Link to={`/product/${product.id}`}>
                      <Button variant={isDark ? 'outline-light' : 'primary'} size="sm">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
