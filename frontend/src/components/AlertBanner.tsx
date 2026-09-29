import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import type { EmergencyAlert } from '../types';

interface AlertBannerProps {
  alert: EmergencyAlert | null;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert }) => {
  if (!alert || alert.status !== 'ACTIVE') return null;

  return (
    <div className="bg-red-600 text-white font-semibold py-2.5 px-4 shadow-lg animate-pulse-fast border-b-2 border-red-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
          <span>
            <strong className="font-extrabold uppercase">🚨 EMERGENCY ALERT ACTIVE:</strong> Alert #{alert.id} ({alert.alert_type}) is broadcasting live!
          </span>
        </div>
        <Link
          to={`/active-emergency?id=${alert.id}`}
          className="bg-white text-red-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-red-100 transition flex items-center gap-1 shrink-0 shadow"
        >
          View Emergency <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
