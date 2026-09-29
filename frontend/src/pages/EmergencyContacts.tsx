import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  PhoneCall,
  Share2,
  Trash2,
  Edit2,
  Star,
  Check,
  AlertCircle,
  X,
  Phone,
  User,
  Heart
} from 'lucide-react';
import { contactsApi } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import type { EmergencyContact } from '../types';

export const EmergencyContacts: React.FC = () => {
  const geo = useGeolocation();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactsApi.getContacts();
      setContacts(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load emergency contacts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('Parent');
    setIsPrimary(contacts.length === 0); // Default primary if first contact
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: EmergencyContact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone);
    setRelationship(c.relationship);
    setIsPrimary(c.is_primary);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      if (!name.trim()) throw new Error('Contact Name is required.');
      if (!phone.trim()) throw new Error('Phone number is required.');

      if (editingContact) {
        await contactsApi.updateContact(editingContact.id, {
          name,
          phone,
          relationship,
          is_primary: isPrimary
        });
      } else {
        await contactsApi.createContact({
          name,
          phone,
          relationship,
          is_primary: isPrimary
        });
      }

      setIsModalOpen(false);
      await fetchContacts();
    } catch (err: any) {
      setFormError(err?.response?.data?.detail || err?.message || 'Failed to save contact.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from your emergency contacts?`)) {
      return;
    }

    try {
      await contactsApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to delete contact.');
    }
  };

  const handleSetPrimary = async (id: number) => {
    try {
      await contactsApi.updateContact(id, { is_primary: true });
      await fetchContacts();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to update primary contact.');
    }
  };

  const handleShareToContact = (contact: EmergencyContact) => {
    const lat = geo.latitude;
    const lng = geo.longitude;
    const mapUrl = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : 'Pending GPS';
    const message = encodeURIComponent(
      `Hello ${contact.name}, this is an urgent message from SAHAYAK. My current GPS location is: ${mapUrl}. Please reach out if you cannot get in touch with me.`
    );
    const cleanPhone = contact.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Emergency Contacts</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your designated guardians and emergency circle.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm border border-rose-500 shadow-lg shadow-rose-900/30 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-950/70 border border-red-800 rounded-2xl text-xs sm:text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Contacts List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading emergency contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">No Emergency Contacts Registered</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              Add family members, trusted friends, or medical caretakers who can be notified instantly during emergencies.
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg transition"
            >
              Add First Contact
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  contact.is_primary
                    ? 'border-rose-500/80 ring-1 ring-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg ${
                    contact.is_primary
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-white text-base">{contact.name}</h3>
                      {contact.is_primary && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-rose-300" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <strong className="text-slate-300">{contact.relationship}</strong> • <span className="font-mono">{contact.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Actions: Call, Share, Primary, Edit, Delete */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Quick Call */}
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                    title={`Call ${contact.name}`}
                  >
                    <PhoneCall className="w-4 h-4 fill-white" />
                    <span className="hidden sm:inline">Call</span>
                  </a>

                  {/* Share Location via WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleShareToContact(contact)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
                    title={`Share Live Location with ${contact.name}`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share GPS</span>
                  </button>

                  {/* Set Primary Button if not already */}
                  {!contact.is_primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(contact.id)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition"
                      title="Set as Primary Contact"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(contact)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 transition"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white">
                {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mom, Dr. Mehta, Partner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Parent">Parent</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Doctor / Caretaker">Doctor / Caretaker</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-950 border-slate-800 focus:ring-rose-500"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    Set as Primary Emergency Contact
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : editingContact ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
