import React from 'react';

const SkeletonCard = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '200px', gap: '12px' }}>
    <div className="skeleton" style={{ height: '18px', width: '70%', borderRadius: '6px' }} />
    <div className="skeleton" style={{ height: '13px', width: '40%', borderRadius: '6px' }} />
    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
      <div className="skeleton" style={{ height: '24px', width: '64px', borderRadius: '99px' }} />
      <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
      <div className="skeleton" style={{ height: '24px', width: '72px', borderRadius: '99px' }} />
    </div>
    <div style={{ flexGrow: 1 }} />
    <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: 'var(--radius-md)' }} />
  </div>
);

export default SkeletonCard;
