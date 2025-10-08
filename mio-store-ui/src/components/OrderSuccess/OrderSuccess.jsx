import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    // If no order data, redirect to homepage
    navigate("/");
    return null;
  }

  return (
    <div className="order-success">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Order ID: <strong>{orderData.orderNumber}</strong></p>

      <h3>📦 Shipping Details</h3>
      <p><strong>{orderData.shippingAddress.fullName}</strong></p>
      <p>{orderData.shippingAddress.addressLine1}, {orderData.shippingAddress.city}</p>
      <p>{orderData.shippingAddress.state} - {orderData.shippingAddress.postalCode}</p>

      <h3>🧾 Payment</h3>
      <p>Method: {orderData.paymentMethod}</p>
      <p>Status: {orderData.paymentStatus}</p>

      <button className="btn" onClick={() => navigate("/")}>
        Back to Home 🏠
      </button>
    </div>
  );
};

export default OrderSuccess;
