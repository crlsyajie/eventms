import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SideNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user?.is_admin) return null;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '/dashboard.png' },
    { path: '/admin/events', label: 'Manage Events', icon: '/target.png' },
    { path: '/admin/registrations', label: 'Registrations', icon: '/docs.png' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      width: 260,
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 30px rgba(0,0,0,0.4)",
      zIndex: 1000,
      borderRight: '1px solid rgba(245,158,11,0.1)'
    }}>
      {/* Background Glow Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.1), transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Logo Section */}
      <div style={{
        padding: '32px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16
        }}>
          {/* Glowing Logo */}
          <div style={{
            position: 'relative',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
              animation: 'sidebarPulse 3s ease-in-out infinite'
            }} />
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{
                height: 50,
                width: 50,
                objectFit: 'contain',
                borderRadius: 12,
                filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.5))',
                position: 'relative',
                zIndex: 1
              }}
              onError={e => e.target.style.display='none'}
            />
          </div>
          <div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.02em'
            }}>
              EventMS
            </div>
            <div style={{
              fontSize: 12,
              color: '#f59e0b',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#1e293b',
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
          }}>
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 14 }}>
              {user.username}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 2
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 6px #22c55e'
              }} />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1
      }}>
        <div style={{
          fontSize: 11,
          color: '#64748b',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0 12px',
          marginBottom: 8
        }}>
          Navigation
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onMouseEnter={() => setHoveredLink(link.path)}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              background: isActive(link.path) 
                ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)'
                : hoveredLink === link.path 
                  ? 'rgba(148,163,184,0.1)' 
                  : 'transparent',
              border: isActive(link.path) 
                ? '1px solid rgba(245,158,11,0.3)' 
                : '1px solid transparent',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isActive(link.path) && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: 24,
                background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                borderRadius: '0 4px 4px 0',
                boxShadow: '0 0 10px rgba(245,158,11,0.5)'
              }} />
            )}
            <img 
              src={link.icon} 
              alt="" 
              style={{
                width: 20,
                height: 20,
                filter: isActive(link.path) ? 'drop-shadow(0 0 4px rgba(245,158,11,0.5))' : 'none'
              }}
            />
            <span style={{
              color: isActive(link.path) ? '#f59e0b' : '#cbd5e1',
              fontWeight: isActive(link.path) ? 700 : 500,
              fontSize: 14,
              letterSpacing: '0.01em'
            }}>
              {link.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid rgba(148,163,184,0.1)'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#1e293b',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)';
          }}
        >
          <img src="/back.png" alt="" style={{ width: 18, height: 18 }} />
          Logout
        </button>
      </div>

      <style>{`
        @keyframes sidebarPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </aside>
  );
}

export default SideNavbar;
