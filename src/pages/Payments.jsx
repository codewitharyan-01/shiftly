import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import {
  IndianRupee, ArrowDownToLine, ArrowUpFromLine, ShieldCheck,
  Clock, CheckCircle2, XCircle, RefreshCw, Wallet,
  CreditCard, AlertCircle, ToggleLeft, ToggleRight, Download, Zap
} from 'lucide-react';

// ─── Mock data ───────────────────────────────────────────────────────────────
const WORKER_TRANSACTIONS = [
  { id: 'wt1', date: '2023-11-05', shift: 'Event Staff',        amount: 800,  type: 'credit', status: 'Paid'    },
  { id: 'wt2', date: '2023-11-03', shift: 'Data Entry Temp',    amount: 650,  type: 'credit', status: 'Paid'    },
  { id: 'wt3', date: '2023-11-01', shift: 'Warehouse Packer',   amount: 500,  type: 'credit', status: 'Paid'    },
  { id: 'wt4', date: '2023-10-28', shift: 'Withdrawal to UPI',  amount: 1200, type: 'debit',  status: 'Success' },
  { id: 'wt5', date: '2023-10-25', shift: 'Retail Helper',      amount: 600,  type: 'credit', status: 'Pending' },
];

const POSTER_TRANSACTIONS = [
  { id: 'pt1', date: '2023-11-10', description: 'Payout: Warehouse Packer', amount: 500,   type: 'debit',  status: 'Completed' },
  { id: 'pt2', date: '2023-11-10', description: 'Platform Fee',             amount: 50,    type: 'debit',  status: 'Deducted'  },
  { id: 'pt3', date: '2023-11-08', description: 'Payout: Event Staff',      amount: 800,   type: 'debit',  status: 'Completed' },
  { id: 'pt4', date: '2023-11-01', description: 'Funds Added via UPI',      amount: 10000, type: 'credit', status: 'Success'   },
  { id: 'pt5', date: '2023-10-28', description: 'Platform Fee',             amount: 80,    type: 'debit',  status: 'Deducted'  },
];

// ─── Shared sub-components ────────────────────────────────────────────────────
const BalanceCard = ({ balance, label, gradient, icon: Icon, children }) => (
  <div style={{
    background: gradient,
    borderRadius: 'var(--radius-lg)',
    padding: '36px',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    marginBottom: '32px',
  }}>
    <div style={{ position:'absolute', top:'-40px', right:'-40px', opacity:0.1 }}>
      <Icon size={200} />
    </div>
    <p style={{ margin:'0 0 8px 0', opacity:0.85, fontSize:'0.95rem', fontWeight:'500' }}>{label}</p>
    <h1 style={{ margin:'0 0 28px 0', fontSize:'3.5rem', fontWeight:'800', letterSpacing:'-0.02em' }}>
      ₹{balance.toLocaleString('en-IN')}
    </h1>
    {children}
  </div>
);

const StatusBadge = ({ status, type }) => {
  const palette = {
    Paid:      { bg:'rgba(52,199,89,0.12)',   color:'var(--color-success)' },
    Success:   { bg:'rgba(52,199,89,0.12)',   color:'var(--color-success)' },
    Completed: { bg:'rgba(52,199,89,0.12)',   color:'var(--color-success)' },
    Pending:   { bg:'rgba(255,184,0,0.12)',   color:'#D4800A' },
    Deducted:  { bg:'rgba(134,134,139,0.12)', color:'var(--color-text-muted)' },
    Failed:    { bg:'rgba(255,59,48,0.12)',   color:'var(--color-danger)' },
  };
  const s = palette[status] || palette.Deducted;
  return (
    <span style={{ padding:'4px 10px', borderRadius:'100px', fontSize:'0.8rem', fontWeight:'600', backgroundColor:s.bg, color:s.color }}>
      {status}
    </span>
  );
};

