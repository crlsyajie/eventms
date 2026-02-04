import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function NavLink({ to, children, isAdmin }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const baseColor = isAdmin ? "#f59e0b" : "#a8c5db";
  const activeColor = "#fff";
  
  return (
    <Link 
      to={to} 
      style={{ 
        color: isActive ? activeColor : baseColor, 
        textDecoration: "none", 
        fontWeight: isAdmin ? 600 : 500,
        padding: "8px 16px",
        borderRadius: 6,
        background: isActive ? (isAdmin ? "rgba(245,158,11,0.2)" : "rgba(168,197,219,0.15)") : "transparent",
        transition: "all 0.2s ease",
        position: "relative"
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = activeColor;
          e.currentTarget.style.background = isAdmin ? "rgba(245,158,11,0.15)" : "rgba(168,197,219,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = baseColor;
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
      {isActive && (
        <span style={{
          position: "absolute",
          bottom: -4,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: 3,
          background: isAdmin ? "#f59e0b" : "#a8c5db",
          borderRadius: 2
        }} />
      )}
    </Link>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{ background: "linear-gradient(90deg, #1a2744 0%, #2a3f5f 100%)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 40, marginRight: 12 }} onError={(e)=>e.target.style.display='none'} />
        {!user?.is_admin && !user?.is_client && (
          <>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/registrations">My Registrations</NavLink>
            <NavLink to="/tickets">Tickets</NavLink>
          </>
        )}
        {user?.is_client && (
          <>
            <NavLink to="/client-dashboard">Dashboard</NavLink>
            <NavLink to="/client-events">Events</NavLink>
            <NavLink to="/submit-event">Submit Event</NavLink>
          </>
        )}
        {user?.is_admin && (
          <>
            <NavLink to="/dashboard" isAdmin>Dashboard</NavLink>
            <NavLink to="/admin/events" isAdmin>Manage Events</NavLink>
            <NavLink to="/admin/registrations" isAdmin>Manage Registrations</NavLink>
          </>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user ? (
          <>
            <span style={{ color: "#a8c5db" }}>Hi, {user.username} {user.is_admin && <span style={{ color: "#f59e0b" }}>(Admin)</span>}</span>
            <NavLink to="/profile">Profile</NavLink>
            <button 
              onClick={handleLogout} 
              style={{ background: "#f59e0b", color: "#1a2744", border: 0, borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#d97706"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f59e0b"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/" style={{ color: "#a8c5db", textDecoration: "none" }}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
