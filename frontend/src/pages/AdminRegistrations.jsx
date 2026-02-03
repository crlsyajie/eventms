import React, { useEffect, useState } from 'react';
import api from '../api/axios';

function AdminRegistrations() {
  const [regs, setRegs] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchData = () => {
    api.get('/events/').then((res) => {
      setEvents(Array.isArray(res.data) ? res.data : (res.data.events || []));
    }).catch(() => setEvents([]));

    api.get('/registrations/').then((res) => {
      const data = Array.isArray(res.data) ? res.data : (res.data.registrations || []);
      setRegs(data);
    }).catch(() => setRegs([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEventTitle = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.title : `Event #${eventId}`;
  };

  const updateStatus = (id, newStatus) => {
    api.patch(`/registrations/${id}/`, { status: newStatus })
      .then(() => fetchData())
      .catch(err => console.log(err));
  };

  return (
    <div style={{ maxWidth: 900, margin: '48px auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Manage Registrations</h2>
      
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 24, border: '1px solid #6b8cae', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: '#1a2744', margin: 0 }}>All Registrations ({regs.length})</h3>
        </div>
        
        {regs.length === 0 ? (
          <p style={{ color: '#6b8cae', textAlign: 'center', padding: 20 }}>No registrations yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)' }}>
                  <th style={{ padding: 14, textAlign: 'left', color: '#fff', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: 14, textAlign: 'left', color: '#fff', fontWeight: 600 }}>User</th>
                  <th style={{ padding: 14, textAlign: 'left', color: '#fff', fontWeight: 600 }}>Event</th>
                  <th style={{ padding: 14, textAlign: 'left', color: '#fff', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: 14, textAlign: 'center', color: '#fff', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {regs.map((r, index) => (
                  <tr key={r.id} style={{ background: index % 2 === 0 ? '#f8fafc' : '#fff' }}>
                    <td style={{ padding: 14, borderBottom: '1px solid #e2e8f0', color: '#6b8cae' }}>#{r.id}</td>
                    <td style={{ padding: 14, borderBottom: '1px solid #e2e8f0', color: '#1a2744', fontWeight: 500 }}>{r.user_name}</td>
                    <td style={{ padding: 14, borderBottom: '1px solid #e2e8f0', color: '#2a3f5f' }}>{getEventTitle(r.event)}</td>
                    <td style={{ padding: 14, borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ 
                        background: r.status === 'confirmed' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                        color: r.status === 'confirmed' ? '#fff' : '#1a2744',
                        padding: '4px 10px', 
                        borderRadius: 12, 
                        fontSize: 13, 
                        fontWeight: 600 
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: 14, borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                      {r.status !== 'confirmed' && (
                        <button 
                          onClick={() => updateStatus(r.id, 'confirmed')}
                          style={{ background: '#22c55e', color: '#fff', border: 0, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 500, marginRight: 8 }}
                        >
                          Confirm
                        </button>
                      )}
                      {r.status === 'confirmed' && (
                        <button 
                          onClick={() => updateStatus(r.id, 'pending')}
                          style={{ background: '#6b8cae', color: '#fff', border: 0, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontWeight: 500 }}
                        >
                          Set Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRegistrations;
