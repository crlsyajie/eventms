import React from "react";
import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div style={{ 
      background: 'rgba(255,255,255,0.95)', 
      borderRadius: 12, 
      padding: 0, 
      border: '1px solid #6b8cae',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative'
    }}>
      {/* Price Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10
      }}>
        {event.is_paid ? (
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(139,92,246,0.4)'
          }}>
            ${parseFloat(event.price).toFixed(2)}
          </span>
        ) : (
          <span style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(34,197,94,0.4)'
          }}>
            FREE
          </span>
        )}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', padding: '16px 20px' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: 20, paddingRight: 70 }}>{event.title}</h3>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ color: '#2a3f5f', marginBottom: 12, minHeight: 40 }}>{event.description || 'No description available.'}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 6 }}><img src="/Calendar.png" alt="" style={{ width: 16, height: 16 }} /> {event.date ? new Date(event.date).toLocaleString() : 'TBD'}</span>
          <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 6 }}><img src="/Maps.png" alt="" style={{ width: 16, height: 16 }} /> {event.location || 'TBD'}</span>
        </div>
        <Link 
          to={`/register-event/${event.id}`} 
          style={{ 
            display: 'block', 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: '#1a2744', 
            padding: '12px 24px', 
            borderRadius: 6, 
            textDecoration: 'none', 
            fontWeight: 600,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
          }}
        >
          {event.is_paid ? `Register - $${parseFloat(event.price).toFixed(2)}` : 'Register Free'}
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
