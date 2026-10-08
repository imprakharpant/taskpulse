import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-8xl font-black text-slate-800 leading-none">404</h1>
          <h2 className="text-2xl font-bold text-slate-200 mt-2">Page Not Found</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
