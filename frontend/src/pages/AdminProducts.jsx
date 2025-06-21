import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', stock: '' });

  const fetchProducts = () => {
    axios.get('/products/')
      .then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = (id) => {
    axios.delete(`/products/${id}/`)
      .then(fetchProducts);
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setFormData({ title: product.title, description: product.description, price: product.price, stock: product.stock });
  };

  const handleUpdate = () => {
    axios.put(`/products/${editing}/`, formData)
      .then(() => {
        setEditing(null);
        fetchProducts();
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: Manage Products</h2>

      {products.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          {editing === product.id ? (
            <>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditing(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>{product.title}</strong> (₹{product.price}) - Stock: {product.stock}</p>
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
