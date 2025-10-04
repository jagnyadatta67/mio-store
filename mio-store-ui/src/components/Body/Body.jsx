import React from "react";
import Header from "../Header/Header";
import Carousel from "../Carousel/Carousel";
import Footer from "../Footer/Footer";

const Body = () => {
  return (
    <div>
    
      <Carousel />
      <section className="container" id="shop">
      <h2 className="section-title">Our Products</h2>
      <div className="grid">
        <article className="card">
          <div className="card-img">
            <img src="/images/prod-foxtail.png" alt="Foxtail Millet" />
          </div>
          <div className="card-body">
            <div className="card-title">Foxtail Millet</div>
          </div>
        </article>
        <article className="card">
          <div className="card-img">
            <img src="/images/prod-little.png" alt="Little Millet" />
          </div>
          <div className="card-body">
            <div className="card-title">Little Millet</div>
          </div>
        </article>
        <article className="card">
          <div className="card-img">
            <img src="/images/prod-finger.png" alt="Finger Millet" />
          </div>
          <div className="card-body">
            <div className="card-title">Finger Millet</div>
          </div>
        </article>
      </div>
    </section>

    </div>
  );
};

export default Body;
