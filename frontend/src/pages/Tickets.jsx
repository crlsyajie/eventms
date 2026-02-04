import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = (search = '') => {
    setLoading(true);
    const ticketsUrl = search ? `/tickets/?search=${encodeURIComponent(search)}` : '/tickets/';
    
    Promise.all([
      api.get('/events/'),
      api.get(ticketsUrl),
      api.get('/registrations/')
    ]).then(([eventsRes, ticketsRes, regsRes]) => {
      setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.events || []));
      const ticketData = Array.isArray(ticketsRes.data) ? ticketsRes.data : (ticketsRes.data.tickets || []);
      setTickets(ticketData);
      const regData = regsRes.data.registrations || [];
      // Filter registrations for current user
      const userRegs = regData.filter(r => r.user_name === user.username);
      setRegistrations(userRegs);
      setLoading(false);
    }).catch(() => {
      setEvents([]);
      setTickets([]);
      setRegistrations([]);
      setLoading(false);
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancelRegistration = (regId) => {
    setCancelling(true);
    api.delete(`/registrations/${regId}/`)
      .then(() => {
        setCancelConfirm(null);
        setCancelling(false);
        fetchData(); // Refresh data
      })
      .catch(() => {
        setCancelling(false);
        alert('Failed to cancel registration');
      });
  };

  const getEventTitle = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.title : `Event #${eventId}`;
  };

  const getEventDate = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev && ev.date ? new Date(ev.date).toLocaleDateString() : 'TBD';
  };

  const getEventTime = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev && ev.date ? new Date(ev.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD';
  };

  const getEventLocation = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.location : 'TBD';
  };

  const getEventDescription = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.description : '';
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
            <img src="/ticket.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> MY TICKETS & REGISTRATIONS
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '0.02em'
          }}>
            My Events
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            Manage your event registrations and view your tickets
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: 40 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12 }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name or location..."
              style={{
                flex: 1,
                padding: '16px 20px',
                borderRadius: 12,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.05)',
                fontSize: 16,
                color: '#e5e7eb',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(245,158,11,0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(148,163,184,0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button 
              type="submit"
              style={{
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#1e293b',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 16,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(245,158,11,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Search
            </button>
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  fetchData('');
                }}
                style={{
                  padding: '16px 24px',
                  borderRadius: 12,
                  border: '1px solid rgba(148,163,184,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#e5e7eb',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 16,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
        
        {/* My Registrations Section */}
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Registrations</h2>
      {registrations.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae', marginBottom: 48 }}>
          <p style={{ color: '#6b8cae', fontSize: 18, marginBottom: 16 }}>You haven't registered for any events yet.</p>
          <Link to="/events" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#1a2744', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {registrations.map((reg) => (
            <div 
              key={reg.id}
              style={{ 
                background: 'rgba(255,255,255,0.95)', 
                borderRadius: 12, 
                padding: 20, 
                border: '1px solid #6b8cae',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#1a2744', fontSize: 18 }}>{getEventTitle(reg.event)}</h3>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                    <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
                      <img src="/Calendar.png" alt="" style={{ height: 14 }} /> {getEventDate(reg.event)}
                    </span>
                    <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
                      <img src="/Maps.png" alt="" style={{ height: 14 }} /> {getEventLocation(reg.event)}
                    </span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: 20, 
                      fontSize: 12, 
                      fontWeight: 600,
                      background: reg.status === 'confirmed' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 
                                 reg.status === 'pending' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
                                 reg.status === 'cancelled' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' :
                                 '#6b8cae',
                      color: '#fff',
                      textTransform: 'uppercase'
                    }}>
                      {reg.status}
                    </span>
                    <span style={{ color: '#a8c5db', fontSize: 12 }}>
                      Registered: {reg.registered_at ? new Date(reg.registered_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                {reg.status !== 'cancelled' && (
                  <button
                    onClick={() => setCancelConfirm(reg)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: 6, 
                      background: '#fef2f2', 
                      color: '#dc2626', 
                      border: '1px solid #fecaca', 
                      fontSize: 14, 
                      fontWeight: 500, 
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 32,
            maxWidth: 400,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: 28 }}>⚠️</span>
            </div>
            <h3 style={{ color: '#1a2744', marginBottom: 8 }}>Cancel Registration?</h3>
            <p style={{ color: '#6b8cae', marginBottom: 24 }}>
              Are you sure you want to cancel your registration for <strong style={{ color: '#1a2744' }}>{getEventTitle(cancelConfirm.event)}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setCancelConfirm(null)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: '#f1f5f9',
                  color: '#1a2744',
                  border: '1px solid #6b8cae',
                  fontSize: 16,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Keep Registration
              </button>
              <button
                onClick={() => handleCancelRegistration(cancelConfirm.id)}
                disabled={cancelling}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: cancelling ? '#fca5a5' : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: '#fff',
                  border: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                {cancelling ? (
                  <>
                    <div style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Cancelling...
                  </>
                ) : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Tickets Section */}
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Tickets</h2>
      {tickets.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae' }}>
          <p style={{ color: '#6b8cae', fontSize: 18, marginBottom: 16 }}>You don't have any tickets yet.</p>
          <Link to="/events" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#1a2744', padding: '12px 24px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {tickets.map((t) => (
            <div 
              key={t.id} 
              onClick={() => setSelectedTicket(t)}
              style={{ 
                background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', 
                borderRadius: 12, padding: 0, border: '2px solid #f59e0b', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)', overflow: 'hidden',
                cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(245,158,11,0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'; }}
            >
              <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#1a2744', fontWeight: 700, fontSize: 18 }}>
                  <img src="/logo.png" alt="" style={{ height: 20, marginRight: 8, verticalAlign: 'middle' }} />
                  TICKET #{t.ticket_number || String(t.id).padStart(9, '0')}
                </span>
                <span style={{ color: '#1a2744', fontWeight: 600 }}>{t.seat || 'General Admission'}</span>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 20 }}>{getEventTitle(t.event)}</h3>
                <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                  <span style={{ color: '#a8c5db', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <img src="/Calendar.png" alt="" style={{ height: 16 }} /> {getEventDate(t.event)}
                  </span>
                  <span style={{ color: '#a8c5db', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <img src="/Maps.png" alt="" style={{ height: 16 }} /> {getEventLocation(t.event)}
                  </span>
                </div>
                <p style={{ color: '#6b8cae', fontSize: 12, marginTop: 12 }}>Click to view full ticket</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Confirmation/Detail Modal */}
      {selectedTicket && (
        <div 
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.8)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', 
              borderRadius: 16, maxWidth: 450, width: '100%',
              boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
              border: '3px solid #f59e0b',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ticket Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
              padding: '20px 24px', 
              textAlign: 'center',
              position: 'relative'
            }}>
              <img src="/logo.png" alt="Logo" style={{ height: 50, marginBottom: 8 }} />
              <h2 style={{ color: '#1a2744', margin: 0, fontSize: 14, letterSpacing: 2 }}>EVENT TICKET</h2>
              <div style={{ 
                background: '#1a2744', color: '#f59e0b', 
                padding: '8px 16px', borderRadius: 20, 
                display: 'inline-block', marginTop: 8,
                fontWeight: 700, fontSize: 16
              }}>
                #{selectedTicket.ticket_number || String(selectedTicket.id).padStart(9, '0')}
              </div>
            </div>

            {/* Ticket Body */}
            <div style={{ padding: 24 }}>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 16, textAlign: 'center' }}>
                {getEventTitle(selectedTicket.event)}
              </h3>

              <div style={{ borderTop: '2px dashed #6b8cae', borderBottom: '2px dashed #6b8cae', padding: '16px 0', margin: '16px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>DATE</div>
                    <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img src="/Calendar.png" alt="" style={{ height: 16 }} />
                      {getEventDate(selectedTicket.event)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>TIME</div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>
                      {getEventTime(selectedTicket.event)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>LOCATION</div>
                    <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img src="/Maps.png" alt="" style={{ height: 16 }} />
                      {getEventLocation(selectedTicket.event)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>SEAT</div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>
                      {selectedTicket.seat || 'General Admission'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>ATTENDEE</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>{user.username || 'Guest'}</div>
              </div>

              {getEventDescription(selectedTicket.event) && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ color: '#6b8cae', fontSize: 12, marginBottom: 4 }}>DESCRIPTION</div>
                  <div style={{ color: '#a8c5db', fontSize: 14 }}>{getEventDescription(selectedTicket.event)}</div>
                </div>
              )}

              {/* Barcode Simulation */}
              <div style={{ 
                background: '#fff', borderRadius: 8, padding: 16, textAlign: 'center', marginTop: 16 
              }}>
                <div style={{ 
                  display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 8 
                }}>
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        width: Math.random() > 0.5 ? 2 : 3, 
                        height: 40, 
                        background: '#1a2744' 
                      }} 
                    />
                  ))}
                </div>
                <div style={{ color: '#1a2744', fontWeight: 600, fontSize: 12, letterSpacing: 4 }}>
                  {selectedTicket.ticket_number || String(selectedTicket.id).padStart(9, '0')}
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div style={{ 
              background: '#1a2744', padding: '12px 24px', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
              <span style={{ color: '#6b8cae', fontSize: 12 }}>
                Issued: {selectedTicket.issued_at ? new Date(selectedTicket.issued_at).toLocaleDateString() : 'N/A'}
              </span>
              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                  color: '#1a2744', border: 0, borderRadius: 6, 
                  padding: '8px 20px', fontWeight: 600, cursor: 'pointer' 
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Tickets;
