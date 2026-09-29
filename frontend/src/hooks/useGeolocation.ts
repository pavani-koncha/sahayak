import { useState, useEffect, useCallback } from 'react';
import type { GeolocationData } from '../types';

export interface ExtendedGeolocationData extends GeolocationData {
  addressName: string | null;
  refreshLocation: () => Promise<GeolocationPosition>;
}

export function useGeolocation(): ExtendedGeolocationData {
  const [geoState, setGeoState] = useState<GeolocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    loading: true,
  });
  const [addressName, setAddressName] = useState<string | null>(null);

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SahayakEmergencyApp/1.0'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setAddressName(data.display_name);
        }
      }
    } catch {
      // Non-fatal if reverse geocoding is rate-limited or offline
    }
  };

  const refreshLocation = useCallback((): Promise<GeolocationPosition> => {
    setGeoState((prev) => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errMsg = "Geolocation is not supported by your browser.";
        setGeoState({
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: null,
          error: errMsg,
          loading: false,
        });
        reject(new Error(errMsg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setGeoState({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            timestamp: position.timestamp,
            error: null,
            loading: false,
          });
          fetchAddress(latitude, longitude);
          resolve(position);
        },
        (error) => {
          let errorMsg = "Unable to retrieve your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = "Location permission denied. Please enable GPS/Location in your browser settings to use emergency services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is currently unavailable. Please check your device GPS signal.";
              break;
            case error.TIMEOUT:
              errorMsg = "The request to get your location timed out. Please click 'Refresh Location'.";
              break;
          }
          setGeoState((prev) => ({
            ...prev,
            error: errorMsg,
            loading: false,
          }));
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  useEffect(() => {
    refreshLocation().catch(() => {
      // Initial error handled in state
    });
  }, [refreshLocation]);

  return {
    ...geoState,
    addressName,
    refreshLocation,
  };
}
