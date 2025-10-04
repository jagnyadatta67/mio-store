import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); // total cart items
  const [miniCartProduct, setMiniCartProduct] = useState(null); // last added product

  const addToCart = (product) => {
    // Update cart items
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    // Show mini-cart popup
    setMiniCartProduct({ ...product, quantity: 1 });
    setTimeout(() => setMiniCartProduct(null), 3000);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const removeFromMiniCart = () => setMiniCartProduct(null);

  return (
    <CartContext.Provider value={{
      cartItems,
      miniCartProduct,
      addToCart,
      removeFromCart,
      removeFromMiniCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
