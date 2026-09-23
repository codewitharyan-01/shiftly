import React, { useState } from 'react';
import { Check, X, Zap, Crown, Building2 } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: '🆓',
    price: '₹0',
    period: 'forever',
    desc: 'For individuals and small businesses just starting out.',
    color: 'var(--color-text-muted)',
    features: [
      ['Post up to 2 shifts/month', true],
      ['Browse all available workers', true],
      ['Basic applicant management', true],
      ['In-app chat', true],
      ['Email support', true],
      ['Analytics dashboard', false],
      ['Talent Pool access', false],
      ['Priority listing', false],
      ['Dedicated account manager', false],
      ['Custom branding', false],
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: '⚡',
    price: '₹999',
    period: '/month',
    desc: 'For growing businesses that need to hire regularly and quickly.',
    color: 'var(--color-primary)',
    popular: true,
    features: [
      ['Post up to 20 shifts/month', true],
      ['Browse all available workers', true],
      ['Advanced applicant management', true],
      ['In-app chat', true],
      ['Priority email & phone support', true],
      ['Analytics dashboard', true],
      ['Talent Pool access', true],
      ['Priority listing', true],
      ['Dedicated account manager', false],
      ['Custom branding', false],
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: '🏢',
    price: 'Custom',
    period: '',
    desc: 'For large organisations, staffing agencies, and high-volume hirers.',
    color: '#AF52DE',
    features: [
      ['Unlimited shifts', true],
      ['Browse all available workers', true],
      ['Advanced applicant management', true],
      ['In-app chat', true],
      ['24/7 priority support', true],
      ['Analytics dashboard', true],
      ['Talent Pool access', true],
      ['Priority listing', true],
      ['Dedicated account manager', true],
      ['Custom branding', true],
    ],
  },
];

const Pricing = () => {
  const [billing, setBilling] = useState('monthly');

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '60px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.03em' }}>Simple, Transparent Pricing</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '28px' }}>No hidden fees. Pay for what you use. Cancel anytime.</p>
        <div style={{ display: 'inline-flex', backgroundColor: 'var(--color-bg-card)', borderRadius: '100px', padding: '4px', border: '1px solid var(--color-border)', gap: '4px' }}>
          {[['monthly', 'Monthly'], ['annual', 'Annual (20% off)']].map(([v, l]) => (
            <button key={v} onClick={() => setBilling(v)} style={{ padding: '8px 20px', borderRadius: '100px', border: 'none', backgroundColor: billing === v ? 'var(--color-primary)' : 'transparent', color: billing === v ? '#fff' : 'var(--color-text-muted)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid-3" style={{ alignItems: 'stretch', gap: '20px', marginBottom: '60px' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: `2px solid ${plan.popular ? plan.color : 'var(--color-border)'}`, padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', transform: plan.popular ? 'scale(1.02)' : 'none', boxShadow: plan.popular ? 'var(--shadow-lg)' : 'none' }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', backgroundColor: plan.color, color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                ⭐ Most Popular
              </div>
            )}
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{plan.icon}</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 4px', color: plan.color }}>{plan.name}</h2>
              <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{plan.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text-main)' }}>
                  {plan.id === 'pro' && billing === 'annual' ? '₹799' : plan.price}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{plan.period}</span>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.features.map(([feat, included]) => (
                <div key={feat} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', opacity: included ? 1 : 0.45 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: included ? `${plan.color}15` : 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    {included ? <Check size={11} color={plan.color} strokeWidth={3} /> : <X size={11} color="var(--color-text-muted)" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: included ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>{feat}</span>
                </div>
              ))}
            </div>

            <button style={{ padding: '13px', borderRadius: 'var(--radius-md)', border: `2px solid ${plan.popular ? plan.color : 'var(--color-border)'}`, backgroundColor: plan.popular ? plan.color : 'transparent', color: plan.popular ? '#fff' : 'var(--color-text-main)', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.15s', width: '100%' }}
              onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.borderColor = plan.color; e.currentTarget.style.color = plan.color; }}}
              onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-main)'; }}}>
              {plan.id === 'enterprise' ? 'Contact Sales' : plan.id === 'free' ? 'Get Started Free' : 'Start Free Trial'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>Frequently Asked Questions</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          ['Is there a free trial?',              'Yes! All Pro features are available for 14 days free. No credit card required.'],
          ['Can I switch plans anytime?',          'Absolutely. Upgrade or downgrade at any time. Prorated charges apply.'],
          ['Are platform fees included in plans?', 'No. Platform fees (₹50 per filled shift) apply regardless of plan. Plans give you more posting limits and features.'],
          ['Do workers pay anything?',             'Workers join and use Shiftly completely free. Only posters have optional paid plans.'],
        ].map(([q, a], i) => (
          <div key={i} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '20px 24px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem' }}>{q}</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
