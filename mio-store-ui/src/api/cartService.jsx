import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Always attach the latest token from localStorage or session
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("jwtToken") ||
      sessionStorage.getItem("jwtToken"); // fallback
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found while making API request:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚡ Centralized error logging helper
const handleError = (error, message) => {
  console.error(`❌ ${message}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || message);
};

/**
 * 🛒 Add an item to cart
 * @param {string} variantId - Variant SKU or ID
 * @param {number} quantity - Quantity to add
 */
export const addToCartApi = async (variantId, quantity = 1) => {
  try {
    const response = await apiClient.post("/cart/add", {
      variant: variantId,
      quantity,
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add item to cart");
  }
};

/**
 * 🧾 Get current user's cart
 */
export const getCartApi = async () => {
  try {
    const response = await apiClient.get("/cart");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch cart");
  }
};

/**
 * 🔁 Update item quantity in cart
 */
export const updateCartItemApi = async (variantId, quantity) => {
  try {
    const response = await apiClient.put("/cart/update", {
      variant: variantId,
      quantity,
    });
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update cart item");
  }
};

/**
 * ❌ Remove item from cart
 */
export const removeCartItemApi = async (variantId) => {
  try {
    const response = await apiClient.delete(`/cart/remove/${variantId}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to remove item from cart");
  }
};

/**
 * 💡 Get smart product suggestions (cross-sell)
 */
export const getCartSuggestionsApi = async () => {
  try {
    const response = await apiClient.get("/cart/suggestions");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch cart suggestions");
  }
};
