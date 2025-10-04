import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Body from "./components/Body/Body";
import ProductListPage from "./components/pages/ProductListPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./components/Cart/CartContext";

function App() {
  return (
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
  );
}

export default App;
