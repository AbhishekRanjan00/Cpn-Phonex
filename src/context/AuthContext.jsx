import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    let user = null;
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Invalid JSON in localStorage 'user':", error);
      localStorage.removeItem('user'); // Clean up bad data
    }

    if (token && user) {
      setAuth({ token, user });
    }

    setLoading(false);
  }, []);

  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

 const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuth({ token: null, user: null });
};


  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
