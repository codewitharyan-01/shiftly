import React, { useContext, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import {
  User, Phone, Mail, MapPin, FileText, Briefcase, Upload,
  ShieldCheck, Lock, Bell, Globe, Trash2, CheckCircle2,
  Eye, EyeOff, Camera, ToggleLeft, ToggleRight, ChevronDown,
  AlertTriangle, X, Check, Zap, Star
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SKILL_OPTIONS = ['Packing', 'Retail', 'Event Staff', 'Delivery', 'Data Entry', 'Security', 'Catering', 'Cleaning', 'Driving', 'Cashier'];
const AVAILABILITY_OPTIONS = ['Mornings (6am–12pm)', 'Afternoons (12pm–6pm)', 'Evenings (6pm–12am)', 'Weekends', 'Weekdays', 'On Call'];
const LOCATION_OPTIONS = ['Nikol, Ahmedabad', 'Gandhinagar', 'Infocity, Gandhinagar', 'Kudasan, Gandhinagar', 'SG Highway, Ahmedabad', 'Satellite, Ahmedabad', 'Vastrapur, Ahmedabad'];
const CATEGORY_OPTIONS = ['Warehouse / Logistics', 'Retail', 'Events & Exhibitions', 'Weddings & Catering', 'IT & Data Entry', 'Other'];
const LANGUAGES = [{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी (Hindi)' }, { code: 'gu', label: 'ગુજરાતી (Gujarati)' }];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const passwordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: 'Too short',  color: '#FF3B30' },
    { label: 'Weak',       color: '#FF3B30' },
    { label: 'Fair',       color: '#FFB800' },
    { label: 'Good',       color: '#007AFF' },
    { label: 'Strong',     color: '#34C759' },
  ];
  return { score, ...map[score] };
};

// ─── Reusable sub-components ──────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="glass-card stagger-fade-in premium-card hover-scale" style={{ marginBottom: '24px', border: 'none' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(0,122,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color="var(--color-primary)" />
      </div>
      <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>{title}</h2>
    </div>
    {children}
  </div>
);

const NotifToggle = ({ label, sublabel, checked, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
    <div>
      <p style={{ margin: 0, fontWeight: '500' }}>{label}</p>
      {sublabel && <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{sublabel}</p>}
    </div>
    <button onClick={onChange} style={{ background: 'transparent', padding: 0, flexShrink: 0 }}>
      {checked
        ? <ToggleRight size={40} color="var(--color-primary)" />
        : <ToggleLeft  size={40} color="var(--color-text-muted)" />
      }
    </button>
  </div>
);

const MultiSelect = ({ label, options, selected, onChange }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '10px' }}>{label}</label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            style={{
              padding: '8px 16px', borderRadius: '100px', fontSize: '0.875rem', fontWeight: '500',
              cursor: 'pointer', transition: 'all 0.15s ease',
              backgroundColor: active ? 'var(--color-primary)' : 'transparent',
              color: active ? '#fff' : 'var(--color-text-main)',
              border: active ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
            }}
          >
            {active && <Check size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

const UploadZone = ({ label, sublabel, onUpload, uploaded, isUploading }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '10px' }}>{label}</label>
    <div style={{
      border: uploaded ? '2px solid var(--color-success)' : '2px dashed var(--color-border)',
      borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center',
      backgroundColor: uploaded ? 'rgba(52,199,89,0.04)' : 'transparent',
      transition: 'all 0.2s ease',
    }}>
      {uploaded ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={36} color="var(--color-success)" />
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-success)' }}>Document Uploaded!</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Under review by Shiftly team</p>
        </div>
      ) : (
        <>
          <Upload size={32} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
          <p style={{ margin: '0 0 4px', fontWeight: '500' }}>{sublabel}</p>
          <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>PNG, JPG, PDF up to 5MB</p>
          <Button variant="secondary" onClick={onUpload} disabled={isUploading}>
            {isUploading ? 'Uploading…' : 'Choose File'}
          </Button>
        </>
      )}
    </div>
  </div>
);

