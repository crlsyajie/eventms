import React from "react";

function Loading({ message = "Loading..." }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(245,158,11,0.08), transparent 50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 70% 80%, rgba(59,130,246,0.06), transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Glowing Logo Container */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Outer Glow Ring */}
        <div style={{
          position: 'relative',
          width: 120,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Spinning Glow Ring */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, #f59e0b, transparent)',
            animation: 'spinGlow 1.5s linear infinite',
            opacity: 0.8
          }} />
          
          {/* Inner Background */}
          <div style={{
            position: 'absolute',
            inset: 4,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            boxShadow: 'inset 0 0 30px rgba(245,158,11,0.2)'
          }} />

          {/* Pulsing Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />

          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="Loading" 
            style={{
              width: 70,
              height: 70,
              objectFit: 'contain',
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))',
              animation: 'logoFloat 2s ease-in-out infinite'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback Icon */}
          <div style={{
            display: 'none',
            width: 70,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            position: 'relative',
            zIndex: 2,
            filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.6))'
          }}>
            <img src="/sparkle.png" alt="" style={{ width: 50, height: 50 }} />
          </div>
        </div>

        {/* Loading Text */}
        <p style={{
          color: '#e5e7eb',
          marginTop: 32,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {message}
        </p>

        {/* Animated Dots */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: 16
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#f59e0b',
                animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
                boxShadow: '0 0 10px rgba(245,158,11,0.5)'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spinGlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default Loading;
