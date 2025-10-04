import React, { useContext } from "react";
import MiniCart from "../Cart/MiniCart";
import { CartContext } from "../Cart/CartContext";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <div className="container topbar">
        <div className="logo">
        <Link to="/">
            <img src="/images/mio-logo.png" alt="MiO Logo" />
          </Link>
        </div>
   
        <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>
      <nav>
          <div className="cart-icon">
            🛒
            {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
          </div>
        </nav>
      </div>
      <MiniCart /> {/* popup */}
    </header>
  );
};

export default Header;
