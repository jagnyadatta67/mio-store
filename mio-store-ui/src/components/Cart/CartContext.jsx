import React, { createContext, useState, useEffect, useContext } from "react";
import {
  addToCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartItemApi,
} from "../../api/cartService";
import { AuthContext } from "../../context/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [miniCartProduct, setMiniCartProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  /** 🧾 Fetch current cart */
  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getCartApi();
      setCartItems(data.items || []);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  /** 🛒 Add to cart */
  const addToCart = async (variant, quantity = 1) => {
    try {
      // pick proper identifier for backend
      const variantId = variant.id || variant.variantId || variant.sku;
      console.log("🟢 Sending variant:", variantId);

      await addToCartApi(variantId, quantity);
      await fetchCart();

      setMiniCartProduct({
        name: variant.sku || variant.name || "Product",
        imageUrl: variant.variantThumbImageUrl,
        price: variant.salePrice || variant.price,
        unit:variant.unitLabel,
        quantity,
      });

      setTimeout(() => setMiniCartProduct(null), 3000);
    } catch (err) {
      console.error("❌ Error adding to cart:", err.response?.data || err.message);
      throw err;
    }
  };

  /** 🔁 Update quantity */
  const updateQuantity = async (variantId, quantity) => {
    try {
      await updateCartItemApi(variantId, quantity);
      await fetchCart();
    } catch (err) {
      console.error("❌ Error updating cart item:", err.response?.data || err.message);
    }
  };

  /** ❌ Remove item */
  const removeFromCart = async (variantId) => {
    try {
      await removeCartItemApi(variantId);
      setCartItems((prev) => prev.filter((item) => item.variant !== variantId));
    } catch (err) {
      console.error("❌ Error removing item:", err.response?.data || err.message);
    }
  };

  /** 🧹 Clear cart */
  const clearCart = () => setCartItems([]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        miniCartProduct,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
