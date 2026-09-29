import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Flame, Car, HeartPulse, Shield, Crosshair } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alertType: string) => Promise<void>;
  gpsReady: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
}

const ALERT_TYPES = [
  { id: 'SOS', label: 'General Emergency', desc: 'Immediate assistance needed', icon: AlertTriangle, color: 'border-red-500 bg-red-950/40 text-red-400' },
  { id: 'MEDICAL', label: 'Medical Emergency', desc: 'Heart attack, stroke, injury', icon: HeartPulse, color: 'border-rose-500 bg-rose-950/40 text-rose-400' },
  { id: 'ACCIDENT', label: 'Road Accident', desc: 'Vehicle collision or trauma', icon: Car, color: 'border-amber-500 bg-amber-950/40 text-amber-400' },
  { id: 'FIRE', label: 'Fire & Rescue', desc: 'Building fire or smoke trapped', icon: Flame, color: 'border-orange-500 bg-orange-950/40 text-orange-400' },
  { id: 'UNSAFE', label: 'Threat / Safety', desc: 'Harassment, stalker, violence', icon: Shield, color: 'border-purple-500 bg-purple-950/40 text-purple-400' },
];

export const SosModal: React.FC<SosModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  gpsReady,
  latitude,
  longitude,
  accuracy,
}) => {
  const [selectedType, setSelectedType] = useState('SOS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleActivate = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(selectedType);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to activate SOS. Please check connection and GPS.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" role="dialog" aria-modal="true">
      <div className="bg-slate-900 border-2 border-red-600/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-red-950/80 px-6 py-4 border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg text-white shadow-lg shadow-red-600/40 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-wide text-white uppercase">Confirm Emergency</h2>
              <p className="text-xs text-red-200">SAHAYAK Response Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-lg font-bold text-red-400">
              Are you sure you want to activate an emergency alert?
            </p>
            <p className="text-sm text-slate-400">
              This triggers a high-priority emergency broadcast with your live coordinates.
            </p>
          </div>

          {/* GPS Status Indicator */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Crosshair className={`w-4 h-4 ${gpsReady ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
              <span className="font-medium text-slate-300">
                {gpsReady ? 'GPS Coordinates Acquired' : 'Acquiring high-precision GPS...'}
              </span>
            </div>
            {latitude && longitude ? (
              <span className="font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                {latitude.toFixed(4)}, {longitude.toFixed(4)} {accuracy ? `(±${accuracy}m)` : ''}
              </span>
            ) : (
              <span className="text-amber-400">Pending Signal</span>
            )}
          </div>

          {/* Emergency Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Emergency Nature:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALERT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-red-500 bg-red-950/60 ring-2 ring-red-500/50 shadow-md'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
                    <div>
                      <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-slate-400 leading-tight">
                        {type.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg text-xs text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-950/90 px-6 py-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition uppercase tracking-wider text-sm border border-slate-700 active:scale-95"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleActivate}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl font-extrabold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/50 transition uppercase tracking-wider text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5" />
                <span>ACTIVATE SOS</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
