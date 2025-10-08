import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Body from "./components/Body/Body";
import ProductListPage from "./components/pages/ProductListPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./components/Cart/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/signup/Navbar";
import CartPage from "./components/Cart/CartPage";
import AnnouncementBar from "./components/AnnouncementBar/AnnouncementBar";
import CheckoutPage from "./components/CheckoutPage/CheckoutPage"; // ✅ import this
import OrderSuccess from "./components/OrderSuccess/OrderSuccess";
import MyOrders from "./components/MyOrders/MyOrders";
import MyAddresses from "./components/MyAddresses/MyAddresses";
import PersonaPage from "./components/PersonaPage/PersonaPage"; // ✅ adjust path


function App() {
  return (
    <AuthProvider>
    <CartProvider>
      <Router>
      <AnnouncementBar /> {/* 👈 shows on every page */}
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/my-addresses" element={<MyAddresses />} />
          <Route path="/my-profile" element={<PersonaPage />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
