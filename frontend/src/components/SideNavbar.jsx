import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SideNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user?.is_admin) return null;

  return (
    <aside style={{
      width: 220,
      background: "#1a2744",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      boxShadow: "2px 0 8px rgba(0,0,0,0.2)",
      zIndex: 1000,
      paddingTop: 32
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginLeft: 16 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 60, width: 60, objectFit: "cover", borderRadius: 12, marginBottom: 12 }} onError={e => e.target.style.display='none'} />
        <span style={{ color: "#a8c5db", marginBottom: 16 }}>Hi, {user.username} <span style={{ color: "#f59e0b" }}>(Admin)</span></span>
        <Link to="/dashboard" style={{ color: location.pathname === "/dashboard" ? "#f59e0b" : "#a8c5db", fontWeight: 600, padding: "10px 0", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/admin/events" style={{ color: location.pathname === "/admin/events" ? "#f59e0b" : "#a8c5db", fontWeight: 600, padding: "10px 0", textDecoration: "none" }}>Manage Events</Link>
        <Link to="/admin/registrations" style={{ color: location.pathname === "/admin/registrations" ? "#f59e0b" : "#a8c5db", fontWeight: 600, padding: "10px 0", textDecoration: "none" }}>Manage Registrations</Link>
      </div>
      <div style={{ marginTop: "auto", marginLeft: 16, marginBottom: 32 }}>
        <button 
          onClick={handleLogout} 
          style={{ background: "#f59e0b", color: "#1a2744", border: 0, borderRadius: 6, padding: "8px 65px", fontWeight: 600, cursor: "pointer", marginTop: 12 }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideNavbar;
