import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const MOCK_DISPUTES = [
  { id: 'D001', shift: 'Warehouse Packer – Nikol',  date: 'Sep 15, 2024', type: 'Payment Issue',     status: 'Resolved', role: 'worker',  desc: 'Payment not received for completed shift.'               },
  { id: 'D002', shift: 'Event Staff – Gandhinagar',  date: 'Sep 20, 2024', type: 'No-Show by Poster', status: 'Open',     role: 'worker',  desc: 'Poster did not show up; shift cancelled without notice.'  },
  { id: 'D003', shift: 'Retail Helper – SG Highway', date: 'Sep 21, 2024', type: 'Worker Misconduct', status: 'In Review', role: 'poster', desc: 'Worker left 2 hours before shift ended without notice.'    },
];

const STATUS_STYLE = {
  Resolved:  { bg: 'rgba(52,199,89,0.1)',  color: 'var(--color-success)', icon: CheckCircle },
  Open:      { bg: 'rgba(255,59,48,0.1)',  color: 'var(--color-danger)', icon: AlertTriangle },
  'In Review': { bg: 'rgba(255,184,0,0.1)', color: '#FFB800', icon: Clock },
};

const Disputes = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ shift: '', type: '', desc: '' });
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 0 48px' }} className="fade-up visible">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>Dispute Centre</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Raise and track issues with shifts, payments, or conduct.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
          {showForm ? 'Cancel' : '+ Raise Dispute'}
        </button>
      </div>

      {/* Success toast */}
      {submitted && (
        <div style={{ backgroundColor: 'rgba(52,199,89,0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: '24px', color: 'var(--color-success)', fontWeight: '600', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <CheckCircle size={18} /> Your dispute has been submitted. We'll respond within 24 hours.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-danger)', padding: '24px', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--color-danger)' }}>⚠️ New Dispute</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Shift Title / ID</label>
              <input required placeholder="e.g. Warehouse Packer – Nikol (Nov 10)" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Dispute Type</label>
              <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem' }}>
                <option value="">Select type...</option>
                <option>Payment Issue</option>
                <option>No-Show by Poster</option>
                <option>No-Show by Worker</option>
                <option>Worker Misconduct</option>
                <option>Poster Misconduct</option>
                <option>Shift Conditions Mismatch</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Description</label>
              <textarea required rows={4} placeholder="Describe the issue clearly..." value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <button type="submit" style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-danger)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}>
              Submit Dispute
            </button>
          </form>
        </div>
      )}

      {/* Policy note */}
      <div style={{ backgroundColor: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.25)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: '28px' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
          📋 <strong>Policy:</strong> All disputes are reviewed within 24 hours by our trust & safety team. Resolved disputes are archived for 90 days. Please provide as much detail as possible to speed up resolution.
        </p>
      </div>

      {/* Disputes List */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Your Disputes ({MOCK_DISPUTES.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MOCK_DISPUTES.map((d) => {
          const st = STATUS_STYLE[d.status];
          const StatusIcon = st.icon;
          const isOpen = expanded === d.id;
          return (
            <div key={d.id} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div onClick={() => setExpanded(isOpen ? null : d.id)} style={{ padding: '18px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <StatusIcon size={18} color={st.color} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{d.type}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{d.shift} · {d.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', backgroundColor: st.bg, color: st.color }}>{d.status}</span>
                  {isOpen ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: '0 24px 20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{d.desc}</p>
                  <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Case ID: <strong>{d.id}</strong></p>
                  {d.status !== 'Resolved' && (
                    <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)', backgroundColor: 'transparent', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                      <MessageSquare size={14} /> Message Support
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Disputes;
