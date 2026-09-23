import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const newNotif = { id, message, type, read: false, ts: new Date() };

    // Keep last 20 in history
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));

    // Show toast
    setToast(newNotif);
    setTimeout(() => setToast(null), 3500);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, toast, addNotification, removeNotification, markAllRead }}>
      {children}

      {/* Toast popup */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9999,
          backgroundColor: 'var(--color-bg-card)',
          border: `1px solid ${toast.type === 'success' ? 'var(--color-success)' : toast.type === 'error' ? 'var(--color-danger)' : 'var(--color-primary)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          maxWidth: '320px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideUp 0.3s ease',
        }}>
          <span style={{ fontSize: '18px' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>{toast.message}</p>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
