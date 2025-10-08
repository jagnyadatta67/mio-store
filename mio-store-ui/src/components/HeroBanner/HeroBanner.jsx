import React, { useEffect, useState } from "react";
import "./HeroBanner.css";
import { Link } from "react-router-dom";

const banners = [
  {
    id: 1,
    title: "Discover the Goodness of Millets",
    subtitle: "Wholesome • Natural • Nutritious",
    description:
      "Experience nature’s finest grains—crafted for health, energy, and taste. Choose millets, choose better living.",
    img: "/images/prod-finger-1.png",
    bgColor: "#FFA751",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    title: "Pure, Organic & Locally Sourced",
    subtitle: "From Farm to Your Table",
    description:
      "MIO brings you premium quality millets directly from trusted farmers—fresh, chemical-free, and rich in nutrients.",
    img: "/images/prod-finger.png",
    bgColor: "#FFD65A",
    buttonText: "Explore Products",
  },
  {
    id: 3,
    title: "Fuel Your Day with Millets",
    subtitle: "Healthy Energy for Every Moment",
    description:
      "Switch to millets—packed with protein, fiber, and minerals. Make every meal deliciously healthy!",
    img: "/images/prod-foxtail.png",
    bgColor: "#FFB347",
    buttonText: "Order Now",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  // Auto rotate banners every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { title, subtitle, description, img, bgColor, buttonText } =
    banners[current];

  return (
    <Link to="/products">
    <section
      className="hero-banner"
      style={{ backgroundColor: bgColor, transition: "background 0.6s ease" }}
    >
      <div className="hero-text">
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <p>{description}</p>
        <button className="hero-btn">{buttonText}</button>
      </div>

      <div className="hero-image">
        <img src={img} alt={title} />
      </div>
    </section>
    </Link>
  );
};

export default HeroBanner;
