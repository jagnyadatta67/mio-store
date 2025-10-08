import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./MyAddresses.css";

const MyAddresses = () => {
  const { token } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // ✅ Fetch all addresses
  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load addresses");
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/address/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle save address
  const handleSaveAddress = async () => {
    if (!token) return alert("Please log in first");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add address");
      await fetchAddresses(); // Refresh list
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

  return (
    <div className="address-book">
      <h1>🏠 My Address Book</h1>

      {/* Add New Address Button */}
      <button className="add-address-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "➕ Add New Address"}
      </button>

      {/* Address Form */}
      {showForm && (
        <div className="address-form">
          <h3>Add Address</h3>
          <div className="form-grid">
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <input
              name="addressLine1"
              placeholder="Address Line 1"
              value={formData.addressLine1}
              onChange={handleChange}
            />
            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.addressLine2}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
            />
            <label className="checkbox">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />{" "}
              Set as Default
            </label>
          </div>

          <button
            className="save-address-btn"
            onClick={handleSaveAddress}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <p>No saved addresses yet.</p>
      ) : (
        <div className="address-grid">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <p>
                <strong>{addr.fullName}</strong>
              </p>
              <p>
                {addr.addressLine1}, {addr.addressLine2}
              </p>
              <p>
                {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <p>📞 {addr.phoneNumber}</p>
              <p>{addr.country}</p>
              {addr.isDefault && (
                <span className="default-badge">Default</span>
              )}
              <button
                className="delete-btn"
                onClick={() => handleDelete(addr.id)}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddresses;
