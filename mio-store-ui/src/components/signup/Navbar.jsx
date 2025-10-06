import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-3 shadow-md bg-white">
      <h1 className="text-2xl font-bold text-green-700">MiO Store</h1>
      <div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-700">Hi, {user.phone}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </nav>
  );
};

export default Navbar;
