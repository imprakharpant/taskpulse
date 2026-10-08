import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, LayoutDashboard, FolderKanban, LogOut, Menu, X, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-950 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                Task<span className="text-indigo-400">Pulse</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/projects"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/projects') || location.pathname.startsWith('/projects/')
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                Projects
              </Link>
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0) || <User className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-200 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/dashboard') ? 'bg-slate-800 text-indigo-400' : 'text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/projects') ? 'bg-slate-800 text-indigo-400' : 'text-slate-300'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            Projects
          </Link>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-slate-200">{user?.fullName}</p>
              <p className="text-slate-500 text-[11px]">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-900/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
