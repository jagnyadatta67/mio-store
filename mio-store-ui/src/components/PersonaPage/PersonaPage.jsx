import React, { useState, useEffect, useContext } from "react";
import "./PersonaPage.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const PersonaPage = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    ageGroup: "",
    gender: "",
    location: "",
    dietType: "",
    prefersOrganic: false,
    healthGoals: [],
    restrictions: [],
    activityLevel: "",
    shoppingFrequency: "",
    interests: [],
    buyingPriority: "",
    feedback: "",
  });
  const [profile, setProfile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch profile if already exists
  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setFormData(res.data);
          setProfile(res.data);
          setSubmitted(true);
        }
      } catch (err) {
        console.log("No profile found yet — first time user.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // ✅ Handle input & checkbox changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const current = prev[name];
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // ✅ Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to continue.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProfile(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("❌ Failed to save profile:", err);
      alert("Failed to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="persona-container">
        <p>Loading your wellness profile... 🌿</p>
      </div>
    );

  return (
    <div className="persona-container">
      <h1>🌾 Your Wellness Profile</h1>
      <p className="subtitle">Tell us about your lifestyle to get personalized health and food recommendations.</p>

      {!submitted ? (
        <form className="persona-form" onSubmit={handleSubmit}>
          {/* 👤 Basic Info */}
          <section>
            <h2>👤 About You</h2>
            <div className="form-grid">
              <input
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
              <select name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
                <option value="">Age Group</option>
                <option>18–25</option>
                <option>26–35</option>
                <option>36–45</option>
                <option>46–60</option>
                <option>60+</option>
              </select>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Gender (optional)</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                name="location"
                placeholder="City or Region"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* 🍽️ Food Preferences */}
          <section>
            <h2>🍽️ Food Preferences</h2>
            <select name="dietType" value={formData.dietType} onChange={handleChange}>
              <option value="">Diet Type</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
              <option>Eggetarian</option>
            </select>

            <label className="checkbox">
              <input
                type="checkbox"
                name="prefersOrganic"
                checked={formData.prefersOrganic}
                onChange={handleChange}
              />
              I prefer organic-only products
            </label>
          </section>

          {/* ⚕️ Health Goals */}
          <section>
            <h2>⚕️ Health Goals</h2>
            <div className="options-grid">
              {["Weight Loss", "Better Digestion", "More Energy", "Balanced Nutrition", "Diabetes Management", "Skin & Hair Health"].map(
                (goal) => (
                  <button
                    type="button"
                    key={goal}
                    className={formData.healthGoals.includes(goal) ? "selected" : ""}
                    onClick={() => handleMultiSelect("healthGoals", goal)}
                  >
                    {goal}
                  </button>
                )
              )}
            </div>
          </section>

          {/* 🏃 Lifestyle */}
          <section>
            <h2>🏃 Lifestyle</h2>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
              <option value="">Select activity level</option>
              <option>Sedentary (desk job)</option>
              <option>Moderate (walks / yoga)</option>
              <option>Active (gym / sports)</option>
            </select>
          </section>

          {/* 🛒 Shopping Preferences */}
          <section>
            <h2>🛒 Shopping Preferences</h2>
            <label>How often do you shop for healthy groceries?</label>
            <select name="shoppingFrequency" value={formData.shoppingFrequency} onChange={handleChange}>
              <option value="">Select frequency</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>

            <label>Product Interests</label>
            <div className="options-grid">
              {["Millets & Grains", "Organic Snacks", "Cold-Pressed Oils", "Herbal Powders", "Health Drinks", "Ayurvedic Products"].map(
                (interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={formData.interests.includes(interest) ? "selected" : ""}
                    onClick={() => handleMultiSelect("interests", interest)}
                  >
                    {interest}
                  </button>
                )
              )}
            </div>

            <label>What matters most to you?</label>
            <select name="buyingPriority" value={formData.buyingPriority} onChange={handleChange}>
              <option value="">Select</option>
              <option>Quality / Organic Certification</option>
              <option>Local Sourcing</option>
              <option>Price & Offers</option>
              <option>Brand Reputation</option>
            </select>
          </section>

          {/* 💬 Feedback */}
          <section>
            <h2>💬 Anything Else?</h2>
            <textarea
              name="feedback"
              placeholder="Share your thoughts..."
              value={formData.feedback}
              onChange={handleChange}
            />
          </section>

          <button type="submit" className="btn-submit">
            Save My Profile 💚
          </button>
        </form>
      ) : (
        <div className="summary-card">
          <h2>🎉 Hi {profile?.name || "there"}!</h2>
          <p>
            You are a <strong>{profile?.personaType || "Balanced Explorer 🌿"}</strong>.
          </p>
          <p>
            You focus on <strong>{profile?.healthGoals?.join(", ") || "healthy eating"}</strong> and love{" "}
            <strong>{profile?.interests?.join(", ") || "organic products"}</strong>.
          </p>
          <p>
            Expect our best recommendations tailored for your{" "}
            <strong>{profile?.dietType || "diet"}</strong> lifestyle.
          </p>

          <button className="btn-refresh" onClick={() => setSubmitted(false)}>
            ✏️ Edit My Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonaPage;
