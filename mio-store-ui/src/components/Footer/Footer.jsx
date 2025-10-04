import React from 'react';
import './Footer.css'; // optional if you want separate CSS

const Footer = () => (
  <footer className="container">
    <div className="footer">
      <div>
        <div className="addr">
          <strong>Siddha Development Research and Consultancy Pvt. Ltd</strong><br />
          Plot No-273/2983, Khata No-238/2219,<br />
          Bijipur, Khordha, Odisha-752054
        </div>
        <div className="contact">
          <span className="badge">mio@sdrc.co.in</span>
          <span className="badge">+91 9938182723</span>
          <span className="badge shop">
            Shop Online: 
            <a href="https://themiostore.com" target="_blank" rel="noopener noreferrer">
              themiostore.com
            </a>
          </span>
        </div>

        <div className="social-links">
          <a href="https://www.facebook.com/mioodisha" target="_blank" aria-label="Facebook" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-2.9h2v-2.2c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v2h2.2l-.3 2.9h-1.9v7A10 10 0 0 0 22 12"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/mio.odisha/" target="_blank" aria-label="Instagram" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#E4405F">
              <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.8-2.9a1.2 1.2 0 100 2.3 1.2 1.2 0 000-2.3z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@mio.odisha" target="_blank" aria-label="YouTube" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.8-1.6-.8-2-0.9C17.6 2.5 12 2.5 12 2.5h0s-5.6 0-8.7.5c-.5.1-1.2.1-2 .9C.7 4.6.5 6.2.5 6.2S0 8.1 0 10v3.9c0 1.9.5 3.8.5 3.8s.2 1.6.8 2.3c.8.8 1.9.8 2.4.9 1.8.2 7.3.5 8.3.5s6.5 0 8.3-.5c.5-.1 1.6-.1 2.4-.9.6-.7.8-2.3.8-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.5 14.8V8.9l6.3 2.9-6.3 3z"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-brand">
        <img src="/images/mio-logo.png" alt="MiO logo" style={{ height: "54px" }} />
      </div>
    </div>
  </footer>
);

export default Footer;
