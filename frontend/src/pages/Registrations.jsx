import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function Registrations() {
  const [regs, setRegs] = useState([]);
  const [events, setEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get('/events/').then((res) => {
      setEvents(Array.isArray(res.data) ? res.data : (res.data.events || []));
    }).catch(() => setEvents([]));
    
    api.get('/registrations/').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data.registrations || []);
      const userRegs = data.filter(r => r.user_name === user.username);
      setRegs(userRegs);
    }).catch(() => setRegs([]));
  }, [user.username]);

  const getEventTitle = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.title : `Event #${eventId}`;
  };

  const getEventDate = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev && ev.date ? new Date(ev.date).toLocaleDateString() : 'TBD';
  };

  const getEventLocation = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.location : 'TBD';
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '80px 20px'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 70% 80%, rgba(59,130,246,0.06), transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
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
            <img src="/docs.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> MY REGISTRATIONS
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '0.02em'
          }}>
            My Event Registrations
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            Track all your registered events in one place
          </p>
        </div>

        {regs.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 20,
            padding: 48,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '2rem'
            }}>
              <img src="/ticket.png" alt="" style={{ width: 40, height: 40 }} />
            </div>
            <h3 style={{ color: '#e5e7eb', fontSize: '1.5rem', marginBottom: 16, fontWeight: 600 }}>
              No Registrations Yet
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: 32, lineHeight: 1.6 }}>
              You haven't registered for any events yet. Discover amazing events happening around you!
            </p>
            <Link 
              to="/events" 
              style={{ 
                display: 'inline-block', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#1e293b', 
                padding: '16px 32px', 
                borderRadius: 12, 
                textDecoration: 'none', 
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.02em',
                boxShadow: '0 10px 30px rgba(245,158,11,0.3)',
                transition: 'all 0.3s ease'
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
              Browse Events →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 24 }}>
            {regs.map((r) => (
              <div 
                key={r.id} 
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 16,
                  padding: 24,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                }}
              >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 20 }}>{getEventTitle(r.event)}</h3>
                  <p style={{ color: '#6b8cae', margin: '8px 0 0 0' }}>
                    <span style={{ marginRight: 16 }}> {getEventDate(r.event)}</span>
                    <span> {getEventLocation(r.event)}</span>
                  </p>
                </div>
                <span style={{ 
                  background: r.status === 'confirmed' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                  color: r.status === 'confirmed' ? '#fff' : '#1a2744',
                  padding: '6px 12px', 
                  borderRadius: 20, 
                  fontSize: 14, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  {r.status === 'confirmed' ? '✓ Confirmed' : <><img src="/hourglass.png" alt="" style={{ width: 14, height: 14 }} /> Pending</>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Registrations;
