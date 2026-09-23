import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Gift, Copy, Check, Share2, Users, IndianRupee, Trophy } from 'lucide-react';

const REFERRAL_HISTORY = [
  { name: 'Arun Kumar',  date: 'Sep 15', bonus: 200, status: 'Paid',    role: 'Worker' },
  { name: 'Disha Shah',  date: 'Sep 18', bonus: 200, status: 'Pending', role: 'Worker' },
  { name: 'NetPro Pvt.', date: 'Sep 20', bonus: 500, status: 'Paid',    role: 'Poster' },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Share your link',   desc: 'Copy your unique referral link and share it with friends or on social media.',         icon: '🔗' },
  { step: '2', title: 'They sign up',      desc: 'When someone signs up using your link and completes their first shift.',                  icon: '✅' },
  { step: '3', title: 'You both earn',     desc: 'You get ₹200 per worker, ₹500 per poster. Your friend gets a ₹100 joining bonus.',       icon: '🎉' },
];

const Referrals = () => {
  const { user } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const referralCode = `SHIFT${(user?.name || 'USER').slice(0, 4).toUpperCase()}23`;
  const referralLink = `https://shiftly.in/join?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalEarned = REFERRAL_HISTORY.filter(r => r.status === 'Paid').reduce((s, r) => s + r.bonus, 0);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 0 48px' }} className="fade-up visible">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #007AFF, #0051d4)', borderRadius: 'var(--radius-xl)', padding: '40px', marginBottom: '32px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.07 }}><Gift size={180} /></div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Invite & Earn 💰</h1>
        <p style={{ opacity: 0.85, marginBottom: '28px', fontSize: '1.05rem', maxWidth: '480px' }}>
          Earn ₹200 for every worker you refer, ₹500 for every poster. No limit — the more you share, the more you earn!
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[['₹200', 'per Worker'], ['₹500', 'per Poster'], ['₹100', 'Friend Bonus']].map(([val, lbl]) => (
            <div key={lbl} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: '12px 20px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{val}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.75 }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Link Card */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Your Referral Link</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <div style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: '0.9rem', fontFamily: 'monospace', color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {referralLink}
          </div>
          <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 20px', borderRadius: 'var(--radius-md)', backgroundColor: copied ? 'var(--color-success)' : 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', transition: 'background 0.2s', whiteSpace: 'nowrap' }}>
            {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Your code:</span>
          <code style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-primary)', backgroundColor: 'var(--color-bg)', padding: '2px 8px', borderRadius: '6px' }}>{referralCode}</code>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <Users size={24} color="var(--color-primary)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px' }}>{REFERRAL_HISTORY.length}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>People Referred</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <IndianRupee size={24} color="var(--color-success)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px' }}>₹{totalEarned}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Total Earned</p>
        </div>
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <Trophy size={24} color="#FFB800" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px' }}>Silver</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>Referral Tier</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>How It Works</h2>
        <div className="grid-3" style={{ position: 'relative' }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 12px', position: 'relative' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.2rem', position: 'relative', zIndex: 1 }}>
                {step.icon}
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.9rem' }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral History */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Referral History</h2>
        </div>
        {REFERRAL_HISTORY.map((r, i) => (
          <div key={i} style={{ padding: '16px 24px', borderBottom: i < REFERRAL_HISTORY.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.85rem' }}>
                {r.name[0]}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '0.9rem' }}>{r.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{r.role} · {r.date}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: '700', color: 'var(--color-success)', fontSize: '0.95rem' }}>+₹{r.bonus}</span>
              <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: r.status === 'Paid' ? 'rgba(52,199,89,0.1)' : 'rgba(255,184,0,0.1)', color: r.status === 'Paid' ? 'var(--color-success)' : '#FFB800' }}>
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Referrals;
