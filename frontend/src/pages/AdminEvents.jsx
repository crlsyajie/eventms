import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { getCSRFToken } from "../api/csrf";

function AdminEvents() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, event: null });
  const [deleting, setDeleting] = useState(false);
  const [successModal, setSuccessModal] = useState({ show: false, message: "" });
  const [filter, setFilter] = useState("all"); // all, pending, approved

  const fetchEvents = () => {
    setLoading(true);
    // Fetch all events for admin view
    api.get("/events/?admin=true").then((res) => {
      const allEvents = Array.isArray(res.data) ? res.data : (res.data.events || []);
      console.log('Admin events:', allEvents);
      setEvents(allEvents);
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching events:', err);
      setEvents([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]); // refetch when filter changes

  const addEvent = () => {
    if (!title || !date) {
      alert("Title and Date are required");
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    api
      .post("/events/", { 
        title, 
        description, 
        date, 
        location,
        is_paid: isPaid,
        price: isPaid ? parseFloat(price) || 0 : 0,
        submitted_by: user.id
      })
      .then(() => {
        setSuccessModal({ show: true, message: "Event created and approved!" });
        setTitle(""); setDescription(""); setDate(""); setLocation("");
        setIsPaid(false); setPrice("");
        fetchEvents();
      })
      .catch((err) => console.log(err));
  };

  const toggleEventPayment = (event) => {
    const newIsPaid = !event.is_paid;
    api.put(`/events/${event.id}/`, { 
      ...event, 
      is_paid: newIsPaid,
      price: newIsPaid ? event.price : 0
    })
      .then(() => fetchEvents())
      .catch((err) => console.log(err));
  };

  const updateEventPrice = (event, newPrice) => {
    api.put(`/events/${event.id}/`, { 
      ...event, 
      price: parseFloat(newPrice) || 0
    })
      .then(() => fetchEvents())
      .catch((err) => console.log(err));
  };

  const confirmDelete = (event) => {
    setDeleteModal({ show: true, event });
  };

  const handleApproveReject = (eventId, action) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    api.post(`/events/${eventId}/approve/`, { action, user_id: user.id })
      .then(() => {
        setSuccessModal({ show: true, message: `Event ${action}d successfully!` });
        fetchEvents();
      })
      .catch((err) => {
        setSuccessModal({ show: true, message: `Failed to ${action} event.` });
        console.log(err);
      });
  };

  const deleteEvent = () => {
    if (!deleteModal.event) return;
    setDeleting(true);
    api.delete(`/events/${deleteModal.event.id}/`)
      .then(() => {
        setDeleteModal({ show: false, event: null });
        setDeleting(false);
        fetchEvents();
      })
      .catch(err => {
        console.log(err);
        setDeleting(false);
        alert("Failed to delete event");
      });
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Loading" className="loading-logo" />
        <p className="loading-text">Loading events...</p>
      </div>
    );
  }

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const filteredEvents = filter === 'pending' ? pendingEvents : filter === 'approved' ? approvedEvents : events;

  return (
    <div style={{ maxWidth: 1200, margin: "48px auto", padding: 32 }}>
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Manage Events</h2>
      
      {/* Add Event Form */}
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, marginBottom: 32, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        <h3 style={{ color: '#1a2744', marginBottom: 20 }}>Add New Event</h3>
        <input
          style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #6b8cae', marginBottom: 12, fontSize: 16, boxSizing: 'border-box' }}
          placeholder="Event Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #6b8cae', marginBottom: 12, fontSize: 16, minHeight: 80, boxSizing: 'border-box', resize: 'vertical' }}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <input
            type="datetime-local"
            style={{ padding: 12, borderRadius: 6, border: '1px solid #6b8cae', fontSize: 16 }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            style={{ padding: 12, borderRadius: 6, border: '1px solid #6b8cae', fontSize: 16 }}
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Payment Toggle */}
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPaid ? 12 : 0 }}>
            <span style={{ color: '#1a2744', fontWeight: 500 }}>💰 Paid Event</span>
            <label style={{ 
              position: 'relative', 
              display: 'inline-block', 
              width: 50, 
              height: 26,
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: isPaid ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#cbd5e1',
                borderRadius: 26,
                transition: 'all 0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '',
                  height: 20,
                  width: 20,
                  left: isPaid ? 26 : 3,
                  bottom: 3,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </span>
            </label>
          </div>
          {isPaid && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6b8cae', fontSize: 20 }}>$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: 10, 
                  borderRadius: 6, 
                  border: '1px solid #6b8cae', 
                  fontSize: 16 
                }}
              />
            </div>
          )}
        </div>

        <button 
          style={{ 
            width: '100%', 
            padding: '14px 32px', 
            borderRadius: 6, 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            color: '#1a2744', 
            border: 0, 
            fontSize: 18, 
            fontWeight: 600, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
          }} 
          onClick={addEvent}
        >
          + Add Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {['all', 'pending', 'approved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '10px 20px',
              borderRadius: 6,
              border: 0,
              background: filter === f ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255,255,255,0.1)',
              color: filter === f ? '#1a2744' : '#a8c5db',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'pending' ? pendingEvents.length : f === 'approved' ? approvedEvents.length : events.length})
          </button>
        ))}
      </div>

      {/* Events List */}
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        <h3 style={{ color: '#1a2744', marginBottom: 20 }}>Existing Events ({filteredEvents.length})</h3>
        {filteredEvents.length === 0 ? (
          <p style={{ color: '#6b8cae', textAlign: 'center', padding: 20 }}>No events found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredEvents.map((e) => (
              <div key={e.id} style={{ background: '#f8fafc', borderRadius: 8, padding: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <strong style={{ color: '#1a2744' }}>{e.title}</strong>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        background: e.status === 'approved' ? '#10b981' : e.status === 'rejected' ? '#dc2626' : '#f59e0b',
                        color: '#fff'
                      }}>
                        {e.status?.charAt(0).toUpperCase() + e.status?.slice(1) || 'Approved'}
                      </span>
                      {e.is_paid && (
                        <span style={{ 
                          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', 
                          color: '#fff', 
                          padding: '2px 8px', 
                          borderRadius: 12, 
                          fontSize: 12, 
                          fontWeight: 600 
                        }}>
                          ${parseFloat(e.price).toFixed(2)}
                        </span>
                      )}
                      {!e.is_paid && (
                        <span style={{ 
                          background: '#e0f2fe', 
                          color: '#0369a1', 
                          padding: '2px 8px', 
                          borderRadius: 12, 
                          fontSize: 12, 
                          fontWeight: 600 
                        }}>
                          FREE
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#6b8cae', margin: '4px 0 0 0', fontSize: 14 }}>
                      <img src="/Calendar.png" alt="" style={{ width: 14, height: 14, verticalAlign: 'middle' }} /> {e.date ? new Date(e.date).toLocaleString() : 'TBD'} | <img src="/Maps.png" alt="" style={{ width: 14, height: 14, verticalAlign: 'middle' }} /> {e.location || 'TBD'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {e.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveReject(e.id, 'approve')}
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
                          onClick={() => handleApproveReject(e.id, 'reject')}
                          style={{
                            background: '#f59e0b',
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
                      </>
                    )}
                    <button 
                      onClick={() => confirmDelete(e)}
                      style={{ background: '#ef4444', color: '#fff', border: 0, borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {/* Payment Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#6b8cae', fontSize: 14 }}>Paid Event:</span>
                    <label style={{ 
                      position: 'relative', 
                      display: 'inline-block', 
                      width: 44, 
                      height: 24,
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={e.is_paid}
                        onChange={() => toggleEventPayment(e)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: e.is_paid ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : '#cbd5e1',
                        borderRadius: 24,
                        transition: 'all 0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: 18,
                          width: 18,
                          left: e.is_paid ? 23 : 3,
                          bottom: 3,
                          background: '#fff',
                          borderRadius: '50%',
                          transition: 'all 0.3s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </span>
                    </label>
                  </div>
                  {e.is_paid && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#6b8cae', fontSize: 14 }}>Price: $</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={e.price}
                        onBlur={(ev) => updateEventPrice(e, ev.target.value)}
                        style={{ 
                          width: 80, 
                          padding: '6px 8px', 
                          borderRadius: 4, 
                          border: '1px solid #6b8cae', 
                          fontSize: 14 
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: '#fff', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s ease-out'
          }}>
            <div style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '3px solid #fecaca'
            }}>
              <span style={{ fontSize: 32 }}>🗑️</span>
            </div>
            <h3 style={{ color: '#1a2744', marginBottom: 12, textAlign: 'center', fontSize: 22 }}>Delete Event?</h3>
            <p style={{ color: '#6b8cae', textAlign: 'center', marginBottom: 8 }}>
              This action cannot be undone. Are you sure you want to delete:
            </p>
            <p style={{ color: '#1a2744', fontWeight: 600, textAlign: 'center', marginBottom: 24, fontSize: 18 }}>
              "{deleteModal.event?.title}"
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setDeleteModal({ show: false, event: null })}
                disabled={deleting}
                style={{ 
                  flex: 1, padding: 14, borderRadius: 8, 
                  background: '#f1f5f9', color: '#1a2744', 
                  border: '1px solid #6b8cae', fontSize: 16, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={deleteEvent}
                disabled={deleting}
                style={{ 
                  flex: 1, padding: 14, borderRadius: 8, 
                  background: deleting ? '#fca5a5' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  color: '#fff', 
                  border: 0, fontSize: 16, fontWeight: 600, 
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(239,68,68,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {deleting ? (
                  <>
                    <div style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Deleting...
                  </>
                ) : 'Delete Event'}
              </button>
            </div>
          </div>
          <style>{`
            @keyframes popIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Success Modal */}
      {successModal.show && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.7)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: '#fff', borderRadius: 16, padding: 32, maxWidth: 400, width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s ease-out',
            textAlign: 'center'
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(34,197,94,0.4)'
            }}>
              <span style={{ fontSize: 40, color: '#fff' }}>✓</span>
            </div>
            <h3 style={{ color: '#1a2744', marginBottom: 12, fontSize: 22 }}>Success!</h3>
            <p style={{ color: '#6b8cae', marginBottom: 24 }}>{successModal.message}</p>
            <button 
              onClick={() => setSuccessModal({ show: false, message: "" })}
              style={{ 
                padding: '12px 32px', borderRadius: 8, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#1a2744', 
                border: 0, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
              }}
            >
              Continue
            </button>
          </div>
          <style>{`
            @keyframes popIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
