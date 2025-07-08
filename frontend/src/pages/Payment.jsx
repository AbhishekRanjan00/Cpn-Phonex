import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CrazyLoader from "../components/CrazyLoader";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE;

const Payment = () => {
  const { cartItems, clearCart } = useCart();
  const { auth } = useAuth();
  const token = auth?.token;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!shippingInfo) {
      toast.error("Shipping info is missing!");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Try again later.");
      return;
    }

    try {
      setLoading(true);

      const { data: order } = await axios.post(
        `${API_BASE}/payment/create-order`,
        { amount: totalAmount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Cpn Phonex Grocery",
        description: "Order Payment",
        image: "/logo.png",
        order_id: order.id,
        handler: async (response) => {
          const payload = {
            products: cartItems.map((item) => ({
              product: item._id,
              quantity: item.qty,
            })),
            totalAmount,
            shippingDetails: shippingInfo,
            razorpay: {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            },
          };

          const { data } = await axios.post(`${API_BASE}/orders/place`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success("🎉 Payment successful, order placed!");
          localStorage.setItem("lastOrder", JSON.stringify(data.order));
          clearCart();
          localStorage.removeItem("shippingInfo");
          navigate("/order-success");
        },
        prefill: {
          name: shippingInfo.name,
          email: auth?.user?.email || "",
          contact: shippingInfo.phone,
        },
        notes: {
          address: shippingInfo.address,
        },
        theme: {
          color: "#38b2ac",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("❌ Razorpay or Order Error:", err.response?.data || err.message);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
      {loading ? (
        <CrazyLoader />
      ) : (
        <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
            Confirm Payment
          </h2>
          <p className="text-center text-base md:text-lg text-gray-600 mb-6">
            Total Payable:{" "}
            <span className="text-teal-600 font-semibold">
              ₹{totalAmount.toFixed(2)}
            </span>
          </p>
          <button
            onClick={handlePayment}
            className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-base transition duration-300"
          >
            Pay with Razorpay
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
