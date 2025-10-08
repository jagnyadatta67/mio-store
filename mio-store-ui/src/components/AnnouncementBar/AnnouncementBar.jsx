import React, { useEffect, useState } from "react";
import "./AnnouncementBar.css";

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`announcement-bar ${visible ? "show" : "hide"}`}>
      <div className="scrolling-container">
        <div className="scrolling-text">
          <span>🚚 Free Shipping on Orders Above ₹499 — Eat Healthy, Live Better with MIO 🌾</span>
          <span>🚚 Free Shipping on Orders Above ₹499 — Eat Healthy, Live Better with MIO 🌾</span>
          <span>🚚 Free Shipping on Orders Above ₹499 — Eat Healthy, Live Better with MIO 🌾</span>
          <span>🚚 Free Shipping on Orders Above ₹499 — Eat Healthy, Live Better with MIO 🌾</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
