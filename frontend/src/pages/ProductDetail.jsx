import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    axios.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(() => setMessage('Failed to load product'));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return setMessage('Please login to add items to cart');

    axios.post('/cart/', {
      product: product.id,
      quantity,
    }).then(() => {
      setMessage('Added to cart ✅');
    }).catch(err => {
      if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Something went wrong');
      }
    });
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div
      style={{
        background: isDark ? '#121212' : '#f8f9fa',
        color: isDark ? '#fff' : '#000',
        minHeight: '100vh',
        paddingTop: '40px',
        transition: 'all 0.3s ease'
      }}
    >
      <Container>
        <Card
          className="p-4"
          style={{
            background: isDark ? '#1e1e1e' : '#fff',
            color: isDark ? '#fff' : '#000',
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Row>
            <Col md={4} className="text-center mb-4 mb-md-0">
              {product.poster_image ? (
                <img
                  src={product.poster_image}
                  alt={product.title}
                  className="img-fluid rounded"
                  style={{ maxHeight: '300px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={handleImageClick}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    height: '300px',
                    backgroundColor: isDark ? '#333' : '#e9ecef',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ color: isDark ? '#aaa' : '#6c757d' }}>No Image</span>
                </div>
              )}
            </Col>

            <Col md={8}>
              <h2>{product.title}</h2>

              <p style={{ color: isDark ? '#aaa' : '#6c757d' }}>{product.description}</p>
              <h4 className="mt-3">₹{product.price}</h4>
              <p className="mb-3">Stock: {product.stock}</p>

              <Form className="d-flex align-items-center gap-3" onSubmit={e => e.preventDefault()}>
                <Form.Group controlId="quantity" className="mb-0">
                  <Form.Label visuallyHidden>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    style={{ width: '100px' }}
                  />
                </Form.Group>

                <Button
                  onClick={handleAddToCart}
                  variant={isDark ? 'outline-light' : 'primary'}
                >
                  Add to Cart
                </Button>
              </Form>

              {message && (
                <p className="mt-3" style={{ color: isDark ? '#0dcaf0' : '#28a745' }}>
                  {message}
                </p>
              )}
            </Col>
          </Row>
        </Card>
      </Container>

      <Modal show={showImageModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{product.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={product.poster_image}
            alt={product.title}
            className="img-fluid"
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;