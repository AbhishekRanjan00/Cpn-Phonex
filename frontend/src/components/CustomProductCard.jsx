import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const CustomProductCard = () => {
  const { addToCart } = useCart();
  const [customItem, setCustomItem] = useState("");

  const handleAddCustom = () => {
    if (!customItem.trim()) {
      toast.error("Please enter what you want to order");
      return;
    }

    const product = {
      _id: Date.now(), // temporary ID
      name: customItem,
      price: 0,
      custom: true,
    };

    addToCart(product);
    toast.success("Custom item added to cart!");
    setCustomItem("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto text-center border border-teal-200">
      <h3 className="text-2xl font-bold text-teal-700 mb-4">📝 Can't find what you need?</h3>
      <p className="text-gray-600 mb-4">Write your custom request below and add it to your cart.</p>
      <textarea
        rows={4}
        placeholder="e.g. 2kg fresh paneer, 1 coconut, 500ml mustard oil..."
        value={customItem}
        onChange={(e) => setCustomItem(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
      ></textarea>
      <button
        onClick={handleAddCustom}
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-all"
      >
        ➕ Add to Cart
      </button>
    </div>
  );
};

export default CustomProductCard;
