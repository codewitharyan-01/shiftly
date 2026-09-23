import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Footer = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <footer
      className="shiftly-footer"
      style={{
        backgroundColor: isDashboard ? 'transparent' : 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
        marginTop: isDashboard ? 0 : '48px',
      }}
    >
      <div
        style={{
          maxWidth: isDashboard ? '100%' : '1200px',
          margin: '0 auto',
          padding: isDashboard ? '32px 0 0' : '40px 24px 0',
        }}
      >
        {/* ── Top Row: Brand + Links ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            paddingBottom: '28px',
          }}
        >
          {/* Brand */}
          <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                textDecoration: 'none',
                marginBottom: '10px',
              }}
            >
              <Zap size={16} fill="var(--color-primary)" color="var(--color-primary)" />
              <span
                style={{
                  fontWeight: '700',
                  fontSize: '15px',
                  color: 'var(--color-text-main)',
                  letterSpacing: '-0.3px',
                }}
              >
                Shiftly
              </span>
            </Link>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.6,
                margin: '8px 0 0',
                maxWidth: '240px',
              }}
            >
              Pick a shift. Get paid. Short-term jobs in Ahmedabad made easy.
            </p>
          </div>

          {/* Links Group: Company */}
          <div style={{ flex: '0 0 auto' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
              }}
            >
              Company
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><FooterLink to="/about">About</FooterLink></li>
              <li><FooterLink to="/pricing">Pricing</FooterLink></li>
              <li><FooterLink to="/help">Help Center</FooterLink></li>
            </ul>
          </div>

          {/* Links Group: Legal */}
          <div style={{ flex: '0 0 auto' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
              }}
            >
              Legal
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><FooterLink to="/terms">Terms</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy</FooterLink></li>
              <li><FooterLink to="/disputes">Disputes</FooterLink></li>
            </ul>
          </div>

          {/* Links Group: Connect */}
          <div style={{ flex: '0 0 auto' }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
              }}
            >
              Connect
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><FooterLink href="https://twitter.com">Twitter</FooterLink></li>
              <li><FooterLink href="https://linkedin.com">LinkedIn</FooterLink></li>
              <li><FooterLink href="https://instagram.com">Instagram</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '16px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} Shiftly. All rights reserved.
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Made with ♥ in Ahmedabad
          </span>
        </div>
      </div>
    </footer>
  );
};

/* ── Tiny Link sub-component ── */
const FooterLink = ({ to, href, children }) => {
  const style = {
    fontSize: '13px',
    color: 'var(--color-text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  };
  const hover = {
    onMouseEnter: (e) => { e.currentTarget.style.color = 'var(--color-primary)'; },
    onMouseLeave: (e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; },
  };

  if (to) {
    return <Link to={to} style={style} {...hover}>{children}</Link>;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...hover}>{children}</a>;
};

export default Footer;
