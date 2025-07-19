import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add course to cart
  const addToCart = (course) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === course.id);
      if (existingItem) {
        return prevCart; // Course already in cart
      }
      return [...prevCart, { ...course, addedAt: new Date().toISOString() }];
    });
  };

  // Remove course from cart
  const removeFromCart = (courseId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== courseId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cart.length;
  };

  // Check if course is in cart
  const isInCart = (courseId) => {
    return cart.some(item => item.id === courseId);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    loading,
    setLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 