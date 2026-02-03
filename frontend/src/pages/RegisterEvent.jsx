import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function RegisterEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/events/"),
      api.get("/registrations/")
    ]).then(([eventsRes, regsRes]) => {
      const events = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data.events || []);
      const found = events.find((e) => e.id === parseInt(id));
      setEvent(found || null);
      
      // Check if user already registered for this event
      const registrations = regsRes.data.registrations || [];
      const existing = registrations.find(r => r.event === parseInt(id) && r.user_name === user.username);
      if (existing) {
        setAlreadyRegistered(true);
      }
    }).catch(() => setEvent(null));
  }, [id, user.username]);

  const handleRegister = () => {
    if (!user.username) {
      alert("Please login first");
      navigate("/");
      return;
    }
    
    // If paid event, show payment popup first
    if (event.is_paid && parseFloat(event.price) > 0) {
      setShowPayment(true);
      return;
    }
    
    // Free event - proceed directly
    processRegistration();
  };

  const processRegistration = () => {
    setLoading(true);
    setErrorMsg("");
    api.post("/registrations/", { event: parseInt(id), user_name: user.username, status: "confirmed" })
      .then(() => {
        setLoading(false);
        setShowPayment(false);
        setShowSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response?.data?.error) {
          setErrorMsg(err.response.data.error);
          setAlreadyRegistered(true);
        } else {
          setErrorMsg("Registration failed. Please try again.");
        }
      });
  };

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvv) {
      return;
    }
    setPaymentProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      // After showing success, proceed with registration
      setTimeout(() => {
        setPaymentSuccess(false);
        processRegistration();
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!event) {
    return (
      <div style={{ maxWidth: 500, margin: '48px auto', padding: 32 }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: 32, textAlign: 'center', border: '1px solid #6b8cae' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #e5e7eb',
            borderTopColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b8cae', fontSize: 18 }}>Loading event...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '48px auto', padding: 32 }}>
      {/* Payment Modal */}
      {showPayment && (
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
            borderRadius: 16,
            maxWidth: 440,
            width: '90%',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s ease-out'
          }}>
            {/* Payment Success State */}
            {paymentSuccess ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
                  animation: 'scaleIn 0.5s ease-out'
                }}>
                  <span style={{ fontSize: 40, color: '#fff' }}>✓</span>
                </div>
                <h2 style={{ color: '#1a2744', marginBottom: 8 }}>Payment Successful!</h2>
                <p style={{ color: '#6b8cae', marginBottom: 8 }}>Amount paid:</p>
                <p style={{ color: '#22c55e', fontSize: 32, fontWeight: 700, marginBottom: 16 }}>
                  ${parseFloat(event.price).toFixed(2)}
                </p>
                <p style={{ color: '#6b8cae' }}>Completing your registration...</p>
                <div style={{
                  width: 30, height: 30,
                  border: '3px solid #e5e7eb',
                  borderTopColor: '#f59e0b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '16px auto 0'
                }} />
              </div>
            ) : (
              <>
                {/* Payment Header */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', 
                  padding: 24, 
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
                  <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>Secure Payment</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0 0', fontSize: 14 }}>
                    Complete your registration for {event.title}
                  </p>
                </div>

                {/* Payment Body */}
                <div style={{ padding: 24 }}>
                  {/* Amount */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                    borderRadius: 12, 
                    padding: 16, 
                    marginBottom: 24,
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                  }}>
                    <p style={{ color: '#6b8cae', margin: 0, fontSize: 14 }}>Total Amount</p>
                    <p style={{ color: '#1a2744', fontSize: 36, fontWeight: 700, margin: '8px 0' }}>
                      ${parseFloat(event.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Card Form */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', color: '#1a2744', fontWeight: 500, marginBottom: 8 }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      style={{
                        width: '100%',
                        padding: 14,
                        borderRadius: 8,
                        border: '2px solid #e2e8f0',
                        fontSize: 16,
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', color: '#1a2744', fontWeight: 500, marginBottom: 8 }}>
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        style={{
                          width: '100%',
                          padding: 14,
                          borderRadius: 8,
                          border: '2px solid #e2e8f0',
                          fontSize: 16,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#1a2744', fontWeight: 500, marginBottom: 8 }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: 14,
                          borderRadius: 8,
                          border: '2px solid #e2e8f0',
                          fontSize: 16,
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Payment Buttons */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => setShowPayment(false)}
                      disabled={paymentProcessing}
                      style={{
                        flex: 1,
                        padding: 14,
                        borderRadius: 8,
                        background: '#f1f5f9',
                        color: '#1a2744',
                        border: '1px solid #6b8cae',
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={paymentProcessing || !cardNumber || !expiry || !cvv}
                      style={{
                        flex: 2,
                        padding: 14,
                        borderRadius: 8,
                        background: paymentProcessing 
                          ? '#c4b5fd'
                          : (!cardNumber || !expiry || !cvv) 
                            ? '#e2e8f0' 
                            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: (!cardNumber || !expiry || !cvv) ? '#9ca3af' : '#fff',
                        border: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: (!cardNumber || !expiry || !cvv || paymentProcessing) ? 'not-allowed' : 'pointer',
                        boxShadow: (!cardNumber || !expiry || !cvv) ? 'none' : '0 4px 12px rgba(139,92,246,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      {paymentProcessing ? (
                        <>
                          <div style={{
                            width: 18, height: 18,
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          Processing...
                        </>
                      ) : (
                        <>🔒 Pay ${parseFloat(event.price).toFixed(2)}</>
                      )}
                    </button>
                  </div>

                  <p style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
                    🔒 This is a demo payment. No real charges will be made.
                  </p>
                </div>
              </>
            )}
          </div>
          <style>{`
            @keyframes popIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0); }
              to { transform: scale(1); }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Success Popup Modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'popIn 0.3s ease-out'
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
            <h2 style={{ color: '#1a2744', marginBottom: 8, fontSize: 24 }}>Registration Successful!</h2>
            <p style={{ color: '#6b8cae', marginBottom: 8 }}>You have been registered for:</p>
            <p style={{ color: '#1a2744', fontWeight: 600, fontSize: 18, marginBottom: 24 }}>{event.title}</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/registrations')}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#1a2744',
                  border: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
                }}
              >
                View My Registrations
              </button>
              <button
                onClick={() => navigate('/events')}
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
                Browse Events
              </button>
            </div>
          </div>
          <style>{`
            @keyframes popIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 12, overflow: 'hidden', border: '1px solid #6b8cae', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #2a3f5f 100%)', padding: '24px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 24 }}>Register for Event</h2>
        </div>
        <div style={{ padding: 24 }}>
          <h3 style={{ color: '#1a2744', marginBottom: 8 }}>{event.title}</h3>
          <p style={{ color: '#6b8cae', marginBottom: 16 }}>{event.description || 'No description available.'}</p>
          
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 6 }}><img src="/Calendar.png" alt="" style={{ width: 16, height: 16 }} /> Date</span>
              <span style={{ color: '#1a2744', fontWeight: 500 }}>{event.date ? new Date(event.date).toLocaleString() : 'TBD'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#6b8cae', display: 'flex', alignItems: 'center', gap: 6 }}><img src="/Maps.png" alt="" style={{ width: 16, height: 16 }} /> Location</span>
              <span style={{ color: '#1a2744', fontWeight: 500 }}>{event.location || 'TBD'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b8cae' }}>💰 Price</span>
              {event.is_paid ? (
                <span style={{ color: '#8b5cf6', fontWeight: 700 }}>${parseFloat(event.price).toFixed(2)}</span>
              ) : (
                <span style={{ color: '#22c55e', fontWeight: 700 }}>FREE</span>
              )}
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b8cae' }}>👤 Registering as</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{user.username}</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ 
              background: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 24,
              color: '#dc2626',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Already Registered Message */}
          {alreadyRegistered ? (
            <div>
              <div style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                borderRadius: 8, 
                padding: 16, 
                marginBottom: 16,
                textAlign: 'center',
                border: '1px solid #f59e0b'
              }}>
                <span style={{ fontSize: 24, marginRight: 8 }}>⚠️</span>
                <span style={{ color: '#92400e', fontWeight: 600 }}>You are already registered for this event</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  style={{ 
                    flex: 1,
                    padding: '14px 24px', 
                    borderRadius: 8, 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                    color: '#1a2744', 
                    border: 0, 
                    fontSize: 16, 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
                  }}
                  onClick={() => navigate('/tickets')}
                >
                  View My Tickets
                </button>
                <button
                  style={{ 
                    flex: 1,
                    padding: '14px 24px', 
                    borderRadius: 8, 
                    background: '#f1f5f9', 
                    color: '#1a2744', 
                    border: '1px solid #6b8cae', 
                    fontSize: 16, 
                    fontWeight: 500, 
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate('/events')}
                >
                  Browse Events
                </button>
              </div>
            </div>
          ) : (
            <button
              style={{ 
                width: '100%', 
                padding: '14px 32px', 
                borderRadius: 8, 
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                color: '#1a2744', 
                border: 0, 
                fontSize: 18, 
                fontWeight: 600, 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10
              }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 20,
                    height: 20,
                    border: '2px solid rgba(26,39,68,0.3)',
                    borderTopColor: '#1a2744',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Processing...
                </>
              ) : event.is_paid ? `💳 Pay $${parseFloat(event.price).toFixed(2)} & Register` : "✓ Confirm Registration"}
            </button>
          )}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default RegisterEvent;
