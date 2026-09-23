import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Search, IndianRupee, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    emoji: '🔍',
    bg: 'var(--color-primary-bg)',
    color: 'var(--color-primary)',
    icon: <Search size={32} color="var(--color-primary)" />,
    title: 'Find Shifts Instantly',
    desc: 'Browse hundreds of local shifts in retail, events, and warehousing across Ahmedabad. Apply with one tap.',
  },
  {
    emoji: '💸',
    bg: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    icon: <IndianRupee size={32} color="var(--color-success)" />,
    title: 'Get Paid Fast',
    desc: 'Receive earnings directly to your UPI account immediately after completing a shift. No delays.',
  },
  {
    emoji: '🛡️',
    bg: 'rgba(88,86,214,0.1)',
    color: '#5856D6',
    icon: <ShieldCheck size={32} color="#5856D6" />,
    title: 'Safe & Verified',
    desc: 'All businesses are background-checked. Ratings and reviews ensure you always know who you\'re working for.',
  },
];

const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('shiftly_onboarded')) {
      const t = setTimeout(() => setIsOpen(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('shiftly_onboarded', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const s = STEPS[step];

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInOverlay 0.2s ease',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          width: '100%', maxWidth: '400px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          animation: 'scaleInModal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          padding: '32px',
        }}
      >
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '28px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: '4px',
                borderRadius: '99px',
                width: i === step ? '28px' : '12px',
                backgroundColor: i === step ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            backgroundColor: s.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            {s.icon}
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px', color: 'var(--color-text-main)' }}>{s.title}</h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '28px' }}>{s.desc}</p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {step > 0 && (
            <Button variant="secondary" size="md" onClick={() => setStep(s => s - 1)} style={{ flex: 0 }}>Back</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="primary" size="md" fullWidth onClick={() => setStep(s => s + 1)}>Continue</Button>
          ) : (
            <Button variant="primary" size="md" fullWidth onClick={handleClose}>Get Started! 🚀</Button>
          )}
        </div>

        <button
          onClick={handleClose}
          style={{ display: 'block', margin: '16px auto 0', fontSize: '13px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Skip tour
        </button>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleInModal { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default OnboardingModal;
