// src/components/Carousel.jsx
import React, { useEffect, useRef, useState } from 'react';
import './Carousel.css'; // optional, copy your carousel styles here

const images = [
  { src: '/images/1.jpeg', alt: 'Foxtail Millet pack' },
  { src: '/images/2.jpeg', alt: 'Featured Millet pack' },
];

const Carousel = () => {
  const trackRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1 >= images.length ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  // auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container" aria-label="Featured MiO Millets">
      <div className="carousel">
        <div
          className="carousel-track"
          ref={trackRef}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div className="carousel-slide" key={idx}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button className="carousel-btn prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="carousel-btn next" onClick={nextSlide}>
          &#10095;
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={currentSlide === idx ? 'active' : ''}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
