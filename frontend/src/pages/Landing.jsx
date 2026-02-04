import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  const container = { maxWidth: 1100, margin: "0 auto", padding: "0 20px" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e5e7eb" }}>
      
      {/* HERO */}
      <section style={{ padding: "120px 0 100px", textAlign: "center", position: "relative" }}>
        <div style={container}>

          {/* Soft Glow */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, rgba(245,158,11,0.12), transparent 65%)",
            pointerEvents: "none"
          }} />

          {/* Logo */}
          <img
          src="/logo.png"
          alt="Leon"
          style={{
          height: 150, // ⬅️ was 120
          marginBottom: 28, // slight spacing compensation
          filter: "drop-shadow(0 12px 45px rgba(245,158,11,0.38))",
          animation: "glowFloat 6s ease-in-out infinite",
          position: "relative",
          zIndex: 1
          }}
          onError={(e) => (e.target.style.display = "none")}
          />
          
          {/* Title */}
          <h1 style={{
            fontSize: "3.8rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
            color: "#ffffff",
            textTransform: "uppercase",
            textShadow: "0 0 40px rgba(245,158,11,0.35)"
          }}>
            LEON
          </h1>

          {/* Tagline */}
          <p style={{
            color: "#f59e0b",
            fontSize: "1.3rem",
            fontWeight: 600,
            marginBottom: 28,
            letterSpacing: "0.05em"
          }}>
            Command Every Crowd
          </p>

          {/* Divider */}
          <div style={{
            width: 90,
            height: 3,
            margin: "0 auto 36px",
            background: "linear-gradient(to right, transparent, #f59e0b, transparent)"
          }} />

          {/* Description */}
          <p style={{
            maxWidth: 760,
            margin: "0 auto 48px",
            fontSize: "1.05rem",
            lineHeight: 1.9,
            color: "#cbd5f5"
          }}>
            Leon is a comprehensive event management platform designed for organizers,
            attendees, and administrators. Built on discipline, clarity, and trust,
            it provides a centralized system to submit, manage, and attend events
            with confidence.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <Link to="/login" style={primaryBtn}>Login</Link>
            <Link to="/register" style={secondaryBtn}>Register</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "100px 0", background: "rgba(255,255,255,0.02)" }}>
        <div style={container}>
          <h2 style={sectionTitle}>Platform Features</h2>
          <div style={sectionLine} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
            {features.map((f, i) => (
              <div key={i} style={featureCard}>
                <h3 style={featureTitle}>{f.title}</h3>
                <p style={featureText}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid rgba(148,163,184,0.2)" }}>
        <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
          <strong style={{ color: "#f59e0b" }}>LEON</strong> — Strength, Reliability, Leadership
        </p>
        <p style={{ fontSize: "0.8rem", marginTop: 6, color: "#64748b" }}>
          © 2026 Leon Event Management System
        </p>
      </footer>

      {/* Animation */}
      <style>{`
        @keyframes glowFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

/* Reusable Styles */
const primaryBtn = {
  padding: "14px 42px",
  background: "linear-gradient(135deg,#f59e0b,#d97706)",
  color: "#1e293b",
  borderRadius: 6,
  fontWeight: 700,
  textDecoration: "none",
  letterSpacing: "0.04em",
  boxShadow: "0 10px 30px rgba(245,158,11,0.35)",
  transition: "transform .3s"
};

const secondaryBtn = {
  padding: "14px 42px",
  border: "1px solid rgba(203,213,225,0.4)",
  color: "#e5e7eb",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: 600
};

const sectionTitle = {
  textAlign: "center",
  fontSize: "2.4rem",
  fontWeight: 700,
  marginBottom: 12,
  color: "#ffffff",
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};

const sectionLine = {
  width: 70,
  height: 3,
  background: "#f59e0b",
  margin: "0 auto 48px"
};

const featureCard = {
  padding: 32,
  borderRadius: 8,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.15)"
};

const featureTitle = {
  color: "#f59e0b",
  fontSize: "1.25rem",
  fontWeight: 700,
  marginBottom: 12
};

const featureText = {
  color: "#cbd5f5",
  lineHeight: 1.8,
  fontSize: "1rem"
};

const features = [
  {
    title: "For Organizers",
    text: "Submit, manage, and control events with precision. Pricing, approvals, and registrations handled seamlessly."
  },
  {
    title: "For Attendees",
    text: "Browse events, purchase tickets securely, and receive instant confirmations."
  },
  {
    title: "For Administrators",
    text: "Maintain full oversight with powerful tools for moderation, approval, and system-wide control."
  }
];

export default Landing;
