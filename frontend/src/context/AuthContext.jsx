import { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(localStorage.getItem('access'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (accessToken) {
      axios.get('/token/verify/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).catch(() => logout());
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('/token/', { username, password });
      const { access, refresh } = res.data;

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser({ username });  // Simplified for now
      navigate('/');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('/register/', { username, email, password });
      await login(username, password);
    } catch (err) {
      alert('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
