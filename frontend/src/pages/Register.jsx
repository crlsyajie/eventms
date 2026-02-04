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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
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
        <p style={{ color: '#cbd5e1', marginTop: 16, fontSize: 18, fontWeight: 600 }}>Creating account...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
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
        maxWidth: 480,
        width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 20,
        padding: 48,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
            <img src="/sparkle.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> CREATE ACCOUNT
          </div>
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 8,
            letterSpacing: '0.02em'
          }}>
            Join LEON
          </h1>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1rem'
          }}>
            Create your account to get started
          </p>
        </div>

        {error && (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            color: '#ef4444',
            marginBottom: 24,
            fontSize: '0.95rem',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
        <div style={{ marginBottom: 20 }}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        
        <div style={{ marginBottom: 20 }}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            marginBottom: 8,
            color: '#e5e7eb',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        
        <div style={{ marginBottom: 32 }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            color: '#e5e7eb',
            fontSize: '0.95rem'
          }}>
            <input
              type="checkbox"
              checked={isClient}
              onChange={(e) => setIsClient(e.target.checked)}
              style={{
                width: 18,
                height: 18,
                accentColor: '#f59e0b'
              }}
            />
            Register as Client (Event Organizer)
          </label>
        </div>
        
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#1e293b',
            border: 'none',
            borderRadius: 12,
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(245,158,11,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 15px 35px rgba(245,158,11,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(245,158,11,0.3)';
          }}
        >
          Create Account
        </button>
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: 24, 
        paddingTop: 24, 
        borderTop: '1px solid rgba(148,163,184,0.1)' 
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
          Already have an account?{" "}
          <Link 
            to="/login" 
            style={{ 
              color: '#f59e0b', 
              textDecoration: 'none', 
              fontWeight: 600,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#d97706'}
            onMouseLeave={(e) => e.target.style.color = '#f59e0b'}
          >
            Sign In
          </Link>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 12, margin: '12px 0 0 0' }}>
          <Link 
            to="/" 
            style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.target.style.color = '#cbd5e1'}
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            ← Back to Home
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}

export default Register;
