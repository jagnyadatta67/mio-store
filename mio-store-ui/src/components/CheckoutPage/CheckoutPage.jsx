import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./CheckoutPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const { cartItems = [], subtotal = 0, total = 0 } = location.state || {};
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });
  const [step, setStep] = useState("address");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = "http://localhost:8080/api/address";
  const paymentApi = "http://localhost:8080/api/payments/upi-qr";

  // ✅ Fetch addresses on load
  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(baseUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data);

      const defaultAddr = data.find((addr) => addr.default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // ✅ Add new address
  const handleSaveAddress = async () => {
    if (!token) return alert("Please log in first");
    setLoading(true);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add address");
      await fetchAddresses();
      setShowForm(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Error adding address");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Proceed to payment
  const handleProceedToPayment = async () => {
    if (!selectedAddressId) return alert("Please select a shipping address");
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

    try {
      const res = await fetch("http://localhost:8080/api/cart/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedAddress),
      });
      if (!res.ok) throw new Error("Failed to attach address");
      setStep("payment");
    } catch (err) {
      console.error("Attach address failed:", err);
    }
  };

  // ✅ Handle payment
  const handlePaymentSelection = async (method) => {
    setPaymentMethod(method);
    if (method === "UPI") {
      try {
        const orderId = "ORD" + Date.now();
        const res = await fetch(`${paymentApi}?amount=${total}&orderId=${orderId}`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to generate QR");
        const data = await res.json();
        setQrDataUrl(data.qrDataUrl);
      } catch (err) {
        console.error("QR Error:", err);
      }
    } else setQrDataUrl(null);
  };

  const handleConfirmOrder = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/confirm?paymentMethod=${paymentMethod}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to confirm order");
      const data = await res.json();
      navigate("/order-success", { state: { orderData: data } });
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("Order failed. Try again.");
    }
  };

  if (!token) {
    return <div className="checkout-login-required">Please log in to continue checkout 🔒</div>;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* 🧾 Order Summary */}
      <div className="order-summary">
        <h3>🛍️ Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.sku} className="order-item">
            <span>{item.productName} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <p>Subtotal: ₹{subtotal}</p>
        <p>Delivery: ₹40</p>
        <h4>Total: ₹{total}</h4>
      </div>

      {/* 📦 Shipping Address */}
      {step === "address" && (
        <div className="address-section">
          <h2>📦 Shipping Address</h2>
          {addresses.length > 0 ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div>
                    <p><strong>{addr.fullName}</strong> — {addr.phoneNumber}</p>
                    <p>{addr.addressLine1}, {addr.addressLine2}</p>
                    <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                    <p>{addr.country}</p>
                    {addr.default && <span className="default-badge">Default</span>}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p>No saved addresses yet.</p>
          )}

          <button className="btn add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "➕ Add New Address"}
          </button>

          {showForm && (
            <div className="address-form">
              <h3>Add Address</h3>
              <div className="form-grid">
                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                <input name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                <input name="addressLine2" placeholder="Address Line 2" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                <input name="city" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                <input name="state" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                <label className="checkbox">
                  <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} /> Set as default
                </label>
              </div>

              <button className="btn save-btn" onClick={handleSaveAddress} disabled={loading}>
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          )}

          <button className="btn proceed-btn" onClick={handleProceedToPayment} disabled={!selectedAddressId}>
            Proceed to Payment 💳
          </button>
        </div>
      )}

      {/* 💳 Payment Section */}
      {step === "payment" && (
        <div className="payment-section">
          <h2>💰 Choose Payment Method</h2>
          <div className="payment-options">
            <div
              className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}
              onClick={() => handlePaymentSelection("COD")}
            >
              <div className="payment-left">
                <img src="/images/cod.png" alt="Cash on Delivery" className="payment-icon" />
                <span>Cash on Delivery</span>
              </div>
              <input type="radio" name="payment" checked={paymentMethod === "COD"} onChange={() => handlePaymentSelection("COD")} />
            </div>

            <div
              className={`payment-card ${paymentMethod === "UPI" ? "selected" : ""}`}
              onClick={() => handlePaymentSelection("UPI")}
            >
              <div className="payment-left">
                <img src="/images/upi.png" alt="UPI" className="payment-icon" />
                <span>Pay via UPI</span>
              </div>
              <input type="radio" name="payment" checked={paymentMethod === "UPI"} onChange={() => handlePaymentSelection("UPI")} />
            </div>
          </div>

          {paymentMethod === "UPI" && (
            <div className="upi-section">
              <h3>Scan this QR to Pay</h3>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="UPI QR" className="qr-image" />
              ) : (
                <p>Generating QR Code...</p>
              )}
              <div className="upi-note">
                <strong>📸 Important:</strong>
                <p>After paying, share a screenshot on WhatsApp or support to confirm your order.</p>
              </div>
            </div>
          )}

          {paymentMethod && (
            <button className="btn confirm-btn" onClick={handleConfirmOrder} disabled={loading}>
              {loading ? "Processing..." : "Confirm Order ✅"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
