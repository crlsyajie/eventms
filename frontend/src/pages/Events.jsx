import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "free", "paid"
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get("/events/")
      .then((res) => {
        // Only show approved events to non-admins/clients
        const user = JSON.parse(localStorage.getItem("user") || "null");
        let allEvents = Array.isArray(res.data) ? res.data : (res.data.events || []);
        if (!user?.is_admin) {
          allEvents = allEvents.filter(e => e.status === 'approved');
        }
        setEvents(allEvents);
        setLoading(false);
      })
      .catch((err) => {
        setEvents([]);
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter(event => {
    // Filter by price
    if (filter === "free" && event.is_paid) return false;
    if (filter === "paid" && !event.is_paid) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = event.title?.toLowerCase().includes(query);
      const matchesLocation = event.location?.toLowerCase().includes(query);
      return matchesTitle || matchesLocation;
    }
    
    return true;
  });

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

      <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 32 }}>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event name or location..."
            style={{
              width: '100%',
              padding: '16px 20px',
              borderRadius: 12,
              border: '1px solid rgba(148,163,184,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e5e7eb',
              fontSize: '1rem',
              boxSizing: 'border-box',
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
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#ffffff', 
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '0.02em'
            }}>
              Available Events
            </h1>
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '1.1rem', 
              margin: '8px 0 0 0' 
            }}>
              Discover amazing events happening around you
            </p>
          </div>
          
          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12, border: '1px solid rgba(148,163,184,0.1)' }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 0,
                background: filter === "all" ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: filter === "all" ? '#1e293b' : '#cbd5e1',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setFilter("free")}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 0,
                background: filter === "free" ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: filter === "free" ? '#1e293b' : '#cbd5e1',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              Free ({events.filter(e => !e.is_paid).length})
            </button>
            <button
              onClick={() => setFilter("paid")}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: 0,
                background: filter === "paid" ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                color: filter === "paid" ? '#1e293b' : '#cbd5e1',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.9rem'
              }}
            >
              Paid ({events.filter(e => e.is_paid).length})
            </button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae' }}>
          <p style={{ color: '#6b8cae', fontSize: 18 }}>
            {filter === "all" 
              ? "No events available at the moment. Check back soon!"
              : `No ${filter} events available.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
