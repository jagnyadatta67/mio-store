import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
  const [step, setStep] = useState("send");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const isValidIndianMobile = (input) => {
    // Matches 10-digit numbers starting with 6–9
    return /^[6-9]\d{9}$/.test(input);
  };

  const isValidEmail = (input) => {
    // Simple but solid email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const validateIdentifier = () => {
    if (!identifier.trim()) {
      setError("Please enter your mobile number or email.");
      return false;
    }
    if (!isValidIndianMobile(identifier) && !isValidEmail(identifier)) {
      setError("Please enter a valid Indian mobile number or email.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateIdentifier()) return;

    setLoading(true);
    try {
      const response = await sendOtp(identifier);
      if (response.status === 200 && response.data) {
        setStep("verify");
      } else {
        setError("Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      setError("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(identifier, otp);
      const token = response?.data?.token;
      if (token) {
        login({ identifier }, token);
        alert(response?.data?.message || "Login successful!");
        onClose();
      } else {
        setError("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      setError("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="login-modal-container">
        <button className="close-btn" onClick={onClose}>✖</button>

        {/* 🥣 Header Section */}
        <div className="modal-header">
          <img src="/images/mio-logo.png" alt="MIO Logo" className="mio-logo" />
          <h2>Made with Love & Millets ❤️</h2>
          <p>Zero Junk. Pure Nutrition. For You & Your Family.</p>
        </div>

        {/* 📱 Form Section */}
        <div className="login-box">
          {step === "send" ? (
            <>
              <h3>Get 10% off on your first purchase!</h3>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="text"
                  placeholder="Enter Mobile Number or Email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.trim())}
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <label className="notify-checkbox">
                <input type="checkbox" /> Notify me for offers & updates
              </label>

              <button
                onClick={handleSendOtp}
                disabled={loading || !identifier}
                className="submit-btn"
              >
                {loading ? "Sending..." : "Login / Signup"}
              </button>
            </>
          ) : (
            <>
              <h3>Verify OTP</h3>
              <p>We’ve sent an OTP to <strong>{identifier}</strong></p>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
              />

              {error && <p className="error-text">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className="submit-btn"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
