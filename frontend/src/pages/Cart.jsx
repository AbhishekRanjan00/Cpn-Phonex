import React, { useRef } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa"; // ✅ Don't forget this!
import CrazyBackButton from "../components/CrazyBackBtn";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const toastIdRef = useRef(null);

  const handleQuantityChange = (id, qty) => {
    const quantity = Number(qty);
    if (quantity >= 1) {
      updateQuantity(id, quantity);
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = toast.success("Quantity updated");
    } else {
      toast.error("Quantity must be at least 1");
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price);
    const quantity = Number(item.qty);
    return total + price * quantity;
  }, 0);

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckoutRedirect = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    toast.success("Redirecting to checkout...");
    navigate("/checkout-form");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
     
     <CrazyBackButton/>

      <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Your cart is empty.</p>
          <Link to="/" className="text-teal-600 underline mt-4 inline-block">
            Go back to shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🛒 Cart Items */}
          <div className="w-full lg:w-2/3 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-xl shadow-sm p-4 border"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 w-full sm:w-2/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-teal-600 font-medium">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex gap-4 items-center mt-4 sm:mt-0">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1"
                  />
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Summary Box */}
          <div className="w-full lg:w-1/3 bg-gray-50 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Order Summary</h3>
            <div className="flex justify-between text-lg font-medium mb-2">
              <span>Total</span>
              <span className="text-teal-600">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="mt-6 space-y-4">
              <button
                onClick={handleClearCart}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckoutRedirect}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
