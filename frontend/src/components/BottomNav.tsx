import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, AlertOctagon, Compass, Users, Clock, ShieldCheck, User } from 'lucide-react';

interface BottomNavProps {
  onOpenSos: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenSos }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto relative">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 py-1 transition ${
              isActive ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Home</span>
        </NavLink>

        {/* Location */}
        <NavLink
          to="/location"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 py-1 transition ${
              isActive ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-1">GPS</span>
        </NavLink>

        {/* CENTER PROMINENT SOS BUTTON */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenSos}
            aria-label="Activate SOS Emergency Alert"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/50 border-4 border-slate-950 hover:scale-105 active:scale-95 transition-all animate-glow"
          >
            <AlertOctagon className="w-7 h-7 fill-white stroke-red-600" />
          </button>
          <span className="text-[10px] font-black uppercase text-red-500 mt-0.5 tracking-wider">
            SOS
          </span>
        </div>

        {/* Nearby */}
        <NavLink
          to="/nearby"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 py-1 transition ${
              isActive ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Nearby</span>
        </NavLink>

        {/* Contacts */}
        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 py-1 transition ${
              isActive ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1">Contacts</span>
        </NavLink>

        {/* History */}
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 py-1 transition ${
              isActive ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-1">Alerts</span>
        </NavLink>
      </div>
    </div>
  );
};
