import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircle, X, Send, CheckCircle2 } from 'lucide-react';
import useScrollAnimation from '../utils/useScrollAnimation';

const faqs = [
  { id: 1,  cat: 'Workers',  question: "How do I apply for a shift?",               answer: "Browse available shifts from your Dashboard or the 'Browse' tab. Click any shift card, review the full details — description, rules, amenities, pay — then click 'View & Apply'. The poster will review and respond within 24 hours." },
  { id: 2,  cat: 'Workers',  question: "When do I get paid?",                        answer: "Payments are processed once the poster marks the shift as complete. Funds are sent to your linked UPI/bank account within 2 hours in most cases. You can also view your payout history in the Earnings tab." },
  { id: 3,  cat: 'Workers',  question: "How do I verify my identity?",               answer: "Go to your Profile and scroll to 'Get Verified'. Upload a government-issued ID (Aadhaar, Voter ID, or Passport). Verification usually completes within 24 hours. Verified workers get 3x more acceptances!" },
  { id: 4,  cat: 'Workers',  question: "What if a shift is cancelled last-minute?",  answer: "If a poster cancels within 4 hours of the shift start, you are eligible for a ₹100 cancellation fee from the poster's wallet. If you cancel, please do so 2 hours in advance to avoid a reliability score penalty." },
  { id: 5,  cat: 'Workers',  question: "What is the Reliability Score?",             answer: "Your Reliability Score (0–100%) is calculated from on-time arrivals, completed shifts, and poster ratings. A higher score boosts your visibility in search results and unlocks better opportunities." },
  { id: 6,  cat: 'Workers',  question: "How does the Check-In process work?",        answer: "When you arrive at the shift site, tap 'Check In' in your Applications tab. The app will verify your GPS location (must be within 100m) and ask for a quick selfie for confirmation. This is shared with the poster as proof of attendance." },
  { id: 7,  cat: 'Posters',  question: "How do I post a shift?",                     answer: "Log in as a Poster, go to 'Post Shift' from your Dashboard, and fill in the details. You can use our Quick Templates to auto-fill common roles like Warehouse Packer or Event Helper. Enable 'Urgent Mode' if you need staff within 24 hours." },
  { id: 8,  cat: 'Posters',  question: "How much does it cost to post a shift?",     answer: "Shiftly charges a flat ₹50 platform fee per shift filled. For urgent shifts, the fee is ₹100. You only pay when a worker is successfully matched and confirmed. There is no listing fee." },
  { id: 9,  cat: 'Posters',  question: "How do I review and accept applicants?",     answer: "Go to 'Manage Shifts' in your Dashboard. Click on any shift to expand its applicant list. You can see each applicant's rating, skills, and verification status, then Accept or Reject them with one click." },
  { id: 10, cat: 'Posters',  question: "Can I require specific qualifications?",     answer: "Yes! When posting a shift you can toggle requirements like Age 18+, Own Transport, and Prior Experience. Workers who do not meet these filters will be ranked lower in your applicant list." },
  { id: 11, cat: 'Payments', question: "What payment methods are supported?",        answer: "Workers receive pay via UPI, bank transfer, or Paytm wallet. Posters can add funds to their Shiftly wallet using UPI, NEFT, or credit/debit cards. All transactions are secured and encrypted." },
  { id: 12, cat: 'Payments', question: "Is there a minimum withdrawal amount?",      answer: "Workers can withdraw any amount from ₹100 upwards. There is no maximum limit. Withdrawals initiated before 5 PM on weekdays usually arrive the same day." },
];

