import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

const Signup = () => {
  const [role, setRole] = useState('worker'); // 'worker' or 'poster'
  const [showOtp, setShowOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: 'Nikol, Ahmedabad',
    skills: [],
    availability: 'mornings',
    businessName: '',
    category: 'warehouse',
    gst: '',
  });

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const checkPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'transparent' };
    if (pass.length < 6) return { score: 1, text: 'Weak', color: 'var(--color-danger)' };
    if (pass.length >= 8 && /[0-9]/.test(pass) && /[A-Z]/.test(pass)) return { score: 3, text: 'Strong', color: 'var(--color-success)' };
    return { score: 2, text: 'Medium', color: '#FFB800' };
  };

  const passStrength = checkPasswordStrength(formData.password);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill all required common fields.');
      return;
    }

    if (role === 'poster' && !formData.businessName) {
      setError('Business name is required for posters.');
      return;
    }

    // Show OTP Mock Modal
    setShowOtp(true);
  };

  const handleOtpVerify = async () => {
    setIsSubmitting(true);
    
    const finalData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: role,
      location: formData.location,
      ...(role === 'worker' ? {
        skills: formData.skills,
        availability: formData.availability
      } : {
        businessName: formData.businessName,
        category: formData.category
      })
    };

    const result = await signup(finalData);
    setIsSubmitting(false);

    if (result.success) {
      setShowOtp(false);
      navigate(role === 'worker' ? '/worker/dashboard' : '/poster/dashboard');
    } else {
      setError(result.message);
      setShowOtp(false);
    }
  };

  const commonFields = (
    <>
      <Input label="Full Name" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
      <Input label="Email Address" id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
      <Input label="Phone Number" id="phone" name="phone" placeholder="+91 9876543210" value={formData.phone} onChange={handleInputChange} />
      
      <div style={{ marginBottom: '16px' }}>
        <Input label="Password" id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
        {formData.password && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '-8px', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: passStrength.score >= 1 ? passStrength.color : 'var(--color-border)' }}></div>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: passStrength.score >= 2 ? passStrength.color : 'var(--color-border)' }}></div>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: passStrength.score >= 3 ? passStrength.color : 'var(--color-border)' }}></div>
            <span style={{ fontSize: '0.75rem', color: passStrength.color, marginLeft: '8px', minWidth: '40px' }}>{passStrength.text}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Location (Ahmedabad)</label>
        <select 
          name="location" 
          value={formData.location} 
          onChange={handleInputChange}
          style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', fontSize: '1rem', fontFamily: 'var(--font-family)', outline: 'none' }}
        >
          <option value="Nikol, Ahmedabad">Nikol</option>
          <option value="Gandhinagar">Gandhinagar</option>
          <option value="Infocity, Gandhinagar">Infocity</option>
          <option value="Kudasan, Gandhinagar">Kudasan</option>
          <option value="Vastrapur, Ahmedabad">Vastrapur</option>
        </select>
      </div>
    </>
  );

  const workerFields = (
    <div className="fade-up visible">
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-main)', display: 'block', marginBottom: '8px' }}>Skills (Select all that apply)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {['Packing', 'Retail', 'Event Staff', 'Delivery', 'Data Entry'].map(skill => (
            <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={formData.skills.includes(skill)} onChange={() => handleSkillChange(skill)} />
              {skill}
            </label>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Availability</label>
        <select 
          name="availability" 
          value={formData.availability} 
          onChange={handleInputChange}
          style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', fontSize: '1rem', fontFamily: 'var(--font-family)', outline: 'none' }}
        >
          <option value="mornings">Mornings (8 AM - 2 PM)</option>
          <option value="evenings">Evenings (3 PM - 9 PM)</option>
          <option value="weekends">Weekends Only</option>
          <option value="anytime">Anytime</option>
        </select>
      </div>
    </div>
  );

  const posterFields = (
    <div className="fade-up visible">
      <Input label="Business/Organization Name" id="businessName" name="businessName" placeholder="ABC Logistics" value={formData.businessName} onChange={handleInputChange} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Category</label>
        <select 
          name="category" 
          value={formData.category} 
          onChange={handleInputChange}
          style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', fontSize: '1rem', fontFamily: 'var(--font-family)', outline: 'none' }}
        >
          <option value="warehouse">Warehouse / Logistics</option>
          <option value="retail">Retail / Store</option>
          <option value="events">Events / Exhibitions</option>
          <option value="weddings">Weddings</option>
          <option value="other">Other</option>
        </select>
      </div>

      <Input label="GST/PAN Number (Optional)" id="gst" name="gst" placeholder="ABCDE1234F" value={formData.gst} onChange={handleInputChange} />
    </div>
  );

  return (
    <div className="section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div 
          className="fade-up visible card edge-to-edge-mobile" 
          style={{
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create an Account</h1>
          <p className="text-muted">Join Shiftly to {role === 'worker' ? 'find flexible work' : 'hire fast staff'}.</p>
        </div>

        {/* Custom Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '32px' }}>
          <button 
            type="button"
            onClick={() => setRole('worker')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              backgroundColor: role === 'worker' ? 'var(--color-bg-card)' : 'transparent',
              color: role === 'worker' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              boxShadow: role === 'worker' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            I want to work
          </button>
          <button 
            type="button"
            onClick={() => setRole('poster')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              backgroundColor: role === 'poster' ? 'var(--color-bg-card)' : 'transparent',
              color: role === 'poster' ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              boxShadow: role === 'poster' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            I want to post shifts
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--color-danger)', backgroundColor: 'rgba(255,59,48,0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleInitialSubmit}>
          {commonFields}
          {role === 'worker' ? workerFields : posterFields}
          
          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '16px' }}>
            Create Account
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Log in</Link>
        </p>
        </div>
      </div>

      <Modal isOpen={showOtp} onClose={() => setShowOtp(false)} title="Verify Your Phone">
        <p style={{ marginBottom: '24px', color: 'var(--color-text-muted)' }}>
          We've sent a one-time password to <strong>{formData.phone}</strong>. 
          For this demo, just click "Verify".
        </p>
        <Input label="OTP Code" id="otp" placeholder="123456" />
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <Button variant="secondary" onClick={() => setShowOtp(false)} fullWidth>Cancel</Button>
          <Button variant="primary" onClick={handleOtpVerify} fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Signup;
