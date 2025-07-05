import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
const API_BASE = import.meta.env.VITE_API_BASE;



const CreateProduct = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in product) {
      formData.append(key, product[key]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/api/products`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
});


      alert('✅ Product created successfully!');
      setProduct({ name: '', price: '', description: '', stock: '', image: null });
    } catch (err) {
      console.error('Failed to create product:', err);
      alert(err.response?.data?.message || 'Failed to create product ❌');
    }
  };

  const handleBack = () => {
    navigate('/admin/dashboard'); // You can change this to '/' if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-10 flex items-center justify-center relative">
      
     <button
  onClick={handleBack}
  className="absolute top-4 left-4 p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
>
  <FaArrowLeft className="text-xl text-gray-700" />
</button>


      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-6 text-center">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Ex: Apple"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Ex: 99"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Write about the product..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={4}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Ex: 100"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Product Image</label>
            <label className="w-full flex flex-col items-center justify-center px-4 py-8 sm:py-10 border-2 border-dashed border-teal-400 rounded-lg cursor-pointer hover:bg-teal-50 transition">
              <FiUploadCloud className="text-3xl text-teal-500 mb-1" />
              <span className="text-gray-600 text-sm sm:text-base">Click to upload image</span>
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 transition duration-200"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
