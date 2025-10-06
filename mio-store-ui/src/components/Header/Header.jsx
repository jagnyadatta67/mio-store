import React, { useContext, useState } from "react";
import MiniCart from "../Cart/MiniCart";
import { CartContext } from "../Cart/CartContext";
import LoginModal from "../signup/LoginModal";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container topbar">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/images/mio-logo.png" alt="MiO Logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>

        {/* Right section */}
        <div className="header-actions">
          {/* Login / User Info */}
          {user ? (
            <div className="user-info">
              <span className="user-name">👋 Hi, {user.name || "User"}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login / Signup
            </button>
          )}

          {/* Cart */}
          <div className="cart-icon">
            🛒
            {totalCount > 0 && <span className="cart-count">{totalCount}</span>}
          </div>
        </div>
      </div>

      {/* Popup Components */}
      <MiniCart />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Header;
