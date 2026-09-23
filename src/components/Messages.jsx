import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Image as ImageIcon, MapPin, CheckCheck, MoreVertical } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const mockChats = [
  {
    id: 'c1',
    user: { name: 'Rahul Patel', avatar: 'RP', role: 'worker' },
    shiftTitle: 'Warehouse Packer',
    messages: [
      { id: 'm1', text: 'Hi, I saw your shift for tomorrow. Is it still open?', sender: 'worker', time: '10:30 AM' },
      { id: 'm2', text: 'Yes, it is! Are you available to start at 9 AM?', sender: 'poster', time: '10:35 AM' },
      { id: 'm3', text: 'Absolutely. I have experience in packing too.', sender: 'worker', time: '10:36 AM' },
    ]
  },
  {
    id: 'c2',
    user: { name: 'SuperMart Inc', avatar: 'SM', role: 'poster' },
    shiftTitle: 'Retail Assistant',
    messages: [
      { id: 'm1', text: 'Hello, please remember to wear a black t-shirt.', sender: 'poster', time: 'Yesterday' },
      { id: 'm2', text: 'Noted. I will be there 10 mins early.', sender: 'worker', time: 'Yesterday' },
    ]
  }
];

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [activeChatId, setActiveChatId] = useState(mockChats[0].id);
  const [chats, setChats] = useState(mockChats);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now().toString(),
      text: newMessage,
      sender: user.role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, msg] };
      }
      return c;
    }));
    setNewMessage('');
  };

  return (
    <div className="fade-up visible" style={{ height: 'calc(100vh - 140px)', display: 'flex', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      
      {/* Sidebar - Chat List */}
      <div style={{ width: '320px', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChatId(chat.id)}
              style={{ 
                padding: '16px 20px', 
                borderBottom: '1px solid var(--color-border)', 
                cursor: 'pointer',
                backgroundColor: activeChatId === chat.id ? 'var(--color-bg)' : 'transparent',
                display: 'flex', gap: '12px', alignItems: 'center',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(0,122,255,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {chat.user.avatar}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.user.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{chat.messages[chat.messages.length - 1].time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.messages[chat.messages.length - 1].text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeChat ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
          {/* Chat Header */}
          <div style={{ padding: '20px', backgroundColor: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0,122,255,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {activeChat.user.avatar}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{activeChat.user.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Regarding: {activeChat.shiftTitle}</p>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeChat.messages.map(msg => {
              const isMine = msg.sender === user.role;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '70%', 
                    padding: '12px 16px', 
                    borderRadius: '16px', 
                    borderBottomRightRadius: isMine ? '4px' : '16px',
                    borderBottomLeftRadius: !isMine ? '4px' : '16px',
                    backgroundColor: isMine ? 'var(--color-primary)' : 'var(--color-bg-card)',
                    color: isMine ? '#FFF' : 'var(--color-text-main)',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '4px'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>{msg.text}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    {msg.time} {isMine && <CheckCheck size={12} color="var(--color-success)" />}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ padding: '16px 24px', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '8px' }}>
                <ImageIcon size={20} />
              </button>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '8px' }}>
                <MapPin size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '100px', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'var(--color-bg)', fontSize: '0.95rem' }}
              />
              <button type="submit" disabled={!newMessage.trim()} style={{ backgroundColor: newMessage.trim() ? 'var(--color-primary)' : 'var(--color-border)', color: '#FFF', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
                <Send size={18} style={{ marginLeft: '2px' }} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
          <p className="text-muted">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
