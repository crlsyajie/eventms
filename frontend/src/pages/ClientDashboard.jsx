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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: 50,
          height: 50,
          border: '4px solid rgba(245,158,11,0.3)',
          borderTop: '4px solid #f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#cbd5e1', marginTop: 16, fontSize: 18, fontWeight: 600 }}>Loading dashboard...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 30,
              marginBottom: 16,
              fontSize: '0.9rem',
              color: '#f59e0b',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}>
              <img src="/target.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> CLIENT DASHBOARD
            </div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.02em'
            }}>
              My Events
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#cbd5e1',
              margin: '8px 0 0 0'
            }}>
              Manage your submitted events and track their status
            </p>
          </div>
          
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
    </div>
  );
}

export default ClientDashboard;
