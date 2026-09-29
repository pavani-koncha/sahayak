import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom emergency icons using SVG
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 34px;
        height: 34px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #ffffff;
        box-shadow: 0 0 15px ${color};
        color: white;
        font-size: 16px;
        font-weight: bold;
      ">
        ${label}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
};

const userIcon = createCustomIcon('#ef4444', '📍');
const hospitalIcon = createCustomIcon('#3b82f6', '🏥');
const policeIcon = createCustomIcon('#6366f1', '👮');
const fireIcon = createCustomIcon('#f97316', '🚒');

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  category?: string;
}

interface MapComponentProps {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  height?: string;
  markers?: MapMarker[];
  zoom?: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  accuracy,
  height = '350px',
  markers = [],
  zoom = 15,
}) => {
  const center: [number, number] = [latitude, longitude];

  const getMarkerIcon = (category?: string) => {
    switch (category) {
      case 'hospital':
      case 'hospitals':
        return hospitalIcon;
      case 'police':
        return policeIcon;
      case 'fire_station':
      case 'fire_stations':
        return fireIcon;
      default:
        return hospitalIcon;
    }
  };

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}
      >
        <ChangeView center={center} zoom={zoom} />
        {/* Clean OpenStreetMap Carto tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Current / Emergency Location */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="text-slate-900 text-sm">
              <strong className="block text-red-600 font-bold">Emergency Coordinates</strong>
              <span>Lat: {latitude.toFixed(5)}</span><br />
              <span>Lng: {longitude.toFixed(5)}</span>
              {accuracy && <><br /><span>Accuracy: ±{accuracy}m</span></>}
            </div>
          </Popup>
        </Marker>

        {/* Accuracy Circle */}
        {accuracy && accuracy > 0 && (
          <Circle
            center={center}
            radius={accuracy}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '4, 8'
            }}
          />
        )}

        {/* Additional nearby markers (Hospitals, Police, etc.) */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={getMarkerIcon(m.category)}
          >
            <Popup>
              <div className="text-slate-900 text-sm p-1">
                <strong className="block font-bold">{m.title}</strong>
                {m.subtitle && <span className="text-xs text-slate-600 block">{m.subtitle}</span>}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs bg-rose-600 text-white px-2 py-1 rounded font-medium hover:bg-rose-700"
                >
                  Navigate Here
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
