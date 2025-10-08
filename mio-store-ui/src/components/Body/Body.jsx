import React from "react";
import Header from "../Header/Header";
import Carousel from "../Carousel/Carousel";
import Footer from "../Footer/Footer";
import "./Body.css";
import { useNavigate } from "react-router-dom";
import WhyMillets from "../WhyMillets/WhyMillets";
import HeroBanner from "../HeroBanner/HeroBanner";
import GenerateUpiQR from "../GenerateUpiQR/GenerateUpiQR";

const Body = () => {
  const navigate = useNavigate();

  const handleShopClick = () => {
    navigate("/products"); // redirect to products page
  };

  return (
    <div className="container">
      <Carousel />

      {/* ✅ Hero Banner Image */}
     {/* <section className="hero-section">
        <img
          src="/images/hero-banner.png"
          alt="Shop Healthy Millets"
          className="hero-full-img"
        />
      </section>
      */}

      {/* ✅ Text Section Below Image */}
      <section className="hero-content">
          {/* 🎉 Attractive Offer Banner */}
          <div className="offer-banner">
          <span className="offer-text">
            🎉 First-time order? <strong>Get 20% OFF</strong> on your first purchase!
          </span>
        </div>
          <button className="hero-btn" onClick={handleShopClick}>
          Shop Now
        </button>
      </section>
      <HeroBanner />
      <WhyMillets></WhyMillets>
    </div>
  );
};

export default Body;
