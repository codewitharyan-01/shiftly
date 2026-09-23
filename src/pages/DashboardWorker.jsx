import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ShiftContext } from '../context/ShiftContext';
import DashboardLayout from '../components/DashboardLayout';
import ShiftCard from '../components/ShiftCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Messages from '../components/Messages';
import useSEO from '../utils/useSEO';
import { calculateMatchScore } from '../utils/matching';
import {
  Clock, IndianRupee, FileText, CheckCircle, Upload, Home, Search,
  ClipboardList, Wallet, User, Flame, Ghost, MessageSquare,
  TrendingUp, Star, Zap, Award, Camera, MapPin, SlidersHorizontal,
  ArrowUpRight, ChevronRight, X, Check
} from 'lucide-react';

const WORKER_NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: Search, label: 'Browse' },
  { id: 'applications', icon: ClipboardList, label: 'Applications' },
  { id: 'messages', icon: MessageSquare, label: 'Messages' },
  { id: 'earnings', icon: Wallet, label: 'Earnings' },
  { id: 'profile', icon: User, label: 'Profile' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }) => (
  <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <div style={{ padding: '8px', backgroundColor: iconBg, borderRadius: '10px' }}>
        <Icon size={20} color={iconColor} />
      </div>
      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{label}</span>
    </div>
    <p style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{value}</p>
    {sub && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>{sub}</p>}
  </div>
);

