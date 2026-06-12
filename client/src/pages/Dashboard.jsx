import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { FileText, Compass, History, Trash2, ArrowRight, Plus, UserCheck } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, removeSavedProfile } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await api.getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch calculation history.');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleDeleteProfile = async (id, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this birth profile?')) {
      await removeSavedProfile(id);
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your saved charts and history..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="glow-bubble h-[300px] w-[300px] bg-cosmic-800/5 top-10 left-10"></div>

      {/* Welcome Header */}
      <div className="border-b border-slate-900 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cosmic-400 block mb-1">
            Dashboard
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your birth profiles and review gemstone history logs.
          </p>
        </div>
        
        <Link
          to="/recommend"
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cosmic-600 to-cosmic-700 px-5 py-2.5 text-xs font-bold text-slate-100 shadow-glow-sm hover:from-cosmic-500 hover:to-cosmic-600 transition-all cursor-pointer"
        >
          <Compass className="h-4 w-4" />
          Run New Chart
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saved Profiles Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-mystic-900/40">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
              <h3 className="font-serif text-base font-bold text-slate-200 flex items-center gap-2">
                <UserCheck className="h-4.5 w-4.5 text-cosmic-400" />
                Birth Profiles ({user?.savedProfiles?.length || 0})
              </h3>
              <Link to="/recommend" className="text-[10px] font-bold text-cosmic-400 hover:text-cosmic-300 flex items-center gap-0.5">
                <Plus className="h-3 w-3" /> Add
              </Link>
            </div>

            {user?.savedProfiles && user.savedProfiles.length > 0 ? (
              <div className="space-y-3">
                {user.savedProfiles.map((prof) => (
                  <div key={prof._id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/20 text-xs flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-200 text-sm font-semibold">{prof.name}</strong>
                      <span className="text-slate-450 block mt-0.5">{prof.pob} | {prof.dob}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const { data } = await api.recommendGemstone(prof);
                          window.location.href = `/report/${data.logId}`;
                        }}
                        className="text-[10px] px-2.5 py-1 bg-cosmic-950/80 border border-cosmic-900/60 rounded text-cosmic-400 font-bold hover:bg-cosmic-600 hover:text-slate-100 transition-colors"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={(e) => handleDeleteProfile(prof._id, e)}
                        className="text-slate-500 hover:text-gem-ruby p-1 transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                No profiles saved yet. Fill out a chart query and check the "Save this profile" box.
              </div>
            )}
          </div>
        </div>

        {/* Calculation Logs History Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-mystic-900/40">
            <h3 className="font-serif text-base font-bold text-slate-200 border-b border-slate-850 pb-3 mb-4 flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-cosmic-400" />
              Calculation History Logs
            </h3>

            {error && (
              <div className="mb-4 text-xs text-gem-ruby bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                {error}
              </div>
            )}

            {history.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-850">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider text-[9px] border-b border-slate-850">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Birth Location</th>
                      <th className="py-3 px-4 text-center">Calculation Date</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-medium text-slate-350">
                    {history.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-200">{log.birthData.name}</td>
                        <td className="py-3 px-4">{log.birthData.pob}</td>
                        <td className="py-3 px-4 text-center">{new Date(log.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            to={`/report/${log._id}`}
                            className="inline-flex items-center gap-1 text-[10px] text-cosmic-400 font-bold hover:text-cosmic-300"
                          >
                            View Report
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-500">
                No past calculation logs found. Click "Run New Chart" to perform your first reading.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
