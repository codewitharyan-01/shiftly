import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, IndianRupee, MapPin, ArrowRight, Zap } from 'lucide-react';

const STATS = [
  { value: '2,000+',  label: 'Workers on platform' },
  { value: '350+',    label: 'Businesses served'   },
  { value: '8,500+',  label: 'Shifts completed'    },
  { value: '₹1.2Cr+', label: 'Earned by workers'  },
];

const TEAM = [
  { name: 'Aryan Patel',    role: 'Co-Founder & CEO',     avatar: 'AP', bio: 'Ex-operations at an Ahmedabad logistics startup. Passionate about dignified flexible work.' },
  { name: 'Priya Mehta',    role: 'Co-Founder & CTO',     avatar: 'PM', bio: 'Full-stack engineer with experience scaling fintech platforms in India.' },
  { name: 'Vikram Desai',   role: 'Head of Growth',       avatar: 'VD', bio: 'Previously ran demand-gen for two Gujarat-based startups.' },
];

const TIMELINE = [
  { year: 'Q1 2024', event: 'Founded in Ahmedabad. First 50 workers onboarded in Nikol.' },
  { year: 'Q2 2024', event: 'Expanded to Gandhinagar, Infocity, and Kudasan. 200 shifts filled.' },
  { year: 'Q3 2024', event: 'Launched poster dashboard, wallet system, and check-in flow.' },
  { year: 'Q4 2024', event: 'Series A fundraise. Expanding to Mumbai, Surat, and Vadodara.' },
  { year: '2025',    event: 'Pan-India launch. 100,000 workers, 10,000 businesses.' },
];

const About = () => (
  <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
    {/* Hero */}
    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', backgroundColor: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.2)', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.85rem', marginBottom: '20px' }}>
        <Zap size={14} /> Investor Deck · September 2024
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '16px', lineHeight: 1.1 }}>
        India's Shift-Based<br />Work Revolution
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.6 }}>
        Shiftly connects businesses with verified temporary workers in under 4 hours — starting with Ahmedabad, scaling to India.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/signup" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Join Platform <ArrowRight size={16} />
        </Link>
        <a href="mailto:investors@shiftly.in" style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', fontWeight: '600', textDecoration: 'none' }}>
          Contact Investors
        </a>
      </div>
    </div>

    {/* Problem */}
    <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '40px', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>🔴 The Problem</h2>
      <div className="grid-3">
        {[
          { icon: '⏱️', title: 'Too Slow',   desc: 'Businesses spend 2–3 days finding temp workers through word-of-mouth or generic job boards.' },
          { icon: '🤝', title: 'No Trust',   desc: 'No verification, no ratings, no accountability. High no-show rates hurt businesses.' },
          { icon: '💸', title: 'No Payment', desc: 'Workers often wait weeks for payment. Posters have no easy way to pay workers instantly.' },
        ].map(p => (
          <div key={p.title} style={{ padding: '20px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{p.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{p.title}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Solution */}
    <div style={{ background: 'linear-gradient(135deg, #007AFF, #0051d4)', borderRadius: 'var(--radius-xl)', padding: '40px', marginBottom: '32px', color: '#fff' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>✅ Our Solution</h2>
      <div className="grid-3">
        {[
          { icon: '⚡', title: 'Fill in 4 Hours', desc: 'Smart matching sends shifts to the right workers instantly.' },
          { icon: '🔒', title: 'Full Trust Layer', desc: 'ID verification, reliability scores, and GPS check-ins.' },
          { icon: '💳', title: 'Instant Pay',      desc: 'Workers get paid to UPI within 2 hours of completing a shift.' },
        ].map(s => (
          <div key={s.title} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{s.icon}</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{s.title}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Traction */}
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>📈 Traction</h2>
      <div className="grid-4">
        {STATS.map(s => (
          <div key={s.label} style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 4px', color: 'var(--color-primary)' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Business Model */}
    <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', padding: '40px', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>💼 Business Model</h2>
      <div className="grid-3">
        {[
          { stream: 'Platform Fee',      amount: '₹50/shift',    desc: 'Charged to poster each time a shift is successfully filled.' },
          { stream: 'Urgent Surcharge',  amount: '₹100/shift',   desc: 'Extra fee for urgent shifts (< 24 hours notice).'           },
          { stream: 'Pro Plans',         amount: '₹999/month',   desc: 'Monthly subscription for analytics, talent pool, priority.' },
        ].map(m => (
          <div key={m.stream} style={{ padding: '20px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{m.stream}</h3>
            <p style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary)' }}>{m.amount}</p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Roadmap */}
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px' }}>🗺️ Roadmap</h2>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--color-border)' }} />
        {TIMELINE.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px', position: 'relative' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: i < 3 ? 'var(--color-primary)' : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, border: '3px solid var(--color-bg)' }}>
              {i < 3 ? '✓' : <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{i + 1}</span>}
            </div>
            <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flex: 1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: i < 3 ? 'var(--color-primary)' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.year}</span>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Team */}
    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>👥 The Team</h2>
    <div className="grid-3" style={{ marginBottom: '48px' }}>
      {TEAM.map(m => (
        <div key={m.name} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '1.1rem', margin: '0 auto 12px' }}>{m.avatar}</div>
          <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{m.name}</h3>
          <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600' }}>{m.role}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{m.bio}</p>
        </div>
      ))}
    </div>

    {/* CTA */}
    <div style={{ background: 'linear-gradient(135deg, #007AFF, #0051d4)', borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center', color: '#fff' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>Ready to Partner with Us?</h2>
      <p style={{ opacity: 0.85, marginBottom: '28px', fontSize: '1rem' }}>Whether you're an investor, strategic partner, or enterprise customer — we'd love to talk.</p>
      <a href="mailto:investors@shiftly.in" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 'var(--radius-md)', backgroundColor: '#fff', color: 'var(--color-primary)', fontWeight: '800', textDecoration: 'none', fontSize: '1rem' }}>
        investors@shiftly.in
      </a>
    </div>
  </div>
);

export default About;
