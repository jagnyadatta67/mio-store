import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./CheckoutPage.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const { cartItems = [], subtotal = 0, total = 0 } = location.state || {};
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [cartCleared, setCartCleared] = useState(false); // ✅ NEW — track cart clear

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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("address");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);

  const baseUrl = "http://localhost:8080/api/address";
  const paymentApi = "http://localhost:8080/api/payments/upi-qr";

  // ✅ Fetch addresses
  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(baseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");

      const data = await res.json();
      setAddresses(data);

      // ✅ Auto-select default address if available
      const defaultAddr = data.find((addr) => addr.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // ✅ Address form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Save new address
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

  // ✅ Proceed to payment (attach address to cart)
  const handleProceedToPayment = async () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address");
      return;
    }

    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );

    try {
      const res = await fetch("http://localhost:8080/api/cart/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedAddress),
      });

      if (!res.ok) throw new Error("Failed to link address to cart");
      console.log("✅ Address attached to cart successfully");
      setStep("payment");
    } catch (err) {
      console.error("Error linking address:", err);
      alert("Could not attach address. Please try again.");
    }
  };

  // ✅ Handle payment selection
  const handlePaymentSelection = async (method) => {
    setPaymentMethod(method);
    if (method === "UPI") {
      try {
        const amount = total;
        const orderId = "ORD" + Date.now();
        const res = await fetch(
          `${paymentApi}?amount=${amount}&orderId=${orderId}`,
          { method: "POST" }
        );

        if (!res.ok) throw new Error("Failed to generate QR");
        const data = await res.json();
        setQrDataUrl(data.qrDataUrl);
      } catch (err) {
        console.error(err);
        alert("Could not generate UPI QR code");
      }
    } else {
      setQrDataUrl(null);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/confirm?paymentMethod=${paymentMethod}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!res.ok) throw new Error("Failed to confirm order");
      const data = await res.json();
  
      // ✅ Clear local state
      setOrderData(null);
      setCartCleared(true);
  
      // ✅ Redirect to success page with order details
      navigate("/order-success", { state: { orderData: data } });
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="checkout-login-required">
        <h2>Please log in to continue checkout 🔒</h2>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* 🛍️ Order Summary (hidden after confirmation) */}
      {!cartCleared && (
        <div className="order-summary">
          <h3>🛒 Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.sku} className="order-item">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr />
          <p>Subtotal: ₹{subtotal}</p>
          <p>Delivery: ₹40</p>
          <h4>Total: ₹{total}</h4>
        </div>
      )}

      {/* Step 1️⃣ - Address Section */}
      {step === "address" && (
        <div className="address-section">
          <h2>📦 Shipping Address</h2>
          {addresses.length > 0 ? (
            <div className="address-list">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`address-card ${
                    selectedAddressId === addr.id ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className="address-info">
                    <p>
                      <strong>{addr.fullName}</strong> — {addr.phoneNumber}
                    </p>
                    <p>
                      {addr.addressLine1}, {addr.addressLine2}
                    </p>
                    <p>
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
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
                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                <input name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} />
                <input name="addressLine2" placeholder="Address Line 2" value={formData.addressLine2} onChange={handleChange} />
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
                <label className="checkbox">
                  <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} /> Set as default
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

      {/* Step 2️⃣ - Payment Section */}
      {step === "payment" && (
        <div className="payment-section">
          <h2>💰 Choose Payment Method</h2>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" value="COD" onChange={(e) => handlePaymentSelection(e.target.value)} />
              Cash on Delivery
            </label>
            <label>
              <input type="radio" name="payment" value="UPI" onChange={(e) => handlePaymentSelection(e.target.value)} />
              Pay via UPI
            </label>
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
                <p>
                  You can place your order using UPI. Once payment is made, our
                  team will verify and confirm your order.
                </p>
                <p className="highlight-text">
                  Please share a <strong>screenshot</strong> of your UPI transaction confirmation on WhatsApp or support chat.
                </p>
              </div>
            </div>
          )}

          {paymentMethod && (
            <button className="btn confirm-btn" onClick={handleConfirmOrder}>
              Confirm Order ✅
            </button>
          )}
        </div>
      )}

      {/* Step 3️⃣ - Order Confirmation */}
      {step === "confirm" && orderData && (
        <div className="order-confirm">
          <h2>🎉 Thank you for your order!</h2>
          <p className="order-number">Order ID: <strong>{orderData.orderNumber}</strong></p>

          <div className="confirm-section">
            <h3>📦 Shipping Details</h3>
            <p><strong>{orderData.shippingAddress.fullName}</strong></p>
            <p>{orderData.shippingAddress.addressLine1}, {orderData.shippingAddress.addressLine2}</p>
            <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}</p>
            <p>{orderData.shippingAddress.country}</p>
            <p>📞 {orderData.shippingAddress.phoneNumber}</p>
          </div>

          <div className="confirm-section">
            <h3>🧾 Order Summary</h3>
            <p>Subtotal: ₹{orderData.subtotal}</p>
            <p>Delivery Fee: ₹{orderData.deliveryFee}</p>
            <p><strong>Total: ₹{orderData.totalAmount}</strong></p>
            <p>Payment Method: {orderData.paymentMethod}</p>
            <p>Status: <strong>{orderData.paymentStatus}</strong></p>
          </div>

          <div className="confirm-section">
            <h3>🛍️ Ordered Items</h3>
            {orderData.items.map((item, index) => (
              <div key={index} className="order-item-card">
                <img src={item.imageUrl} alt={item.productName} className="confirm-img" />
                <div>
                  <p><strong>{item.productName}</strong></p>
                  <p>Qty: {item.quantity} | Unit: {item.unitLabel}</p>
                  <p>₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="thankyou-footer">
            <p>📩 You’ll receive a confirmation email shortly.</p>
            <p>🙏 Thank you for shopping with <strong>MIO</strong>!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
