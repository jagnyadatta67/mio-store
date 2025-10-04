import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../Cart/CartContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./ProductListPage.css";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/jagnyadatta67/mio/refs/heads/main/products.json"
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      
      <div className="product-list-container">
        <h1>Our Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="product-search"
        />
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                {product.offer && (
                  <span className="offer-badge">{product.offer.title}</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>
                  <strong>
                    ₹{product.offer?.salePrice || product.price}{" "}
                    {product.offer && (
                      <span className="original-price">₹{product.price}</span>
                    )}
                  </strong>
                </p>
                <button onClick={() => addToCart(product)} className="add-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    
    </>
  );
};

export default ProductListPage;
