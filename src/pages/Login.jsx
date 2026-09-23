import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Info } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, lockoutUntil } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (result.user.role === 'worker') {
        navigate('/worker/dashboard');
      } else {
        navigate('/poster/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  const getLockoutTime = () => {
    if (!lockoutUntil) return 0;
    const remaining = Math.ceil((lockoutUntil - new Date().getTime()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(155deg, #eef4ff 0%, #f5f5f7 60%, #fff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="card premium-card edge-to-edge-mobile"
          style={{
            width: '100%',
            maxWidth: '440px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>👋</div>
          <h2 style={{ marginBottom: '6px' }}>Welcome back</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>Sign in to your Shiftly account</p>
        </div>

        {/* Quick Demo Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '10px', textAlign: 'center' }}>Quick Demo Login</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => { setEmail('worker@shiftly.in'); setPassword('demo'); }}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              👷 Try as Worker
            </button>
            <button
              type="button"
              onClick={() => { setEmail('test@gmail.com'); setPassword('test@123'); }}
              style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-success)'; e.currentTarget.style.backgroundColor = 'rgba(52,199,89,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              🏢 Try as Poster
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Info size={15} />
            <span>{error}</span>
          </div>
        )}

        {lockoutUntil && getLockoutTime() > 0 && (
          <div style={{
            backgroundColor: 'var(--color-warning-bg)',
            color: 'var(--color-warning)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
          }}>
            Too many attempts. Try again in {getLockoutTime()} seconds.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!!lockoutUntil}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={!!lockoutUntil}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px', marginBottom: '20px' }}>
            <Link to="#" style={{ fontSize: '13px', fontWeight: '500' }}>Forgot password?</Link>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" disabled={isSubmitting || !!lockoutUntil}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" fullWidth size="md" style={{ flex: 1 }}>🔗 Google</Button>
          <Button variant="secondary" fullWidth size="md" style={{ flex: 1 }}>🍎 Apple</Button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>Sign up free</Link>
        </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
