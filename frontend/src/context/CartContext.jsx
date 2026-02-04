import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        showNotification(`Updated ${product.title} quantity in cart`, 'info');
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + qty } : p));
      }
      showNotification(`Added ${product.title} to cart`, 'success');
      return [...prev, { ...product, qty }];
    });
  }, [showNotification]);

  const remove = useCallback((id) => {
    setItems((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        showNotification(`Removed ${item.title} from cart`, 'warning');
      }
      return prev.filter((p) => p.id !== id);
    });
  }, [showNotification]);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    showNotification('Cart cleared', 'info');
  }, [showNotification]);

  const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, updateQty, clear, total, itemCount }}>
      {children}
      
      {/* Styled Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            background: notification.type === 'success' 
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              : notification.type === 'warning'
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span style={{ fontSize: 20 }}>
              {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '🗑️' : 'ℹ️'}
            </span>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{notification.message}</span>
          </div>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
