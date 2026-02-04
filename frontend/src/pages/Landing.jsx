import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  const container = { maxWidth: 1200, margin: "0 auto", padding: "0 20px" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#e5e7eb" }}>
      
      {/* HERO SECTION - Portfolio Style */}
      <section style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative",
        padding: "80px 0"
      }}>
        <div style={container}>
          {/* Animated Background Elements */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(245,158,11,0.15), transparent 50%)",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 70% 80%, rgba(59,130,246,0.1), transparent 50%)",
            pointerEvents: "none"
          }} />

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 60, 
            alignItems: "center",
            position: "relative",
            zIndex: 1
          }}>
            {/* Left Column - Hero Text */}
            <div>
              <div style={{
                display: "inline-block",
                padding: "8px 20px",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 30,
                marginBottom: 24,
                fontSize: "0.9rem",
                color: "#f59e0b",
                fontWeight: 600,
                letterSpacing: "0.05em"
              }}>
                <img src="/sparkle.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> EVENT MANAGEMENT PLATFORM
              </div>
              
              <h1 style={{
                fontSize: "4.5rem",
                fontWeight: 900,
                letterSpacing: "0.02em",
                marginBottom: 24,
                color: "#ffffff",
                lineHeight: 1.1,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}>
                Transform Your
                <br />
                <span style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Event Experience
                </span>
              </h1>

              <p style={{
                fontSize: "1.2rem",
                lineHeight: 1.8,
                color: "#cbd5e1",
                marginBottom: 36,
                maxWidth: 540
              }}>
                The ultimate platform for event organizers, attendees, and administrators. 
                Manage events with precision, security, and style.
              </p>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link to="/register" style={primaryBtn}>
                  Get Started →
                </Link>
                <Link to="/login" style={secondaryBtn}>
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div style={{
                display: "flex",
                gap: 40,
                marginTop: 48,
                paddingTop: 32,
                borderTop: "1px solid rgba(148,163,184,0.2)"
              }}>
                {[
                  { label: "Events Managed", value: "500+" },
                  { label: "Happy Users", value: "10K+" },
                  { label: "Success Rate", value: "99%" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: "#f59e0b",
                      marginBottom: 4
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: "0.9rem",
                      color: "#94a3b8"
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{
                position: "relative",
                width: "100%",
                maxWidth: 500
              }}>
                {/* Decorative Card Stack */}
                <div style={{
                  position: "relative",
                  background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: 24,
                  padding: 40,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                }}>
                  <img
                    src="/logo.png"
                    alt="Leon"
                    style={{
                      width: "100%",
                      height: "auto",
                      filter: "drop-shadow(0 12px 45px rgba(245,158,11,0.5))",
                      animation: "glowFloat 6s ease-in-out infinite"
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  
                  {/* Floating Elements */}
                  <div style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                    borderRadius: "50%",
                    opacity: 0.6,
                    animation: "float 4s ease-in-out infinite"
                  }} />
                  
                  <div style={{
                    position: "absolute",
                    bottom: -15,
                    left: -15,
                    width: 60,
                    height: 60,
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "50%",
                    opacity: 0.5,
                    animation: "float 5s ease-in-out infinite reverse"
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: "120px 0", background: "rgba(0,0,0,0.2)" }}>
        <div style={container}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: 16,
              color: "#ffffff",
              letterSpacing: "0.02em"
            }}>
              Everything You Need
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#94a3b8",
              maxWidth: 600,
              margin: "0 auto"
            }}>
              Powerful features designed for seamless event management
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                ...featureCard,
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(245,158,11,0.15)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
              }}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  fontSize: "2rem"
                }}>
                  <img src={f.icon} alt="" style={{ width: 32, height: 32 }} />
                </div>
                <h3 style={featureTitle}>{f.title}</h3>
                <p style={featureText}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ 
        padding: "120px 0",
        background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(59,130,246,0.1) 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={container}>
          <div style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "0 auto"
          }}>
            <h2 style={{
              fontSize: "3rem",
              fontWeight: 800,
              marginBottom: 24,
              color: "#ffffff"
            }}>
              Ready to Get Started?
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#cbd5e1",
              marginBottom: 40,
              lineHeight: 1.8
            }}>
              Join thousands of event organizers and attendees who trust LEON 
              for their event management needs.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <Link to="/register" style={{
                ...primaryBtn,
                fontSize: "1.1rem",
                padding: "16px 48px"
              }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        padding: "60px 20px 40px", 
        background: "rgba(0,0,0,0.3)",
        borderTop: "1px solid rgba(148,163,184,0.1)" 
      }}>
        <div style={container}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 60,
            marginBottom: 40
          }}>
            {/* Brand */}
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#f59e0b",
                marginBottom: 16
              }}>
                LEON
              </h3>
              <p style={{
                color: "#94a3b8",
                lineHeight: 1.8,
                fontSize: "0.95rem"
              }}>
                A comprehensive event management platform designed for organizers, 
                attendees, and administrators. Built on discipline, clarity, and trust.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#e5e7eb",
                marginBottom: 16
              }}>
                Quick Links
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link to="/login" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>
                  Login
                </Link>
                <Link to="/register" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>
                  Register
                </Link>
                <Link to="/events" style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>
                  Events
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#e5e7eb",
                marginBottom: 16
              }}>
                Platform
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Event Management</p>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Ticketing System</p>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Registration</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{
            paddingTop: 32,
            borderTop: "1px solid rgba(148,163,184,0.1)",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
              © 2026 <strong style={{ color: "#f59e0b" }}>LEON</strong> Event Management System. 
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes glowFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
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
  borderRadius: 8,
  fontWeight: 700,
  textDecoration: "none",
  letterSpacing: "0.04em",
  boxShadow: "0 10px 30px rgba(245,158,11,0.35)",
  transition: "all 0.3s ease",
  display: "inline-block"
};

const secondaryBtn = {
  padding: "14px 42px",
  border: "2px solid rgba(245,158,11,0.3)",
  background: "transparent",
  color: "#e5e7eb",
  borderRadius: 8,
  textDecoration: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  display: "inline-block"
};

const featureCard = {
  padding: 40,
  borderRadius: 16,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(148,163,184,0.2)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const featureTitle = {
  color: "#f59e0b",
  fontSize: "1.4rem",
  fontWeight: 700,
  marginBottom: 16
};

const featureText = {
  color: "#cbd5e1",
  lineHeight: 1.8,
  fontSize: "1rem"
};

const features = [
  {
    icon: "/target.png",
    title: "For Organizers",
    text: "Submit, manage, and control events with precision. Pricing, approvals, and registrations handled seamlessly."
  },
  {
    icon: "/ticket.png",
    title: "For Attendees",
    text: "Browse events, purchase tickets securely, and receive instant confirmations with QR codes."
  },
  {
    icon: "/people.png",
    title: "For Administrators",
    text: "Maintain full oversight with powerful tools for moderation, approval, and system-wide control."
  },
  {
    icon: "/security.png",
    title: "Secure & Reliable",
    text: "Built with industry-standard security practices to protect your data and transactions."
  },
  {
    icon: "/dashboard.png",
    title: "Analytics & Reports",
    text: "Track event performance, registrations, and revenue with comprehensive analytics."
  },
  {
    icon: "/light.png",
    title: "Fast & Scalable",
    text: "Lightning-fast performance that scales with your needs, from small meetups to large conferences."
  }
];

export default Landing;
