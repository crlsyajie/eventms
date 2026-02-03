
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/users/login/", { username, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Keep spinner visible while navigating
      setTimeout(() => {
        if (res.data.user.is_admin) {
          navigate("/dashboard");
        } else if (res.data.user.is_client) {
          navigate("/client-dashboard");
        } else {
          navigate("/events");
        }
      }, 800);
    } catch (err) {
      setLoading(false);
      setError("Invalid username or password");
    }
  };

  // Loading overlay with glowing logo
  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Loading" className="loading-logo" />
        <p className="loading-text">Logging in...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", background: "rgba(255,255,255,0.95)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", padding: 40, border: "1px solid #6b8cae" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 80, marginBottom: 16 }} onError={(e)=>e.target.style.display='none'} />
        <h2 style={{ margin: 0, color: "#1a2744" }}>Login</h2>
      </div>
      {error && <div style={{ color: "#dc2626", marginBottom: 16, textAlign: "center" }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Username</label>
        <input
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 16, fontSize: 16, boxSizing: "border-box" }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label style={{ color: "#2a3f5f", fontWeight: 500, marginBottom: 8, display: "block" }}>Password</label>
        <input
          type="password"
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "1px solid #6b8cae", marginBottom: 24, fontSize: 16, boxSizing: "border-box" }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#1a2744", border: 0, borderRadius: 6, padding: 14, fontSize: 18, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(245,158,11,0.4)" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: 24, textAlign: "center", color: "#6b8cae" }}>
        Don't have an account? <Link to="/register" style={{ color: "#f59e0b", fontWeight: 600 }}>Register</Link>
      </p>
    </div>
  );
}

export default Login;
