import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Failed to fetch product:', err));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock");
      return;
    }

    addToCart({ ...product, qty: quantity });
    toast.success(`${product.name} added to cart ✅`);
  };

  const handleQuantityChange = (e) => {
    let val = Number(e.target.value);
    if (val > product.stock) {
      val = product.stock;
      toast.error("Only limited stock available");
    }
    setQuantity(val);
  };

  if (!product)
    return <div className="p-4 text-center text-teal-600">Loading...</div>;

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 bg-white shadow-md rounded-xl">

      {/* 🔙 Back Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-teal-50 transition"
      >
        <FaArrowLeft className="text-teal-600 text-xl" />
      </Link>

      {/* 🖼️ Product Image */}
      <div className="rounded-xl overflow-hidden mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 sm:h-80 object-cover"
        />
      </div>

      {/* 📦 Details */}
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">{product.name}</h2>
      <p className="text-gray-700 mb-4 text-sm sm:text-base">{product.description}</p>
      <p className="text-lg font-semibold text-teal-700 mb-2">₹{product.price}</p>

      {/* 📊 Stock */}
      <p className="mb-4 text-sm text-gray-600">
        Stock:&nbsp;
        {product.stock > 0 ? (
          <span className="text-green-600 font-semibold">{product.stock} available</span>
        ) : (
          <span className="text-red-600 font-semibold">Out of Stock</span>
        )}
      </p>

      {/* 🔢 Quantity Input */}
      {product.stock > 0 && (
        <div className="mb-4 flex items-center gap-3">
          <label className="font-semibold text-sm sm:text-base">Quantity:</label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 p-2 border border-gray-300 rounded text-sm sm:text-base focus:outline-none"
          />
        </div>
      )}

      {/* 🛒 Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`px-5 py-2 rounded-md transition text-sm sm:text-base ${
          product.stock === 0
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductDetail;
