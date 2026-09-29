export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  blood_group?: string | null;
  medical_information?: string | null;
  address?: string | null;
  created_at: string;
}

export interface EmergencyContact {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
}

export interface EmergencyAlert {
  id: number;
  user_id: number;
  alert_type: string;
  status: 'ACTIVE' | 'CANCELLED' | 'RESOLVED';
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  created_at: string;
  resolved_at?: string | null;
  user_name?: string | null;
  user_phone?: string | null;
}

export interface LocationRecord {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  distance_km: number;
  address?: string | null;
  latitude: number;
  longitude: number;
  phone?: string | null;
}

export interface NearbyResponse {
  success: boolean;
  category: string;
  count: number;
  user_latitude: number;
  user_longitude: number;
  places: NearbyPlace[];
  error?: string | null;
}

export interface GeolocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
}
