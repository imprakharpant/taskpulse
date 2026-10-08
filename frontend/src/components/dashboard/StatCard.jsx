import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'indigo',
  description
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400'
    },
    blue: {
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      text: 'text-sky-400'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${scheme.bg} ${scheme.border} ${scheme.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
};
