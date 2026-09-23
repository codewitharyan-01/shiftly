import React from 'react';
import { Link } from 'react-router-dom';

const sizeMap = {
  sm: { padding: '7px 16px', fontSize: '13px', minHeight: '34px' },
  md: { padding: '10px 20px', fontSize: '15px', minHeight: '42px' },
  lg: { padding: '13px 28px', fontSize: '16px', minHeight: '50px' },
};

const variantMap = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: '#FFF',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'var(--color-bg-card)',
    color: 'var(--color-text-main)',
    border: '1px solid var(--color-border)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid var(--color-primary)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
  },
  danger: {
    backgroundColor: 'var(--color-danger)',
    color: '#FFF',
    border: 'none',
  },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  disabled = false,
  style: extraStyle = {},
  ...props
}) => {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    fontFamily: 'var(--font-family)',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-bounce)',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    WebkitTapHighlightColor: 'transparent',
    ...sizeMap[size],
    ...variantMap[variant],
    ...extraStyle,
  };

  const hoverHandlers = disabled ? {} : {
    onMouseEnter: e => {
      if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      if (variant !== 'ghost' && variant !== 'outline') e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    },
    onMouseLeave: e => {
      if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)';
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseDown: e => { 
      e.currentTarget.style.transform = 'scale(0.95)';
      e.currentTarget.style.boxShadow = 'none';
    },
    onMouseUp: e => { 
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; 
      if (variant !== 'ghost' && variant !== 'outline') e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    },
  };

  if (to) {
    return (
      <Link to={to} style={base} className={className} {...hoverHandlers} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      style={base}
      className={className}
      disabled={disabled}
      {...hoverHandlers}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
