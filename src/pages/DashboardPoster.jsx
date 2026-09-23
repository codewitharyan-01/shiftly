import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ShiftContext } from '../context/ShiftContext';
import { NotificationContext } from '../context/NotificationContext';
import DashboardLayout from '../components/DashboardLayout';
import Messages from '../components/Messages';
import Analytics from './Analytics';
import TalentPool from './TalentPool';
import Referrals from './Referrals';
import Disputes from './Disputes';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import useSEO from '../utils/useSEO';
import {
  Home, PlusCircle, Settings, Wallet, User, CheckCircle, Clock,
  MapPin, IndianRupee, Bell, Download, FileText, Upload, Ghost,
  MessageSquare, TrendingUp, Users, Zap, ChevronRight, Eye,
  Flame, Star, ArrowUpRight, Check, X, BarChart2, Gift, AlertTriangle
} from 'lucide-react';

const POSTER_NAV_ITEMS = [
  { id: 'home',     icon: Home,          label: 'Home'        },
  { id: 'post',     icon: PlusCircle,    label: 'Post Shift'  },
  { id: 'manage',   icon: Settings,      label: 'Manage'      },
  { id: 'workers',  icon: Users,         label: 'Talent Pool' },
  { id: 'messages', icon: MessageSquare, label: 'Messages'    },
  { id: 'analytics',icon: BarChart2,     label: 'Analytics'   },
  { id: 'payments', icon: Wallet,        label: 'Payments'    },
  { id: 'referrals',icon: Gift,          label: 'Referrals'   },
  { id: 'disputes', icon: AlertTriangle, label: 'Disputes'    },
  { id: 'profile',  icon: User,          label: 'Profile'     },
];

const SHIFT_TEMPLATES = [
  { id: 'warehouse', name: 'Warehouse Packer', description: 'Pack and sort items in a warehouse. Fast-paced. Punctuality required.', pay: 600, category: 'warehouse' },
  { id: 'event',     name: 'Event Helper',     description: 'Guest registration, seating, and light setup for local events.',        pay: 800, category: 'events'    },
  { id: 'retail',    name: 'Retail Staff',     description: 'Assist customers, manage inventory during peak hours.',                  pay: 500, category: 'retail'    },
  { id: 'delivery',  name: 'Delivery Runner',  description: 'Local delivery on 2-wheeler within the city.',                          pay: 700, category: 'other'     },
];

