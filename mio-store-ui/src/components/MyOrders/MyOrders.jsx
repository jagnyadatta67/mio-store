import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <p className="loading">Loading your orders...</p>;

  if (orders.length === 0)
    return (
      <div className="no-orders container">
        <h2>No orders yet 🛒</h2>
        <p>Start shopping to see your past orders here!</p>
      </div>
    );

  return (
    <div className="orders-container container">
      <h1>🧾 My Orders</h1>

      {orders.map((order) => (
        <div key={order.orderNumber} className="order-card">
          <div className="order-header">
            <span>Order ID: <strong>{order.orderNumber}</strong></span>
            <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </span>
          </div>

          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>

          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-mini">
                <img src={item.imageUrl} alt={item.productName} />
                <div>
                  <p>{item.productName}</p>
                  <p>
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
