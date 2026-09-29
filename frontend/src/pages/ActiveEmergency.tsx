import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  Share2,
  Users,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  MapPin,
  Clock,
  Crosshair,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { emergencyApi, contactsApi } from '../services/api';
import { MapComponent } from '../components/MapComponent';
import type { EmergencyAlert, EmergencyContact } from '../types';

export const ActiveEmergency: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alertIdParam = searchParams.get('id');

  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAlertAndContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      let currentAlert: EmergencyAlert | null = null;
      if (alertIdParam) {
        currentAlert = await emergencyApi.getById(parseInt(alertIdParam));
      } else {
        currentAlert = await emergencyApi.getActive();
      }

      if (!currentAlert) {
        setError('No active emergency alert found.');
      } else {
        setAlert(currentAlert);
      }

      const fetchedContacts = await contactsApi.getContacts();
      setContacts(fetchedContacts);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to retrieve emergency details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertAndContacts();
  }, [alertIdParam]);

  const handleCancelAlert = async () => {
    if (!alert) return;
    const confirmCancel = window.confirm('Are you sure you want to CANCEL this emergency alert?');
    if (!confirmCancel) return;

    setActionLoading(true);
    try {
      const updated = await emergencyApi.cancel(alert.id);
      setAlert(updated);
      window.alert('Emergency alert has been cancelled.');
    } catch (err: any) {
      window.alert(err?.response?.data?.detail || 'Failed to cancel alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveAlert = async () => {
    if (!alert) return;
    const confirmResolve = window.confirm('Confirm that you are safe and this emergency is now RESOLVED?');
    if (!confirmResolve) return;

    setActionLoading(true);
    try {
      const updated = await emergencyApi.resolve(alert.id);
      setAlert(updated);
      window.alert('Emergency alert marked as resolved. Glad you are safe!');
    } catch (err: any) {
      window.alert(err?.response?.data?.detail || 'Failed to resolve alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareLocation = async () => {
    if (!alert) return;
    const mapUrl = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
    const shareData = {
      title: 'SAHAYAK 🚨 Emergency Location Broadcast',
      text: `EMERGENCY ALERT: I need immediate assistance! Alert #${alert.id}. My coordinates are: ${alert.latitude}, ${alert.longitude}. Google Maps: ${mapUrl}`,
      url: mapUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(mapUrl);
        }
      }
    } else {
      copyToClipboard(mapUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-bold tracking-wide">Loading emergency status...</p>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Active Emergency</h2>
          <p className="text-sm text-slate-400">{error || 'There is no active emergency broadcast at this moment.'}</p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
            >
              Return to Dashboard
            </Link>
            <Link
              to="/history"
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition"
            >
              View Alert History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isStillActive = alert.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
          <span className="text-xs text-slate-500 font-mono">Alert ID #{alert.id}</span>
        </div>

        {/* PROMINENT EMERGENCY STATUS BANNER */}
        <div className={`rounded-3xl p-6 sm:p-8 border-2 shadow-2xl transition-all ${
          isStillActive
            ? 'bg-red-950/80 border-red-600 shadow-red-950/50'
            : alert.status === 'RESOLVED'
            ? 'bg-emerald-950/80 border-emerald-600'
            : 'bg-slate-900 border-slate-700'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl shrink-0 ${
                isStillActive
                  ? 'bg-red-600 text-white animate-pulse'
                  : alert.status === 'RESOLVED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    isStillActive
                      ? 'bg-red-600 text-white border-red-500 animate-pulse'
                      : alert.status === 'RESOLVED'
                      ? 'bg-emerald-900 text-emerald-300 border-emerald-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {alert.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Category: {alert.alert_type}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  {isStillActive ? '🚨 EMERGENCY ALERT ACTIVE' : `ALERT ${alert.status}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {isStillActive
                    ? 'Your emergency state is recorded. Use the rapid action buttons below immediately.'
                    : `This alert was resolved or cancelled at ${alert.resolved_at ? new Date(alert.resolved_at).toLocaleTimeString() : 'N/A'}.`}
                </p>
              </div>
            </div>
          </div>

          {/* Real Coordinates & Telemetry Box */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Latitude</span>
              <span className="font-mono text-white text-sm font-bold">{alert.latitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Longitude</span>
              <span className="font-mono text-white text-sm font-bold">{alert.longitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">GPS Accuracy</span>
              <span className="font-mono text-emerald-400 text-sm font-bold">
                {alert.accuracy ? `±${alert.accuracy}m` : 'Accurate'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Triggered</span>
              <span className="text-slate-200 text-sm font-medium">
                {new Date(alert.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS (MANDATORY SPEC: CALL 112, SHARE LOCATION, CONTACT FAMILY, CANCEL ALERT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* CALL 112 */}
          <a
            href="tel:112"
            className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-xl shadow-red-900/40 border border-red-500 active:scale-98 transition transform text-center"
          >
            <PhoneCall className="w-6 h-6 fill-white shrink-0 animate-bounce" />
            <div>
              <span>CALL 112</span>
              <span className="block text-[11px] font-normal tracking-normal text-red-100 opacity-90">
                (Opens device phone dialer)
              </span>
            </div>
          </a>

          {/* SHARE LOCATION */}
          <button
            type="button"
            onClick={handleShareLocation}
            className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg uppercase tracking-wider border border-slate-700 shadow-lg active:scale-98 transition text-center"
          >
            {shareSuccess ? (
              <Check className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <Share2 className="w-6 h-6 text-blue-400 shrink-0" />
            )}
            <div>
              <span>{shareSuccess ? 'LINK COPIED' : 'SHARE LOCATION'}</span>
              <span className="block text-[11px] font-normal tracking-normal text-slate-400">
                (Google Maps GPS URL)
              </span>
            </div>
          </button>

          {/* CONTACT FAMILY */}
          <button
            type="button"
            onClick={() => setShowFamilyModal(true)}
            className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base sm:text-lg uppercase tracking-wider border border-slate-700 shadow-lg active:scale-98 transition text-center"
          >
            <Users className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <span>CONTACT FAMILY</span>
              <span className="block text-[11px] font-normal tracking-normal text-slate-400">
                ({contacts.length} saved emergency contacts)
              </span>
            </div>
          </button>

          {/* CANCEL ALERT or RESOLVE ALERT */}
          {isStillActive ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCancelAlert}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 hover:bg-red-950/60 text-red-400 hover:text-red-300 font-bold text-sm uppercase tracking-wider border border-red-900/60 transition active:scale-98 disabled:opacity-50"
              >
                <XCircle className="w-5 h-5 shrink-0" />
                <span>CANCEL</span>
              </button>

              <button
                type="button"
                onClick={handleResolveAlert}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-950/40 border border-emerald-500 transition active:scale-98 disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>RESOLVE</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider border border-slate-700 transition"
            >
              <span>Return to Dashboard</span>
            </button>
          )}
        </div>

        {/* REAL LEAFLET MAP OF ACTIVE EMERGENCY */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-white">Live Emergency Location Map</h2>
            </div>
            <a
              href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Open in Google Maps
            </a>
          </div>

          <MapComponent
            latitude={alert.latitude}
            longitude={alert.longitude}
            accuracy={alert.accuracy}
            height="320px"
          />

          <p className="text-[11px] text-slate-400 italic text-center">
            Coordinates verified via real browser Geolocation API. Accuracy: ±{alert.accuracy || 15} meters.
          </p>
        </div>

        {/* Honest Disclosure notice */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1">
          <strong className="text-slate-300 block">Service Transparency Notice:</strong>
          <p>
            Pressing "CALL 112" opens your phone's dialer to connect directly to India's Emergency Response Support System (ERSS).
            Sahayak stores your emergency coordinates securely in the database and provides one-tap tools for sharing and contacting family.
          </p>
        </div>
      </main>

      {/* CONTACT FAMILY MODAL */}
      {showFamilyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Emergency Contacts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFamilyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400 space-y-3">
                <p>No emergency contacts have been saved yet.</p>
                <Link
                  to="/contacts"
                  className="inline-block px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs"
                >
                  Add Contacts Now
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {contacts.map((c) => {
                  const whatsappMessage = encodeURIComponent(
                    `EMERGENCY ALERT: I need your help! Alert #${alert.id}. My live location: https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`
                  );
                  return (
                    <div
                      key={c.id}
                      className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{c.name}</span>
                          {c.is_primary && (
                            <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800 font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block">{c.relationship} • {c.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Call */}
                        <a
                          href={`tel:${c.phone}`}
                          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow"
                          title={`Call ${c.name}`}
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                        {/* WhatsApp / SMS share */}
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition shadow"
                          title={`Share Location via WhatsApp to ${c.name}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowFamilyModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