const LOCATIONS = ['Nikol, Ahmedabad', 'Gandhinagar', 'Infocity, Gandhinagar', 'Kudasan, Gandhinagar', 'SG Highway, Ahmedabad', 'Satellite, Ahmedabad', 'Vastrapur, Ahmedabad'];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, sub, onClick }) => (
  <div onClick={onClick} style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.15s' }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
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

// ─── Poster Home Tab ──────────────────────────────────────────────────────────
const PosterHome = ({ user, shifts, applications, setActiveTab }) => {
  const myShifts = shifts.filter(s => s.posterId === user.id || s.posterId === 'p1' || s.posterId === 'p0');
  const activeShifts = myShifts.filter(s => s.status === 'open').length;
  const totalApps = applications.filter(a => myShifts.some(s => s.id === a.shiftId)).length;
  const pendingReviews = applications.filter(a => a.status === 'Pending' && myShifts.some(s => s.id === a.shiftId)).length;

  const RECENT_ACTIVITY = [
    { icon: '✅', text: <><strong>Rahul Patel</strong> completed <em>Warehouse Packer</em> shift</>, time: '2 hours ago', color: 'var(--color-success)' },
    { icon: '📩', text: <><strong>Priya Sharma</strong> applied for <em>Event Staff</em></>, time: '5 hours ago', color: 'var(--color-primary)' },
    { icon: '✍️', text: <>You posted <em>Retail Helper</em> shift</>, time: 'Yesterday', color: 'var(--color-text-muted)' },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px' }}>Hi, {user.businessName || user.name}! 🏢</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Here is your business overview for today.</p>
        </div>
        <Button variant="primary" onClick={() => setActiveTab('post')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlusCircle size={16} /> Post a Shift
        </Button>
      </div>

      {/* Alert: pending reviews */}
      {pendingReviews > 0 && (
        <div onClick={() => setActiveTab('manage')} style={{ backgroundColor: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.2)', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer' }}>
          <Bell size={18} /> {pendingReviews} applicants waiting for your review
          <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
        </div>
      )}

      {/* Stats */}
      <div className="scroll-x" style={{ marginBottom: '36px' }}>
        <div style={{ width: '80vw', maxWidth: '300px' }}>
          <StatCard icon={FileText} iconBg="#e5f1ff" iconColor="var(--color-primary)" label="Active Shifts" value={activeShifts} sub="Open for applications" onClick={() => setActiveTab('manage')} />
        </div>
        <div style={{ width: '80vw', maxWidth: '300px' }}>
          <StatCard icon={Users} iconBg="#e9f8ee" iconColor="var(--color-success)" label="Total Applicants" value={totalApps} sub={`${pendingReviews} pending review`} onClick={() => setActiveTab('manage')} />
        </div>
        <div style={{ width: '80vw', maxWidth: '300px' }}>
          <StatCard icon={IndianRupee} iconBg="rgba(255,184,0,0.12)" iconColor="#FFB800" label="Spent This Month" value="₹3,200" sub="Avg ₹600/shift" />
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Quick Actions</h2>
      <div className="auto-grid stagger-fade-in" style={{ marginBottom: '36px' }}>
        {[
          { icon: PlusCircle, label: 'Post New Shift', sub: 'Takes 2 minutes', color: 'var(--color-primary)', action: () => setActiveTab('post') },
          { icon: Settings,   label: 'Manage Shifts',  sub: 'Review applicants',     color: 'var(--color-success)', action: () => setActiveTab('manage') },
          { icon: Wallet,     label: 'Add Funds',      sub: 'Top up your wallet',    color: '#FFB800',              action: () => setActiveTab('payments') },
        ].map(qa => (
          <div key={qa.label} className="premium-card hover-lift" onClick={qa.action} style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = qa.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${qa.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <qa.icon size={22} color={qa.color} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px', fontWeight: '700', fontSize: '0.95rem' }}>{qa.label}</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{qa.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shifts Live */}
      {myShifts.filter(s => s.status === 'open').length > 0 && (
        <>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(52,199,89,0.2)' }} />
            Live Shifts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
            {myShifts.filter(s => s.status === 'open').slice(0, 3).map(shift => {
              const appCount = applications.filter(a => a.shiftId === shift.id).length;
              return (
                <div key={shift.id} style={{ backgroundColor: 'var(--color-bg-card)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>{shift.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{shift.location} · {shift.date}</p>
                  </div>
                  <div style={{ display: 'flex', align: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-primary)' }}>{appCount} applicants</span>
                    <button onClick={() => setActiveTab('manage')} style={{ padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Review</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent Activity */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={18} color="var(--color-primary)" /> Recent Activity
      </h2>
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {RECENT_ACTIVITY.map((a, i) => (
          <div key={i} style={{ padding: '16px 24px', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: '0.9rem' }}>{a.text}</p></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{a.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Post Shift Tab ───────────────────────────────────────────────────────────
const PosterPostShift = ({ user, addShift, addNotification, setActiveTab }) => {
  const [formData, setFormData] = useState({ title: '', category: 'warehouse', location: '', date: '', time: '', pay: '', description: '', urgent: false, reqAge: false, reqTransport: false, reqExperience: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyTemplate = (id) => {
    const t = SHIFT_TEMPLATES.find(x => x.id === id);
    if (t) setFormData(prev => ({ ...prev, title: t.name, description: t.description, pay: String(t.pay), category: t.category }));
  };

  const platformFee = formData.urgent ? 100 : 50;
  const total = parseInt(formData.pay || 0) + platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.pay || !formData.date) {
      addNotification('Please fill all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      addShift({ title: formData.title, category: formData.category, posterId: user.id, posterName: user.businessName || user.name, description: formData.description, location: formData.location, date: formData.date, time: formData.time || 'TBD', pay: `₹${formData.pay}/shift`, numericPay: parseInt(formData.pay), status: 'open', postedAt: Date.now(), isUrgent: formData.urgent });
      setIsSubmitting(false);
      addNotification('🎉 Shift posted successfully!', 'success');
      setActiveTab('manage');
    }, 900);
  };

  const selectStyle = { width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' };
  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '4px' }}>Post a Shift</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Fill in details to find the right workers fast.</p>
        </div>
        <div onClick={() => setFormData(p => ({ ...p, urgent: !p.urgent }))} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', border: `1.5px solid ${formData.urgent ? 'var(--color-danger)' : 'var(--color-border)'}`, backgroundColor: formData.urgent ? 'rgba(255,59,48,0.08)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
          <Flame size={16} color={formData.urgent ? 'var(--color-danger)' : 'var(--color-text-muted)'} />
          <span style={{ fontWeight: '600', fontSize: '0.9rem', color: formData.urgent ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>Urgent Mode</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div style={{ display: 'grid', gap: '24px' }} className="post-grid">
          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card stagger-fade-in" style={{ padding: '28px', borderRadius: 'var(--radius-lg)' }}>
            {/* Template picker */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.85rem', display: 'block', marginBottom: '8px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Templates</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SHIFT_TEMPLATES.map(t => (
                  <button key={t.id} type="button" onClick={() => applyTemplate(t.id)} style={{ padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', color: 'var(--color-text-main)', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-main)'; }}>
                    ⚡ {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="auto-grid" style={{ marginBottom: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Shift Title *</label>
                <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Warehouse Packer - Nikol" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Category *</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={selectStyle}>
                  <option value="warehouse">Warehouse / Logistics</option>
                  <option value="retail">Retail</option>
                  <option value="events">Events</option>
                  <option value="weddings">Weddings</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Location *</label>
                <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={selectStyle}>
                  <option value="">Select Area...</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Date *</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Time</label>
                <input placeholder="e.g. 9 AM – 5 PM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Pay (₹ per shift) *</label>
                <input type="number" placeholder="500" value={formData.pay} onChange={e => setFormData({ ...formData, pay: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the tasks, dress code, what to bring..." rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '10px' }}>Worker Requirements</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[['reqAge', 'Age 18+'], ['reqTransport', 'Own Transport'], ['reqExperience', 'Prior Experience']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${formData[key] ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: formData[key] ? 'rgba(0,122,255,0.06)' : 'transparent', transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.checked })} style={{ accentColor: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cost estimator */}
            {formData.pay && (
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem' }}>💰 Estimated Cost</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}><span>Worker pay</span><span>₹{formData.pay}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px', color: 'var(--color-text-muted)' }}><span>Platform fee{formData.urgent ? ' (Urgent)' : ''}</span><span>₹{platformFee}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '8px' }}><span>Total</span><span>₹{total}</span></div>
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} style={{ backgroundColor: formData.urgent ? 'var(--color-danger)' : undefined }}>
              {isSubmitting ? 'Posting...' : formData.urgent ? '🔥 Post Urgent Shift' : 'Post Shift Now'}
            </Button>
          </form>
        </div>
      </div>
      <style>{`.post-grid { grid-template-columns: 1fr; }`}</style>
    </motion.div>
  );
};

// ─── Manage Shifts Tab ────────────────────────────────────────────────────────
const PosterManageShifts = ({ user, shifts, applications, updateApplicationStatus, markShiftFilled, addNotification }) => {
  const myShifts = shifts.filter(s => s.posterId === user.id || s.posterId === 'p1' || s.posterId === 'p0');
  const [expandedShift, setExpandedShift] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAccept = (appId, shiftId) => {
    updateApplicationStatus(appId, 'Accepted');
    markShiftFilled(shiftId);
    addNotification('✅ Worker accepted! Shift marked as filled.', 'success');
  };

  const filtered = filterStatus === 'all' ? myShifts : myShifts.filter(s => s.status === filterStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Manage Shifts</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[['all', 'All'], ['open', 'Open'], ['filled', 'Filled']].map(([v, l]) => (
            <button key={v} onClick={() => setFilterStatus(v)} style={{ padding: '6px 14px', borderRadius: '100px', border: `1px solid ${filterStatus === v ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: filterStatus === v ? 'var(--color-primary)' : 'transparent', color: filterStatus === v ? '#fff' : 'var(--color-text-main)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.15s' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length > 0 ? filtered.map(shift => {
          const shiftApps = applications.filter(a => a.shiftId === shift.id);
          const isExpanded = expandedShift === shift.id;

          return (
            <div key={shift.id} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: `1px solid ${isExpanded ? 'var(--color-primary)' : 'var(--color-border)'}`, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <div style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }} onClick={() => setExpandedShift(isExpanded ? null : shift.id)}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{shift.title}</h3>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: shift.status === 'open' ? 'rgba(52,199,89,0.1)' : 'rgba(134,134,139,0.1)', color: shift.status === 'open' ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                      {shift.status === 'open' ? '● OPEN' : '● FILLED'}
                    </span>
                    {shift.isUrgent && <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: 'rgba(255,59,48,0.1)', color: 'var(--color-danger)' }}>🔥 URGENT</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{shift.date} · {shift.location} · {shift.pay}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)' }}>{shiftApps.length}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Applicants</p>
                  </div>
                  <span style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.9rem' }}>{isExpanded ? '▲ Hide' : '▼ View'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--color-border)', padding: '20px 24px', backgroundColor: 'var(--color-bg)' }}>
                  {shiftApps.length > 0 ? shiftApps.map(app => (
                    <div key={app.id} style={{ backgroundColor: 'var(--color-bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '0.9rem' }}>R</div>
                        <div>
                          <h4 style={{ margin: '0 0 4px' }}>Rahul Patel <span style={{ color: '#FFB800', fontSize: '0.85rem' }}>★ 4.8</span></h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Skills: Packing · Delivery · Verified ✅</p>
                        </div>
                      </div>
                      {app.status === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => updateApplicationStatus(app.id, 'Rejected')} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', color: 'var(--color-danger)' }}>Reject</button>
                          <button onClick={() => handleAccept(app.id, shift.id)} style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: 'var(--color-success)', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem' }}>Accept</button>
                        </div>
                      ) : (
                        <span style={{ padding: '6px 14px', borderRadius: '100px', fontWeight: '700', fontSize: '0.8rem', backgroundColor: app.status === 'Accepted' ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', color: app.status === 'Accepted' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {app.status === 'Accepted' ? '✅ Accepted' : '❌ Rejected'}
                        </span>
                      )}
                    </div>
                  )) : <p style={{ margin: 0, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px' }}>No applications yet for this shift.</p>}
                </div>
              )}
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <Ghost size={40} color="var(--color-text-muted)" style={{ opacity: 0.3, marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px' }}>No Shifts Yet</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: '0 0 20px' }}>Post your first shift to start finding workers!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Payments Tab ─────────────────────────────────────────────────────────────
const PosterPayments = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [funded, setFunded] = useState(false);

  const TRANSACTIONS = [
    { type: 'debit',  label: 'Payout: Warehouse Packer',  date: 'Sep 20, 2024', amount: '500',    status: 'Completed' },
    { type: 'debit',  label: 'Platform Fee',               date: 'Sep 20, 2024', amount: '50',     status: 'Deducted'  },
    { type: 'debit',  label: 'Payout: Event Staff',        date: 'Sep 18, 2024', amount: '800',    status: 'Completed' },
    { type: 'credit', label: 'Funds Added via UPI',        date: 'Sep 01, 2024', amount: '10,000', status: 'Success'   },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0 }}>Payments</h1>
        <Button variant="primary" onClick={() => setShowAddFunds(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpRight size={16} /> Add Funds
        </Button>
      </div>

      <div className="auto-grid stagger-fade-in" style={{ marginBottom: '32px' }}>
        {/* Balance */}
        <div className="premium-card glass-card hover-scale" style={{ background: 'linear-gradient(135deg, #007AFF, #0051d4)', color: '#fff', position: 'relative', overflow: 'hidden', border: 'none' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.07 }}><Wallet size={140} /></div>
          <p style={{ margin: '0 0 6px', opacity: 0.8, fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Wallet Balance</p>
          <p style={{ fontSize: '2.75rem', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-1px' }}>₹12,400</p>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Auto-deducted after shifts are filled</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[['Total Spent This Month', '₹3,200', 'var(--color-danger)'], ['Workers Paid', '4', 'var(--color-success)'], ['Avg Cost per Shift', '₹600', '#FFB800']].map(([l, v, c]) => (
            <div key={l} style={{ backgroundColor: 'var(--color-bg-card)', padding: '14px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{l}</span>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: c }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Transaction History</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem' }}>
          <Download size={14} /> Export PDF
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        {TRANSACTIONS.map((t, i) => (
          <div key={i} style={{ padding: '16px 24px', borderBottom: i < TRANSACTIONS.length - 1 ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: t.type === 'credit' ? 'rgba(52,199,89,0.03)' : 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: t.type === 'credit' ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.type === 'credit' ? <ArrowUpRight size={16} color="var(--color-success)" /> : <IndianRupee size={16} color="var(--color-danger)" />}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: '500', fontSize: '0.95rem' }}>{t.label}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t.date}</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px', fontWeight: '700', color: t.type === 'credit' ? 'var(--color-success)' : 'var(--color-danger)' }}>{t.type === 'credit' ? '+' : '-'}₹{t.amount}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Funds Modal */}
      <Modal isOpen={showAddFunds} onClose={() => { setShowAddFunds(false); setFunded(false); setUpiId(''); setFundAmount(''); }} title="Add Funds">
        {funded ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ margin: '0 0 8px' }}>Funds Added!</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>₹{fundAmount} has been added to your wallet.</p>
            <Button variant="primary" fullWidth onClick={() => { setShowAddFunds(false); setFunded(false); setUpiId(''); setFundAmount(''); }}>Done</Button>
          </div>
        ) : (
          <div>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>Current balance: <strong style={{ color: 'var(--color-text-main)' }}>₹12,400</strong></p>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' }}>Quick amounts</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['5000', '10000', '20000'].map(a => (
                  <button key={a} onClick={() => setFundAmount(a)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: `1px solid ${fundAmount === a ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: fundAmount === a ? 'rgba(0,122,255,0.06)' : 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', color: fundAmount === a ? 'var(--color-primary)' : 'var(--color-text-main)', transition: 'all 0.15s' }}>₹{parseInt(a).toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontWeight: '500', display: 'block', marginBottom: '8px', fontSize: '0.95rem' }}>UPI ID</label>
              <input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem' }} />
            </div>
            <Button variant="primary" fullWidth disabled={!upiId || !fundAmount} onClick={() => setFunded(true)}>Pay ₹{fundAmount ? parseInt(fundAmount).toLocaleString('en-IN') : '—'} via UPI</Button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

// ─── Poster Profile Tab ───────────────────────────────────────────────────────
const PosterProfile = ({ user, updateProfile, addNotification }) => {
  const [formData, setFormData] = useState({ businessName: user.businessName || '', phone: user.phone || '', email: user.email || '' });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => { setUploading(false); addNotification('Business document uploaded!', 'success'); }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fade-up visible"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: '#fff', flexShrink: 0 }}>
          {(user.businessName || user.name || 'B')[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '1.2rem' }}>{user.businessName || user.name}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {user.verified && <span style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(52,199,89,0.1)', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: '700' }}>✅ Verified Business</span>}
            <span style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'rgba(255,184,0,0.1)', color: '#FFB800', fontSize: '0.75rem', fontWeight: '700' }}>★ {user.rating || '5.0'} Rating</span>
          </div>
        </div>
      </div>

      <div className="auto-grid stagger-fade-in" style={{ gap: '20px' }}>
        <div className="glass-card premium-card">
          <h3 style={{ margin: '0 0 20px', fontSize: '1rem' }}>Business Details</h3>
          <form onSubmit={handleSave}>
            {[['Business Name', 'businessName', 'text', 'e.g. ABC Logistics'], ['Contact Email', 'email', 'email', 'you@company.com'], ['Phone', 'phone', 'text', '+91 98765 43210']].map(([label, key, type, placeholder]) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{label}</label>
                <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' }} />
              </div>
            ))}
            <Button type="submit" variant="primary" fullWidth style={{ backgroundColor: saved ? 'var(--color-success)' : undefined }}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Business Verification</h3>
            <div style={{ border: '2px dashed var(--color-border)', padding: '28px', borderRadius: 'var(--radius-md)', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
              <Upload size={28} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
              <p style={{ margin: '0 0 6px', fontWeight: '500', fontSize: '0.95rem' }}>Upload GST / PAN / Shop Act License</p>
              <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PNG, JPG, PDF up to 5 MB</p>
              <Button variant="secondary" onClick={handleUpload} disabled={uploading}>{uploading ? '⏳ Uploading...' : '📤 Choose File'}</Button>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1rem' }}>Quick Stats</h3>
            {[['Shifts Posted', '3'], ['Workers Hired', '4'], ['Avg Rating Given', '4.9 ★']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{l}</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Container ────────────────────────────────────────────────────────────
const DashboardPoster = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { shifts, applications, addShift, updateApplicationStatus, markShiftFilled } = useContext(ShiftContext);
  const { addNotification } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('home');

  useSEO('Poster Dashboard – Shiftly');

  if (!user || user.role !== 'poster') return <Navigate to="/login" />;

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return <PosterHome user={user} shifts={shifts} applications={applications} setActiveTab={setActiveTab} />;
      case 'post':      return <PosterPostShift user={user} addShift={addShift} addNotification={addNotification} setActiveTab={setActiveTab} />;
      case 'manage':    return <PosterManageShifts user={user} shifts={shifts} applications={applications} updateApplicationStatus={updateApplicationStatus} markShiftFilled={markShiftFilled} addNotification={addNotification} />;
      case 'workers':   return <TalentPool />;
      case 'messages':  return <Messages />;
      case 'analytics': return <Analytics />;
      case 'payments':  return <PosterPayments />;
      case 'referrals': return <Referrals />;
      case 'disputes':  return <Disputes />;
      case 'profile':   return <PosterProfile user={user} updateProfile={updateProfile} addNotification={addNotification} />;
      default:          return <PosterHome user={user} shifts={shifts} applications={applications} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} navItems={POSTER_NAV_ITEMS}>
      {renderTab()}
    </DashboardLayout>
  );
};

export default DashboardPoster;
