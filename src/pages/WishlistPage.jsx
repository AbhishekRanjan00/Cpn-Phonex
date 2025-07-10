import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import CrazyBackButton from "../components/CrazyBackBtn";

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <p>Your wishlist is empty 💔</p>
        <Link to="/" className="text-teal-600 underline mt-4 inline-block">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
        <CrazyBackButton />
      <h2 className="text-2xl font-bold text-teal-700 mb-6">Your Wishlist ❤️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item._id} className="bg-white shadow rounded p-4 relative">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-3" />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-teal-600 font-bold">₹{item.price}</p>
            <button
              onClick={() => toggleWishlist(item)}
              className="absolute top-3 right-3 text-red-500"
              title="Remove from wishlist"
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
