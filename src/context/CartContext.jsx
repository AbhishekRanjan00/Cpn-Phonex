import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add to cart
  const addToCart = (product) => {
  setCartItems((prev) => {
    const existing = prev.find((item) => item._id === product._id);
    if (existing) {
      return prev.map((item) =>
        item._id === product._id
          ? { ...item, qty: item.qty + product.qty }
          : item
      );
    }
    return [...prev, product];
  });
};


  // ✅ Remove from cart
  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  // ✅ Update quantity
  const updateQuantity = (id, qty) => {
    setCartItems((items) =>
      items.map((item) =>
        item._id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  // ✅ Clear cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
