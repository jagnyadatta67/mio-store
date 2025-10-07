import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Add item to cart
export const addToCartApi = async (variantId, quantity = 1, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cart/add`,
      { variant: variantId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error adding to cart:", error.response?.data || error.message);
    throw error;
  }
};

// Get current cart (for mini cart)
export const getCartApi = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error);
      throw error;
    }
  };

  export const updateCartItemApi = async (variant, quantity, token) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/cart/update`,
    { variant, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update cart item:", error);
      throw error;
    }
  };
  
  export const removeCartItemApi = async (variantId, token) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/remove/${variantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Failed to remove cart item:", error);
      throw error;
    }
  };

  export const getCartSuggestionsApi = async (token) => {
    const res = await fetch("http://localhost:8080/api/cart/suggestions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return res.json();
  };
  
  
