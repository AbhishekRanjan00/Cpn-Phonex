import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleAddToCart = () => {
    addToCart({ ...product, qty: 1 });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col justify-between h-full">

      {/* ❤️ Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-lg z-20 hover:scale-110 transition"
      >
        {isWishlisted(product._id) ? (
          <FaHeart className="text-red-600 text-xl" />  // 🔥 Filled red heart
        ) : (
          <FaRegHeart className="text-gray-500 text-xl" /> // 🤍 Outlined gray heart
        )}
      </button>

      {/* Product image and link */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-36 sm:h-40 md:h-44 object-cover rounded-lg mb-2"
        />
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-[#319795] font-bold mt-1">₹{product.price}</p>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-3 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-medium"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
