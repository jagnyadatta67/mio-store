import React from "react";
import "./WhyMillets.css";

const WhyMillets = () => {
  return (
    <section className="why-section container">
      {/* 🌾 WHY MILLETS */}
      <div className="why-container">
        <div className="why-image">
          <img src="/images/why-millets.png" alt="Healthy Millets" />
        </div>

        <div className="why-content">
          <h2>Why Choose Millets?</h2>
          <ul className="why-list">
            <li>🌱 <strong>Rich in Nutrients</strong> — Packed with protein, fiber, and essential minerals.</li>
            <li>💪 <strong>Boosts Immunity</strong> — Strengthens the body’s natural defense system.</li>
            <li>🔥 <strong>Supports Weight Management</strong> — Keeps you full longer with fewer calories.</li>
            <li>💚 <strong>Good for Heart</strong> — Lowers bad cholesterol and improves digestion.</li>
            <li>🌍 <strong>Eco-Friendly Crop</strong> — Requires less water and grows sustainably.</li>
          </ul>
        </div>
      </div>

      {/* 💫 WHY MIO */}
      <div className="why-mio">
        <h2>Why MIO?</h2>
        <p className="why-mio-desc">
          At <strong>MIO</strong>, we believe in reviving traditional grains with modern quality standards.
          Our millets are sourced directly from trusted farmers, cleaned, processed hygienically,
          and packed with love to ensure you get pure, unadulterated nutrition in every bite.
        </p>

        <div className="why-mio-points">
          <div className="mio-point">✅ 100% Natural Ingredients</div>
          <div className="mio-point">🌾 Farm-to-Table Freshness</div>
          <div className="mio-point">🔬 Lab-Tested Purity</div>
          <div className="mio-point">📦 Eco-Friendly Packaging</div>
          <div className="mio-point">❤️ Loved by Thousands of Families</div>
        </div>
      </div>
    </section>
  );
};

export default WhyMillets;
