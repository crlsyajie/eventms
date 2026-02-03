import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function ClientSubmitEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || '{}');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/events/", {
        title,
        description,
        date,
        location,
        is_paid: isPaid,
        price: isPaid ? parseFloat(price) : 0,
        status: 'pending',
        submitted_by: user.id
      });
      setSuccess(true);
      setTimeout(() => navigate("/client-dashboard"), 1500);
    } catch (err) {
      console.error('Submission error:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.detail || JSON.stringify(err.response?.data) || "Submission failed");
      setLoading(false);
    }
  };

  if (!user.is_client) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: 36, textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 16 }}>Access Denied</h2>
        <p style={{ color: '#2a3f5f' }}>You must be registered as a Client/Company to submit events.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: 36, border: "1px solid #6b8cae" }}>
      <h2 style={{ textAlign: "center", color: "#1a2744", marginBottom: 24 }}>Submit New Event</h2>
      {success && <div style={{ color: "#16a34a", marginBottom: 16, textAlign: "center" }}>Event submitted for review!</div>}
      {error && <div style={{ color: "#dc2626", marginBottom: 16, textAlign: "center" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Title</label>
        <input style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16 }} value={title} onChange={e => setTitle(e.target.value)} required />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Description</label>
        <textarea style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16 }} value={description} onChange={e => setDescription(e.target.value)} required />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Date & Time</label>
        <input type="datetime-local" style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16 }} value={date} onChange={e => setDate(e.target.value)} required />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Location</label>
        <input style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16, boxSizing: "border-box" }} value={location} onChange={e => setLocation(e.target.value)} required />
        
        {/* Paid Event Toggle */}
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPaid ? 12 : 0 }}>
            <span style={{ color: '#2a3f5f', fontWeight: 500 }}>💰 Paid Event</span>
            <label style={{ 
              position: 'relative', 
              display: 'inline-block', 
              width: 50, 
              height: 26,
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: isPaid ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#cbd5e1',
                borderRadius: 26,
                transition: 'all 0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  height: 20,
                  width: 20,
                  left: isPaid ? 26 : 3,
                  bottom: 3,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </span>
            </label>
          </div>
          {isPaid && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6b8cae', fontSize: 20 }}>$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: 10, 
                  borderRadius: 6, 
                  border: '1px solid #6b8cae', 
                  fontSize: 16,
                  boxSizing: 'border-box'
                }}
                required={isPaid}
              />
            </div>
          )}
        </div>
        
        <button type="submit" disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#1a2744", border: 0, borderRadius: 6, padding: 14, fontSize: 18, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: "0 4px 12px rgba(245,158,11,0.2)", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting..." : "Submit Event"}
        </button>
      </form>
    </div>
  );
}

export default ClientSubmitEvent;
