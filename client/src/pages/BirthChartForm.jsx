import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import { Compass, Sparkles, User, Save } from 'lucide-react';

const BirthChartForm = () => {
  const { user, addSavedProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
    gender: ''
  });
  const [saveToAccount, setSaveToAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Autofill form from a saved profile selection
  const handleProfileSelect = (e) => {
    const profileId = e.target.value;
    if (!profileId) return;

    const selected = user.savedProfiles.find(p => p._id === profileId);
    if (selected) {
      setFormData({
        name: selected.name,
        dob: selected.dob,
        tob: selected.tob,
        pob: selected.pob,
        gender: selected.gender || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. If checked and logged in, save the profile to their account first
      if (saveToAccount && user) {
        await addSavedProfile(formData);
      }

      // 2. Call recommendations endpoint
      const { data } = await api.recommendGemstone(formData);
      
      // 3. Navigate to recommendations report page with the returned data
      // We can pass data through state or by redirecting to /report/:id
      navigate(`/report/${data.logId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Calculation failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner message="Calculating planetary alignments and BPHS rules..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="glow-bubble h-[400px] w-[400px] bg-cosmic-800/5 top-20 right-20"></div>

      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 sm:p-8 relative z-10 border border-slate-800 bg-mystic-900/40 shadow-xl">
        <div className="flex justify-between items-start border-b border-slate-850 pb-5 mb-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="h-6.5 w-6.5 text-cosmic-400" />
              Generate Birth Report
            </h2>
            <p className="text-xs text-slate-400 mt-1">Enter birth coordinates to calculate natal house positions</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
            <Sparkles className="h-5 w-5 text-cosmic-500 animate-pulse" />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-950/40 border border-red-900/60 p-4 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Quick select saved profiles for logged-in users */}
        {user && user.savedProfiles && user.savedProfiles.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-cosmic-900/40 bg-cosmic-950/20 text-xs">
            <label className="block font-semibold text-cosmic-300 uppercase tracking-wider mb-2">
              Quick-Select Saved Profile
            </label>
            <select
              onChange={handleProfileSelect}
              className="w-full rounded-lg border border-slate-800 bg-mystic-900/60 px-3 py-2 text-slate-200 outline-none focus:border-cosmic-500"
            >
              <option value="">-- Choose a Profile --</option>
              {user.savedProfiles.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.pob})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Yash Negi"
              required
            />

            <InputField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Select Gender (Optional)"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <InputField
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
            />

            <InputField
              label="Time of Birth"
              name="tob"
              type="time"
              value={formData.tob}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Place of Birth"
            name="pob"
            value={formData.pob}
            onChange={handleChange}
            placeholder="e.g. New Delhi, Mumbai, New York"
            required
          />

          {/* Save Profile Checkbox */}
          {user && (
            <div className="flex items-center gap-2 border-t border-slate-850 pt-5 mt-2">
              <input
                type="checkbox"
                id="saveToAccount"
                checked={saveToAccount}
                onChange={(e) => setSaveToAccount(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-mystic-950 text-cosmic-600 focus:ring-cosmic-500 accent-cosmic-600 cursor-pointer"
              />
              <label htmlFor="saveToAccount" className="text-xs font-semibold text-slate-350 select-none cursor-pointer flex items-center gap-1">
                <Save className="h-3.5 w-3.5 text-slate-400" />
                Save this profile to my dashboard for future lookups
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cosmic-600 to-cosmic-700 hover:from-cosmic-500 hover:to-cosmic-600 font-bold text-sm tracking-wide text-slate-100 shadow-glow-sm hover:shadow-glow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="h-4 w-4" />
            Analyze Horoscope & Recommend Stones
          </button>
        </form>
      </div>
    </div>
  );
};

export default BirthChartForm;
