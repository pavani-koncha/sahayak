import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useGeolocation } from './hooks/useGeolocation';
import { emergencyApi } from './services/api';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SosModal } from './components/SosModal';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ActiveEmergency } from './pages/ActiveEmergency';
import { LocationPage } from './pages/LocationPage';
import { NearbyHelp } from './pages/NearbyHelp';
import { EmergencyContacts } from './pages/EmergencyContacts';
import { EmergencyServices } from './pages/EmergencyServices';
import { AlertHistory } from './pages/AlertHistory';
import { SafetyCenter } from './pages/SafetyCenter';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-300 font-bold text-sm tracking-wide">Initializing SAHAYAK...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const geo = useGeolocation();
  const navigate = useNavigate();
  const [isSosOpen, setIsSosOpen] = useState(false);

  const handleGlobalSosConfirm = async (alertType: string) => {
    let lat = geo.latitude;
    let lng = geo.longitude;
    let acc = geo.accuracy;

    if (!lat || !lng) {
      try {
        const pos = await geo.refreshLocation();
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        acc = Math.round(pos.coords.accuracy);
      } catch {
        throw new Error("Unable to obtain GPS coordinates. Please enable location permissions.");
      }
    }

    if (!lat || !lng) {
      throw new Error("GPS position unavailable. Cannot activate emergency without coordinates.");
    }

    const newAlert = await emergencyApi.activate({
      alert_type: alertType,
      latitude: lat,
      longitude: lng,
      accuracy: acc
    });

    setIsSosOpen(false);
    navigate(`/active-emergency?id=${newAlert.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/active-emergency"
            element={
              <ProtectedRoute>
                <ActiveEmergency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/location"
            element={
              <ProtectedRoute>
                <LocationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nearby"
            element={
              <ProtectedRoute>
                <NearbyHelp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <EmergencyContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <EmergencyServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AlertHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety"
            element={
              <ProtectedRoute>
                <SafetyCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <BottomNav onOpenSos={() => setIsSosOpen(true)} />
      )}

      {/* Global SOS Modal triggerable anywhere */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onConfirm={handleGlobalSosConfirm}
        gpsReady={geo.latitude !== null && geo.longitude !== null}
        latitude={geo.latitude}
        longitude={geo.longitude}
        accuracy={geo.accuracy}
      />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
