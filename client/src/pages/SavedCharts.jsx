import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../services/api';
import { User, Calendar, Clock, MapPin, Trash2, Compass, Plus, Users } from 'lucide-react';

const SavedCharts = () => {
  const { user, removeSavedProfile } = useAuth();
  const navigate = useNavigate();

  const handleCalculate = async (profile) => {
    try {
      const { data } = await api.recommendGemstone(profile);
      navigate(`/report/${data.logId}`);
    } catch (err) {
      alert('Error calculating chart: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this profile?')) {
      await removeSavedProfile(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="glow-bubble h-[300px] w-[300px] bg-cosmic-800/5 top-10 right-10"></div>

      {/* Header */}
      <div className="border-b border-slate-900 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cosmic-400 block mb-1">
            Profiles
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="h-7 w-7 text-cosmic-400" />
            Saved Family Charts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Save birth details for yourself, family members, or friends to run reports anytime.
          </p>
        </div>

        <Link
          to="/recommend"
          className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Profile
        </Link>
      </div>

      {user?.savedProfiles && user.savedProfiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.savedProfiles.map((prof) => (
            <div
              key={prof._id}
              onClick={() => handleCalculate(prof)}
              className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 bg-mystic-900/20 shadow-md cursor-pointer relative group flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-cosmic-950 border border-cosmic-900/60 flex items-center justify-center text-cosmic-400 font-bold">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">{prof.name}</h3>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{prof.gender || 'unspecified'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(prof._id, e)}
                    className="p-1.5 text-slate-500 hover:text-gem-ruby hover:bg-red-950/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete Profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-cosmic-400/80" />
                    <span>{prof.dob}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-cosmic-400/80" />
                    <span>{prof.tob}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-cosmic-400/80" />
                    <span className="truncate max-w-[180px]">{prof.pob}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex items-center gap-1.5 text-[11px] font-bold text-cosmic-400 group-hover:text-cosmic-300">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '12s' }} />
                Calculate Horoscope Report
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl py-16 text-center border-slate-800 bg-mystic-900/10">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-slate-350">No Saved Profiles</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Keep your family charts stored in one place to avoid typing birth parameters each time.
          </p>
          <Link
            to="/recommend"
            className="inline-flex items-center gap-1.5 rounded-xl bg-cosmic-600 hover:bg-cosmic-500 px-5 py-2.5 text-xs font-bold text-slate-100"
          >
            Create Your First Chart
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedCharts;
