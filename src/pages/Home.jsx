import React, { useContext, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, CheckCircle, IndianRupee, Star, ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import Button from '../components/Button';
import ShiftCard from '../components/ShiftCard';
import { ShiftContext } from '../context/ShiftContext';
import { LanguageContext } from '../context/LanguageContext';
import { mockTestimonials } from '../utils/mockData';

const FadeSection = ({ children, style = {}, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const StatCard = ({ value, label, color }) => (
  <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
    <div style={{ fontSize: '32px', fontWeight: '800', color, marginBottom: '6px', letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{label}</div>
  </div>
);

const Home = () => {
  const { shifts } = useContext(ShiftContext);
  const { t } = useContext(LanguageContext);
  const featuredShifts = shifts.slice(0, 6);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(155deg, #eef4ff 0%, #f0f6ff 30%, #f5f5f7 70%, #ffffff 100%)',
          padding: '96px 0 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft background shape */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '800px',
          background: 'radial-gradient(ellipse at top, rgba(0,122,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle at center, rgba(175, 82, 222, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle at center, rgba(52,199,89,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <FadeSection>
            {/* Label pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', padding: '5px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
              <Zap size={13} fill="currentColor" /> Now live in Ahmedabad
            </div>

            <h1 style={{ fontWeight: '800', letterSpacing: '-1px', marginBottom: '20px', color: 'var(--color-text-main)' }}>
              {t('hero_title')}
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              {t('hero_subtitle')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Button to="/browse" variant="primary" size="lg">
                {t('find_work')} <ArrowRight size={16} />
              </Button>
              <Button to="/signup" variant="secondary" size="lg">
                {t('post_shift')}
              </Button>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ padding: '32px 16px' }}>
          <div className="scroll-x">
            <FadeSection style={{ width: '80vw', maxWidth: '300px' }}><StatCard value="1,240" label="Shifts posted this week" color="var(--color-primary)" /></FadeSection>
            <FadeSection style={{ width: '80vw', maxWidth: '300px' }}><StatCard value="₹8.2L" label="Paid to workers" color="var(--color-success)" /></FadeSection>
            <FadeSection style={{ width: '80vw', maxWidth: '300px' }}>
              <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '32px', fontWeight: '800', color: '#FF9500', marginBottom: '6px' }}>
                  4.9 <Star size={22} fill="#FF9500" color="#FF9500" />
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontWeight: '500' }}>Average worker rating</div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how-it-works" className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <FadeSection style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Simple & Fast</p>
            <h2>How It Works</h2>
          </FadeSection>

          <div className="grid-3">
            {[
              { icon: <Search size={24} color="var(--color-primary)" />, bg: 'var(--color-primary-bg)', title: 'Post or Browse', desc: 'Businesses list shifts in seconds. Workers find nearby gigs instantly.' },
              { icon: <CheckCircle size={24} color="var(--color-success)" />, bg: 'var(--color-success-bg)', title: 'Show Up & Work', desc: 'Verified shifts with clear instructions. Just arrive and get to work.' },
              { icon: <IndianRupee size={24} color="var(--color-warning)" />, bg: 'var(--color-warning-bg)', title: 'Get Paid Instantly', desc: 'Earnings directly to your UPI account the moment a shift ends.' },
            ].map((step, i) => (
              <FadeSection key={i} delay={i * 0.1}>
                <div className="card hover-lift premium-card" style={{ textAlign: 'center', padding: '32px 24px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'inline-flex', padding: '14px', backgroundColor: step.bg, borderRadius: '14px', marginBottom: '20px' }}>
                    {step.icon}
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{step.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Shifts ───────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <FadeSection style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Live Now</p>
              <h2 style={{ margin: 0 }}>Featured Shifts</h2>
            </div>
            <Link to="/browse" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={14} />
            </Link>
          </FadeSection>

          <div className="grid-3">
            {featuredShifts.map((shift, i) => (
              <FadeSection key={shift.id} delay={i * 0.07}>
                <ShiftCard shift={shift} />
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <FadeSection style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Real Stories</p>
            <h2>What People Say</h2>
          </FadeSection>

          <div className="grid-3">
            {mockTestimonials.map((t, i) => (
              <FadeSection key={t.id} delay={i * 0.1}>
                <div className="card hover-lift premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, si) => <Star key={si} size={14} fill="#FF9500" color="#FF9500" />)}
                  </div>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-main)', lineHeight: '1.65', flexGrow: 1, marginBottom: '20px' }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--color-primary)', fontSize: '16px' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-main)' }}>{t.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} /> {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--color-primary)', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', padding: '5px 14px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
            <Users size={13} /> Join 5,000+ workers & 200+ businesses
          </div>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>Ready to get started?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>Sign up free — post or find a shift in under 2 minutes.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Button to="/signup" variant="secondary" size="lg">Get Started Free</Button>
            <Button to="/browse" size="lg" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>Browse Shifts</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
