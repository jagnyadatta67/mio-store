import React, { useEffect, useState } from "react";
import "./AnnouncementBar.css";

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        // scrolling down
        setVisible(false);
      } else {
        // scrolling up
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`announcement-bar ${visible ? "show" : "hide"}`}>
      <div className="scrolling-text">
        🚚 Free Shipping on Orders Above ₹499 — Eat Healthy, Live Better with MIO 🌾
      </div>
    </div>
  );
};

export default AnnouncementBar;
