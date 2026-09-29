import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, PhoneCall, User as UserIcon, LogOut, Radio } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/location', label: 'Location' },
    { to: '/nearby', label: 'Nearby Help' },
    { to: '/contacts', label: 'Contacts' },
    { to: '/services', label: 'Services' },
    { to: '/history', label: 'History' },
    { to: '/safety', label: 'Safety Center' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white">SAHAYAK</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-red-400" /> Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-tight font-medium">
                Emergency assistance when every second matters.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      isActive
                        ? 'bg-slate-800 text-rose-400 border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Quick 112 Call Button (Always accessible) */}
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition transform active:scale-95 border border-red-500"
              title="Emergency Response Support System (ERSS India)"
            >
              <PhoneCall className="w-4 h-4 fill-white" />
              <span>112</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className={`p-2 rounded-xl border transition ${
                    location.pathname === '/profile'
                      ? 'border-rose-500 bg-rose-950/40 text-rose-400'
                      : 'border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={`Profile: ${user?.name || 'User'}`}
                  aria-label="Profile"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
