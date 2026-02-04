import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users/register/", {
        username,
        email,
        password,
        is_client: isClient
      });
      // Keep spinner visible while navigating
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.username?.[0] || "Registration failed");
    }
  };

  // Loading overlay with spinner
  if (loading) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: 60,
          height: 60,
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: 24
        }} />
        <p style={{ color: '#fff', fontSize: 20, fontWeight: 500 }}>Creating your account...</p>
        <p style={{ color: '#a8c5db', fontSize: 14, marginTop: 8 }}>Redirecting to login...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", background: "rgba(255,255,255,0.95)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", padding: 40, border: "1px solid #6b8cae" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 80, marginBottom: 16 }} onError={(e)=>e.target.style.display='none'} />
        <h2 style={{ margin: 0, color: "#1a2744" }}>Register</h2>
      </div>
      {error && <div style={{ color: "#dc2626", marginBottom: 16, textAlign: "center" }}>{error}</div>}
      <form onSubmit={handleRegister}>
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Username</label>
        <input
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16, boxSizing: "border-box" }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Email</label>
        <input
          type="email"
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16, boxSizing: "border-box" }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Password</label>
        <input
          type="password"
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16, boxSizing: "border-box" }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label style={{ display: "flex", alignItems: "center", marginBottom: 24, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isClient}
            onChange={(e) => setIsClient(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          <span style={{ color: "#2a3f5f" }}>Register as Client/Company (can submit events)</span>
        </label>
        <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#1a2744", border: 0, borderRadius: 6, padding: 14, fontSize: 18, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245,158,11,0.4)" }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: 24, textAlign: "center", color: "#6b8cae" }}>
        Already have an account? <Link to="/login" style={{ color: "#f59e0b", fontWeight: 600 }}>Login</Link>
      </p>
      <p style={{ marginTop: 12, textAlign: "center" }}>
        <Link to="/" style={{ color: "#a8c5db", fontSize: "0.9rem", textDecoration: "none" }}>Back to Home</Link>
      </p>
    </div>
  );
}

export default Register;
