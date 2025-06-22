import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CrazyBackButton from '../components/CrazyBackBtn';
import axios from 'axios';

const UserDashboard = () => {
  const { auth, logout } = useAuth();
  const user = auth?.user;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        setOrders(data);
      } catch (error) {
        console.error('Failed to load orders', error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) fetchOrders();
  }, [auth?.token]);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-teal-100 via-indigo-100 to-pink-100 px-4 py-10 sm:px-6">
      <div className="absolute top-6 left-6 z-50">
        <CrazyBackButton />
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=319795&color=fff&size=96`}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-teal-500 shadow-lg"
          />
          <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-teal-500 via-indigo-600 to-pink-500 bg-clip-text text-transparent text-center sm:text-left">
            Welcome back, {user?.name || 'User'}!
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Profile Info</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <button
              onClick={logout}
              className="mt-6 px-4 py-2 bg-blue-400 hover:bg-pink-600 text-white rounded-md shadow transition"
            >
              Logout
            </button>
          </div>

          {/* Orders Table */}
          <div className="md:col-span-2 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-lg p-6 shadow-lg overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6 text-teal-700">Your Orders</h2>

            {loading ? (
              <p className="text-gray-600">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">You haven't placed any orders yet.</p>
            ) : (
              <table className="w-full min-w-[500px] table-auto border-collapse text-left text-gray-700 text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-teal-300">
                    <th className="py-2 px-4">Order ID</th>
                    <th className="py-2 px-4">Items</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-teal-100">
                      <td className="py-2 px-4">{order._id.slice(-6)}</td>
                      <td className="py-2 px-4">
                        {order.products.map((p) => p.product.name).join(', ')}
                      </td>
                      <td className={`py-2 px-4 font-semibold ${
                        order.status === 'Delivered'
                          ? 'text-green-600'
                          : order.status === 'Shipped'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                      }`}>
                        {order.status}
                      </td>
                      <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
