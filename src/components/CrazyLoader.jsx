// src/components/CrazyLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaBolt, FaFire, FaReact } from 'react-icons/fa';

const icons = [FaBolt, FaFire, FaReact];

const CrazyLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl font-extrabold mb-6 text-cyan-400 drop-shadow-lg"
      >
        Cpn Phonex is Powering Up...
      </motion.h1>

      <div className="flex space-x-8">
        {icons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [0, -30, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: index * 0.2 }}
            className="text-5xl text-yellow-400 drop-shadow-xl"
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
        className="mt-8 text-lg text-gray-300"
      >
        Loading with style... ⚡🔥⚛️
      </motion.p>
    </div>
  );
};

export default CrazyLoader;