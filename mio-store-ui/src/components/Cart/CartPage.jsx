import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import { AuthContext } from "../../context/AuthContext";
import {
  getCartApi,
  getCartSuggestionsApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../../api/cartService";
import "./CartPage.css";

const CartPage = () => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate(); // ✅ add navigation hook

  const DELIVERY_FEE = 40;

  // Fetch Cart & Suggestions
  const fetchCartAndSuggestions = async () => {
    if (!token) {
      alert("Please log in to view your cart.");
      setLoading(false);
      return;
    }
    try {
      const [cartData, suggestionsData] = await Promise.all([
        getCartApi(token),
        getCartSuggestionsApi(token),
      ]);
      setCart(cartData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error("Failed to fetch cart or suggestions:", error);
      alert("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndSuggestions();
  }, [token]);

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    setUpdating(true);
    try {
      await updateCartItemApi(item.sku, newQty, token);
      await fetchCartAndSuggestions();
    } catch {
      alert("Failed to update quantity.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    setUpdating(true);
    try {
      await removeCartItemApi(itemId, token);
      await fetchCartAndSuggestions();
    } catch {
      alert("Failed to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddSuggestion = async (product) => {
    if (!token) {
      alert("Please log in to add items to cart.");
      return;
    }
    try {
      await addToCartApi(product.id, 1, token);
      await fetchCartAndSuggestions();
      alert(`${product.name} added to your cart!`);
    } catch (error) {
      console.error("Failed to add suggested product:", error);
      alert("Could not add to cart. Please try again.");
    }
  };

  if (loading) return <div className="cart-loading">Loading your cart...</div>;
  if (!cart || cart.items?.length === 0)
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
        <p>Add some healthy millet goodness to your basket!</p>
      </div>
    );

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + DELIVERY_FEE;

  // ✅ Navigate to Checkout
  const handleCheckout = () => {
    if (!token) {
      alert("Please log in before proceeding to checkout.");
      navigate("/login"); // redirect to login page
      return;
    }

    // Pass total & cart items to checkout page
    navigate("/checkout", {
      state: {
        cartItems: cart.items,
        subtotal,
        total,
      },
    });
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-content">
        {/* LEFT - CART ITEMS */}
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.sku} className="cart-item">
              <img
                src={item.imageUrl || "/images/placeholder.png"}
                alt={item.productName}
                className="cart-item-img"
              />
              <div className="cart-item-details">
                <h3>{item.productName}</h3>
                <p>Unit: {item.unitLabel}</p>
                <p className="item-price">₹{item.price * item.quantity}</p>

                <div className="item-actions">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      disabled={updating}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      disabled={updating}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.sku)}
                    disabled={updating}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Delivery: ₹{DELIVERY_FEE.toFixed(2)}</p>
          <hr />
          <p className="cart-total">
            <strong>Total: ₹{total.toFixed(2)}</strong>
          </p>
          <button
            className="checkout-btn"
            disabled={updating}
            onClick={handleCheckout} // ✅ updated
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div className="cart-suggestions">
          <h2>You may also like</h2>
          <div className="suggestion-grid">
            {suggestions.map((p) => (
              <div key={p.id} className="suggestion-card">
                <img
                  src={
                    p.thumbImageUrl || p.imageUrl?.[0] || "/images/placeholder.png"
                  }
                  alt={p.name}
                  className="suggestion-img"
                />
                <h4>{p.name}</h4>
                <div className="suggestion-price">
                  {p.salePrice ? (
                    <>
                      <span className="sale-price">₹{p.salePrice}</span>
                      <span className="original-price">₹{p.price}</span>
                    </>
                  ) : (
                    <span className="sale-price">₹{p.price}</span>
                  )}
                </div>
                <button
                  className="add-suggestion-btn"
                  onClick={() => handleAddSuggestion(p)}
                  disabled={updating}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
