import React, { useEffect, useState } from "react";
import api from "../api/axios";

function ClientEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/events/")
      .then((res) => {
        const allEvents = Array.isArray(res.data) ? res.data : (res.data.events || []);
        // Only show approved events
        setEvents(allEvents.filter(e => e.status === 'approved'));
        setLoading(false);
      })
      .catch((err) => {
        setEvents([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Loading" className="loading-logo" />
        <p className="loading-text">Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '48px auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        Approved Events ({events.length})
      </h2>

      {events.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae' }}>
          <p style={{ color: '#6b8cae', fontSize: 18 }}>No approved events available yet.</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, overflow: 'hidden', border: '1px solid #6b8cae' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)' }}>
                <th style={{ padding: 16, textAlign: 'left', color: '#fff', fontWeight: 600 }}>Event Title</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#fff', fontWeight: 600 }}>Date</th>
                <th style={{ padding: 16, textAlign: 'left', color: '#fff', fontWeight: 600 }}>Location</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#fff', fontWeight: 600 }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr 
                  key={event.id} 
                  style={{ 
                    background: idx % 2 === 0 ? '#fff' : '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  <td style={{ padding: 16, color: '#1a2744', fontWeight: 500 }}>
                    {event.title}
                    {event.description && (
                      <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b8cae' }}>
                        {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: 16, color: '#2a3f5f' }}>
                    {event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}
                  </td>
                  <td style={{ padding: 16, color: '#2a3f5f' }}>
                    {event.location || 'TBD'}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    {event.is_paid ? (
                      <span style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600
                      }}>
                        ${parseFloat(event.price).toFixed(2)}
                      </span>
                    ) : (
                      <span style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600
                      }}>
                        FREE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientEvents;
