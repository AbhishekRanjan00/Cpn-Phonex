import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetails';
import Cart from './pages/Cart';
import CreateProduct from './components/CreateProduct';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';
import MyOrders from './pages/MyOrders';
import CheckoutForm from './pages/CheckoutForm';
import Payment from './pages/Payment';
import { Toaster } from 'react-hot-toast';
import CrazyLoader from './components/CrazyLoader';
import AdminOrders from './pages/AdminOrders';
import About from './pages/About';
import Contact from './pages/Contact';
import WishlistPage from './pages/WishlistPage'; // ✅ Corrected import
import AdminSalesStats from './pages/AdminSalesStats';
import AdminUsers from './pages/AdminUsers';
import OrderSuccess from './pages/OrderSuccess';

const App = () => {
  const { loading } = useAuth();

  if (loading) return <CrazyLoader />;

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
         <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/create-product"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdminRoute={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/orders" element={
  <ProtectedRoute isAdminRoute={true}>
    <AdminOrders />
  </ProtectedRoute>
} />
    
 <Route path="/admin/sales" element={<AdminSalesStats />} />
<Route path="/admin/users" element={<AdminUsers />} />

  
  <Route path="/" element={<Home />} />
  <Route path="/wishlist" element={<WishlistPage />} />  // ✅ this must be defined
  


<Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/checkout-form" element={<CheckoutForm />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
};

export default App;
