import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  HeartPulse,
  FileText,
  MapPin,
  Save,
  Check,
  AlertTriangle,
  ShieldCheck,
  Info
} from 'lucide-react';
import { profileApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalInfo, setMedicalInfo] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBloodGroup(user.blood_group || '');
      setMedicalInfo(user.medical_information || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      const updated = await profileApi.updateProfile({
        name,
        phone,
        blood_group: bloodGroup || null,
        medical_information: medicalInfo || null,
        address: address || null,
      });
      updateUser(updated);
      setSuccessMsg('Emergency profile updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <User className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Emergency Medical Profile</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personal health details displayed to medical emergency responders when required.
          </p>
        </div>

        {/* MANDATORY WARNING NOTICE */}
        <div className="p-5 bg-amber-950/60 border-2 border-amber-700/70 rounded-3xl text-slate-200 flex items-start gap-4 shadow-xl">
          <div className="p-2.5 bg-amber-600 text-white rounded-2xl shrink-0 mt-0.5">
            <Info className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="text-amber-300 font-extrabold block text-sm">
              Privacy & Medical Data Disclosure Warning
            </strong>
            <p className="text-amber-100/90 leading-relaxed">
              Users should only store sensitive medical or personal information they are comfortable storing on this device. Information provided here (such as blood group, allergies, or emergency address) may be made accessible to designated emergency contacts during active alerts.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-2xl text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-950/80 border border-red-700 rounded-2xl text-red-200 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-slate-500 lowercase">(registered)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Blood Group <span className="text-slate-500 lowercase">(optional)</span>
              </label>
              <div className="relative">
                <HeartPulse className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Medical Conditions / Allergies <span className="text-slate-500 lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Diabetic, severe penicillin allergy, wears pacemaker, asthmatic."
              value={medicalInfo}
              onChange={(e) => setMedicalInfo(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed"
            />
          </div>

          {/* Emergency Home Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Emergency Home Address <span className="text-slate-500 lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flat 402, Sunshine Apts, MG Road, New Delhi"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-lg shadow-rose-900/40 transition active:scale-95 text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
