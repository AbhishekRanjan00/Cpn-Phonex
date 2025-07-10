import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CrazyBackButton from '../components/CrazyBackBtn';

const API_BASE = import.meta.env.VITE_API_BASE;
const steps = ['Placed', 'Shipped', 'Out for Delivery', 'Delivered'];

const MyOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = auth?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const handleCancel = async (orderId) => {
    try {
      await axios.delete(`${API_BASE}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      alert('Order canceled');
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const renderStatusStepper = (status) => {
    const currentIndex = steps.indexOf(status);
    return (
      <div className="flex items-center space-x-4 mt-3 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 min-w-[80px]">
            <div className={`w-full h-2 rounded-full ${index <= currentIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <p className={`text-xs text-center mt-1 ${index === currentIndex ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>{step}</p>
          </div>
        ))}
      </div>
    );
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE}/orders/invoice/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  if (loading) return <div className="text-center py-10 text-teal-600">Loading orders...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-6">
      <CrazyBackButton />
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-700 mb-8">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 shadow rounded-lg p-4 sm:p-6 bg-white">
              <div className="mb-4 text-sm sm:text-base space-y-1">
                <p className="text-gray-800 font-semibold">Order ID: <span className="text-gray-600">{order._id}</span></p>
                <p className="text-gray-800 font-semibold">Date: <span className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
                <p className="text-gray-800 font-semibold">Total: <span className="text-teal-700 font-bold">₹{order.totalAmount.toFixed(2)}</span></p>
                <p className="text-gray-800 font-semibold">Status: <span className="text-teal-600">{order.status}</span></p>
                {renderStatusStepper(order.status)}
              </div>

              <div className="border-t pt-4 space-y-4">
                {order.products.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 last:border-none"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <div>
                        <h4 className="text-base font-semibold text-gray-800">{item.product.name}</h4>
                        <p className="text-gray-600 text-sm">Price: ₹{item.product.price}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-gray-700">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end mt-4 gap-3">
                {(order.status === 'Pending' || order.status === 'Placed') && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-md text-sm"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
