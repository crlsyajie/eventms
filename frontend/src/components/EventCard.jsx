import React, { useState } from "react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        border: '1px solid rgba(148,163,184,0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: isHovered
          ? '0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.1)'
          : '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16
      }}
    >
      {/* Animated Glow Effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.12), transparent 60%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
      }} />

      {/* Price Badge - Floating */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10
      }}>
        {event.is_paid ? (
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(139,92,246,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            ${parseFloat(event.price).toFixed(2)}
          </span>
        ) : (
          <span style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 30,
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 4px 15px rgba(34,197,94,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <img src="/sparkle.png" alt="" style={{ width: 14, height: 14 }} /> FREE
          </span>
        )}
      </div>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.05) 100%)',
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(245,158,11,0.15)',
        position: 'relative'
      }}>
        {/* Top Accent Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)'
        }} />
        
        <h3 style={{
          margin: 0,
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 700,
          paddingRight: 80,
          letterSpacing: '0.01em',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          lineHeight: 1.3
        }}>
          {event.title}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <p style={{
          color: '#94a3b8',
          marginBottom: 20,
          minHeight: 48,
          lineHeight: 1.6,
          fontSize: 14
        }}>
          {event.description || 'No description available.'}
        </p>

        {/* Event Details */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 24,
          padding: '16px',
          background: 'rgba(148,163,184,0.05)',
          borderRadius: 12,
          border: '1px solid rgba(148,163,184,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#cbd5e1'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}>
              <img src="/Calendar.png" alt="" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Date & Time</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{event.date ? new Date(event.date).toLocaleString() : 'TBD'}</div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#cbd5e1'
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}>
              <img src="/Maps.png" alt="" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Location</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{event.location || 'TBD'}</div>
            </div>
          </div>
        </div>

        {/* Register Button */}
        <Link
          to={`/register-event/${event.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#1e293b',
            padding: '16px 24px',
            borderRadius: 14,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 15,
            boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.3)';
          }}
        >
          {event.is_paid ? (
            <><img src="/G_Pay.png" alt="" style={{ width: 18, height: 18 }} /> Register - ${parseFloat(event.price).toFixed(2)}</>
          ) : (
            <><img src="/sparkle.png" alt="" style={{ width: 18, height: 18 }} /> Register Free</>
          )}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
