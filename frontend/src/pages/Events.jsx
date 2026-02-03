import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "free", "paid"
  const [loading, setLoading] = useState(true);

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
    if (filter === "free") return !event.is_paid;
    if (filter === "paid") return event.is_paid;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/logo.png" alt="Loading" className="loading-logo" />
        <p className="loading-text">Loading events...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '48px auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Available Events</h2>
        
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: 8 }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 0,
              background: filter === "all" ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
              color: filter === "all" ? '#1a2744' : '#a8c5db',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All ({events.length})
          </button>
          <button
            onClick={() => setFilter("free")}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 0,
              background: filter === "free" ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'transparent',
              color: filter === "free" ? '#fff' : '#a8c5db',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Free ({events.filter(e => !e.is_paid).length})
          </button>
          <button
            onClick={() => setFilter("paid")}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 0,
              background: filter === "paid" ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'transparent',
              color: filter === "paid" ? '#fff' : '#a8c5db',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Paid ({events.filter(e => e.is_paid).length})
          </button>
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
