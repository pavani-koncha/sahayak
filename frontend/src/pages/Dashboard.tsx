import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertOctagon,
  PhoneCall,
  Share2,
  Users,
  Compass,
  MapPin,
  RefreshCw,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  AlertTriangle,
  Flame,
  Car,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGeolocation } from '../hooks/useGeolocation';
import { contactsApi, emergencyApi } from '../services/api';
import { SosModal } from '../components/SosModal';
import { AlertBanner } from '../components/AlertBanner';
import type { EmergencyAlert, EmergencyContact } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const geo = useGeolocation();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<EmergencyAlert[]>([]);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Load contacts, active emergency, and recent alerts
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [fetchedContacts, fetchedActive, fetchedHistory] = await Promise.allSettled([
        contactsApi.getContacts(),
        emergencyApi.getActive(),
        emergencyApi.getHistory()
      ]);

      if (fetchedContacts.status === 'fulfilled') {
        setContacts(fetchedContacts.value);
      }
      if (fetchedActive.status === 'fulfilled') {
        setActiveAlert(fetchedActive.value);
      }
      if (fetchedHistory.status === 'fulfilled') {
        setRecentAlerts(fetchedHistory.value.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSosConfirm = async (alertType: string) => {
    // 1. Ensure we have location or attempt fresh refresh
    let lat = geo.latitude;
    let lng = geo.longitude;
    let acc = geo.accuracy;

    if (!lat || !lng) {
      try {
        const pos = await geo.refreshLocation();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        acc = Math.round(pos.coords.accuracy);
      } catch (err) {
        throw new Error("Unable to obtain GPS coordinates. Please enable location permissions.");
      }
    }

    if (!lat || !lng) {
      throw new Error("GPS position unavailable. Cannot activate emergency without coordinates.");
    }

    // 2. Call backend emergency activation
    const newAlert = await emergencyApi.activate({
      alert_type: alertType,
      latitude: lat,
      longitude: lng,
      accuracy: acc
    });

    setIsSosOpen(false);
    setActiveAlert(newAlert);
    navigate(`/active-emergency?id=${newAlert.id}`);
  };

  const handleShareLocation = async () => {
    if (!geo.latitude || !geo.longitude) {
      alert("GPS coordinates not acquired yet. Please allow location access or click 'Refresh Location'.");
      return;
    }

    const mapUrl = `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`;
    const shareData = {
      title: 'SAHAYAK Emergency Location',
      text: `EMERGENCY ALERT: I need assistance. My current live location is: ${mapUrl}`,
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

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <AlertBanner alert={activeAlert} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Welcome & System Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-rose-500 tracking-wider">
                Emergency Response Ready
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Welcome, {user?.name || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Sahayak is actively monitoring your emergency perimeter.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {user?.blood_group && (
              <span className="px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-bold text-xs flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                Blood Group: {user.blood_group}
              </span>
            )}
            <Link
              to="/services"
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              ERSS India (112)
            </Link>
          </div>
        </div>

        {/* SOS DOMINANT CALL-TO-ACTION CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-red-950/80 via-slate-900 to-slate-900 border-2 border-red-700/60 p-6 sm:p-10 shadow-2xl text-center flex flex-col items-center">
          <div className="absolute top-4 right-4 bg-red-900/40 border border-red-800 px-3 py-1 rounded-full text-[11px] font-bold text-red-300 tracking-wider uppercase">
            Instant Broadcast
          </div>

          <p className="text-xs sm:text-sm uppercase tracking-widest text-red-400 font-extrabold mb-1">
            Life Threatening Emergency?
          </p>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-lg mb-6">
            Press SOS to Broadcast Alert
          </h2>

          {/* LARGE PULSING SOS BUTTON */}
          <div className="sos-radar my-2 sm:my-4">
            <button
              id="sos-trigger-button"
              type="button"
              onClick={() => setIsSosOpen(true)}
              className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-red-700 via-rose-600 to-red-500 hover:from-red-600 hover:to-rose-500 text-white font-black text-2xl sm:text-3xl tracking-widest uppercase shadow-2xl shadow-red-600/70 border-4 border-white/20 active:scale-95 transition-transform flex flex-col items-center justify-center gap-1 z-10"
              aria-label="Activate SOS Emergency Alert"
            >
              <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 fill-white stroke-red-600 animate-pulse" />
              <span>SOS</span>
              <span className="text-[10px] tracking-normal font-medium text-red-100 opacity-90">
                TAP TO TRIGGER
              </span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-6 max-w-md">
            Instantly transmits your exact GPS coordinates to the emergency network and activates rapid actions.
          </p>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Call 112 */}
          <a
            href="tel:112"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-lg shadow-red-900/30 transition transform active:scale-95 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <PhoneCall className="w-6 h-6 fill-white" />
            </div>
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-wide">Call 112</span>
            <span className="text-[11px] text-red-100 mt-0.5">National Emergency</span>
          </a>

          {/* Share Location */}
          <button
            type="button"
            onClick={handleShareLocation}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 shadow-md transition transform active:scale-95 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              {shareSuccess ? <Check className="w-6 h-6 text-emerald-400" /> : <Share2 className="w-6 h-6" />}
            </div>
            <span className="text-sm sm:text-base font-bold">
              {shareSuccess ? 'Link Copied!' : 'Share Location'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">Google Maps URL</span>
          </button>

          {/* Emergency Contacts */}
          <Link
            to="/contacts"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 shadow-md transition transform active:scale-95 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm sm:text-base font-bold">Contacts</span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {contacts.length} Registered
            </span>
          </Link>

          {/* Nearby Help */}
          <Link
            to="/nearby"
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-800 shadow-md transition transform active:scale-95 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-sm sm:text-base font-bold">Nearby Help</span>
            <span className="text-[11px] text-slate-400 mt-0.5">Hospitals, Police</span>
          </Link>
        </div>

        {/* METRICS & STATUS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Current Location Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">GPS Location Status</h3>
                    <p className="text-xs text-slate-400">Real browser Geolocation sensor</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => geo.refreshLocation()}
                  disabled={geo.loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                  title="Refresh GPS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${geo.loading ? 'animate-spin text-rose-400' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {geo.error ? (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 mb-3">
                  {geo.error}
                </div>
              ) : (
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Latitude:</span>
                    <span className="font-mono text-white font-bold">
                      {geo.latitude !== null ? geo.latitude.toFixed(6) : 'Acquiring...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Longitude:</span>
                    <span className="font-mono text-white font-bold">
                      {geo.longitude !== null ? geo.longitude.toFixed(6) : 'Acquiring...'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">GPS Accuracy:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {geo.accuracy !== null ? `±${geo.accuracy} meters` : 'Pending'}
                    </span>
                  </div>
                  {geo.timestamp && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Last Synced:</span>
                      <span className="text-slate-300">
                        {new Date(geo.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  {geo.addressName && (
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 line-clamp-2">
                      <strong className="text-slate-400">Address: </strong>{geo.addressName}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/location"
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center justify-between pt-2 border-t border-slate-800"
            >
              <span>View Live Map & Accuracy Radius</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Emergency Contact Quick Summary & Recent Alerts */}
          <div className="space-y-4">
            {/* Contacts quick card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Emergency Contacts</h3>
                    <p className="text-xs text-slate-400">{contacts.length} designated guardian(s)</p>
                  </div>
                </div>

                <Link
                  to="/contacts"
                  className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  Manage
                </Link>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <p>No emergency contacts added yet.</p>
                  <Link to="/contacts" className="text-rose-400 font-bold hover:underline mt-1 inline-block">
                    + Add Primary Contact
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.slice(0, 2).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{c.name}</span>
                          {c.is_primary && (
                            <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800 font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{c.relationship} • {c.phone}</span>
                      </div>
                      <a
                        href={`tel:${c.phone}`}
                        className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                        title={`Call ${c.name}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Alerts Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Recent Alerts</h3>
                    <p className="text-xs text-slate-400">Database emergency history</p>
                  </div>
                </div>

                <Link
                  to="/history"
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center"
                >
                  All Alerts <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>

              {recentAlerts.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-3 bg-slate-950 rounded-xl border border-slate-800">
                  No emergency alerts triggered yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentAlerts.map((a) => (
                    <Link
                      key={a.id}
                      to={a.status === 'ACTIVE' ? `/active-emergency?id=${a.id}` : `/history`}
                      className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${
                          a.status === 'ACTIVE' ? 'bg-red-500 animate-pulse' :
                          a.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-slate-500'
                        }`} />
                        <div>
                          <div className="text-xs font-bold text-white">Alert #{a.id} ({a.alert_type})</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(a.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        a.status === 'ACTIVE'
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : a.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {a.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* SOS CONFIRMATION MODAL */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onConfirm={handleSosConfirm}
        gpsReady={geo.latitude !== null && geo.longitude !== null}
        latitude={geo.latitude}
        longitude={geo.longitude}
        accuracy={geo.accuracy}
      />
    </div>
  );
};
