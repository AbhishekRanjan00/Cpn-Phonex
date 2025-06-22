import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShoppingCart, FaBars, FaHeart, FaSignInAlt, FaUserPlus, FaUserCircle
} from 'react-icons/fa';
import { IoMdClose, IoMdCall, IoMdInformationCircle } from 'react-icons/io';
import { AiFillHome } from 'react-icons/ai';
import { MdSpaceDashboard } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { auth } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center relative z-50">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleMenu} className="text-2xl text-teal-600 sm:hidden">
          <FaBars />
        </button>
        <Link to="/" className="text-2xl font-bold text-teal-600">
          Cpn Phonex
        </Link>
      </div>

      {/* Center-right: Text Nav Items (visible on tablet/laptop) */}
      <div className="hidden sm:flex items-center ml-auto gap-4">
        <Link to="/" className="text-teal-600 font-medium hover:underline">Home</Link>
        <Link to="/about" className="text-teal-600 font-medium hover:underline">About</Link>
        <Link to="/contact" className="text-teal-600 font-medium hover:underline">Contact</Link>

        <Link to="/wishlist" className="relative text-red-500 text-xl">
          <FaHeart />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {wishlist.length}
            </span>
          )}
        </Link>

        <Link to="/cart" className="relative text-teal-600 text-xl">
          <FaShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {cartItems.length}
            </span>
          )}
        </Link>

        {auth?.user && (
          <Link to={auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}>
            <FaUserCircle className="text-2xl text-indigo-600 hover:text-indigo-800" />
          </Link>
        )}

        {!auth?.user && (
          <>
            <Link
              to="/login"
              className="bg-teal-600 text-white px-4 py-1.5 rounded hover:bg-teal-700 transition"
            >
              <FaSignInAlt className="inline mr-1" /> Login
            </Link>
            <Link
              to="/register"
              className="bg-white border border-teal-600 text-teal-600 px-4 py-1.5 rounded hover:bg-teal-50 transition"
            >
              <FaUserPlus className="inline mr-1" /> Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile top-right icons */}
      <div className="flex items-center space-x-4 sm:hidden">
        <Link to="/wishlist" className="relative text-red-500 text-xl">
          <FaHeart />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {wishlist.length}
            </span>
          )}
        </Link>
        <Link to="/cart" className="relative text-teal-600 text-xl">
          <FaShoppingCart />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 backdrop-blur-lg bg-white/15 border-r border-gray-300 transition-transform duration-500 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          <IoMdClose />
        </button>

        <div className="mt-20 px-6 space-y-6">
          <Link to="/" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <AiFillHome className="text-xl text-emerald-600" /> Home
          </Link>
          <Link to="/about" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <IoMdInformationCircle className="text-xl text-yellow-500" /> About
          </Link>
          <Link to="/contact" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <IoMdCall className="text-xl text-blue-500" /> Contact
          </Link>

          <Link to="/my-orders" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <FaShoppingCart className="text-xl text-pink-500" /> My Orders
          </Link>

          {auth?.user && (
            <Link
              to={auth.user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
              onClick={toggleMenu}
              className="flex items-center gap-2 text-lg text-teal-700 font-medium"
            >
              <MdSpaceDashboard className="text-xl text-indigo-600" /> Dashboard
            </Link>
          )}

          <Link to="/wishlist" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <FaHeart className="text-xl text-red-500" /> Wishlist
          </Link>
          <Link to="/cart" onClick={toggleMenu} className="flex items-center gap-2 text-lg text-teal-700 font-medium">
            <FaShoppingCart className="text-xl text-green-500" /> Cart
          </Link>

          {!auth?.user && (
            <>
              <Link
                to="/login"
                onClick={toggleMenu}
                className="flex items-center gap-2 text-lg text-teal-700 font-medium"
              >
                <FaSignInAlt className="text-xl text-teal-500" /> Login
              </Link>
              <Link
                to="/register"
                onClick={toggleMenu}
                className="flex items-center gap-2 text-lg text-teal-700 font-medium"
              >
                <FaUserPlus className="text-xl text-green-600" /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
