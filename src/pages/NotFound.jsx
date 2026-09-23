import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/Button';
import useSEO from '../utils/useSEO';
import useAnalytics from '../utils/useAnalytics';

const NotFound = () => {
  useSEO('Page Not Found');
  useAnalytics('404 NotFound');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 200px)', padding: '0 24px', textAlign: 'center' }}>
      <div className="fade-up visible">
        <div style={{ fontSize: '72px', lineHeight: 1, marginBottom: '24px' }}>🔍</div>
        <h1 style={{ fontSize: '80px', fontWeight: '800', color: 'var(--color-text-main)', letterSpacing: '-2px', marginBottom: '8px', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-main)' }}>This page doesn't exist</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '360px', margin: '0 auto 32px', fontSize: '15px', lineHeight: 1.6 }}>
          The page you're looking for has moved, been removed, or never existed.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/" variant="primary" size="lg">Go Home</Button>
          <Button to="/browse" variant="secondary" size="lg">Browse Shifts</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
