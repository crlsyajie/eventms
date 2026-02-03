import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ClientDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.is_client) {
      navigate('/events');
      return;
    }
    const fetchSubmissions = () => {
      api.get(`/events/my-submissions/?user_id=${user.id}`)
        .then((res) => {
          const myEvents = Array.isArray(res.data) ? res.data : (res.data.events || []);
          setEvents(myEvents);
          const pending = myEvents.filter(e => e.status === 'pending').length;
          const approved = myEvents.filter(e => e.status === 'approved').length;
          const rejected = myEvents.filter(e => e.status === 'rejected').length;
          setStats({ pending, approved, rejected, total: myEvents.length });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [user.id, user.is_client, navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Loading" className="loading-logo" />
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '48px auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Client Dashboard</h2>
        <button 
          onClick={() => navigate('/submit-event')}
          style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: '#1a2744', 
            border: 0, 
            borderRadius: 6, 
            padding: '12px 24px', 
            fontSize: 16, 
            fontWeight: 600, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
          }}
        >
          + Submit New Event
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', color: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', border: '1px solid #6b8cae' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f59e0b' }}>{stats.total}</div>
          <div style={{ fontSize: 16, marginTop: 8, color: '#a8c5db' }}>Total Events</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #2a3f5f 0%, #6b8cae 100%)', color: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', border: '1px solid #a8c5db' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
          <div style={{ fontSize: 16, marginTop: 8, color: '#fff' }}>Pending</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{stats.approved}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>Approved</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', color: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 4px 16px rgba(220,38,38,0.3)' }}>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{stats.rejected}</div>
          <div style={{ fontSize: 16, marginTop: 8 }}>Rejected</div>
        </div>
      </div>

      {/* Events List */}
      <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 22 }}>My Submitted Events</h3>
      {events.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: 40, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ color: '#a8c5db', fontSize: 16 }}>No events submitted yet.</p>
          <button 
            onClick={() => navigate('/submit-event')}
            style={{ 
              marginTop: 16,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
              color: '#1a2744', 
              border: 0, 
              borderRadius: 6, 
              padding: '10px 20px', 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: 'pointer'
            }}
          >
            Submit Your First Event
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {events.map(event => (
            <div 
              key={event.id} 
              style={{ 
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: 12, 
                padding: 20, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: '#1a2744', fontSize: 18, marginBottom: 8 }}>{event.title}</h4>
                <p style={{ margin: 0, color: '#6b8cae', fontSize: 14, marginBottom: 4 }}>
                  {new Date(event.date).toLocaleDateString()} at {event.location}
                </p>
                {event.is_paid && (
                  <p style={{ margin: 0, color: '#f59e0b', fontSize: 14, fontWeight: 600 }}>
                    ${event.price}
                  </p>
                )}
              </div>
              <div>
                <span style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600,
                  background: event.status === 'approved' ? '#10b981' : event.status === 'rejected' ? '#dc2626' : '#f59e0b',
                  color: '#fff'
                }}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
