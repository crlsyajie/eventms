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
    <div style={{ maxWidth: 700, margin: '48px auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Registrations</h2>
      {regs.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae' }}>
          <p style={{ color: '#6b8cae', fontSize: 18, marginBottom: 16 }}>You haven't registered for any events yet.</p>
          <Link to="/events" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#1a2744', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {regs.map((r) => (
            <div key={r.id} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 20, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1a2744', fontSize: 20 }}>{getEventTitle(r.event)}</h3>
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
                  fontWeight: 600 
                }}>
                  {r.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Registrations;
