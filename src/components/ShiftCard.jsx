import React from 'react';
import { MapPin, Clock, IndianRupee, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShiftCard = ({ shift }) => {
  return (
    <div
      className="card card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        paddingTop: shift.isUrgent || shift.distance !== undefined ? '28px' : '20px',
      }}
    >
      {/* Top badges */}
      <div style={{ position: 'absolute', top: '-11px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
        {shift.matchScore !== undefined && (
          <span className="badge" style={{ fontSize: '11px', backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }}>
            {shift.matchScore}% Match
          </span>
        )}
        {shift.distance !== undefined && shift.matchScore === undefined && (
          <span className="badge badge-gray" style={{ fontSize: '11px' }}>
            <MapPin size={10} /> {shift.distance.toFixed(1)} km
          </span>
        )}
        {shift.isUrgent && (
          <span className="badge badge-red" style={{ fontSize: '11px', marginLeft: 'auto' }}>
            <Flame size={10} /> Urgent
          </span>
        )}
      </div>

      {/* Header */}
      <div style={{ marginBottom: '12px', flexGrow: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 4px', color: 'var(--color-text-main)', lineHeight: 1.3 }}>
          {shift.title}
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {shift.posterName}
          <ShieldCheck size={12} color="var(--color-primary)" />
        </p>
      </div>

      {/* Info chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <span className="badge badge-gray">
          <MapPin size={11} /> {shift.location}
        </span>
        <span className="badge badge-gray">
          <Clock size={11} /> {shift.time}
        </span>
        <span className="badge badge-green">
          <IndianRupee size={11} /> {shift.pay}
        </span>
      </div>

      {/* CTA */}
      <Link
        to={`/shift/${shift.id}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-primary)',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'background-color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
      >
        View & Apply <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default ShiftCard;
