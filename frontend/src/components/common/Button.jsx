import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500 shadow-sm shadow-indigo-950',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 focus:ring-slate-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500 shadow-sm shadow-rose-950',
    outline: 'border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/50',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};