// ─── Worker Home Tab ──────────────────────────────────────────────────────────
const WorkerHome = ({ user, shifts, applications, setActiveTab }) => {
  const scoredShifts = shifts.map(s => ({ ...s, matchScore: calculateMatchScore(user, s) }));
  const recommended = scoredShifts.filter(s => s.matchScore > 50).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const urgent = shifts.filter(s => (Date.now() - s.postedAt) < 7200000).slice(0, 3);
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const acceptedShift = applications.find(a => a.status === 'Accepted');
  const todayShift = acceptedShift ? shifts.find(s => s.id === acceptedShift.shiftId) : null;

  const BADGES = [
    { icon: '⚡', label: 'Fast Responder', color: '#AF52DE', earned: true },
    { icon: '🎯', label: 'First Shift', color: 'var(--color-primary)', earned: true },
    { icon: '🔟', label: '10 Shifts Done', color: '#FF9500', earned: true },
    { icon: '💰', label: '₹10K Earned', color: 'var(--color-success)', earned: false },
    { icon: '⭐', label: 'Top Rated', color: '#FF3B30', earned: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px' }}>
            Hi, {user.name.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            🔥 7-day work streak · Ready to earn more today?
          </p>
        </div>
        <Button variant="primary" onClick={() => setActiveTab('browse')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={16} /> Find Shifts
        </Button>
      </div>

      {/* Today's Shift Card */}
      {todayShift && (
        <div className="glass-card hover-lift" style={{ background: 'linear-gradient(135deg, var(--color-primary), #0051d4)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '28px', color: '#fff', border: 'none', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ margin: '0 0 8px', opacity: 0.8, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Shift</p>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem' }}>{todayShift.title}</h2>
          <p style={{ margin: '0 0 20px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} /> {todayShift.location} · {todayShift.time}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button style={{ backgroundColor: '#fff', color: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
              ✅ Check In Now
            </button>
            <button style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
              📍 View Location
            </button>
          </div>
        </div>
      )}

      {/* Urgent banner */}
      {urgent.length > 0 && (
        <div style={{ backgroundColor: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)', fontWeight: '600', cursor: 'pointer' }} onClick={() => setActiveTab('browse')}>
          <Flame size={18} /> {urgent.length} urgent shifts near you — high pay, start soon!
          <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
        </div>
      )}

      {/* Stats */}
      <div className="auto-grid" style={{ marginBottom: '36px' }}>
        <StatCard icon={IndianRupee} iconBg="#e9f8ee" iconColor="var(--color-success)" label="Earned This Week" value="₹1,150" sub="+₹350 vs last week" />
        <StatCard icon={CheckCircle} iconBg="#e5f1ff" iconColor="var(--color-primary)" label="Shifts Completed" value="12" sub="3 this month" />
        <StatCard icon={FileText} iconBg="rgba(255,184,0,0.12)" iconColor="#FFB800" label="Pending Apps" value={pendingApps} sub="2 under review" />
      </div>

      {/* Badges */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: '36px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="var(--color-primary)" /> Your Badges
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {BADGES.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', border: `1px solid ${b.earned ? b.color : 'var(--color-border)'}`, backgroundColor: b.earned ? `${b.color}10` : 'transparent', opacity: b.earned ? 1 : 0.45 }}>
              <span>{b.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: b.earned ? b.color : 'var(--color-text-muted)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* For You Feed */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="var(--color-primary)" /> For You
        </h2>
        <button onClick={() => setActiveTab('browse')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          See all <ChevronRight size={16} />
        </button>
      </div>
      <div className="scroll-x hover-lift" style={{ marginBottom: '40px' }}>
        {recommended.length > 0 ? recommended.map(s => (
          <div key={s.id} className="premium-card" style={{ width: '85vw', maxWidth: '340px' }}>
            <ShiftCard shift={s} />
          </div>
        )) : (
          <div className="glass-card" style={{ width: '100%', textAlign: 'center' }}>
            <Ghost size={40} color="var(--color-text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px' }}>No Recommendations Yet</h3>
            <p className="text-muted" style={{ margin: '0 0 16px' }}>Complete your profile to get personalised matches.</p>
            <Button variant="primary" onClick={() => setActiveTab('profile')}>Complete Profile</Button>
          </div>
        )}
      </div>

      {/* Urgent */}
      <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame size={20} color="var(--color-danger)" /> Urgent Shifts
      </h2>
      <div className="scroll-x">
        {urgent.length > 0 ? urgent.map(s => (
          <div key={s.id} className="premium-card" style={{ width: '85vw', maxWidth: '340px' }}>
            <ShiftCard shift={s} />
          </div>
        )) : <p className="text-muted" style={{ paddingLeft: '16px' }}>No urgent shifts right now.</p>}
      </div>
    </motion.div>
  );
};

// ─── Worker Browse Tab ────────────────────────────────────────────────────────
const WorkerBrowse = ({ shifts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [minPay, setMinPay] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = shifts
    .filter(s => {
      const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || (s.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation = location ? s.location.includes(location) : true;
      const matchCategory = category ? s.category === category : true;
      const pay = parseInt((s.pay || '').replace(/[^\d]/g, '')) || 0;
      return matchSearch && matchLocation && matchCategory && pay >= minPay;
    })
    .sort((a, b) => {
      if (sortBy === 'pay') return (parseInt((b.pay || '').replace(/[^\d]/g, '')) || 0) - (parseInt((a.pay || '').replace(/[^\d]/g, '')) || 0);
      return b.postedAt - a.postedAt;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Browse Shifts</h1>
        <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: showFilters ? 'var(--color-primary)' : 'transparent', color: showFilters ? '#fff' : 'var(--color-text-main)', cursor: 'pointer', fontWeight: '500' }}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search shifts, skills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '11px 12px 11px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', outline: 'none', fontSize: '0.95rem' }} />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '11px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', outline: 'none', fontWeight: '500' }}>
          <option value="recent">Most Recent</option>
          <option value="pay">Highest Pay</option>
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Location</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none' }}>
              <option value="">All Areas</option>
              <option value="Nikol">Nikol</option>
              <option value="Gandhinagar">Gandhinagar</option>
              <option value="Infocity">Infocity</option>
              <option value="Kudasan">Kudasan</option>
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none' }}>
              <option value="">All Categories</option>
              <option value="warehouse">Warehouse</option>
              <option value="retail">Retail</option>
              <option value="events">Events</option>
              <option value="weddings">Weddings</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Min Pay: ₹{minPay}</label>
            <input type="range" min="0" max="2000" step="50" value={minPay} onChange={e => setMinPay(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          </div>
          <div style={{ flex: '1 1 80px', display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={() => { setLocation(''); setCategory(''); setMinPay(0); }} style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: '500', color: 'var(--color-text-muted)' }}>Clear</button>
          </div>
        </div>
      )}

      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>{filtered.length} shifts found</p>

      <div className="auto-grid stagger-fade-in">
        {filtered.length > 0 ? filtered.map(s => <ShiftCard key={s.id} shift={s} />) : (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <Search size={40} color="var(--color-text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px' }}>No Shifts Found</h3>
            <p className="text-muted" style={{ margin: 0 }}>Try adjusting filters or search terms.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Worker Applications Tab ──────────────────────────────────────────────────
const WorkerApplications = ({ applications, shifts }) => {
  const [checkInStep, setCheckInStep] = useState(0); // 0=none, 1=gps, 2=selfie, 3=done
  const [checkInShift, setCheckInShift] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const getStatusColor = (status) => {
    const m = { Accepted: 'var(--color-success)', Pending: '#FFB800', Rejected: 'var(--color-danger)', Completed: 'var(--color-primary)' };
    return m[status] || 'var(--color-text-muted)';
  };
  const getStatusIcon = (status) => {
    if (status === 'Accepted') return '✅';
    if (status === 'Pending') return '⏳';
    if (status === 'Rejected') return '❌';
    return '✓';
  };

  const startCheckIn = (shift) => {
    setCheckInShift(shift);
    setCheckInStep(1);
    setGpsLoading(true);
    setTimeout(() => setGpsLoading(false), 2000);
  };

  const STEPS = ['GPS Verify', 'Take Selfie', 'Confirmed'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '24px' }}>My Applications</h1>

      {/* Status legend */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[['Pending', '#FFB800'], ['Accepted', 'var(--color-success)'], ['Rejected', 'var(--color-danger)']].map(([s, c]) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c, display: 'inline-block' }} />{s}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {applications.length > 0 ? applications.map(app => {
          const shift = shifts.find(s => s.id === app.shiftId);
          if (!shift) return null;
          return (
            <div key={app.id} style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: `1px solid ${app.status === 'Accepted' ? 'rgba(52,199,89,0.3)' : 'var(--color-border)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1rem' }}>{shift.title}</h3>
                  <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{shift.date} · {shift.posterName}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {shift.location}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ padding: '5px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '700', backgroundColor: `${getStatusColor(app.status)}15`, color: getStatusColor(app.status), display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getStatusIcon(app.status)} {app.status}
                  </span>
                  {app.status === 'Accepted' && (
                    <button onClick={() => startCheckIn(shift)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Check In
                    </button>
                  )}
                </div>
              </div>

              {/* Progress timeline for Pending */}
              {app.status === 'Pending' && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0', alignItems: 'center' }}>
                  {['Applied', 'Reviewed', 'Decision'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: i === 0 ? 'var(--color-primary)' : i === 1 ? '#FFB800' : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {i < 1 ? <Check size={12} color="#fff" /> : <span style={{ fontSize: '10px', color: i < 2 ? '#fff' : 'var(--color-text-muted)' }}>{i + 1}</span>}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{step}</span>
                      </div>
                      {i < 2 && <div style={{ flex: 1, height: '2px', backgroundColor: i < 1 ? '#FFB800' : 'var(--color-border)', margin: '0 4px', marginBottom: '18px' }} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <ClipboardList size={40} color="var(--color-text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px' }}>No Applications Yet</h3>
            <p className="text-muted" style={{ margin: 0 }}>Start browsing shifts and apply!</p>
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      <Modal isOpen={checkInStep > 0} onClose={() => { setCheckInStep(0); setCheckInShift(null); }} title="Check In to Shift">
        {checkInShift && (
          <div>
            {/* Step indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
              {STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem', backgroundColor: i + 1 < checkInStep ? 'var(--color-success)' : i + 1 === checkInStep ? 'var(--color-primary)' : 'var(--color-border)', color: i + 1 <= checkInStep ? '#fff' : 'var(--color-text-muted)' }}>
                    {i + 1 < checkInStep ? <Check size={14} /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && <div style={{ width: '32px', height: '2px', backgroundColor: i + 1 < checkInStep ? 'var(--color-success)' : 'var(--color-border)' }} />}
                </div>
              ))}
            </div>

            {checkInStep === 1 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: gpsLoading ? 'rgba(0,122,255,0.1)' : 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', transition: 'background 0.5s' }}>
                  <MapPin size={32} color={gpsLoading ? 'var(--color-primary)' : 'var(--color-success)'} />
                </div>
                <h3 style={{ margin: '0 0 8px' }}>{gpsLoading ? 'Verifying Location...' : '✅ Location Verified!'}</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                  {gpsLoading ? 'Checking you are within 100m of the shift site.' : `You are near ${checkInShift.location}. Ready to proceed!`}
                </p>
                {!gpsLoading && <Button variant="primary" fullWidth onClick={() => setCheckInStep(2)}>Next: Take Selfie</Button>}
              </div>
            )}

            {checkInStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '16px', backgroundColor: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px dashed var(--color-border)' }}>
                  <Camera size={40} color="var(--color-text-muted)" />
                </div>
                <h3 style={{ margin: '0 0 8px' }}>Take a Check-In Selfie</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>This confirms your presence at the worksite and is shared with the poster.</p>
                <Button variant="primary" fullWidth onClick={() => setCheckInStep(3)}>📸 Capture Selfie</Button>
              </div>
            )}

            {checkInStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ margin: '0 0 8px' }}>You're Checked In!</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Your attendance for <strong>{checkInShift.title}</strong> is confirmed.</p>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>The poster has been notified. Have a great shift!</p>
                <Button variant="primary" fullWidth onClick={() => { setCheckInStep(0); setCheckInShift(null); }}>Done</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

// ─── Worker Earnings Tab ──────────────────────────────────────────────────────
const WorkerEarnings = ({ earnings, weeklyChart }) => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [withdrawn, setWithdrawn] = useState(false);

  const maxEarn = Math.max(...(weeklyChart || []).map(d => d.amount), 1000);
  const totalEarned = (earnings || []).reduce((sum, e) => sum + (e.amount || 0), 0);

  const MILESTONES = [
    { label: 'First Shift ✅', icon: '🎯', done: true },
    { label: '5 Shifts', icon: '⚡', done: true },
    { label: '10 Shifts', icon: '🔟', done: true },
    { label: '₹10K Earned', icon: '💰', done: totalEarned >= 10000 },
    { label: '₹50K Earned', icon: '🏆', done: totalEarned >= 50000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Earnings</h1>
        <Button variant="primary" onClick={() => setShowWithdraw(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpRight size={16} /> Withdraw Funds
        </Button>
      </div>

      {/* Balance card */}
      <div className="glass-card premium-card" style={{ background: 'linear-gradient(135deg, #007AFF, #0051d4)', padding: '28px 32px', marginBottom: '28px', color: '#fff', position: 'relative', overflow: 'hidden', border: 'none' }}>
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.07 }}><IndianRupee size={140} /></div>
        <p style={{ margin: '0 0 6px', opacity: 0.8, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available Balance</p>
        <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>₹1,150</p>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Total lifetime earnings: ₹{totalEarned.toLocaleString('en-IN')}</p>
      </div>

      {/* Weekly Chart */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '28px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} color="var(--color-primary)" /> This Week
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
          {(weeklyChart || []).map((data, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{data.amount > 0 ? `₹${data.amount}` : ''}</span>
              <div style={{ width: '100%', height: `${Math.max((data.amount / maxEarn) * 100, 4)}%`, backgroundColor: data.amount > 0 ? 'var(--color-primary)' : 'var(--color-border)', borderRadius: '6px 6px 0 0', transition: 'height 0.5s ease' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', marginBottom: '28px', border: '1px solid var(--color-border)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>🏅 Milestones</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {MILESTONES.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', backgroundColor: m.done ? 'rgba(52,199,89,0.1)' : 'var(--color-bg)', border: `1px solid ${m.done ? 'var(--color-success)' : 'var(--color-border)'}`, opacity: m.done ? 1 : 0.5 }}>
              <span>{m.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: m.done ? 'var(--color-success)' : 'var(--color-text-muted)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Transaction History</h2>
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        {(earnings || []).map((e, i) => (
          <div key={e.id} style={{ padding: '16px 24px', borderBottom: i < earnings.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(52,199,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={16} color="var(--color-success)" />
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '500', fontSize: '0.95rem' }}>{e.shiftTitle}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{e.date}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', fontWeight: '700', color: 'var(--color-success)' }}>+₹{e.amount}</p>
              <span style={{ fontSize: '0.75rem', color: e.status === 'Paid' ? 'var(--color-success)' : '#FFB800', fontWeight: '600' }}>{e.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Withdraw Modal */}
      <Modal isOpen={showWithdraw} onClose={() => { setShowWithdraw(false); setWithdrawn(false); setUpiId(''); setAmount(''); }} title="Withdraw Earnings">
        {withdrawn ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ margin: '0 0 8px' }}>Withdrawal Initiated!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>₹{amount} will arrive in your UPI account within 2 hours.</p>
            <Button variant="primary" fullWidth onClick={() => { setShowWithdraw(false); setWithdrawn(false); setUpiId(''); setAmount(''); }}>Done</Button>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>Available: <strong style={{ color: 'var(--color-text-main)' }}>₹1,150</strong></p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '500', display: 'block', marginBottom: '8px', fontSize: '0.95rem' }}>UPI ID</label>
              <input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: '500', display: 'block', marginBottom: '8px', fontSize: '0.95rem' }}>Amount (₹)</label>
              <input type="number" placeholder="1150" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem' }} />
            </div>
            <Button variant="primary" fullWidth disabled={!upiId || !amount} onClick={() => setWithdrawn(true)}>Confirm Withdrawal</Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

// ─── Worker Profile Tab ───────────────────────────────────────────────────────
const WorkerProfile = ({ user, updateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    phone: user.phone || '',
    availability: user.availability || { days: [], times: [] }
  });
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day) => {
    const days = formData.availability.days.includes(day) ? formData.availability.days.filter(d => d !== day) : [...formData.availability.days, day];
    setFormData({ ...formData, availability: { ...formData.availability, days } });
  };
  const toggleTime = (time) => {
    const times = formData.availability.times.includes(time) ? formData.availability.times.filter(t => t !== time) : [...formData.availability.times, time];
    setFormData({ ...formData, availability: { ...formData.availability, times } });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => { updateProfile({ verified: true }); setIsUploading(false); }, 2000);
  };

  const WORK_HISTORY = [
    { title: 'Warehouse Packer', company: 'Flipkart Logistics', date: 'Sep 20', pay: '₹600', rating: 5 },
    { title: 'Event Staff', company: 'EventPro Ahmedabad', date: 'Sep 15', pay: '₹800', rating: 4.5 },
    { title: 'Retail Helper', company: 'D-Mart Nikol', date: 'Sep 10', pay: '₹500', rating: 5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>{user.name}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {user.verified && <span style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(52,199,89,0.1)', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: '700' }}>✅ Verified</span>}
            <span style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(255,184,0,0.1)', color: '#FFB800', fontSize: '0.75rem', fontWeight: '700' }}>★ {user.rating || '4.8'}</span>
            <span style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(175,82,222,0.1)', color: '#AF52DE', fontSize: '0.75rem', fontWeight: '700' }}>⚡ Fast Responder</span>
          </div>
        </div>
        {/* Reliability ring */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `conic-gradient(var(--color-success) ${(user.reliabilityScore || 95) * 3.6}deg, #e5e5ea ${(user.reliabilityScore || 95) * 3.6}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-success)' }}>{user.reliabilityScore || 95}%</span>
            </div>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Reliable</p>
        </div>
      </div>

      <div className="auto-grid stagger-fade-in" style={{ gap: '20px' }}>
        {/* Personal Info */}
        <div className="glass-card">
          <h3 style={{ margin: '0 0 20px', fontSize: '1rem' }}>Personal Info</h3>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Phone</label>
              <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '500', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Bio</label>
              <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }} />
            </div>
            <Button type="submit" variant="primary" fullWidth style={{ backgroundColor: saved ? 'var(--color-success)' : undefined }}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Availability */}
          <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Availability</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Days</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button key={day} onClick={() => toggleDay(day)} style={{ padding: '5px 10px', borderRadius: '8px', border: `1px solid ${formData.availability.days.includes(day) ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: formData.availability.days.includes(day) ? 'var(--color-primary)' : 'transparent', color: formData.availability.days.includes(day) ? '#fff' : 'var(--color-text-main)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.15s' }}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time Slots</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                  <button key={time} onClick={() => toggleTime(time)} style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${formData.availability.times.includes(time) ? 'var(--color-success)' : 'var(--color-border)'}`, backgroundColor: formData.availability.times.includes(time) ? 'var(--color-success)' : 'transparent', color: formData.availability.times.includes(time) ? '#fff' : 'var(--color-text-main)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.15s' }}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Work History */}
          <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Work History</h3>
            {WORK_HISTORY.map((w, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < WORK_HISTORY.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontWeight: '600', fontSize: '0.9rem' }}>{w.title}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{w.company} · {w.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-success)' }}>{w.pay}</p>
                  <span style={{ fontSize: '0.75rem', color: '#FFB800' }}>{'★'.repeat(Math.floor(w.rating))}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ID Verification */}
          {!user.verified && (
            <div style={{ backgroundColor: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.3)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#FFB800' }}>⚠ Get Verified</h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Verified workers get 3x more acceptances. Upload your Aadhaar/ID now.</p>
              <Button variant="secondary" onClick={handleUpload} disabled={isUploading}>{isUploading ? '⏳ Uploading...' : '📤 Upload ID'}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Container ────────────────────────────────────────────────────────────
const DashboardWorker = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { shifts, applications, earnings, weeklyChart } = useContext(ShiftContext);
  const [activeTab, setActiveTab] = useState('home');

  useSEO('Worker Dashboard – Shiftly');

  if (!user || user.role !== 'worker') return <Navigate to="/login" />;

  const renderTab = () => {
    switch (activeTab) {
      case 'home':         return <WorkerHome user={user} shifts={shifts} applications={applications} setActiveTab={setActiveTab} />;
      case 'browse':       return <WorkerBrowse shifts={shifts} />;
      case 'applications': return <WorkerApplications applications={applications} shifts={shifts} />;
      case 'messages':     return <Messages />;
      case 'earnings':     return <WorkerEarnings earnings={earnings} weeklyChart={weeklyChart} />;
      case 'profile':      return <WorkerProfile user={user} updateProfile={updateProfile} />;
      default:             return <WorkerHome user={user} shifts={shifts} applications={applications} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} navItems={WORKER_NAV_ITEMS}>
      {renderTab()}
    </DashboardLayout>
  );
};

export default DashboardWorker;
