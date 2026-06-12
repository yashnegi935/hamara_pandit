import React, { useEffect, useState } from 'react';
import * as api from '../services/api';
import GemstoneCard from '../components/GemstoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Gem, Search, Filter, BookOpen } from 'lucide-react';

const Catalog = () => {
  const [gems, setGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [planetFilter, setPlanetFilter] = useState('All');
  
  useEffect(() => {
    const fetchGems = async () => {
      try {
        setLoading(true);
        const { data } = await api.getGemstones();
        setGems(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load gemstones.');
      } finally {
        setLoading(false);
      }
    };
    fetchGems();
  }, []);

  if (loading) return <LoadingSpinner message="Opening the sacred vault of gemstones..." />;
  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 glass-panel rounded-2xl text-center border-red-950 bg-red-950/20">
        <h3 className="font-serif text-lg font-bold text-red-400 mb-2">Error Loading Catalog</h3>
        <p className="text-xs text-slate-450">{error}</p>
      </div>
    );
  }

  // Get unique ruling planets list
  const planets = ['All', ...new Set(gems.map(g => g.rulingPlanet))];

  // Filtered gems list
  const filteredGems = gems.filter(gem => {
    const matchesSearch = gem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gem.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gem.hindiName.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesPlanet = planetFilter === 'All' || gem.rulingPlanet === planetFilter;
    
    return matchesSearch && matchesPlanet;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="glow-bubble h-[300px] w-[300px] bg-cosmic-800/5 top-20 left-10"></div>

      {/* Header */}
      <div className="border-b border-slate-900 pb-5 mb-8">
        <span className="text-[10px] font-bold tracking-widest uppercase text-cosmic-400 block mb-1">
          Catalog
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <Gem className="h-7 w-7 text-cosmic-400" />
          The Navaratna Vault
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore the nine primary gemstones (Navaratnas) of Vedic astrology. Read about their governing planets, mantras, and wearing instructions.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center bg-mystic-900/40 border border-slate-800/60 p-4 rounded-2xl">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Ruby, Manik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-mystic-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-cosmic-500"
          />
        </div>

        {/* Planet Filters */}
        <div className="flex items-center gap-2 w-full overflow-x-auto sm:justify-end py-1">
          <Filter className="h-4.5 w-4.5 text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0 mr-1">Planet:</span>
          <div className="flex gap-1">
            {planets.map(p => (
              <button
                key={p}
                onClick={() => setPlanetFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  planetFilter === p
                    ? 'bg-cosmic-600 text-slate-100'
                    : 'bg-mystic-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gems Grid */}
      {filteredGems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGems.map(gem => (
            // Re-use GemstoneCard. We wrap it in a mock recommendation object structure
            <GemstoneCard
              key={gem._id}
              stone={{
                gemstone: gem.name,
                planet: gem.rulingPlanet,
                reason: gem.description,
                isAllowed: true,
                details: gem
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-slate-800 rounded-2xl bg-mystic-900/10">
          <Search className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <h3 className="font-serif text-sm font-semibold text-slate-400">No Gemstones Found</h3>
          <p className="text-xs text-slate-500 mt-0.5">Try searching with a different keyword or adjusting filters.</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
