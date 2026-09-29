import React, { useState, useEffect } from 'react';
import {
  Compass,
  HeartPulse,
  Shield,
  Flame,
  Navigation,
  MapPin,
  PhoneCall,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { nearbyApi } from '../services/api';
import { MapComponent } from '../components/MapComponent';
import type { NearbyPlace } from '../types';

export const NearbyHelp: React.FC = () => {
  const geo = useGeolocation();
  const [category, setCategory] = useState<'hospitals' | 'police' | 'fire_stations'>('hospitals');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const fetchNearby = async (selectedCat = category) => {
    if (!geo.latitude || !geo.longitude) return;

    setLoading(true);
    setServiceError(null);
    try {
      const data = await nearbyApi.getNearby(geo.latitude, geo.longitude, selectedCat);
      if (data.success) {
        setPlaces(data.places || []);
        if (data.places.length === 0) {
          setServiceError(`No ${selectedCat} found within 15 km of your current location.`);
        }
      } else {
        setPlaces([]);
        setServiceError(data.error || 'Nearby emergency services query unavailable at the moment.');
      }
    } catch (err: any) {
      setPlaces([]);
      setServiceError(
        err?.response?.data?.detail || 'Nearby emergency search service is currently unavailable. Please dial 112 directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (geo.latitude && geo.longitude) {
      fetchNearby(category);
    }
  }, [geo.latitude, geo.longitude, category]);

  const mapMarkers = places.map((p) => ({
    id: p.id,
    lat: p.latitude,
    lng: p.longitude,
    title: p.name,
    subtitle: `${p.distance_km} km away • ${p.address || ''}`,
    category: p.category,
  }));

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Nearby Emergency Services</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real facilities near your verified GPS location. Never fabricated.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchNearby(category)}
              disabled={loading || !geo.latitude}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-rose-400' : ''}`} />
              <span>Refresh Nearby</span>
            </button>
          </div>
        </div>

        {/* GPS Warning if not available */}
        {(!geo.latitude || !geo.longitude) && (
          <div className="p-5 bg-amber-950/60 border border-amber-800 rounded-3xl text-amber-200 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-400" />
            <div className="text-xs sm:text-sm">
              <strong className="block font-bold">Waiting for real GPS coordinates...</strong>
              Allow location access in your browser to locate hospitals, police, and fire stations around you.
            </div>
          </div>
        )}

        {/* Category Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setCategory('hospitals')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition ${
              category === 'hospitals'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4 shrink-0" />
            <span>Hospitals & Clinics</span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('police')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition ${
              category === 'police'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Police Stations</span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('fire_stations')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition ${
              category === 'fire_stations'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" />
            <span>Fire Stations</span>
          </button>
        </div>

        {/* Interactive Map with facility markers */}
        {geo.latitude && geo.longitude && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300">
                Facility Map ({places.length} located)
              </h2>
              <span className="text-xs text-slate-500 font-mono">Radius: 15 km</span>
            </div>

            <MapComponent
              latitude={geo.latitude}
              longitude={geo.longitude}
              accuracy={geo.accuracy}
              height="350px"
              markers={mapMarkers}
              zoom={13}
            />
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white">
              {category === 'hospitals' && 'Nearest Hospitals & Medical Centers'}
              {category === 'police' && 'Nearest Police Stations'}
              {category === 'fire_stations' && 'Nearest Fire & Rescue Stations'}
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Sorted by real distance
            </span>
          </div>

          {loading ? (
            <div className="p-12 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-400 font-semibold">
                Searching real OpenStreetMap verified facilities...
              </p>
            </div>
          ) : serviceError ? (
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center space-y-2">
              <p className="text-slate-300 text-sm font-semibold">{serviceError}</p>
              <p className="text-xs text-slate-500">
                In urgent need of help, call the national emergency line immediately:
              </p>
              <div className="pt-2">
                <a
                  href="tel:112"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm"
                >
                  <PhoneCall className="w-4 h-4" /> Dial 112
                </a>
              </div>
            </div>
          ) : places.length === 0 ? (
            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 text-center text-slate-400 text-sm">
              No emergency facilities found in this category within 15 km.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-white text-base leading-snug">
                          {place.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {place.address || 'Address details registered in OpenStreetMap.'}
                        </p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800 font-bold text-xs font-mono">
                        {place.distance_km} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate Here</span>
                    </a>

                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
