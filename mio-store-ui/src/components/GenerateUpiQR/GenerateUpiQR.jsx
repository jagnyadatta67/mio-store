import React, { useState } from "react";
import "./GenerateUpiQR.css";

const GenerateUpiQR = () => {
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!orderId || !amount) {
      setError("Please enter both Order ID and Amount.");
      return;
    }

    setError("");
    setQrDataUrl(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/payments/upi-qr?amount=${amount}&orderId=${orderId}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to generate QR");
      const data = await res.json();
      setQrDataUrl(data.qrDataUrl);
    } catch (err) {
      setError("Error generating QR. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOrderId("");
    setAmount("");
    setQrDataUrl(null);
    setError("");
  };

  return (
    <div className="qr-generator-container">
      <h2>🧾 Generate UPI QR Code</h2>
      <p className="desc">
        Enter the <strong>Order ID</strong> and <strong>Amount</strong> to
        generate a UPI payment QR (for internal or customer COD use).
      </p>

      <div className="input-group">
        <label>Order ID</label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="e.g. ORD1234"
        />
      </div>

      <div className="input-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 299.00"
        />
      </div>

      <div className="actions">
        <button className="btn generate" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate QR"}
        </button>
        <button className="btn reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {qrDataUrl && (
        <div className="qr-display">
          <img src={qrDataUrl} alt="UPI QR" className="qr-image" />
          <p className="qr-note">
            Scan this QR to pay ₹{amount} for Order #{orderId}.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateUpiQR;
