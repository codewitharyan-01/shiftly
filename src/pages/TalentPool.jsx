import React, { useState } from 'react';
import { Search, Star, MapPin, Award, Heart, UserPlus, SlidersHorizontal, X } from 'lucide-react';

const MOCK_WORKERS = [
  { id: 'w1', name: 'Rahul Patel',    location: 'Nikol',       skills: ['Packing', 'Delivery', 'Lifting'],   rating: 4.9, reliability: 98, shifts: 42, verified: true,  badge: 'Top Rated',      avatar: 'RP', available: true  },
  { id: 'w2', name: 'Priya Sharma',   location: 'Gandhinagar', skills: ['Customer Service', 'Retail', 'POS'], rating: 4.8, reliability: 95, shifts: 28, verified: true,  badge: 'Fast Responder', avatar: 'PS', available: true  },
  { id: 'w3', name: 'Amit Verma',     location: 'Infocity',    skills: ['Driving', 'Delivery', 'Logistics'],  rating: 4.7, reliability: 92, shifts: 35, verified: true,  badge: null,             avatar: 'AV', available: false },
  { id: 'w4', name: 'Meena Joshi',    location: 'Kudasan',     skills: ['Events', 'Catering', 'Hostess'],     rating: 4.9, reliability: 99, shifts: 20, verified: true,  badge: 'Festival Hero',  avatar: 'MJ', available: true  },
  { id: 'w5', name: 'Sachin Gupta',   location: 'Satellite',   skills: ['Warehouse', 'Packing', 'Sorting'],   rating: 4.6, reliability: 88, shifts: 18, verified: false, badge: null,             avatar: 'SG', available: true  },
  { id: 'w6', name: 'Kavita Rao',     location: 'Nikol',       skills: ['Retail', 'Cashier', 'Inventory'],    rating: 4.8, reliability: 94, shifts: 31, verified: true,  badge: null,             avatar: 'KR', available: true  },
  { id: 'w7', name: 'Dinesh Solanki', location: 'SG Highway',  skills: ['Security', 'Monitoring', 'Access'],  rating: 4.5, reliability: 90, shifts: 14, verified: true,  badge: null,             avatar: 'DS', available: false },
  { id: 'w8', name: 'Riya Mehta',     location: 'Vastrapur',   skills: ['Events', 'Decoration', 'Hosting'],   rating: 4.9, reliability: 97, shifts: 24, verified: true,  badge: 'Top Rated',      avatar: 'RM', available: true  },
];

const BADGE_COLORS = { 'Top Rated': '#FF3B30', 'Fast Responder': '#007AFF', 'Festival Hero': '#AF52DE' };

const TalentPool = () => {
  const [search, setSearch]       = useState('');
  const [location, setLocation]   = useState('');
  const [skill, setSkill]         = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(['w1', 'w4']);
  const [invited, setInvited]     = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const toggleFav = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const inviteWorker = (id) => { setInvited(prev => [...prev, id]); };

  const filtered = MOCK_WORKERS.filter(w => {
    const matchSearch   = w.name.toLowerCase().includes(search.toLowerCase()) || w.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchLocation = location ? w.location.includes(location) : true;
    const matchSkill    = skill ? w.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) : true;
    const matchRating   = w.rating >= minRating;
    const matchTab      = activeTab === 'favorites' ? favorites.includes(w.id) : true;
    return matchSearch && matchLocation && matchSkill && matchRating && matchTab;
  });

  return (
    <div className="fade-up visible" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>Talent Pool</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Search, save, and invite verified workers directly.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[['all', '👥 All Workers'], ['favorites', '❤️ Saved']].map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v)} style={{ padding: '7px 16px', borderRadius: '100px', border: `1px solid ${activeTab === v ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: activeTab === v ? 'var(--color-primary)' : 'transparent', color: activeTab === v ? '#fff' : 'var(--color-text-main)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
            {l} {v === 'favorites' && `(${favorites.length})`}
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input placeholder="Search name or skill..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)', outline: 'none', fontSize: '0.9rem' }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${showFilters ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: showFilters ? 'var(--color-primary)' : 'transparent', color: showFilters ? '#fff' : 'var(--color-text-main)', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Area</label>
            <select value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none' }}>
              <option value="">All Areas</option>
              {['Nikol', 'Gandhinagar', 'Infocity', 'Kudasan', 'Satellite', 'Vastrapur', 'SG Highway'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Skill</label>
            <input placeholder="e.g. Packing" value={skill} onChange={e => setSkill(e.target.value)} style={{ width: '100%', padding: '9px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', outline: 'none' }} />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.8rem', display: 'block', marginBottom: '6px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Min Rating: {minRating > 0 ? `${minRating}★` : 'Any'}</label>
            <input type="range" min="0" max="5" step="0.5" value={minRating} onChange={e => setMinRating(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={() => { setSearch(''); setLocation(''); setSkill(''); setMinRating(0); }} style={{ padding: '9px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Clear</button>
          </div>
        </div>
      )}

      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>{filtered.length} workers found</p>

      {/* Worker Cards */}
      <div className="grid-3">
        {filtered.map(w => (
          <div key={w.id} style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            
            {/* Fav button */}
            <button onClick={() => toggleFav(w.id)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', cursor: 'pointer', color: favorites.includes(w.id) ? '#FF3B30' : 'var(--color-text-muted)', transition: 'color 0.15s' }}>
              <Heart size={18} fill={favorites.includes(w.id) ? '#FF3B30' : 'none'} />
            </button>

            {/* Avatar + Info */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #007AFF, #0051d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff', fontSize: '1rem', flexShrink: 0, position: 'relative' }}>
                {w.avatar}
                {w.available && <span style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-success)', border: '2px solid var(--color-bg-card)' }} />}
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem' }}>{w.name} {w.verified && '✅'}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} />{w.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem', color: '#FFB800' }}>★{w.rating}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Rating</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem', color: 'var(--color-success)' }}>{w.reliability}%</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Reliable</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem' }}>{w.shifts}</p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Shifts</p>
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {w.skills.map(s => <span key={s} style={{ padding: '3px 10px', borderRadius: '100px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>{s}</span>)}
            </div>

            {/* Badge */}
            {w.badge && (
              <span style={{ padding: '4px 10px', borderRadius: '100px', backgroundColor: `${BADGE_COLORS[w.badge]}15`, color: BADGE_COLORS[w.badge], fontSize: '0.75rem', fontWeight: '700', alignSelf: 'flex-start', border: `1px solid ${BADGE_COLORS[w.badge]}40` }}>
                🏅 {w.badge}
              </span>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button onClick={() => toggleFav(w.id)} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', color: favorites.includes(w.id) ? '#FF3B30' : 'var(--color-text-main)' }}>
                {favorites.includes(w.id) ? '❤️ Saved' : '🤍 Save'}
              </button>
              <button onClick={() => inviteWorker(w.id)} disabled={invited.includes(w.id)} style={{ flex: 1, padding: '8px', borderRadius: 'var(--radius-md)', border: 'none', backgroundColor: invited.includes(w.id) ? 'var(--color-success)' : 'var(--color-primary)', color: '#fff', cursor: invited.includes(w.id) ? 'default' : 'pointer', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                {invited.includes(w.id) ? '✓ Invited' : <><UserPlus size={14} /> Invite</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</p>
          <h3 style={{ margin: '0 0 8px' }}>No Workers Found</h3>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default TalentPool;
