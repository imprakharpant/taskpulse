import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-1/3" />
        <div className="h-5 bg-slate-800 rounded-full w-20" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/60 rounded w-full" />
        <div className="h-4 bg-slate-800/60 rounded w-4/5" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="h-4 bg-slate-800 rounded w-24" />
        <div className="h-8 bg-slate-800 rounded-lg w-16" />
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="w-9 h-9 rounded-lg bg-slate-800" />
      </div>
      <div className="h-8 bg-slate-800 rounded w-1/3" />
    </div>
  );
};
