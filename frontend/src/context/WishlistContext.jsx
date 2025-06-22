// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const isAlready = prev.find((p) => p._id === product._id);
      if (isAlready) {
        return prev.filter((p) => p._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