const Help = () => {
  useScrollAnimation();
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCat, setActiveCat] = useState('All');
  const [formState, setFormState] = useState({ name: '', email: '', issueType: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hi there! 👋 How can we help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const filteredFaqs = faqs.filter(faq => {
    const matchSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCat === 'All' || faq.cat === activeCat;
    return matchSearch && matchCat;
  });

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setFormState({ name: '', email: '', issueType: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'agent', text: 'Thanks for your message! A support agent will be with you shortly.' }]);
    }, 1000);
  };

  return (
    <div className="section-padding container" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="text-center fade-up" style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '16px' }}>
          How can we help?
        </h1>
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search for articles, questions, etc..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              fontSize: '1.1rem',
              borderRadius: '100px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.boxShadow = 'var(--shadow-md)'}
            onBlur={(e) => e.target.style.boxShadow = 'var(--shadow-sm)'}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        {['All', 'Workers', 'Posters', 'Payments'].map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '8px 20px', borderRadius: '100px', border: `1.5px solid ${activeCat === cat ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: activeCat === cat ? 'var(--color-primary)' : 'transparent', color: activeCat === cat ? '#fff' : 'var(--color-text-main)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s' }}>
            {cat === 'Workers' ? '👷 Workers' : cat === 'Posters' ? '🏢 Posters' : cat === 'Payments' ? '💳 Payments' : '🔍 All'}
          </button>
        ))}
      </div>

      <div className="grid-2 fade-up">
        {/* FAQ Section */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredFaqs.length > 0 ? filteredFaqs.map(faq => (
              <div 
                key={faq.id} 
                style={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderRadius: 'var(--radius-md)', 
                  border: `1px solid var(--color-border)`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  style={{ 
                    width: '100%', 
                    padding: '20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontWeight: '500',
                    fontSize: '1rem',
                    color: openFaq === faq.id ? 'var(--color-primary)' : 'inherit'
                  }}
                >
                  {faq.question}
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transform: openFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: openFaq === faq.id ? 'var(--color-primary)' : 'var(--color-text-muted)'
                    }} 
                  />
                </button>
                <div 
                  style={{ 
                    maxHeight: openFaq === faq.id ? '200px' : '0px', 
                    opacity: openFaq === faq.id ? 1 : 0,
                    padding: openFaq === faq.id ? '0 20px 20px 20px' : '0 20px',
                    transition: 'all 0.3s ease',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.6'
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            )) : (
              <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)' }}>
                No FAQs found matching "{searchTerm}". Try a different search term.
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Contact Support</h2>
          <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>Ticket Created Successfully</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>We've received your request and will reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid-2" style={{ gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleFormChange}
                      style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', transition: 'border-color 0.2s', width: '100%' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                      placeholder="John Doe"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleFormChange}
                      style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', transition: 'border-color 0.2s', width: '100%' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Issue Type</label>
                  <select 
                    name="issueType"
                    required
                    value={formState.issueType}
                    onChange={handleFormChange}
                    style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: '#fff', cursor: 'pointer', width: '100%' }}
                  >
                    <option value="" disabled>Select an issue</option>
                    <option value="payment">Payment Issue</option>
                    <option value="verification">Account Verification</option>
                    <option value="technical">Technical Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--color-text-main)' }}>Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formState.message}
                    onChange={handleFormChange}
                    style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', outline: 'none', minHeight: '120px', resize: 'vertical', width: '100%' }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="hover-lift"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: '#fff', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-md)', 
                    fontWeight: '600',
                    marginTop: '8px',
                    boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)',
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Live Chat Mock Component */}
      <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000 }}>
        {/* Chat Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: 'var(--shadow-lg)',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isChatOpen ? 'scale(0)' : 'scale(1)',
            position: 'absolute',
            bottom: '0',
            right: '0',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <MessageCircle size={28} />
        </button>

        {/* Chat Window */}
        <div 
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '350px',
            height: '500px',
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transformOrigin: 'bottom right',
            transform: isChatOpen ? 'scale(1)' : 'scale(0)',
            opacity: isChatOpen ? 1 : 0,
            pointerEvents: isChatOpen ? 'auto' : 'none'
          }}
        >
          {/* Chat Header */}
          <div style={{ backgroundColor: 'var(--color-primary)', padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>Shiftly Support</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Typically replies in a few minutes</p>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ color: '#fff', background: 'transparent', padding: '4px', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#f9f9fb' }}>
            {chatMessages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div 
                  style={{ 
                    padding: '12px 16px', 
                    borderRadius: '16px', 
                    backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#fff',
                    color: msg.sender === 'user' ? '#fff' : 'var(--color-text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.sender === 'agent' ? '4px' : '16px',
                    fontSize: '0.95rem'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} style={{ padding: '16px', borderTop: '1px solid var(--color-border)', backgroundColor: '#fff', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '10px 16px', borderRadius: '20px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
            />
            <button 
              type="submit"
              style={{ width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', cursor: 'pointer' }}
            >
              <Send size={18} style={{ transform: 'translateX(-1px)' }} />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Help;
