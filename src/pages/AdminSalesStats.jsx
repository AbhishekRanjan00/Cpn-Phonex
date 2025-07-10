import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE;

const AdminSalesStats = () => {
  const { auth } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/stats/sales`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      setSalesData(res.data.monthlySales || []);
      setTotal(res.data.totalSales || 0);
    } catch (err) {
      toast.error("❌ Failed to fetch sales data");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-8 drop-shadow">
        📈 Monthly Sales Overview
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
        <p className="text-xl font-semibold text-gray-800 mb-4">
          Total Sales: <span className="text-teal-600">₹{total}</span>
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#38b2ac" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminSalesStats;
