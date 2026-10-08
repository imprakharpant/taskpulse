import React from 'react';

export const Badge = ({ children, className = '', variant = 'default' }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
    >
      {children}
    </span>
  );
};
