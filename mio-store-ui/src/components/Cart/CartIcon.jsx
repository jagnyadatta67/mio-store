// src/components/Cart/CartIcon.jsx
import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import { Link } from "react-router-dom";
import "./CartIcon.css";

const CartIcon = () => {
  const { cart } = useContext(CartContext);
  const itemCount = cart.length;

  return (
    <Link to="/cart" className="cart-icon">
      🛒
      {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
    </Link>
  );
};

export default CartIcon;
