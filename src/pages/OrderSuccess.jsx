import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-700">
        <h2 className="text-2xl font-bold mb-4">No recent order found</h2>
        <Link to="/" className="text-teal-600 underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 relative">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <h1 className="text-3xl sm:text-4xl font-bold text-teal-600 mb-4 text-center">
        🎉 Thank you for your order!
      </h1>
      <p className="text-gray-700 text-lg mb-6 text-center">
        Your payment was successful and your order has been placed.
      </p>

      <div className="bg-gray-50 border rounded-xl shadow-md p-6 w-full max-w-md mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Order Summary:
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {order.products.map((item, i) => (
            <li key={i}>
              <span className="font-medium">{item.product.name}</span> ×{" "}
              {item.quantity}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-semibold text-gray-800">
          Total: ₹{order.totalAmount}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Order ID: {order._id}
        </p>
      </div>

      <Link
        to="/my-orders"
        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default OrderSuccess;
