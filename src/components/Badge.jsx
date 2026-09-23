import React from 'react';

/**
 * Badge component for status chips.
 * variant: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
 */
const Badge = ({ children, variant = 'gray', style = {} }) => {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
