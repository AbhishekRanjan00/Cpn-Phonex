import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";
import { FaUser, FaUserShield } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE;
const COLORS = ["#38b2ac", "#90cdf4"];

const AdminDashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [userStats, setUserStats] = useState({ admins: 0, users: 0 });
  const [orderStats, setOrderStats] = useState({ totalOrders: 0 });

  const fetchAllData = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [userRes, salesRes, orderRes] = await Promise.all([
      axios.get(`${API_BASE}/admin/users`, { headers }),
      axios.get(`${API_BASE}/admin/sales`, { headers }),
      axios.get(`${API_BASE}/admin/orders`, { headers }),
    ]);

    setUsers(userRes.data);
    setSalesData(salesRes.data.monthlySales || []);
    setTotalSales(salesRes.data.totalSales || 0);
    setOrderStats(orderRes.data);

    setUserStats(
      userRes.data.reduce(
        (acc, user) => {
          acc[user.role === "admin" ? "admins" : "users"]++;
          return acc;
        },
        { admins: 0, users: 0 }
      )
    );
  } catch (err) {
    toast.error("Error loading dashboard");
  }
};
  

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axios.put(
        `${API_BASE}/admin/toggle-role/${id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );
      toast.success(`Changed role to ${newRole}`);
      fetchAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change role");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchAllData();
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-4 md:p-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/double-bubble-outline.png')]"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-4xl font-extrabold text-teal-700 drop-shadow-sm text-center sm:text-left">
            Admin Dashboard
          </h1>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            <Link
              to="/"
              className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 shadow transition"
            >
              Home
            </Link>
            <Link
              to="/admin/orders"
              className="bg-teal-500 text-white px-4 py-2 rounded-xl hover:bg-teal-600 shadow transition"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/create-product"
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 shadow transition"
            >
              + Create Product
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 shadow transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 mb-6">
          <img
            src={`https://ui-avatars.com/api/?name=${auth?.user?.name}&background=38b2ac&color=fff`}
            alt="admin"
            className="w-16 h-16 rounded-full border-4 border-teal-400"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {auth?.user?.name || "Admin"}
            </h2>
            <p className="text-gray-500 text-sm">Role: {auth?.user?.role}</p>
          </div>
        </div>

        {/* Charts */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  {/* Total Sales Card */}
  <div
    onClick={() => navigate("/admin/sales")}
    className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer border border-teal-100"
  >
    <h3 className="font-semibold text-teal-700 mb-2">Total Sales</h3>
    <p className="text-3xl font-bold text-teal-500 mb-4">₹{totalSales}</p>
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={salesData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#319795" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* User Role Chart */}
  <div
    onClick={() => navigate("/admin/users")}
    className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer border border-indigo-100"
  >
    <h3 className="font-semibold text-indigo-700 mb-2">User Roles</h3>
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          data={[
            { name: "Admins", value: userStats.admins },
            { name: "Users", value: userStats.users },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={50}
          dataKey="value"
          label
        >
          {COLORS.map((color, idx) => (
            <Cell key={idx} fill={color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* Total Orders Card */}
  <div
    onClick={() => navigate("/admin/orders")}
    className="bg-white p-4 rounded-2xl shadow-md text-center hover:shadow-lg hover:scale-[1.02] transition cursor-pointer border border-pink-100"
  >
    <h3 className="font-semibold text-pink-700 mb-2">Total Orders</h3>
    <p className="text-4xl font-bold text-pink-500">
      {orderStats.totalOrders || 0}
    </p>
  </div>
</div>


        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>
          <table className="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Verified</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, i) => (
                <tr key={user._id} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2 capitalize">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                  <td className="border px-4 py-2">
                    {user.isVerified ? "✅" : "❌"}
                  </td>
                  <td className="border px-4 py-2">
                    {user._id !== auth?.user?._id && (
                      <button
                        onClick={() => toggleRole(user._id, user.role)}
                        className={`px-3 py-1 rounded-xl text-white text-sm font-medium flex items-center gap-1 justify-center transition ${
                          user.role === "admin"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <>
                            <FaUser /> Demote
                          </>
                        ) : (
                          <>
                            <FaUserShield /> Promote
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
