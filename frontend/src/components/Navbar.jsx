import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#222',
      color: '#fff'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
          🛒 MyShop
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff' }}>Home</Link>
        <Link to="/cart" style={{ color: '#fff' }}>Cart</Link>


        
        {user?.username === 'admin' && (
            <>
            <Link to="/admin" >Admin Dashboard</Link>
            <Link to="/admin/products">Manage Products</Link>
            <Link to="/admin/orders">All Orders</Link>
        </>
        )}

        {user ? (
          <>
            <Link to="/orders" style={{ color: '#fff' }}>My Orders</Link>
            <span>Hello, {user.username}</span>
            <button onClick={logout} style={{ background: '#f44', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
