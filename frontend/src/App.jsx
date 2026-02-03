import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import RegisterEvent from "./pages/RegisterEvent";
import ClientSubmitEvent from "./pages/ClientSubmitEvent";
import ClientDashboard from "./pages/ClientDashboard";
import ClientEvents from "./pages/ClientEvents";
import Registrations from "./pages/Registrations";
import Tickets from "./pages/Tickets";
import AdminEvents from "./pages/AdminEvents";
import AdminRegistrations from "./pages/AdminRegistrations";
import Dashboard from "./pages/Dashboard";
import SideNavbar from "./components/SideNavbar";

function ProtectedRoute({ children, adminOnly }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/events" />;
  return children;
}

function AppRoutes() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdminRoute = user?.is_admin && ["/dashboard", "/admin/events", "/admin/registrations"].some(p => location.pathname.startsWith(p));
  return (
    <>
      {!hideNavbar && (isAdminRoute ? <SideNavbar /> : <Navbar />)}
      <div style={isAdminRoute ? { marginLeft: 220 } : {}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/client-events" element={<ProtectedRoute><ClientEvents /></ProtectedRoute>} />
          <Route path="/client-dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/register-event/:id" element={<ProtectedRoute><RegisterEvent /></ProtectedRoute>} />
          <Route path="/submit-event" element={<ProtectedRoute><ClientSubmitEvent /></ProtectedRoute>} />
          <Route path="/registrations" element={<ProtectedRoute><Registrations /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute adminOnly><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute adminOnly><AdminRegistrations /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
