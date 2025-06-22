// src/pages/AdminSalesStats.jsx
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

const AdminSalesStats = () => {
  const { auth } = useAuth();
  const [salesData, setSalesData] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/stats/sales", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      setSalesData(res.data.monthlySales || []);
      setTotal(res.data.totalSales || 0);
    } catch (err) {
      toast.error("Failed to fetch sales data");
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
        📈 Monthly Sales Overview
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <p className="text-xl font-semibold text-gray-700 mb-2">
          Total Sales: ₹{total}
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#38b2ac" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminSalesStats;
