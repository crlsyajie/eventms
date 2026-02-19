import React, { useState } from "react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = event.is_paid 
    ? `$${parseFloat(event.price).toFixed(2)}` 
    : "FREE";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        border: '1px solid rgba(148,163,184,0.15)',
        backdropFilter: 'blur(20px)',
        boxShadow: isHovered
          ? '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.1)'
          : '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* 1. Price Badge - Adjusted sizing to prevent blocking title */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 20,
        background: event.is_paid 
          ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
          : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#fff',
        padding: '8px 18px', // Slightly slimmer padding
        borderRadius: 30,
        fontSize: 16,        // Slightly smaller font
        fontWeight: 800,
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        {!event.is_paid && <img src="/sparkle.png" alt="" style={{ width: 14, height: 14 }} />}
        {formattedPrice}
      </div>

      {/* 2. Clipped Header */}
      <div style={{
        background: 'linear-gradient(165deg, #23272f 0%, #111827 100%)',
        padding: '40px 28px 48px',
        position: 'relative',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}>
        <h3 style={{
          margin: 0,
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          maxWidth: '65%', // CRITICAL FIX: Forces title to wrap before badge
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {event.title}
        </h3>
      </div>

      {/* 3. Content Section */}
      <div style={{
        padding: '0 24px 32px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        <p style={{
          color: '#94a3b8',
          margin: '16px 0 24px',
          fontSize: 15,
          lineHeight: 1.6
        }}>
          {event.description || 'Campus-wide tech conference'}
        </p>

        {/* Info Box */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 32,
          padding: '20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/Calendar.png" alt="" style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>{event.date || '2/19/2026, 11:34 PM'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/Maps.png" alt="" style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>{event.location}</div>
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
            gap: 10,
            background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            color: '#0f172a',
            padding: '18px',
            borderRadius: 16,
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: 16,
            boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)',
            transition: 'all 0.3s ease',
            marginTop: 'auto'
          }}
        >
          <img src={event.is_paid ? "/G_Pay.png" : "/sparkle.png"} alt="" style={{ width: 20 }} />
          Register {event.is_paid ? `- ${formattedPrice}` : 'Free'}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;