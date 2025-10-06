import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Body from "./components/Body/Body";
import ProductListPage from "./components/pages/ProductListPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./components/Cart/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/signup/Navbar";

function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/products" element={<ProductListPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