// ─── Avatar component ─────────────────────────────────────────────────────────
const Avatar = ({ name }) => {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: '100px', height: '100px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #007AFF, #0051d4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2rem', fontWeight: '800', color: '#fff',
      position: 'relative', flexShrink: 0,
    }}>
      {initials}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: '32px', height: '32px', borderRadius: '50%',
        backgroundColor: 'var(--color-bg-card)', border: '2px solid var(--color-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Camera size={14} color="var(--color-text-main)" />
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login?redirect=/profile" />;

  // ── Profile form state ──
  const [profileData, setProfileData] = useState({
    name:         user.name         || '',
    phone:        user.phone        || '',
    email:        user.email        || '',
    location:     user.location     || '',
    bio:          user.bio          || '',
    businessName: user.businessName || '',
    category:     user.category     || '',
    gst:          user.gst          || '',
    skills:       user.skills       || [],
    availability: user.availability || [],
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [idUploaded,    setIdUploaded]    = useState(user.verified   || false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [isUploadingId,    setIsUploadingId]    = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  // ── Password state ──
  const [pwData,     setPwData]     = useState({ current: '', next: '', confirm: '' });
  const [showPw,     setShowPw]     = useState({ current: false, next: false, confirm: false });
  const [isSavingPw, setIsSavingPw] = useState(false);
  const strength = passwordStrength(pwData.next);

  // ── Notifications state ──
  const [notifPrefs, setNotifPrefs] = useState({ email: true, sms: true, push: false });

  // ── Language state ──
  const [lang, setLang] = useState('en');

  // ── Delete account state ──
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // ── Handlers ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateProfile(profileData);
    setIsSavingProfile(false);
    addNotification('Profile saved successfully!', 'success');
  };

  const handleUploadId = () => {
    setIsUploadingId(true);
    setTimeout(() => { setIdUploaded(true); setIsUploadingId(false); updateProfile({ verified: true }); }, 1800);
  };

  const handleUploadProof = () => {
    setIsUploadingProof(true);
    setTimeout(() => { setProofUploaded(true); setIsUploadingProof(false); addNotification('Business proof uploaded!', 'success'); }, 1800);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!pwData.current) { addNotification('Enter your current password.', 'error'); return; }
    if (pwData.next.length < 8) { addNotification('New password must be at least 8 characters.', 'error'); return; }
    if (pwData.next !== pwData.confirm) { addNotification('Passwords do not match.', 'error'); return; }
    setIsSavingPw(true);
    setTimeout(() => {
      setIsSavingPw(false);
      setPwData({ current: '', next: '', confirm: '' });
      addNotification('Password changed successfully!', 'success');
    }, 1200);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') return;
    addNotification('Account deleted. Redirecting…', 'error');
    setTimeout(() => { logout(); navigate('/'); }, 1500);
  };

  const PwField = ({ label, field }) => (
    <div style={{ marginBottom: '16px', position: 'relative' }}>
      <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPw[field] ? 'text' : 'password'}
          value={pwData[field]}
          onChange={e => setPwData({ ...pwData, [field]: e.target.value })}
          style={{
            width: '100%', padding: '12px 44px 12px 16px',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem',
          }}
        />
        <button
          type="button"
          onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', color: 'var(--color-text-muted)', padding: '4px' }}
        >
          {showPw[field] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingTop: '80px', paddingBottom: '80px' }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
          <Avatar name={user.name} />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: '800' }}>{user.name}</h1>
            <p style={{ margin: '0 0 8px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {user.verified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-primary)', backgroundColor: 'rgba(0,122,255,0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                  <ShieldCheck size={13} /> Verified
                </span>
              )}
              {user.rating && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#FFB800', backgroundColor: 'rgba(255,184,0,0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                  ★ {user.rating}
                </span>
              )}
              {user.reliabilityScore && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-success)', backgroundColor: 'rgba(52,199,89,0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                  <CheckCircle2 size={13} /> {user.reliabilityScore}% Reliable
                </span>
              )}
              {user.role === 'worker' && (
                <>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#AF52DE', backgroundColor: 'rgba(175, 82, 222, 0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                    <Zap size={13} /> Fast Responder
                  </span>
                  {Number(user.rating) >= 4.7 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '600', color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.08)', padding: '4px 10px', borderRadius: '100px' }}>
                      <Star size={13} /> Top Rated
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Display Skills as prominent chips if worker */}
            {user.role === 'worker' && user.skills && user.skills.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                {user.skills.map(skill => (
                  <span key={skill} style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-secondary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── PROFILE FORM ─── */}
        <form onSubmit={handleSaveProfile}>
          <SectionCard title="Personal Information" icon={User}>
            <div className="auto-grid" style={{ gap: '16px', marginBottom: '16px' }}>
              <Input label="Full Name" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
              <Input label="Phone Number" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} />
              <Input label="Email Address" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
              <div>
                <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Location</label>
                <input list="profile-locations" placeholder="Select area…" value={profileData.location}
                  onChange={e => setProfileData({ ...profileData, location: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem' }}
                />
                <datalist id="profile-locations">
                  {LOCATION_OPTIONS.map(l => <option key={l} value={l} />)}
                </datalist>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Bio</label>
              <textarea
                value={profileData.bio}
                maxLength={300}
                placeholder="Tell posters / workers a bit about yourself…"
                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', resize: 'vertical', minHeight: '90px', fontFamily: 'inherit', fontSize: '1rem' }}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>{profileData.bio.length}/300</p>
            </div>

            {/* Worker-specific */}
            {user.role === 'worker' && (
              <>
                <MultiSelect label="Skills" options={SKILL_OPTIONS} selected={profileData.skills} onChange={v => setProfileData({ ...profileData, skills: v })} />
                <MultiSelect label="Availability" options={AVAILABILITY_OPTIONS} selected={profileData.availability} onChange={v => setProfileData({ ...profileData, availability: v })} />
              </>
            )}

            {/* Poster-specific */}
            {user.role === 'poster' && (
              <div className="auto-grid" style={{ gap: '16px', marginTop: '16px', marginBottom: '16px' }}>
                <Input label="Business Name" value={profileData.businessName} onChange={e => setProfileData({ ...profileData, businessName: e.target.value })} />
                <div>
                  <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Business Category</label>
                  <select value={profileData.category} onChange={e => setProfileData({ ...profileData, category: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem' }}>
                    <option value="">Select…</option>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="GST / PAN (optional)" placeholder="e.g. 24ABCDE1234F1Z5" value={profileData.gst} onChange={e => setProfileData({ ...profileData, gst: e.target.value })} />
              </div>
            )}

            <Button type="submit" variant="primary" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving…' : 'Save Profile'}
            </Button>
          </SectionCard>
        </form>

        {/* ─── DOCUMENT UPLOAD ─── */}
        <SectionCard title={user.role === 'worker' ? 'Identity Verification' : 'Business Verification'} icon={ShieldCheck}>
          {user.role === 'worker' ? (
            <UploadZone
              label="Government ID"
              sublabel="Upload Aadhaar, Voter ID, or Passport"
              onUpload={handleUploadId}
              uploaded={idUploaded}
              isUploading={isUploadingId}
            />
          ) : (
            <UploadZone
              label="Business Proof"
              sublabel="Upload GST Certificate, Shop Act License, or PAN"
              onUpload={handleUploadProof}
              uploaded={proofUploaded}
              isUploading={isUploadingProof}
            />
          )}
          {(idUploaded || proofUploaded) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: '0.88rem', fontWeight: '500' }}>
              <ShieldCheck size={16} /> Your document is under review. Verification takes up to 24 hours.
            </div>
          )}
        </SectionCard>

        {/* ─── CHANGE PASSWORD ─── */}
        <form onSubmit={handleSavePassword}>
          <SectionCard title="Change Password" icon={Lock}>
            <PwField label="Current Password" field="current" />
            <PwField label="New Password"     field="next"    />

            {/* Strength bar */}
            {pwData.next && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: i <= strength.score ? strength.color : 'var(--color-border)', transition: 'background-color 0.3s ease' }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600', color: strength.color }}>{strength.label}</p>
              </div>
            )}

            <PwField label="Confirm New Password" field="confirm" />
            {pwData.next && pwData.confirm && pwData.next !== pwData.confirm && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <X size={14} /> Passwords do not match
              </p>
            )}
            <Button type="submit" variant="primary" disabled={isSavingPw}>
              {isSavingPw ? 'Updating…' : 'Update Password'}
            </Button>
          </SectionCard>
        </form>

        {/* ─── NOTIFICATION PREFERENCES ─── */}
        <SectionCard title="Notification Preferences" icon={Bell}>
          <NotifToggle
            label="Email Notifications"
            sublabel="Shift updates, applications, payouts"
            checked={notifPrefs.email}
            onChange={() => { setNotifPrefs(p => ({ ...p, email: !p.email })); addNotification('Email notifications ' + (!notifPrefs.email ? 'enabled' : 'disabled') + '.', 'success'); }}
          />
          <NotifToggle
            label="SMS Notifications"
            sublabel="OTPs and urgent alerts to your phone"
            checked={notifPrefs.sms}
            onChange={() => { setNotifPrefs(p => ({ ...p, sms: !p.sms })); addNotification('SMS notifications ' + (!notifPrefs.sms ? 'enabled' : 'disabled') + '.', 'success'); }}
          />
          <NotifToggle
            label="Push Notifications"
            sublabel="Browser or app push alerts"
            checked={notifPrefs.push}
            onChange={() => { setNotifPrefs(p => ({ ...p, push: !p.push })); addNotification('Push notifications ' + (!notifPrefs.push ? 'enabled' : 'disabled') + '.', 'success'); }}
          />
          <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            We will never share your contact details with third parties.
          </p>
        </SectionCard>

        {/* ─── LANGUAGE ─── */}
        <SectionCard title="Language" icon={Globe}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => { setLang(l.code); addNotification(`Language set to ${l.label}.`, 'success'); }}
                style={{
                  padding: '10px 24px', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer',
                  border: lang === l.code ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  backgroundColor: lang === l.code ? 'rgba(0,122,255,0.08)' : 'transparent',
                  color: lang === l.code ? 'var(--color-primary)' : 'var(--color-text-main)',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang === l.code && <Check size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {l.label}
              </button>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Full translations for Hindi and Gujarati coming soon.
          </p>
        </SectionCard>

        {/* ─── DANGER ZONE ─── */}
        <div className="glass-card hover-scale stagger-fade-in premium-card" style={{
          backgroundColor: 'rgba(255,59,48,0.04)',
          border: '1px solid rgba(255,59,48,0.2)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,59,48,0.15)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="var(--color-danger)" />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--color-danger)' }}>Danger Zone</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: '600' }}>Delete Account</p>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                padding: '10px 20px', borderRadius: 'var(--radius-md)', fontWeight: '600',
                backgroundColor: 'transparent', color: 'var(--color-danger)',
                border: '1.5px solid var(--color-danger)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-danger)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-danger)'; }}
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* ─── DELETE CONFIRMATION MODAL ─── */}
      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} title="Delete Account">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trash2 size={28} color="var(--color-danger)" />
          </div>
          <h3 style={{ margin: '0 0 8px' }}>Are you absolutely sure?</h3>
          <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            This will permanently delete your account, all your applications, earnings history, and profile data. <strong>This action cannot be reversed.</strong>
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(255,59,48,0.06)', border: '1px solid rgba(255,59,48,0.15)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: '500' }}>
            Type <strong>DELETE</strong> to confirm:
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={e => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
              border: `2px solid ${deleteConfirmText === 'DELETE' ? 'var(--color-danger)' : 'var(--color-border)'}`,
              backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem', fontWeight: '600',
              letterSpacing: '0.05em',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" fullWidth onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}>
            Cancel
          </Button>
          <button
            disabled={deleteConfirmText !== 'DELETE'}
            onClick={handleDeleteAccount}
            style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: '700',
              backgroundColor: deleteConfirmText === 'DELETE' ? 'var(--color-danger)' : 'rgba(255,59,48,0.3)',
              color: '#fff', cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed',
              border: 'none', transition: 'all 0.2s ease',
            }}
          >
            <Trash2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Delete My Account
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Profile;
