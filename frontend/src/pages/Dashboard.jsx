import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Dashboard() {
  const [stats, setStats] = useState({ events: 0, registrations: 0, tickets: 0, users: 0, pending: 0, approved: 0, rejected: 0 });
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = () => {
    Promise.all([
      api.get('/events/?admin=true'),
      api.get('/registrations/'),
      api.get('/tickets/'),
      api.get('/users/')
    ]).then(([eventsRes, regsRes, ticketsRes, usersRes]) => {
      const events = eventsRes.data.events || [];
      const regs = regsRes.data.registrations || [];
      const pending = events.filter(e => e.status === 'pending');
      const approved = events.filter(e => e.status === 'approved');
      const rejected = events.filter(e => e.status === 'rejected');
      
      setStats({
        events: events.length,
        registrations: regs.length,
        tickets: ticketsRes.data.tickets?.length || 0,
        users: usersRes.data.users?.length || 0,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length
      });
      setAllEvents(events);
      setRegistrations(regs);
      setPendingEvents(pending);
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleApproveReject = (eventId, action) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    api.post(`/events/${eventId}/approve/`, { action, user_id: user.id })
      .then(() => {
        fetchData();
        setPendingEvents(prev => prev.filter(e => e.id !== eventId)); // Remove from pending immediately
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '80px 40px 40px 40px',
      marginLeft: 30
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
            <img src="/crown.png" alt="" style={{ width: 16, height: 16, marginRight: 8, verticalAlign: 'middle' }} /> ADMIN DASHBOARD
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '0.02em'
          }}>
            System Overview
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#cbd5e1',
            maxWidth: 600,
            margin: '0 auto'
          }}>
            Manage events, registrations, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 48 }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              <img src="/target.png" alt="" style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#f59e0b' }}>{stats.events}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#cbd5e1' }}>Total Events</div>
          </div>
          
          <div 
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 100%)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 16,
              padding: 32,
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 40px rgba(245,158,11,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate('/admin/events')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(245,158,11,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(245,158,11,0.2)';
            }}
          >
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem',
              color: '#1e293b'
            }}>
              <img src="/hourglass.png" alt="" style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#e5e7eb', fontWeight: 600 }}>Pending Review</div>
          </div>
          
          <div style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(34,197,94,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              ✅
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#22c55e' }}>{stats.approved}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#cbd5e1' }}>Approved</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              <img src="/docs.png" alt="" style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#3b82f6' }}>{stats.registrations}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#cbd5e1' }}>Registrations</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(168,85,247,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              <img src="/ticket.png" alt="" style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#a855f7' }}>{stats.tickets}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#cbd5e1' }}>Tickets</div>
          </div>
          
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(148,163,184,0.2)',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '1.5rem'
            }}>
              <img src="/people.png" alt="" style={{ width: 28, height: 28 }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#ef4444' }}>{stats.users}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: '#cbd5e1' }}>Users</div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32, marginBottom: 48 }}>
        {/* Event Status Doughnut Chart */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <h3 style={{ color: '#1a2744', marginTop: 0, marginBottom: 20 }}>Event Status Overview</h3>
          <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut 
              data={{
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                  data: [stats.approved, stats.pending, stats.rejected],
                  backgroundColor: ['#10b981', '#f59e0b', '#dc2626'],
                  borderColor: ['#059669', '#d97706', '#b91c1c'],
                  borderWidth: 2,
                  hoverOffset: 8
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true, font: { size: 12 } }
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.label}: ${ctx.raw} events`
                    }
                  }
                },
                cutout: '60%'
              }}
            />
          </div>
        </div>

        {/* Overview Bar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <h3 style={{ color: '#1a2744', marginTop: 0, marginBottom: 20 }}>System Overview</h3>
          <div style={{ height: 250 }}>
            <Bar 
              data={{
                labels: ['Events', 'Registrations', 'Tickets', 'Users'],
                datasets: [{
                  label: 'Count',
                  data: [stats.events, stats.registrations, stats.tickets, stats.users],
                  backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(107, 140, 174, 0.8)'
                  ],
                  borderColor: [
                    '#d97706',
                    '#059669',
                    '#4f46e5',
                    '#2a3f5f'
                  ],
                  borderWidth: 2,
                  borderRadius: 8,
                  hoverBackgroundColor: [
                    'rgba(245, 158, 11, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(99, 102, 241, 1)',
                    'rgba(107, 140, 174, 1)'
                  ]
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#1a2744',
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    padding: 12,
                    cornerRadius: 8
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 12 } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                  },
                  x: {
                    ticks: { font: { size: 12 } },
                    grid: { display: false }
                  }
                },
                animation: { duration: 800, easing: 'easeOutQuart' }
              }}
            />
          </div>
        </div>

        {/* Event Types Chart */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <h3 style={{ color: '#1a2744', marginTop: 0, marginBottom: 20 }}>Event Types</h3>
          <div style={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut 
              data={{
                labels: ['Free Events', 'Paid Events'],
                datasets: [{
                  data: [
                    allEvents.filter(e => !e.is_paid).length,
                    allEvents.filter(e => e.is_paid).length
                  ],
                  backgroundColor: ['#22c55e', '#8b5cf6'],
                  borderColor: ['#16a34a', '#7c3aed'],
                  borderWidth: 2,
                  hoverOffset: 8
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true, font: { size: 12 } }
                  }
                },
                cutout: '60%'
              }}
            />
          </div>
        </div>
      </div>

      {/* Pending Events Section */}
      {stats.pending > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', border: '1px solid #6b8cae' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#1a2744', margin: 0 }}>Pending Events Submissions</h3>
            <button
              onClick={() => navigate('/admin/events')}
              style={{
                background: 'transparent',
                border: '1px solid #f59e0b',
                color: '#f59e0b',
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingEvents.slice(0, 3).map(event => (
              <div 
                key={event.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: 8,
                  padding: 16,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#1a2744', fontSize: 16, marginBottom: 4 }}>{event.title}</h4>
                  <p style={{ margin: 0, color: '#6b8cae', fontSize: 14 }}>
                    {new Date(event.date).toLocaleDateString()} at {event.location}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleApproveReject(event.id, 'approve')}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 0,
                      borderRadius: 6,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveReject(event.id, 'reject')}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 0,
                      borderRadius: 6,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 14
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Dashboard;
