import React from 'react';

const Input = ({ label, id, error, type = 'text', helperText, style: extraStyle, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className="form-input"
        style={{
          borderColor: error ? 'var(--color-danger)' : undefined,
          boxShadow: error ? '0 0 0 3px rgba(255,59,48,0.15)' : undefined,
          ...extraStyle,
        }}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {helperText && !error && (
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '5px' }}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;
