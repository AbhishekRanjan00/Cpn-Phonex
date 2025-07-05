import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  MdLocalShipping,
  MdDoneAll,
  MdLocalOffer,
  MdOutlinePendingActions,
} from "react-icons/md";
import CrazyBackButton from "../components/CrazyBackBtn";

const API_BASE = import.meta.env.VITE_API_BASE;



const AdminOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders/all`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("❌ Failed to load orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_BASE}/orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      toast.success(`✅ Status set to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("❌ Update failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      case "Delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 p-4 sm:p-6">
      <CrazyBackButton />
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-8 drop-shadow">
        🧾 Admin Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full text-sm sm:text-base">
            <thead className="bg-teal-600 text-white text-xs sm:text-sm uppercase">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order, idx) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 capitalize">{order?.user?.name || "User"}</td>
                  <td className="px-6 py-4 text-teal-700 font-semibold">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex flex-wrap gap-2">
                    
                    <button
                      onClick={() => updateStatus(order._id, "Shipped")}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full shadow transition"
                    >
                      <MdLocalShipping /> Shipped
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, "Out for Delivery")}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded-full shadow transition"
                    >
                      <MdLocalOffer /> Out for Delivery
                    </button>
                    <button
                      onClick={() => updateStatus(order._id, "Delivered")}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full shadow transition"
                    >
                      <MdDoneAll /> Delivered
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
