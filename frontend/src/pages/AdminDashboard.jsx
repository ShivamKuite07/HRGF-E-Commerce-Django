import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Tabs,
  Tab,
  Table,
  Image
} from 'react-bootstrap';
import axios from '../api/axiosInstance';
import { ThemeContext } from '../context/ThemeContext';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('add');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    poster_image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (activeTab === 'manage') fetchProducts();
    else if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchProducts = () => {
    axios.get('/products/').then(res => setProducts(res.data));
  };

  const fetchOrders = () => {
    axios.get('/orders/admin/orders/').then(res => setOrders(res.data));
  };

  const handleImageChange = e => {
    setFormData(prev => ({ ...prev, poster_image: e.target.files[0] }));
  };

  const handleSave = () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.poster_image) {
      data.append('poster_image', formData.poster_image);
    }

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const url = editingId ? `/products/${editingId}/` : '/products/';
    const method = editingId ? axios.put : axios.post;

    method(url, data, config).then(() => {
      fetchProducts();
      resetForm();
      setActiveTab('manage');
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      poster_image: null,
    });
  };

  const handleEdit = p => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      stock: p.stock.toString(),
      poster_image: null,
    });
    setActiveTab('add');
  };

  const handleDelete = id => {
    axios.delete(`/products/${id}/`).then(fetchProducts);
  };

  const cardStyle = {
    backgroundColor: isDark ? '#2c2c2c' : '#fff',
    color: isDark ? '#e0e0e0' : '#333',
    border: '1px solid',
    borderColor: isDark ? '#444' : '#ddd'
  };

  const inputStyle = {
    backgroundColor: isDark ? '#3a3a3a' : '#fff',
    color: isDark ? '#e0e0e0' : '#333',
    borderColor: isDark ? '#555' : '#ccc'
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4" style={{ color: isDark ? '#e0e0e0' : '#333' }}>
        Admin Dashboard
      </h2>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        {/* ADD PRODUCT */}
        <Tab eventKey="add" title={editingId ? "✏️ Edit Product" : "➕ Add Product"}>
          <Card style={cardStyle}>
            <Card.Body>
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Control
                      placeholder="Title"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#fff', color: '#333' }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#fff', color: '#333' }}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Control
                      as="textarea"
                      placeholder="Description"
                      rows={2}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#fff', color: '#333' }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="number"
                      placeholder="Stock"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      style={{ ...inputStyle, backgroundColor: '#fff', color: '#333' }}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      style={inputStyle}
                    />
                  </Col>
                  <Col md={12} className="text-end">
                    <Button variant={isDark ? "outline-light" : "primary"} onClick={handleSave}>
                      {editingId ? 'Update Product' : 'Add Product'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        {/* MANAGE PRODUCTS */}
        <Tab eventKey="manage" title="📋 Manage Products">
          <Row>
            {products.map(p => (
              <Col md={4} key={p.id} className="mb-4">
                <Card style={cardStyle}>
                  {p.poster_image && (
                    <Image
                      src={p.poster_image}
                      alt={p.title}
                      fluid
                      style={{ height: '180px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{p.title}</Card.Title>
                    <Card.Text>
                      ₹{p.price} | Stock: {p.stock}
                    </Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button size="sm" variant={isDark ? "outline-light" : "primary"} onClick={() => handleEdit(p)}>Edit</Button>
                      <Button size="sm" variant={isDark ? "outline-danger" : "danger"} onClick={() => handleDelete(p.id)}>Delete</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* ORDERS */}
        <Tab eventKey="orders" title="📦 Orders">
          <h4 className="mb-3" style={{ color: isDark ? '#e0e0e0' : '#333' }}>All Orders</h4>
          {orders.map(order => (
            <Card key={order.id} className="mb-3" style={cardStyle}>
              <Card.Body>
                <Card.Title>Order #{order.id} by {order.user}</Card.Title>
                <Card.Text>Total: ₹{order.total_amount}</Card.Text>
                <Card.Text>Date: {new Date(order.created_at).toLocaleString()}</Card.Text>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.product_title} — ₹{item.price} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <Form.Select
                  value={order.status}
                  onChange={e =>
                    axios.patch(`/orders/admin/orders/${order.id}/status/`, {
                      status: e.target.value,
                    }).then(fetchOrders)
                  }
                  style={inputStyle}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Card.Body>
            </Card>
          ))}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;