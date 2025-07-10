import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CrazyLoader from '../components/CrazyLoader';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/users/login`, {
        email,
        password,
      });

      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        login({ user, token });

        toast.success(`Welcome back, ${user.name || 'User'}! 🎉`);

        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard/user');
        }

        window.scrollTo(0, 0);
      } else {
        setError('Login failed. Please try again.');
        toast.error('Login failed. Please try again.');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 md:px-10">
      {loading ? (
        <CrazyLoader />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-600 mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition duration-300 text-sm sm:text-base"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-teal-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Login;
