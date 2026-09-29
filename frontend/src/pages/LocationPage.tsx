import React, { useState } from 'react';
import {
  MapPin,
  RefreshCw,
  Share2,
  Copy,
  Check,
  Navigation,
  Compass,
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapComponent } from '../components/MapComponent';
import { locationApi } from '../services/api';

export const LocationPage: React.FC = () => {
  const geo = useGeolocation();
  const [copySuccess, setCopySuccess] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const mapUrl = geo.latitude && geo.longitude ? `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}` : '';

  const handleShare = async () => {
    if (!geo.latitude || !geo.longitude) return;

    const shareData = {
      title: 'SAHAYAK Live GPS Location',
      text: `My real-time location via SAHAYAK: ${mapUrl}`,
      url: mapUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    if (!mapUrl) return;
    navigator.clipboard.writeText(mapUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleSaveToBackend = async () => {
    if (!geo.latitude || !geo.longitude) return;
    setSavingLocation(true);
    try {
      await locationApi.saveLocation({
        latitude: geo.latitude,
        longitude: geo.longitude,
        accuracy: geo.accuracy
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to log location', err);
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Live GPS Location</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time browser geolocation telemetry and OpenStreetMap display.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => geo.refreshLocation()}
              disabled={geo.loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${geo.loading ? 'animate-spin text-rose-400' : ''}`} />
              <span>Refresh Location</span>
            </button>

            {geo.latitude && geo.longitude && (
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm border border-rose-500 shadow-lg shadow-rose-900/30 transition active:scale-95"
              >
                {copySuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copySuccess ? 'Copied!' : 'Share Location'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Handling for GPS Denied or Unavailable */}
        {geo.error && (
          <div className="p-5 bg-red-950/70 border border-red-800 rounded-3xl text-slate-200 flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-red-600 text-white rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-extrabold text-red-300 text-base">GPS Location Permission Required</h3>
              <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
                {geo.error}
              </p>
              <p className="text-xs text-slate-400">
                To fix: Click the site lock/permissions icon in your browser address bar, set "Location" to <strong>Allow</strong>, and tap "Refresh Location" above.
              </p>
              <button
                type="button"
                onClick={() => geo.refreshLocation()}
                className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Retry Location Request
              </button>
            </div>
          </div>
        )}

        {/* Telemetry Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Latitude</span>
            <span className="text-base sm:text-lg font-mono font-black text-white mt-1 block">
              {geo.latitude !== null ? geo.latitude.toFixed(6) : 'Acquiring...'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Longitude</span>
            <span className="text-base sm:text-lg font-mono font-black text-white mt-1 block">
              {geo.longitude !== null ? geo.longitude.toFixed(6) : 'Acquiring...'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Accuracy</span>
            <span className="text-base sm:text-lg font-mono font-black text-emerald-400 mt-1 block">
              {geo.accuracy !== null ? `±${geo.accuracy} m` : 'Pending'}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Last Updated</span>
            <span className="text-base sm:text-lg font-mono font-medium text-slate-200 mt-1 block truncate">
              {geo.timestamp ? new Date(geo.timestamp).toLocaleTimeString() : 'Waiting'}
            </span>
          </div>
        </div>

        {/* Address Card if reverse geocoded */}
        {geo.addressName && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span><strong>Identified Location:</strong> {geo.addressName}</span>
            </div>
          </div>
        )}

        {/* Real Leaflet Map */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-white">Live OpenStreetMap View</h2>
            </div>
            {geo.latitude && geo.longitude && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {geo.latitude && geo.longitude ? (
            <MapComponent
              latitude={geo.latitude}
              longitude={geo.longitude}
              accuracy={geo.accuracy}
              height="400px"
              zoom={16}
            />
          ) : (
            <div className="h-72 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Waiting for real GPS coordinates...</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="text-slate-400">
              Google Maps Link: <span className="font-mono text-slate-300">{mapUrl || 'Generating...'}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={copyLink}
                disabled={!mapUrl}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 font-bold transition disabled:opacity-40"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Link Copied' : 'Copy Location Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToBackend}
                disabled={savingLocation || !geo.latitude}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 font-bold transition disabled:opacity-40"
              >
                <span>{savedSuccess ? 'Location Logged!' : savingLocation ? 'Saving...' : 'Log to History'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
