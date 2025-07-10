import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaShoppingBasket, FaSmile, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CrazyBackButton from '../components/CrazyBackBtn';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 px-4 sm:px-6 md:px-10 lg:px-20 py-12 sm:py-16 text-center relative">
     <CrazyBackButton />

      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-teal-600 mb-6"
      >
        About Cpn Phonex
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto text-gray-700 text-base sm:text-lg leading-relaxed mb-10 px-2"
      >
        We're your friendly neighborhood grocery partner — delivering freshness with a smile.
        From farm to doorstep, we make grocery shopping simple, fast, and joyful.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-lg transition duration-300">
          <FaLeaf className="text-teal-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Organic & Fresh</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Hand-picked fresh produce sourced from local farmers every morning.
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-lg transition duration-300">
          <FaShoppingBasket className="text-teal-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Smart Shopping</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Our online store makes it easy to shop essentials from anywhere.
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-2xl shadow-lg transition duration-300">
          <FaSmile className="text-teal-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Happy Customers</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            We value satisfaction and are always here to help you with a smile.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
