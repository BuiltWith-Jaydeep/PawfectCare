import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing token/user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', parsedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      console.log('No token or user found in localStorage on mount');
    }
  }, []);

  // Login function
  const login = (token, userData) => {
    console.log('Login called with:', { token, userData });

    if (!token || !userData) {
      console.error('Login failed: token or userData is missing', { token, userData });
      return false;
    }

    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      console.log('Login successful with full user data:', userData);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user:', user);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};