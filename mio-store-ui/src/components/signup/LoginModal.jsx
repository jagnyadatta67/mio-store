import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../../api/authService";
import { useAuth } from "../../context/AuthContext";
import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
  const [step, setStep] = useState("send");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const response = await sendOtp(identifier);
      if (response.status === 200 && response.data) setStep("verify");
      else alert("Failed to send OTP. Try again.");
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert("Something went wrong while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await verifyOtp(identifier, otp);
      const token = response?.data?.token;
      if (token) {
        login({ phone: identifier }, token);
        alert(response?.data?.message || "Login successful!");
        onClose();
      } else alert("Invalid OTP, please try again.");
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert("Error verifying OTP. Please try again.");
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
                <span className="country-code">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <label className="notify-checkbox">
                <input type="checkbox" /> Notify me for offers & updates
              </label>
              <button
                onClick={handleSendOtp}
                disabled={loading || !identifier}
                className="submit-btn"
              >
                {loading ? "Sending..." : "Login/Signup"}
              </button>
            </>
          ) : (
            <>
              <h3>Verify OTP</h3>
              <p>We’ve sent an OTP to {identifier}</p>
              <input
                type="text"
                className="otp-input"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
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
