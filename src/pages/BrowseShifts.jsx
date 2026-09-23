import React, { useState, useContext } from 'react';
import { ShiftContext } from '../context/ShiftContext';
import ShiftCard from '../components/ShiftCard';
import Input from '../components/Input';
import useSEO from '../utils/useSEO';
import useAnalytics from '../utils/useAnalytics';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';
import { calculateDistance, getCoordsForLocation } from '../utils/geo';
import { Search, Ghost, MapPin, SlidersHorizontal, X, Flame } from 'lucide-react';

const BrowseShifts = () => {
  const { shifts } = useContext(ShiftContext);
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [maxDistance, setMaxDistance] = useState(50);
  const [urgentOnly, setUrgentOnly] = useState(false);

  useSEO(t('browse_title'));
  const { trackClick } = useAnalytics('BrowseShifts');

  const userCoords = getCoordsForLocation(user?.location || 'Ahmedabad');

  const filtered = shifts.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = category ? s.category === category : true;
    const dist = calculateDistance(userCoords.lat, userCoords.lng, s.lat ?? userCoords.lat, s.lng ?? userCoords.lng);
    s.distance = dist;
    const matchDistance = dist <= maxDistance;
    const matchUrgent = urgentOnly ? s.isUrgent : true;
    return matchSearch && matchCategory && matchDistance && matchUrgent;
  }).sort((a, b) => a.distance - b.distance);

  const clearAll = () => {
    setSearchTerm('');
    setCategory('');
    setMaxDistance(50);
    setUrgentOnly(false);
  };

  const hasActiveFilters = searchTerm || category || urgentOnly || maxDistance < 50;

  const selectStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-card)',
    fontSize: '15px',
    color: 'var(--color-text-main)',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2398989D' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-secondary)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', padding: '32px 0' }}>
        <div className="container">
          <h1 style={{ marginBottom: '6px' }}>{t('browse_title')}</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
            {filtered.length} shift{filtered.length !== 1 ? 's' : ''} available near you
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 16px' }}>
        {/* Search Bar Floating */}
        <div style={{ position: 'sticky', top: '16px', zIndex: 10, backgroundColor: 'var(--color-bg-card)', borderRadius: '100px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ marginLeft: '8px' }} />
          <input
            placeholder="Search roles or locations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', flex: 1, padding: '8px', outline: 'none', fontSize: '15px', color: 'var(--color-text-main)' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'var(--color-bg-secondary)', borderRadius: '50%', padding: '4px', display: 'flex', color: 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="scroll-x" style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => setUrgentOnly(!urgentOnly)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '100px', border: `1px solid ${urgentOnly ? 'var(--color-danger)' : 'var(--color-border)'}`, backgroundColor: urgentOnly ? 'var(--color-danger-bg)' : 'var(--color-bg-card)', color: urgentOnly ? 'var(--color-danger)' : 'var(--color-text-main)', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            <Flame size={16} fill={urgentOnly ? 'currentColor' : 'none'} /> Urgent
          </button>
          
          {['warehouse', 'retail', 'events', 'weddings', 'construction', 'delivery'].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(category === cat ? '' : cat)}
              style={{ padding: '8px 16px', borderRadius: '100px', border: `1px solid ${category === cat ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: category === cat ? 'var(--color-primary)' : 'var(--color-bg-card)', color: category === cat ? '#fff' : 'var(--color-text-main)', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', whiteSpace: 'nowrap', textTransform: 'capitalize', cursor: 'pointer' }}
            >
              {cat}
            </button>
          ))}
          
          {hasActiveFilters && (
            <button onClick={clearAll} style={{ padding: '8px 16px', color: 'var(--color-primary)', fontWeight: '600', fontSize: '14px', background: 'transparent', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}>
              Clear All
            </button>
          )}
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="auto-grid stagger-fade-in">
            {filtered.map(s => <ShiftCard key={s.id} shift={s} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>{t('no_shifts')}</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Try adjusting your filters, increasing the distance, or search for something else.
            </p>
            <button onClick={clearAll} style={{ color: 'var(--color-primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px' }}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseShifts;
