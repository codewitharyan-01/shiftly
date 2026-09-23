import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Bell, X, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const DashboardLayout = ({ children, activeTab, setActiveTab, onLogout, navItems = [] }) => {
  const { user } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const unread = (notifications || []).filter(n => !n.read).length;
  const recentNotifs = (notifications || []).slice(-5).reverse();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg)', overflowX: 'hidden' }}>
      
      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="desktop-sidebar" style={{
        width: '260px',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Zap size={24} fill="var(--color-primary)" color="var(--color-primary)" />
            <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>Shiftly</span>
          </Link>
        </div>

        {/* User Profile Summary */}
        {user && (
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize', fontWeight: '500' }}>{user.role} Account</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                backgroundColor: activeTab === item.id ? 'var(--color-primary-bg)' : 'transparent',
                color: activeTab === item.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === item.id ? '600' : '500',
                width: '100%', textAlign: 'left',
                transition: 'all 0.2s ease',
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)' }}
              onMouseLeave={e => { if (activeTab !== item.id) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <Link
            to="/profile"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>👤</span> Full Profile
          </Link>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: 'var(--color-danger)', fontWeight: '600', width: '100%', textAlign: 'left', backgroundColor: 'transparent', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', transition: 'all 0.2s', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-danger-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────── */}
      <div className="dashboard-main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Top Header */}
        <header style={{ 
          position: 'sticky', top: 0, zIndex: 40, 
          backgroundColor: 'rgba(255,255,255,0.85)', 
          backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', 
          borderBottom: '1px solid var(--color-border)', 
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)', letterSpacing: '-0.3px' }}>
            {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Bell size={18} color="var(--color-text-main)" />
                {unread > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', color: '#fff', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-bg-card)' }}>
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div style={{ position: 'absolute', top: '50px', right: 0, width: '340px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', boxShadow: '0 24px 48px rgba(0,0,0,0.12)', border: '1px solid var(--color-border)', zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      <X size={18} />
                    </button>
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {recentNotifs.length > 0 ? recentNotifs.map((n, i) => (
                      <div key={i} style={{ padding: '16px 20px', borderBottom: i < recentNotifs.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: n.type === 'success' ? 'var(--color-success)' : n.type === 'error' ? 'var(--color-danger)' : 'var(--color-primary)', marginTop: '6px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--color-text-main)' }}>{n.message}</p>
                      </div>
                    )) : (
                      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                        No notifications right now.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Mobile Profile Avatar (Only visible on mobile via CSS) */}
            <Link to="/profile" className="mobile-profile-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'none', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '1rem', textDecoration: 'none' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-main" style={{ flex: 1, padding: '32px 24px 40px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          {children}
        </main>
        
        {/* Dashboard Footer removed per user request */}
        {/* Spacer for mobile bottom nav */}
        <div className="mobile-bottom-nav-spacer" style={{ height: '80px' }} />
      </div>

      {/* ── Mobile Bottom Nav ───────────────────────────────── */}
      <nav className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'saturate(200%) blur(24px)',
        WebkitBackdropFilter: 'saturate(200%) blur(24px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between',
        padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        zIndex: 1000,
      }}>
        {navItems.slice(0, 5).map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                backgroundColor: 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.7rem', fontWeight: isActive ? '700' : '500',
                padding: '4px', border: 'none', cursor: 'pointer',
                flex: 1, minWidth: 0, transition: 'all 0.2s',
                transform: isActive ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
