import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaTelegramPlane,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:3000/api/contact", form);

    if (res.data.success) {
      toast.success("📬 Message sent to admin successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      toast.error("⚠️ Failed to send message");
    }
  } catch (err) {
    console.error("❌ Error sending contact message:", err);
    toast.error("❌ Something went wrong!");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-16 px-4 sm:px-6 md:px-10 lg:px-20 relative">
      {/* Back Button */}
      <Link to="/" className="absolute top-4 left-4 text-teal-600 hover:text-teal-800 text-xl">
        <FaArrowLeft />
      </Link>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold text-center text-teal-700 mb-6"
      >
        Let's Talk
      </motion.h2>
      <p className="text-center text-gray-600 mb-10 text-base sm:text-lg">
        Have questions or feedback? Reach out to us below.
      </p>

      {/* Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg space-y-6 text-sm sm:text-base"
        >
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-teal-600 text-xl" />
            <span className="text-gray-700 break-all">support -- cpnphonex@gmail.com</span>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-teal-600 text-xl" />
            <span className="text-gray-700">+91 7870088255</span>
          </div>
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-teal-600 text-xl" />
            <span className="text-gray-700">chatra more chouparan near KBSS+ High School</span>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="https://t.me/cpnphonex" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-2xl">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 text-2xl">
              <FaWhatsapp />
            </a>
            <a href="https://www.instagram.com/cpnphonex" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-2xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com/cpnphonex" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-2xl">
              <FaTwitter />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-lg space-y-5"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
          >
            Send
          </button>
        </motion.form>
      </div>

      {/* Footer Section */}
      <div className="mt-16 text-center text-sm text-gray-500 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-teal-600">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms & Conditions</span>
        </div>
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Cpn Phonex. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Contact;
