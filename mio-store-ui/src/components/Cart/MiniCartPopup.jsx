// src/components/Cart/MiniCartPopup.jsx
import React, { useState, useContext } from "react";
import { CartContext } from "./CartContext";
import "./MiniCartPopup.css";

const MiniCartPopup = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="mini-cart-wrapper">
      <div className="cart-icon" onClick={() => setOpen(!open)}>
        🛒
        {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
      </div>

      {open && (
        <div className="mini-cart-popup">
          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <ul>
              {cartItems.map(item => (
                <li key={item.id}>
                  <img src={item.imageUrl} alt={item.name} width={40} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>Qty: {item.quantity}</p>
                    {item.offer && <p>Offer: {item.offer.title}</p>}
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCartPopup;
