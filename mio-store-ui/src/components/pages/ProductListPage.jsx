import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../Cart/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { addToCartApi } from "../../api/cartService";
import "./ProductListPage.css";

const healthyMessages = [
  "🌾 Millets — the ancient grains for a modern lifestyle.",
  "💚 Eat smart, live strong — choose natural foods.",
  "✨ Small steps to a healthier tomorrow start with what you eat.",
  "🥣 Whole grains, whole heart — stay full, stay fit.",
  "🌱 Happy, healthy, and hearty — that’s the MiO way!",
];

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addedVariant, setAddedVariant] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);

  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext); // ✅ Auth token from login

  // 🟩 Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🟨 Rotate healthy banner messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % healthyMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 🔍 Filter products by name or brand
  const filteredProducts = products.filter((p) =>
    (p.name || p.brand || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🛒 Handle Add to Cart (with API + animation)
  const handleAdd = async (variant) => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      // Call backend API
      const result = await addToCartApi(variant.sku, 1, token);
      console.log("✅ Added to cart:", result);

      // Update context
      addToCart(variant);

      // Trigger animation
      setAddedVariant(variant.sku);
      setTimeout(() => setAddedVariant(null), 1500);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div className="product-list-container">
      <h1>Our Products</h1>

      {/* 🌿 Rotating Healthy Message */}
      <div className="healthy-banner">
        <p key={messageIndex} className="fade-in-text">
          {healthyMessages[messageIndex]}
        </p>
      </div>

      {/* 🔍 Search Box */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="product-search"
      />

      {/* 🛍 Product Grid */}
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const offer = product.offers?.[0];

          return (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    product.imageUrl 
                    
                  }
                  alt={product.name || "Product"}
                  loading="lazy"
                />

                {offer?.title && (
                  <span className="offer-title-tag">{offer.title}</span>
                )}
                {offer?.discountPercent && (
                  <span className="offer-percent-tag">
                    {offer.discountPercent}% OFF
                  </span>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name || product.brand}</h3>
                <p className="product-description">{product.description}</p>

                {/* 🟨 Variants */}
                <div className="variant-container">
                  {product.variants?.map((variant) => (
                    <div key={variant.sku} className="variant-box">
                      <p className="variant-unit">{variant.unitLabel}</p>

                      {variant.salePrice ? (
                        <p className="variant-price">
                          ₹{variant.salePrice}
                          <span className="variant-original">
                            ₹{variant.price}
                          </span>
                        </p>
                      ) : (
                        <p className="variant-price">₹{variant.price}</p>
                      )}

                      <button
                        className={`variant-add-btn ${
                          addedVariant === variant.sku ? "added" : ""
                        }`}
                        onClick={() => handleAdd(variant)}
                      >
                        {addedVariant === variant.sku ? "✅ Added" : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListPage;
