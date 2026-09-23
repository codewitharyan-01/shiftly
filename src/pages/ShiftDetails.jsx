import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShiftContext } from '../context/ShiftContext';
import { NotificationContext } from '../context/NotificationContext';
import ShiftCard from '../components/ShiftCard';
import Button from '../components/Button';
import {
  MapPin, Clock, IndianRupee, Star, ShieldCheck, Calendar,
  ArrowLeft, Briefcase, User, AlertCircle, CheckCircle2, Zap,
  Smartphone, Ban, Coffee, Timer, HardHat
} from 'lucide-react';

// Helper: relative time string
const timeAgo = (timestamp) => {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const InfoCard = ({ icon: Icon, label, value, accent }) => (
  <div style={{
    backgroundColor: 'var(--color-bg-card)',
    padding: '20px 24px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid var(--color-border)',
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
      backgroundColor: accent ? `${accent}18` : 'rgba(0,122,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={22} color={accent || 'var(--color-primary)'} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{value}</p>
    </div>
  </div>
);

const ShiftDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { shifts, applications, applyForShift } = useContext(ShiftContext);
  const { addNotification } = useContext(NotificationContext);

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyAnim, setApplyAnim] = useState(false);

  const shift = shifts.find(s => s.id === id);

  // Check if user already applied
  useEffect(() => {
    if (user && shift) {
      const alreadyApplied = applications.some(a => a.shiftId === shift.id && a.userId === user.id);
      setHasApplied(alreadyApplied);
    }
  }, [user, shift, applications]);

  if (!shift) {
    return (
      <div style={{ maxWidth: '600px', margin: '120px auto', textAlign: 'center', padding: '0 24px' }}>
        <AlertCircle size={64} color="var(--color-text-muted)" style={{ marginBottom: '24px' }} />
        <h2 style={{ marginBottom: '12px' }}>Shift Not Found</h2>
        <p className="text-muted" style={{ marginBottom: '32px' }}>This shift may have been removed or filled.</p>
        <Button to="/" variant="primary">Browse All Shifts</Button>
      </div>
    );
  }

  // Similar shifts
  const similarShifts = shifts
    .filter(s => s.id !== shift.id && s.category === shift.category)
    .slice(0, 3);

  const handleApply = async () => {
    if (!user) {
      navigate(`/login?redirect=/shift/${id}`);
      return;
    }
    if (user.role !== 'worker') {
      addNotification('Only workers can apply for shifts.', 'error');
      return;
    }

    setIsApplying(true);
    setApplyAnim(true);

    const result = await applyForShift(shift.id, user.id);

    setIsApplying(false);
    setApplyAnim(false);

    if (result.success) {
      setHasApplied(true);
      addNotification(`Applied to "${shift.title}" successfully!`, 'success');
      setTimeout(() => navigate('/worker/dashboard'), 1200);
    } else {
      addNotification(result.message, 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>

        {/* Back Nav */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'transparent', color: 'var(--color-text-muted)',
            marginBottom: '32px', fontWeight: '500', padding: '0',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Hero Header */}
        <div
          className="fade-up visible edge-to-edge-mobile"
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0051d4 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            color: '#fff',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blur orb */}
          <div style={{
            position: 'absolute', width: '300px', height: '300px',
            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
            top: '-80px', right: '-80px', pointerEvents: 'none',
          }} />

          {/* Badges row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600',
              backdropFilter: 'blur(4px)', textTransform: 'capitalize',
            }}>
              {shift.category}
            </span>
            {shift.urgent && (
              <span style={{
                padding: '4px 12px', backgroundColor: 'rgba(255,59,48,0.75)',
                borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Zap size={12} fill="#fff" /> Urgent
              </span>
            )}
            {shift.status === 'Filled' && (
              <span style={{ padding: '4px 12px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600' }}>
                Filled
              </span>
            )}
          </div>

          <h1 style={{ margin: '0 0 12px 0', fontSize: '2rem', fontWeight: '800', lineHeight: 1.2 }}>
            {shift.title}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', opacity: 0.9, fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> {shift.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={16} /> {shift.posterName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> Posted {timeAgo(shift.postedAt)}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

          {/* Info Cards */}
          <div className="grid-2" style={{ gap: '16px' }}>
            <InfoCard
              icon={IndianRupee}
              label="Pay"
              value={shift.pay}
              accent="var(--color-success)"
            />
            <InfoCard
              icon={Calendar}
              label="Date"
              value={shift.date}
              accent="var(--color-primary)"
            />
            <InfoCard
              icon={Clock}
              label="Working Hours"
              value={shift.time}
              accent="#FFB800"
            />
            <InfoCard
              icon={User}
              label="Posted By"
              value={shift.posterName}
              accent="#9B59B6"
            />
          </div>

          {/* Body row: Description + Sidebar */}
          <div className="shift-detail-body" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>

            {/* Left: Description */}
            <div>
              {/* Description */}
              <div style={{
                backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '24px',
                border: '1px solid var(--color-border)',
              }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>About This Shift</h2>
                <p style={{ lineHeight: '1.8', color: 'var(--color-text-main)', margin: '0 0 24px 0' }}>
                  {shift.description || 'No additional description provided.'}
                </p>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>What to Bring</h3>
                <ul style={{ paddingLeft: '20px', lineHeight: '2', color: 'var(--color-text-main)', margin: '0 0 24px 0' }}>
                  <li>Valid Government-issued Photo ID (Aadhaar / Voter card)</li>
                  <li>Comfortable closed-toe footwear</li>
                  <li>Personal water bottle</li>
                </ul>

                <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem' }}>Requirements</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Age 18+', 'Physically Fit', 'Punctual'].map(req => (
                    <span key={req} style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '100px',
                      backgroundColor: 'rgba(52, 199, 89, 0.1)',
                      color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: '500',
                    }}>
                      <CheckCircle2 size={14} /> {req}
                    </span>
                  ))}
                </div>

                {shift.rules && shift.rules.length > 0 && (
                  <>
                    <h3 style={{ margin: '24px 0 12px 0', fontSize: '1rem' }}>Rules & Amenities</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {shift.rules.map(rule => {
                        let Icon = CheckCircle2;
                        let color = 'var(--color-primary)';
                        let bg = 'rgba(0, 122, 255, 0.1)';
                        if (rule === 'Mobile Allowed') Icon = Smartphone;
                        if (rule === 'No Smoking') { Icon = Ban; color = 'var(--color-danger)'; bg = 'rgba(255, 59, 48, 0.1)'; }
                        if (rule === 'Free Tea') { Icon = Coffee; color = '#FF9500'; bg = 'rgba(255, 149, 0, 0.1)'; }
                        if (rule === '15 Min Break') { Icon = Timer; color = '#AF52DE'; bg = 'rgba(175, 82, 222, 0.1)'; }
                        if (rule === 'Safety Gear Required') { Icon = HardHat; color = '#FFCC00'; bg = 'rgba(255, 204, 0, 0.1)'; }

                        return (
                          <span key={rule} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '100px',
                            backgroundColor: bg,
                            color: color, fontSize: '0.85rem', fontWeight: '600',
                            border: `1px solid ${color}40`
                          }}>
                            <Icon size={14} /> {rule}
                          </span>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Map */}
              <div style={{
                backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)', marginBottom: '24px',
              }}>
                <img
                  src="/mock_map.jpg"
                  alt={`Map location for ${shift.location}`}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--color-danger)" />
                  <span style={{ fontWeight: '500' }}>{shift.location}</span>
                </div>
              </div>
            </div>

            {/* Sticky Poster + Apply Card */}
            <div style={{
              backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
              padding: '32px', boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-border)',
              alignSelf: 'start',
            }}>
              {/* Poster Info */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #007AFF, #0051d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', color: '#fff', fontWeight: '700',
                  }}>
                    {shift.posterName?.[0] || 'A'}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{shift.posterName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="var(--color-primary)" />
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600' }}>Verified Business</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={16} fill={i <= 4 ? '#FFB800' : 'none'} color="#FFB800" />
                  ))}
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>4.9 (32 reviews)</span>
                </div>
                <button onClick={() => alert('Mock: Poster Blacklisted')} style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', backgroundColor: 'transparent', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Blacklist Poster</button>
              </div>

              {/* Pay highlight */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 4px 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Earn</p>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-success)' }}>
                  {shift.pay}
                </p>
              </div>

              {/* Apply Button */}
              {shift.status === 'Filled' ? (
                <div style={{
                  padding: '14px 24px', textAlign: 'center',
                  backgroundColor: 'rgba(134,134,139,0.1)',
                  borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontWeight: '600',
                }}>
                  This shift is already filled
                </div>
              ) : hasApplied ? (
                <div style={{
                  padding: '14px 24px', textAlign: 'center',
                  backgroundColor: 'rgba(52,199,89,0.1)',
                  borderRadius: 'var(--radius-md)', color: 'var(--color-success)',
                  fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}>
                  <CheckCircle2 size={20} /> Applied!
                </div>
              ) : (
                <button
                  id="apply-btn"
                  onClick={handleApply}
                  disabled={isApplying}
                  style={{
                    width: '100%', padding: '16px 24px',
                    background: 'linear-gradient(135deg, #007AFF, #0051d4)',
                    color: '#fff', borderRadius: 'var(--radius-md)',
                    fontWeight: '700', fontSize: '1.05rem',
                    boxShadow: applyAnim ? '0 0 0 6px rgba(0,122,255,0.2)' : '0 4px 14px rgba(0,122,255,0.35)',
                    transform: applyAnim ? 'scale(0.97)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    cursor: isApplying ? 'not-allowed' : 'pointer',
                    opacity: isApplying ? 0.7 : 1,
                  }}
                >
                  {isApplying ? 'Applying...' : user ? 'Apply Now' : 'Sign in to Apply'}
                </button>
              )}

              {!user && (
                <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  No account? <Link to={`/signup?redirect=/shift/${id}`} style={{ color: 'var(--color-primary)' }}>Create one free</Link>
                </p>
              )}

              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '16px 0 0' }}>
                Instant payout after shift completion
              </p>
            </div>
          </div>
        </div>

        {/* Similar Shifts */}
        {similarShifts.length > 0 && (
          <div style={{ marginTop: '64px' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Similar Shifts</h2>
            <p className="text-muted" style={{ marginBottom: '32px' }}>More opportunities in {shift.category}</p>
            <div className="grid-3">
              {similarShifts.map(s => <ShiftCard key={s.id} shift={s} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShiftDetails;
