import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkedAlt, FaLandmark,
  FaLocationArrow, FaCity, FaFlag, FaGlobeAsia
} from 'react-icons/fa';

const Checkout = () => {
  const { cartItems } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
  });

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, address, pincode, city, state, country } = shippingInfo;
    if (!name || !email || !phone || !address || !pincode || !city || !state || !country) {
      return alert('Please fill all required fields');
    }

    // ✅ Save shipping info to localStorage and redirect to payment
    localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));
    navigate("/payment");
  };

  const InputField = ({ label, name, icon, required = false, type = 'text', isTextArea = false }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-start gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500">
        {icon}
        {isTextArea ? (
          <textarea
            name={name}
            value={shippingInfo[name]}
            onChange={handleChange}
            rows="3"
            required={required}
            placeholder={label}
            className="w-full bg-transparent outline-none resize-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={shippingInfo[name]}
            onChange={handleChange}
            placeholder={label}
            required={required}
            className="w-full bg-transparent outline-none"
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 transition-all duration-300">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-700">
            Shipping Details
          </h2>
          <span className="text-sm text-gray-500">Step 1 of 2</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div className="h-2 w-1/2 bg-teal-400 rounded-full"></div>
        </div>
      </div>

      <form onSubmit={handleShippingSubmit} className="space-y-6">
        {InputField({ label: 'Full Name', name: 'name', icon: <FaUser className="mt-1 text-gray-400" />, required: true })}
        {InputField({ label: 'Email Address', name: 'email', icon: <FaEnvelope className="mt-1 text-gray-400" />, required: true, type: 'email' })}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {InputField({ label: 'Phone Number', name: 'phone', icon: <FaPhone className="mt-1 text-gray-400" />, required: true })}
          {InputField({ label: 'Alternate Phone (Optional)', name: 'alternatePhone', icon: <FaPhone className="mt-1 text-gray-300" /> })}
        </div>

        {InputField({ label: 'Full Address', name: 'address', icon: <FaMapMarkedAlt className="mt-1 text-gray-400" />, required: true, isTextArea: true })}
        {InputField({ label: 'Landmark (Optional)', name: 'landmark', icon: <FaLandmark className="mt-1 text-gray-400" /> })}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {InputField({ label: 'Pincode', name: 'pincode', icon: <FaLocationArrow className="mt-1 text-gray-400" />, required: true })}
          {InputField({ label: 'City', name: 'city', icon: <FaCity className="mt-1 text-gray-400" />, required: true })}
          {InputField({ label: 'State', name: 'state', icon: <FaFlag className="mt-1 text-gray-400" />, required: true })}
          {InputField({ label: 'Country', name: 'country', icon: <FaGlobeAsia className="mt-1 text-gray-400" />, required: true })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-teal-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Continue to Payment →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
