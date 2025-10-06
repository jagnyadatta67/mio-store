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
      console.log("Send OTP response:", response);
  
      if (response.status === 200 && response.data) {
        setStep("verify");
      } else {
        alert("Failed to send OTP. Try again.");
      }
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
      console.log("Verify OTP Response:", response);
  
      // ✅ Your backend wraps token inside response.data
      const token = response?.data?.token;
  
      if (token) {
        login({ phone: identifier }, token);
        alert(response?.data?.message || "Login successful!");
        onClose();
      } else {
        alert("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      alert("Error verifying OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="modal-backdrop">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{step === "send" ? "Login / Signup" : "Enter OTP"}</h2>

        {step === "send" ? (
          <>
            <input
              type="text"
              placeholder="Enter mobile or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <button onClick={handleSendOtp} disabled={loading || !identifier}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <p className="otp-instruction">We’ve sent an OTP to {identifier}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp} disabled={loading || !otp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
