import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X, Zap, LogOut } from 'lucide-react';
import Button from './Button';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Detect scroll for enhanced glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.72)',
    backdropFilter: 'saturate(180%) blur(16px)',
    WebkitBackdropFilter: 'saturate(180%) blur(16px)',
    borderBottom: `1px solid ${scrolled ? 'rgba(0,0,0,0.09)' : 'rgba(0,0,0,0.05)'}`,
    transition: 'background 0.3s ease, border-color 0.3s ease',
  };

  const langBtn = (code, label) => (
    <button
      key={code}
      onClick={() => setLang(code)}
      style={{
        padding: '4px 9px',
        fontSize: '12px',
        fontWeight: lang === code ? '700' : '500',
        borderRadius: '6px',
        backgroundColor: lang === code ? '#fff' : 'transparent',
        boxShadow: lang === code ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
        color: lang === code ? 'var(--color-text-main)' : 'var(--color-text-muted)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );

  return (
    <nav style={navStyle}>
      <div className="container" style={{ height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontWeight: '700', fontSize: '20px',
            color: 'var(--color-text-main)', letterSpacing: '-0.4px',
          }}
        >
          <Zap size={20} fill="var(--color-primary)" color="var(--color-primary)" />
          Shiftly
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link to="/#how-it-works" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-main)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >How It Works</Link>
          <Link to="/browse" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-main)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >{t('find_work')}</Link>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!user ? (
              <>
                <Button to="/login" variant="secondary" size="sm">{t('login')}</Button>
                <Button to="/signup" variant="primary" size="sm">{t('post_shift')}</Button>
              </>
            ) : (
              <>
                <Link to={user.role === 'worker' ? '/worker/dashboard' : '/poster/dashboard'} style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>Dashboard</Link>
                <Link to="/profile" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-text-main)', marginLeft: '12px' }}>Profile</Link>
                <button 
                  onClick={logout} 
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginLeft: '12px' }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </>
            )}
          </div>

          {/* Language switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(0,0,0,0.05)', padding: '3px', borderRadius: '8px' }}>
            <Globe size={13} color="var(--color-text-muted)" style={{ marginLeft: '4px', marginRight: '2px' }} />
            {langBtn('en', 'EN')}
            {langBtn('gu', 'GU')}
            {langBtn('hi', 'HI')}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="mobile-hamburger"
          style={{ padding: '8px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--color-border)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <Link to="/#how-it-works" style={{ fontSize: '16px', fontWeight: '500', padding: '8px 0', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>How It Works</Link>
          <Link to="/browse" style={{ fontSize: '16px', fontWeight: '500', padding: '8px 0', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-main)' }}>{t('find_work')}</Link>
          
          <div style={{ display: 'flex', gap: '8px', paddingTop: '4px', flexDirection: 'column' }}>
            {!user ? (
              <>
                <Button to="/login" variant="secondary" size="md" fullWidth>{t('login')}</Button>
                <Button to="/signup" variant="primary" size="md" fullWidth>{t('post_shift')}</Button>
              </>
            ) : (
              <>
                <Button to={user.role === 'worker' ? '/worker/dashboard' : '/poster/dashboard'} variant="primary" size="md" fullWidth>Dashboard</Button>
                <Button to="/profile" variant="secondary" size="md" fullWidth>Profile</Button>
                <Button onClick={logout} variant="outline" size="md" fullWidth style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>Log Out</Button>
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--color-bg-hover)', padding: '6px', borderRadius: '10px', width: 'fit-content', marginTop: '8px' }}>
            <Globe size={14} color="var(--color-text-muted)" />
            {langBtn('en', 'EN')}
            {langBtn('gu', 'GU')}
            {langBtn('hi', 'HI')}
          </div>
        </div>
      )}

      {/* Hide desktop-nav on mobile via inline media via JS-class trick */}
      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-hamburger { display: flex !important; } }
      `}</style>
    </nav>
  );
};

export default Navbar;
