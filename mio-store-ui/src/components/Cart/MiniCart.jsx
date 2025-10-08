import React, { useContext } from "react";
import { CartContext } from "../Cart/CartContext";
import "./MiniCart.css";

const MiniCart = () => {
  const { miniCartProduct, removeFromMiniCart } = useContext(CartContext);

  if (!miniCartProduct) return null;

}

export default MiniCart;