// ─── Worker Section ───────────────────────────────────────────────────────────
const WorkerPayments = ({ user }) => {
  const { addNotification } = useContext(NotificationContext);
  const [balance, setBalance] = useState(1950);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [transactions, setTransactions] = useState(WORKER_TRANSACTIONS);

  // Withdraw wizard steps: 'form' | 'otp' | 'processing' | 'success'
  const [withdrawStep, setWithdrawStep] = useState('form');
  const [withdrawData, setWithdrawData] = useState({ amount: '', method: 'upi', upiId: '', accountNo: '', ifsc: '' });
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  // OTP countdown
  useEffect(() => {
    if (withdrawStep !== 'otp') return;
    setOtpTimer(30);
    const interval = setInterval(() => setOtpTimer(t => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; }), 1000);
    return () => clearInterval(interval);
  }, [withdrawStep]);

  const openWithdraw = () => {
    setWithdrawStep('form');
    setWithdrawData({ amount: '', method: 'upi', upiId: '', accountNo: '', ifsc: '' });
    setOtpValue('');
    setOtpError('');
    setShowWithdrawModal(true);
  };

  const handleWithdrawFormSubmit = (e) => {
    e.preventDefault();
    const amt = parseInt(withdrawData.amount);
    if (!amt || amt < 100) { addNotification('Minimum withdrawal is ₹100.', 'error'); return; }
    if (amt > balance)    { addNotification('Insufficient balance.', 'error'); return; }
    if (withdrawData.method === 'upi' && !withdrawData.upiId) { addNotification('Please enter a UPI ID.', 'error'); return; }
    if (withdrawData.method === 'bank' && (!withdrawData.accountNo || !withdrawData.ifsc)) { addNotification('Please fill bank details.', 'error'); return; }
    setWithdrawStep('otp');
  };

  const handleOtpVerify = () => {
    if (otpValue !== '1234') { setOtpError('Invalid OTP. Use 1234 for demo.'); return; }
    setOtpError('');
    setWithdrawStep('processing');
    setTimeout(() => {
      const amt = parseInt(withdrawData.amount);
      const dest = withdrawData.method === 'upi' ? withdrawData.upiId : `••••${withdrawData.accountNo.slice(-4)}`;
      setBalance(b => b - amt);
      setTransactions(prev => [{
        id: `wt${Date.now()}`, date: new Date().toISOString().split('T')[0],
        shift: `Withdrawal to ${withdrawData.method.toUpperCase()} – ${dest}`,
        amount: amt, type: 'debit', status: 'Success'
      }, ...prev]);
      setWithdrawStep('success');
    }, 2200);
  };

  const handleWithdrawClose = () => {
    setShowWithdrawModal(false);
    if (withdrawStep === 'success') addNotification('Funds transferred successfully!', 'success');
    setWithdrawStep('form');
  };

  return (
    <div>
      <BalanceCard
        balance={balance}
        label="Available Balance"
        gradient="linear-gradient(135deg, #34C759 0%, #1a7a33 100%)"
        icon={Wallet}
      >
        <button
          onClick={openWithdraw}
          style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'12px 28px', backgroundColor:'rgba(255,255,255,0.2)',
            backdropFilter:'blur(8px)', borderRadius:'var(--radius-md)',
            color:'#fff', fontWeight:'700', fontSize:'1rem',
            border:'1px solid rgba(255,255,255,0.4)',
            cursor:'pointer', transition:'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.2)'}
        >
          <ArrowDownToLine size={20} /> Withdraw Funds
        </button>
      </BalanceCard>

      {/* Transaction History */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2 style={{ margin:0, fontSize:'1.4rem' }}>Transaction History</h2>
        <button
          onClick={() => alert('Mock: Downloading CSV...')}
          style={{ display:'flex', alignItems:'center', gap:'6px', backgroundColor:'transparent', color:'var(--color-text-muted)', fontWeight:'500', fontSize:'0.9rem' }}
        >
          <Download size={16} /> Export
        </button>
      </div>
      <div style={{ backgroundColor:'var(--color-bg-card)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--color-border)', overflowX: 'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor:'var(--color-bg)' }}>
              {['Date','Shift / Description','Amount','Status'].map(h => (
                <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:'0.8rem', fontWeight:'600', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none' }}>
                <td style={{ padding:'14px 20px', fontSize:'0.9rem', color:'var(--color-text-muted)' }}>{tx.date}</td>
                <td style={{ padding:'14px 20px', fontWeight:'500' }}>{tx.shift}</td>
                <td style={{ padding:'14px 20px', fontWeight:'700', color: tx.type === 'credit' ? 'var(--color-success)' : 'var(--color-text-main)' }}>
                  {tx.type === 'credit' ? '+' : '–'}₹{tx.amount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding:'14px 20px' }}><StatusBadge status={tx.status} type={tx.type} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Withdraw Modal */}
      <Modal isOpen={showWithdrawModal} onClose={withdrawStep !== 'processing' ? handleWithdrawClose : undefined} title={
        withdrawStep === 'form'       ? 'Withdraw Funds'
        : withdrawStep === 'otp'     ? 'Verify Identity'
        : withdrawStep === 'processing' ? 'Processing…'
        : 'Transfer Successful!'
      }>
        {/* STEP 1: Form */}
        {withdrawStep === 'form' && (
          <form onSubmit={handleWithdrawFormSubmit}>
            <div style={{ backgroundColor:'rgba(52,199,89,0.08)', border:'1px solid rgba(52,199,89,0.2)', padding:'16px', borderRadius:'var(--radius-md)', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
              <Wallet color="var(--color-success)" size={22} />
              <div>
                <p style={{ margin:0, fontSize:'0.85rem', color:'var(--color-text-muted)' }}>Available to withdraw</p>
                <p style={{ margin:0, fontWeight:'800', fontSize:'1.4rem' }}>₹{balance.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <Input label="Amount (₹)" type="number" placeholder="Enter amount (min ₹100)" value={withdrawData.amount} onChange={e => setWithdrawData({...withdrawData, amount: e.target.value})} />

            {/* Method toggle */}
            <div style={{ marginBottom:'20px' }}>
              <label style={{ fontSize:'0.95rem', fontWeight:'500', display:'block', marginBottom:'8px' }}>Withdraw To</label>
              <div style={{ display:'flex', gap:'12px' }}>
                {['upi','bank'].map(m => (
                  <button key={m} type="button"
                    onClick={() => setWithdrawData({...withdrawData, method: m})}
                    style={{
                      flex:1, padding:'12px', borderRadius:'var(--radius-md)', cursor:'pointer',
                      border: withdrawData.method === m ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: withdrawData.method === m ? 'rgba(0,122,255,0.07)' : 'transparent',
                      color: withdrawData.method === m ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontWeight:'600', textTransform:'uppercase', fontSize:'0.85rem',
                    }}
                  >
                    {m === 'upi' ? '📲 UPI' : '🏦 Bank'}
                  </button>
                ))}
              </div>
            </div>

            {withdrawData.method === 'upi' ? (
              <Input label="UPI ID" placeholder="yourname@upi" value={withdrawData.upiId} onChange={e => setWithdrawData({...withdrawData, upiId: e.target.value})} />
            ) : (
              <>
                <Input label="Account Number" placeholder="XXXXXXXXXXXXXX" value={withdrawData.accountNo} onChange={e => setWithdrawData({...withdrawData, accountNo: e.target.value})} />
                <Input label="IFSC Code" placeholder="SBIN0001234" value={withdrawData.ifsc} onChange={e => setWithdrawData({...withdrawData, ifsc: e.target.value})} />
              </>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'var(--color-text-muted)', fontSize:'0.85rem', marginBottom:'24px' }}>
              <ShieldCheck size={16} color="var(--color-primary)" />
              OTP verification required for your security.
            </div>

            <Button type="submit" variant="primary" fullWidth>Continue to Verify</Button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {withdrawStep === 'otp' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:'28px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', backgroundColor:'rgba(0,122,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <ShieldCheck size={32} color="var(--color-primary)" />
              </div>
              <h3 style={{ margin:'0 0 8px' }}>Enter OTP</h3>
              <p style={{ margin:0, color:'var(--color-text-muted)', fontSize:'0.9rem' }}>
                A 4-digit OTP has been sent to your registered phone.<br/>
                <strong style={{ color:'var(--color-text-main)' }}>(Use <code>1234</code> for demo)</strong>
              </p>
            </div>

            {/* OTP Input boxes */}
            <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginBottom:'12px' }}>
              {[0,1,2,3].map(i => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={otpValue[i] || ''}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/,'');
                    const arr = otpValue.split('');
                    arr[i] = val;
                    const next = arr.join('').slice(0,4);
                    setOtpValue(next);
                    setOtpError('');
                    if (val && i < 3) document.getElementById(`otp-${i+1}`)?.focus();
                  }}
                  style={{
                    width:'56px', height:'64px', textAlign:'center', fontSize:'1.8rem', fontWeight:'700',
                    border: otpError ? '2px solid var(--color-danger)' : '2px solid var(--color-border)',
                    borderRadius:'var(--radius-md)', backgroundColor:'var(--color-bg)', outline:'none',
                  }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ textAlign:'center', color:'var(--color-danger)', fontSize:'0.9rem', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
                <XCircle size={16} /> {otpError}
              </p>
            )}

            <p style={{ textAlign:'center', fontSize:'0.85rem', color:'var(--color-text-muted)', marginBottom:'24px' }}>
              {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : <button style={{ background:'none', color:'var(--color-primary)', fontWeight:'600' }} onClick={() => setOtpTimer(30)}>Resend OTP</button>}
            </p>

            <Button variant="primary" fullWidth disabled={otpValue.length < 4} onClick={handleOtpVerify}>Verify & Transfer</Button>
          </div>
        )}

        {/* STEP 3: Processing */}
        {withdrawStep === 'processing' && (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'24px' }}>
              <RefreshCw size={56} color="var(--color-primary)" style={{ animation:'spin 1s linear infinite' }} />
            </div>
            <h3 style={{ margin:'0 0 8px' }}>Processing Transfer…</h3>
            <p style={{ margin:0, color:'var(--color-text-muted)' }}>Please wait, do not close this window.</p>
          </div>
        )}

        {/* STEP 4: Success */}
        {withdrawStep === 'success' && (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'50%', backgroundColor:'rgba(52,199,89,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckCircle2 size={48} color="var(--color-success)" />
            </div>
            <h3 style={{ margin:'0 0 8px' }}>Transfer Successful!</h3>
            <p style={{ color:'var(--color-text-muted)', margin:'0 0 8px' }}>
              ₹{parseInt(withdrawData.amount).toLocaleString('en-IN')} transferred to
            </p>
            <p style={{ fontWeight:'700', fontSize:'1.1rem', margin:'0 0 28px', color:'var(--color-text-main)' }}>
              {withdrawData.method === 'upi' ? withdrawData.upiId : `Account ••••${withdrawData.accountNo.slice(-4)}`}
            </p>
            <Button variant="primary" fullWidth onClick={handleWithdrawClose}>Done</Button>
          </div>
        )}
      </Modal>

      {/* Spin keyframe added to document once */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Poster Section ───────────────────────────────────────────────────────────
const PosterPayments = ({ user }) => {
  const { addNotification } = useContext(NotificationContext);
  const [balance, setBalance] = useState(12400);
  const [autoDebit, setAutoDebit] = useState(true);
  const [transactions, setTransactions] = useState(POSTER_TRANSACTIONS);
  const [showGateway, setShowGateway] = useState(false);
  const [gatewayAmt, setGatewayAmt] = useState(0);
  const [gatewayStep, setGatewayStep] = useState('select'); // 'select'|'processing'|'success'

  const openGateway = (amt) => {
    setGatewayAmt(amt);
    setGatewayStep('select');
    setShowGateway(true);
  };

  const handleGatewayPay = () => {
    setGatewayStep('processing');
    setTimeout(() => {
      setBalance(b => b + gatewayAmt);
      setTransactions(prev => [{
        id: `pt${Date.now()}`, date: new Date().toISOString().split('T')[0],
        description: 'Funds Added via Mock Gateway',
        amount: gatewayAmt, type: 'credit', status: 'Success'
      }, ...prev]);
      setGatewayStep('success');
    }, 2000);
  };

  const closeGateway = () => {
    setShowGateway(false);
    if (gatewayStep === 'success') addNotification(`₹${gatewayAmt.toLocaleString('en-IN')} added to your wallet!`, 'success');
  };

  return (
    <div>
      <BalanceCard
        balance={balance}
        label="Wallet Balance"
        gradient="linear-gradient(135deg, #007AFF 0%, #0051d4 100%)"
        icon={Wallet}
      >
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          {[5000,10000,20000].map(amt => (
            <button key={amt} onClick={() => openGateway(amt)} style={{
              padding:'10px 20px', backgroundColor:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)',
              borderRadius:'var(--radius-md)', color:'#fff', fontWeight:'700',
              border:'1px solid rgba(255,255,255,0.35)', cursor:'pointer', transition:'all 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.28)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.18)'}
            >
              + ₹{(amt/1000)}k
            </button>
          ))}
        </div>
      </BalanceCard>

      {/* Auto-debit toggle card */}
      <div style={{ backgroundColor:'var(--color-bg-card)', padding:'24px', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--color-border)', marginBottom:'32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{ width:'44px', height:'44px', borderRadius:'12px', backgroundColor: autoDebit ? 'rgba(52,199,89,0.1)' : 'rgba(134,134,139,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Zap size={22} color={autoDebit ? 'var(--color-success)' : 'var(--color-text-muted)'} />
          </div>
          <div>
            <h3 style={{ margin:'0 0 4px' }}>Auto-Debit for Shifts</h3>
            <p style={{ margin:0, color:'var(--color-text-muted)', fontSize:'0.9rem' }}>
              Automatically pay workers once a shift is completed.
            </p>
          </div>
        </div>
        <button
          onClick={() => { setAutoDebit(a => !a); addNotification(`Auto-debit ${!autoDebit ? 'enabled' : 'disabled'}.`, 'success'); }}
          style={{ background:'transparent', padding:0 }}
        >
          {autoDebit
            ? <ToggleRight size={48} color="var(--color-success)" />
            : <ToggleLeft  size={48} color="var(--color-text-muted)" />
          }
        </button>
      </div>

      {/* Transaction History */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <h2 style={{ margin:0, fontSize:'1.4rem' }}>Transaction History</h2>
        <button
          onClick={() => alert('Mock: Downloading PDF invoice...')}
          style={{ display:'flex', alignItems:'center', gap:'6px', backgroundColor:'transparent', color:'var(--color-text-muted)', fontWeight:'500', fontSize:'0.9rem' }}
        >
          <Download size={16} /> Invoice
        </button>
      </div>

      <div style={{ backgroundColor:'var(--color-bg-card)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)', border:'1px solid var(--color-border)', overflowX: 'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor:'var(--color-bg)' }}>
              {['Date','Description','Amount','Status'].map(h => (
                <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:'0.8rem', fontWeight:'600', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} style={{ borderTop: i > 0 ? '1px solid var(--color-border)' : 'none', backgroundColor: tx.type === 'credit' ? 'rgba(52,199,89,0.03)' : 'transparent' }}>
                <td style={{ padding:'14px 20px', fontSize:'0.9rem', color:'var(--color-text-muted)' }}>{tx.date}</td>
                <td style={{ padding:'14px 20px', fontWeight:'500' }}>{tx.description}</td>
                <td style={{ padding:'14px 20px', fontWeight:'700', color: tx.type === 'credit' ? 'var(--color-success)' : 'var(--color-text-main)' }}>
                  {tx.type === 'credit' ? '+' : '–'}₹{tx.amount.toLocaleString('en-IN')}
                </td>
                <td style={{ padding:'14px 20px' }}><StatusBadge status={tx.status} type={tx.type} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mock Gateway Modal */}
      <Modal isOpen={showGateway} onClose={gatewayStep !== 'processing' ? closeGateway : undefined} title="Add Funds">
        {gatewayStep === 'select' && (
          <div>
            {/* Mock Razorpay-style UI */}
            <div style={{ backgroundColor:'#072654', borderRadius:'var(--radius-md)', padding:'20px 24px', marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px' }}>
              <CreditCard size={28} color="#fff" />
              <div>
                <p style={{ margin:0, color:'rgba(255,255,255,0.7)', fontSize:'0.8rem' }}>Adding to Shiftly Wallet</p>
                <p style={{ margin:0, color:'#fff', fontSize:'1.5rem', fontWeight:'800' }}>₹{gatewayAmt.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <p style={{ fontWeight:'600', marginBottom:'12px' }}>Select payment method</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'24px' }}>
              {['📲 UPI (GPay, PhonePe, Paytm)','🏦 Net Banking','💳 Debit / Credit Card'].map(m => (
                <label key={m} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px', borderRadius:'var(--radius-md)', border:'1px solid var(--color-border)', cursor:'pointer', backgroundColor:'var(--color-bg)' }}>
                  <input type="radio" name="gateway_method" defaultChecked={m.includes('UPI')} style={{ accentColor:'var(--color-primary)' }} />
                  <span style={{ fontWeight:'500' }}>{m}</span>
                </label>
              ))}
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'var(--color-text-muted)', fontSize:'0.82rem', marginBottom:'24px' }}>
              <ShieldCheck size={16} color="var(--color-success)" />
              Secured by 256-bit SSL encryption
            </div>

            <Button variant="primary" fullWidth onClick={handleGatewayPay}>Pay ₹{gatewayAmt.toLocaleString('en-IN')}</Button>
          </div>
        )}

        {gatewayStep === 'processing' && (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'24px' }}>
              <RefreshCw size={56} color="var(--color-primary)" style={{ animation:'spin 1s linear infinite' }} />
            </div>
            <h3 style={{ margin:'0 0 8px' }}>Processing Payment…</h3>
            <p style={{ margin:0, color:'var(--color-text-muted)' }}>Connecting to payment gateway</p>
          </div>
        )}

        {gatewayStep === 'success' && (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ width:'80px', height:'80px', borderRadius:'50%', backgroundColor:'rgba(52,199,89,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <CheckCircle2 size={48} color="var(--color-success)" />
            </div>
            <h3 style={{ margin:'0 0 8px' }}>Payment Successful!</h3>
            <p style={{ color:'var(--color-text-muted)', margin:'0 0 8px' }}>₹{gatewayAmt.toLocaleString('en-IN')} added to your wallet.</p>
            <p style={{ fontWeight:'700', fontSize:'1.4rem', color:'var(--color-text-main)', margin:'0 0 28px' }}>
              New balance: ₹{(balance + gatewayAmt).toLocaleString('en-IN')}
            </p>
            <Button variant="primary" fullWidth onClick={closeGateway}>Done</Button>
          </div>
        )}
      </Modal>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ─── Page Shell ───────────────────────────────────────────────────────────────
const Payments = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login?redirect=/payments" />;

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'var(--color-bg)', paddingTop:'80px', paddingBottom:'80px' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'0 24px' }}>
        <div style={{ marginBottom:'40px' }}>
          <h1 style={{ fontSize:'2.25rem', fontWeight:'800', margin:'0 0 8px' }}>Payments</h1>
          <p style={{ margin:0, color:'var(--color-text-muted)' }}>
            {user.role === 'worker' ? 'Manage your earnings and withdrawals.' : 'Manage your wallet and payouts.'}
          </p>
        </div>

        {user.role === 'worker' ? <WorkerPayments user={user} /> : <PosterPayments user={user} />}
      </div>
    </div>
  );
};

export default Payments;
