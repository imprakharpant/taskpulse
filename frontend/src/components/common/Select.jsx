import React, { forwardRef } from 'react';

export const Select = forwardRef(
  ({ label, error, options = [], className = '', id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-800 hover:border-slate-700'
          } ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <p className="text-xs font-medium text-rose-400">
            {error.message || error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
