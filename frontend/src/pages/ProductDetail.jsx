import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(() => setMessage('Failed to load product'));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return setMessage('Please login to add items to cart');

    axios.post('/cart/', {
      product: product.id,
      quantity: quantity,
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

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p><strong>Price:</strong> ₹{product.price}</p>
      <p><strong>Stock:</strong> {product.stock}</p>

      <div style={{ marginTop: '20px' }}>
        <label>Quantity: </label>
        <input
          type="number"
          value={quantity}
          min={1}
          max={product.stock}
          onChange={e => setQuantity(Number(e.target.value))}
          style={{ width: '60px', marginRight: '10px' }}
        />
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>

      {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ProductDetail;
