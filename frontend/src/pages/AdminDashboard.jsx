import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';

const AdminDashboard = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    else if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchProducts = () => {
    axios.get('/products/').then(res => setProducts(res.data));
  };

  const fetchOrders = () => {
    axios.get('/orders/admin/orders/').then(res => setOrders(res.data));
  };

  const handleSave = () => {
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    if (editingId) {
      axios.put(`/products/${editingId}/`, data).then(() => {
        resetForm();
        fetchProducts();
      });
    } else {
      axios.post('/products/', data).then(() => {
        resetForm();
        fetchProducts();
      });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: '', stock: '' });
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      description: p.description,
      price: p.price.toString(),
      stock: p.stock.toString(),
    });
  };

  const handleDelete = (id) => {
    axios.delete(`/products/${id}/`).then(fetchProducts);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setTab('products')} style={{ marginRight: '10px' }}>
          Products
        </button>
        <button onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <div>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <input
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: e.target.value })}
            />
            <button onClick={handleSave}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>

          <h3 style={{ marginTop: '30px' }}>All Products</h3>
          {products.map(p => (
            <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>{p.title}</strong> (₹{p.price}) - Stock: {p.stock}</p>
              <button onClick={() => handleEdit(p)} style={{ marginRight: '5px' }}>Edit</button>
              <button onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h3>All Orders</h3>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>Order #{order.id}</strong> by {order.user}</p>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
