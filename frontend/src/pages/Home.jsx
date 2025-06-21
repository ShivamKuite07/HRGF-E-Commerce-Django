import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Products</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <h3>{product.title}</h3>
            <p>{product.description.substring(0, 50)}...</p>
            <p><strong>₹{product.price}</strong></p>
            <p>Stock: {product.stock}</p>
            <Link to={`/product/${product.id}`}>View Product</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
