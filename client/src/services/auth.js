import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    await verifyToken(token);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const googleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}