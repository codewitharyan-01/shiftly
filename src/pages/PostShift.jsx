import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { MapPin, Check } from 'lucide-react';

const LOCATION_OPTIONS = ['Nikol, Ahmedabad', 'Gandhinagar', 'Infocity, Gandhinagar', 'Kudasan, Gandhinagar', 'SG Highway, Ahmedabad', 'Satellite, Ahmedabad', 'Vastrapur, Ahmedabad'];
const AVAILABLE_RULES = ['Mobile Allowed', 'No Smoking', '15 Min Break', 'Free Tea', 'Safety Gear Required'];

const SHIFT_TEMPLATES = [
  {
    id: 'warehouse',
    name: 'Warehouse Packer – Festive Season',
    title: 'Warehouse Packer',
    description: 'We need reliable staff for packing and sorting during the festive rush. High volume, fast-paced environment. Punctuality is essential.',
    pay: 600,
    rules: ['15 Min Break', 'Safety Gear Required']
  },
  {
    id: 'event',
    name: 'Event Helper – Setup & Ushering',
    title: 'Event Helper',
    description: 'Looking for presentable and energetic helpers for a local event. Responsibilities include guest registration, seating assistance, and light setup.',
    pay: 800,
    rules: ['Free Tea', 'Mobile Allowed']
  },
  {
    id: 'retail',
    name: 'Retail Store Assistant',
    title: 'Retail Staff',
    description: 'Assist customers, manage inventory, and keep the store organized during peak hours.',
    pay: 500,
    rules: ['15 Min Break']
  }
];

const PostShift = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('');
  const [selectedRules, setSelectedRules] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);

  const applyTemplate = (e) => {
    const t = SHIFT_TEMPLATES.find(x => x.id === e.target.value);
    if (t) {
      setTitle(t.title);
      setDescription(t.description);
      setPay(t.pay);
      setSelectedRules(t.rules);
    }
  };

  const toggleRule = (rule) => {
    setSelectedRules(prev => 
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  return (
    <div className='container section-padding'>
      <div className="card edge-to-edge-mobile" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0' }}>Post a Shift</h1>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Find reliable workers in your area instantly.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: isUrgent ? 'rgba(255,59,48,0.1)' : 'var(--color-bg)', padding: '8px 12px', borderRadius: '100px', border: `1px solid ${isUrgent ? 'var(--color-danger)' : 'var(--color-border)'}`, cursor: 'pointer' }} onClick={() => setIsUrgent(!isUrgent)}>
             <input type="checkbox" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} style={{ margin: 0, cursor: 'pointer' }} />
             <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isUrgent ? 'var(--color-danger)' : 'var(--color-text-main)' }}>Urgent Mode</span>
          </div>
        </div>
        
        <form>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Start with a Template (Optional)</label>
            <select 
              onChange={applyTemplate}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem', color: 'var(--color-text-main)' }}
            >
              <option value="">Select a template to auto-fill...</option>
              {SHIFT_TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Shift Title</label>
            <input 
              className="form-input" 
              placeholder="e.g. Warehouse Helper" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Location / Area</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none', fontSize: '1rem', color: 'var(--color-text-main)' }}
              >
                <option value="">Select Area...</option>
                {LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            {location && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-success)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> Map pin automatically set for {location}
              </p>
            )}
          </div>
          
          <div className="grid-2" style={{ marginBottom: '20px' }}>
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Detailed Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the responsibilities, what to expect, and any specific requirements..."
              rows="4"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text-main)', outline: 'none', fontSize: '0.95rem',
                resize: 'vertical', fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '12px' }}>Rules & Amenities (Optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {AVAILABLE_RULES.map(rule => {
                const isSelected = selectedRules.includes(rule);
                return (
                  <button
                    type="button"
                    key={rule}
                    onClick={() => toggleRule(rule)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '100px',
                      backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.1)' : 'var(--color-bg)',
                      border: `1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                      fontSize: '0.85rem', fontWeight: isSelected ? '600' : '500',
                      cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                  >
                    {isSelected && <Check size={14} />} {rule}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Pay (₹)</label>
            <input 
              type="number"
              className="form-input" 
              placeholder="e.g. 500" 
              value={pay} 
              onChange={e => setPay(e.target.value)} 
            />
          </div>
          
          <Button variant="primary" fullWidth style={{ marginTop: '16px' }}>
            {isUrgent ? 'Post Urgent Shift' : 'Post Shift Now'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostShift;
