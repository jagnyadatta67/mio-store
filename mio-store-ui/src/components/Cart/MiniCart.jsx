import React, { useContext } from "react";
import { CartContext } from "../Cart/CartContext";
import "./MiniCart.css";

const MiniCart = () => {
  const { miniCartProduct, removeFromMiniCart } = useContext(CartContext);

  if (!miniCartProduct) return null;

  return (
    <div className="mini-cart">
      <button className="close-btn" onClick={removeFromMiniCart}>×</button>
      <img src={miniCartProduct.imageUrl} alt={miniCartProduct.name} />
      <div className="details">
        <h4>{miniCartProduct.name}</h4>
        <p>Qty: {miniCartProduct.quantity}</p>
        <p>Price: {miniCartProduct.price} INR</p>
      </div>
    </div>
  );
};

export default MiniCart;
