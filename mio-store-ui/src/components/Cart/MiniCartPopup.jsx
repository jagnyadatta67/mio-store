import React, { useEffect } from "react";
import "./MiniCartPopup.css";

const CartPopup = ({ product, onClose }) => {
  console.log(product)
  // Auto close after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 100000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="cart-popup">
      <img src={product.imageUrl} alt={product.name} className="cart-popup-img" />
      <div className="cart-popup-details">
        <p className="cart-popup-name">{product.name} - {product.unit}</p>
        <p className="cart-popup-price">
          ₹{product.price} × {product.quantity}
        </p>
        <p className="cart-popup-success">✅ Added to Cart!</p>
      </div>
    </div>
  );
};

export default CartPopup;
