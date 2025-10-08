import React, { useContext, useState, useEffect, useRef } from "react";
import MiniCart from "../Cart/MiniCart";
import { CartContext } from "../Cart/CartContext";
import LoginModal from "../signup/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();
  const { token } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header container">
      <div className="container topbar">
        {/* 🔹 Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/images/mio-logo.png" alt="MiO Logo" />
          </Link>
        </div>

        {/* 🔹 Navigation */}
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
        </nav>

        {/* 🔹 Right Section */}
        <div className="header-actions">
          {/* 👤 My Account Dropdown */}
          {token && (
            <div className="nav-right" ref={dropdownRef}>
              <div className="account-dropdown">
                <button
                  className="account-btn"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  👤 My Account <span className="arrow">▾</span>
                </button>

                {menuOpen && (
                  <div className="account-menu">
                    <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                      🧾 My Orders
                    </Link>
                    <Link to="/my-addresses" onClick={() => setMenuOpen(false)}>
                      🏠 My Addresses
                    </Link>
                    <Link to="/checkout" onClick={() => setMenuOpen(false)}>
                      💳 Checkout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 🔹 Login / Logout */}
          {user ? (
            <div className="user-info">
              <span className="user-name">👋 Hi, {user.name || "User"}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login / Signup
            </button>
          )}

          {/* 🔹 Cart */}
          <Link to="/cart" className="cart-link">
            <div className="cart-icon">
              🛒
              {totalCount > 0 && (
                <span className="cart-count">{totalCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* 🔹 Popup Components */}
      <MiniCart />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
};

export default Header;
