import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setFormData({
      username: storedUser.username,
      email: storedUser.email
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Mock update - in real app this would call the backend
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: 50,
          height: 50,
          border: '4px solid rgba(245,158,11,0.3)',
          borderTop: '4px solid #f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '80px 20px'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.1), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 70% 80%, rgba(59,130,246,0.08), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 30,
            marginBottom: 24,
            fontSize: '0.9rem',
            color: '#f59e0b',
            fontWeight: 600,
            letterSpacing: '0.05em'
          }}>
            {user.is_admin ? <><img src="/crown.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> ADMIN</> : user.is_client ? <><img src="/target.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> CLIENT</> : <><img src="/people.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> USER</>} PROFILE
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '0.02em'
          }}>
            My Profile
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: 500,
            margin: '0 auto'
          }}>
            Update your personal information and account settings
          </p>
        </div>

        {/* Profile Form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(148,163,184,0.2)',
          borderRadius: 20,
          padding: 40,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          {/* Messages */}
          {message && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 12,
              color: '#22c55e',
              marginBottom: 24,
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              ✓ {message}
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12,
              color: '#ef4444',
              marginBottom: 24,
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 24 }}>
              {/* Username */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#e5e7eb',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: 12,
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(245,158,11,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(148,163,184,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#e5e7eb',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    borderRadius: 12,
                    color: '#e5e7eb',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(245,158,11,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(148,163,184,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: 32,
                background: loading 
                  ? 'rgba(148,163,184,0.3)' 
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: loading ? '#94a3b8' : '#1e293b',
                border: 'none',
                borderRadius: 12,
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading 
                  ? 'none' 
                  : '0 10px 30px rgba(245,158,11,0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 35px rgba(245,158,11,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(245,158,11,0.3)';
                }
              }}
            >
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
