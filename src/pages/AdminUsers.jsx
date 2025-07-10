// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaUserShield, FaUser } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE;

const AdminUsers = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axios.put(
        `${API_BASE}/admin/toggle-role/${id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success(`Changed role to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to change role");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">👥 User Management</h2>

      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
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
            {users?.map((user, idx) => (
              <tr key={user._id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{idx + 1}</td>
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
                      className={`px-3 py-1 rounded-lg text-white font-medium flex items-center gap-2 justify-center transition text-sm ${
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
  );
};

export default AdminUsers;
