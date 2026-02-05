import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        border: '1px solid rgba(148,163,184,0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(0,0,0,0.4), 0 0 40px rgba(245,158,11,0.1)'
          : '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16
      }}
    >
      {/* Glow Effect on Hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.15), transparent 60%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
      }} />

      {/* Header with gradient */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%)',
        padding: '24px 24px 20px',
        borderBottom: '1px solid rgba(245,158,11,0.2)',
        position: 'relative'
      }}>
        {/* Decorative accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 24,
          right: 24,
          height: 3,
          background: 'linear-gradient(90deg, #f59e0b, #d97706)',
          borderRadius: '0 0 4px 4px'
        }} />
        
        <h3 style={{
          margin: 0,
          color: '#fff',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '0.01em',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          {product.title}
        </h3>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <p style={{
          color: '#94a3b8',
          marginBottom: 20,
          minHeight: 48,
          lineHeight: 1.6,
          fontSize: 14
        }}>
          {product.description || 'No description available.'}
        </p>

        {/* Price Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '16px 20px',
          background: 'rgba(245,158,11,0.1)',
          borderRadius: 12,
          border: '1px solid rgba(245,158,11,0.2)'
        }}>
          <span style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Price
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            ₱{product.price}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 12
        }}>
          <Link
            to={`/products/${product.id}`}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 12,
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 14,
              color: '#e5e7eb',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(148,163,184,0.2)';
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(148,163,184,0.1)';
              e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
            }}
          >
            Details
          </Link>
          <Link
            to={`/register/${product.id}`}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 12,
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#1e293b',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.3)';
            }}
          >
            Register →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
