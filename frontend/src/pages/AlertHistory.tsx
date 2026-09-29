import React, { useState, useEffect } from 'react';
import {
  Clock,
  ShieldAlert,
  MapPin,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  PhoneCall,
  Share2
} from 'lucide-react';
import { emergencyApi } from '../services/api';
import { MapComponent } from '../components/MapComponent';
import type { EmergencyAlert } from '../types';

export const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await emergencyApi.getHistory();
      setAlerts(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load emergency history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> ACTIVE
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> RESOLVED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-400" /> CANCELLED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Emergency Alert History</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Audit log of all emergency events, GPS coordinates, and resolutions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto text-xs">
            {['ALL', 'ACTIVE', 'RESOLVED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  filterStatus === s
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-950/70 border border-red-800 rounded-2xl text-xs sm:text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Alerts List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading emergency logs...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <p className="text-slate-400 text-sm">No emergency alerts recorded under "{filterStatus}".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 cursor-pointer hover:border-slate-600 transition shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  alert.status === 'ACTIVE'
                    ? 'border-red-600/70 bg-red-950/10 ring-1 ring-red-600/20'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.status === 'ACTIVE'
                      ? 'bg-red-600 text-white animate-pulse'
                      : alert.status === 'RESOLVED'
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">
                        Alert #{alert.id} • {alert.alert_type}
                      </h3>
                      {getStatusBadge(alert.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1 font-mono">
                      <span>Date: {new Date(alert.created_at).toLocaleDateString()}</span>
                      <span>Time: {new Date(alert.created_at).toLocaleTimeString()}</span>
                      <span>GPS: {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-rose-400 font-bold">
                  <span>View Details & Map</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ALERT DETAILS & MAP MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-600 text-white">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">
                    Emergency Alert #{selectedAlert.id}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Category: {selectedAlert.alert_type}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Status & Timing Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Coordinates</span>
                <span className="font-mono text-white text-xs font-bold block mt-1">
                  {selectedAlert.latitude.toFixed(5)}, {selectedAlert.longitude.toFixed(5)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Triggered</span>
                <span className="text-slate-200 text-xs font-medium block mt-1">
                  {new Date(selectedAlert.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Resolution</span>
                <span className="text-slate-200 text-xs font-medium block mt-1">
                  {selectedAlert.resolved_at
                    ? new Date(selectedAlert.resolved_at).toLocaleTimeString()
                    : selectedAlert.status === 'ACTIVE' ? 'Still Active' : 'N/A'}
                </span>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Incident GPS Location:</span>
                <a
                  href={`https://www.google.com/maps?q=${selectedAlert.latitude},${selectedAlert.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <MapComponent
                latitude={selectedAlert.latitude}
                longitude={selectedAlert.longitude}
                accuracy={selectedAlert.accuracy}
                height="280px"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {selectedAlert.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAlert(null);
                    window.location.href = `/active-emergency?id=${selectedAlert.id}`;
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition"
                >
                  Go to Live Action Screen
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
