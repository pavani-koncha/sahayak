import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Flame,
  HeartPulse,
  Shield,
  LifeBuoy,
  Users,
  Baby,
  Car,
  AlertCircle
} from 'lucide-react';

const EMERGENCY_NUMBERS = [
  {
    category: 'National Emergency Service',
    number: '112',
    name: '112 — Emergency Response Support System (ERSS)',
    description: 'Unified single emergency number across India for Police, Fire, Ambulance, and Disaster response.',
    icon: ShieldAlert,
    isPrimary: true,
    color: 'from-red-600 via-rose-600 to-red-700',
    borderColor: 'border-red-500'
  },
  {
    category: 'Police & Law Enforcement',
    number: '100',
    name: 'Police Control Room',
    description: 'Immediate police intervention, crime prevention, and urgent civil safety.',
    icon: Shield,
    isPrimary: false,
    color: 'from-indigo-600 to-indigo-800',
    borderColor: 'border-indigo-600/40'
  },
  {
    category: 'Medical Emergency',
    number: '108',
    name: 'National Ambulance Service (108 / 102)',
    description: 'Free emergency medical ambulance dispatch and hospital transfer across India.',
    icon: HeartPulse,
    isPrimary: false,
    color: 'from-rose-600 to-rose-800',
    borderColor: 'border-rose-600/40'
  },
  {
    category: 'Fire & Rescue',
    number: '101',
    name: 'Fire & Rescue Service',
    description: 'Emergency fire-fighting, building entrapment, and chemical hazard response.',
    icon: Flame,
    isPrimary: false,
    color: 'from-orange-600 to-orange-800',
    borderColor: 'border-orange-600/40'
  },
  {
    category: 'Women Safety',
    number: '1091',
    name: 'Women in Distress Helpline (1091 / 181)',
    description: '24x7 crisis response, domestic violence protection, and stalking support.',
    icon: Users,
    isPrimary: false,
    color: 'from-purple-600 to-purple-800',
    borderColor: 'border-purple-600/40'
  },
  {
    category: 'Child Helpline',
    number: '1098',
    name: 'Childline India (1098)',
    description: 'Emergency assistance, rescue, and care for children in distress.',
    icon: Baby,
    isPrimary: false,
    color: 'from-blue-600 to-blue-800',
    borderColor: 'border-blue-600/40'
  },
  {
    category: 'National Highway Emergency',
    number: '1033',
    name: 'National Highways Helpline (NHAI)',
    description: 'Highway ambulance, crane breakdown towing, and road accident clearance.',
    icon: Car,
    isPrimary: false,
    color: 'from-amber-600 to-amber-800',
    borderColor: 'border-amber-600/40'
  },
  {
    category: 'Disaster Management',
    number: '1078',
    name: 'NDRF Disaster Helpline',
    description: 'National Disaster Response Force for floods, earthquakes, and cyclones.',
    icon: LifeBuoy,
    isPrimary: false,
    color: 'from-teal-600 to-teal-800',
    borderColor: 'border-teal-600/40'
  }
];

export const EmergencyServices: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Emergency Services Directory</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official emergency hotlines across India. One-tap direct device dialing.
          </p>
        </div>

        {/* Device dialer disclaimer */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-300">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Device Dialer Notice:</strong> Clicking any "Call" button opens your phone's native calling screen directly using <code className="bg-slate-800 px-1 py-0.5 rounded text-rose-300 font-mono">tel:number</code>. No third-party VoIP or fake claims are made.
          </p>
        </div>

        {/* NATIONAL EMERGENCY 112 PROMINENT FEATURED HERO */}
        {EMERGENCY_NUMBERS.filter((s) => s.isPrimary).map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.number}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-500 p-6 sm:p-8 shadow-2xl shadow-red-950/60"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-red-600/40 animate-pulse">
                    <Icon className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-400">
                      Unified India Emergency Service
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                      {service.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl">
                      {service.description}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${service.number}`}
                  className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-600/50 transition transform active:scale-95 border-2 border-red-400 shrink-0 uppercase tracking-wider"
                >
                  <PhoneCall className="w-6 h-6 fill-white" />
                  <span>Call {service.number}</span>
                </a>
              </div>
            </div>
          );
        })}

        {/* ALL SERVICES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMERGENCY_NUMBERS.filter((s) => !s.isPrimary).map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className={`bg-slate-900 border ${service.borderColor} rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-600 transition`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${service.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {service.category}
                    </span>
                    <h3 className="font-extrabold text-white text-base mt-0.5">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-rose-400">
                    Dial {service.number}
                  </span>
                  <a
                    href={`tel:${service.number}`}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-rose-500 transition active:scale-95 shadow"
                  >
                    <PhoneCall className="w-4 h-4 fill-white" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
