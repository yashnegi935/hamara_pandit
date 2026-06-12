import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import BirthChartSVG from '../components/BirthChartSVG';
import PlanetTable from '../components/PlanetTable';
import GemstoneCard from '../components/GemstoneCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Clock, MapPin, Compass, Award, ShieldAlert, Sparkles, LayoutGrid, CheckCircle } from 'lucide-react';

const Recommendations = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState('career'); // career, wealth, marriage, education, health, spirituality

  const categories = [
    { id: 'career', label: 'Career / Job' },
    { id: 'business', label: 'Business' },
    { id: 'wealth', label: 'Wealth & Gains' },
    { id: 'marriage', label: 'Marriage' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'education', label: 'Education' },
    { id: 'health', label: 'Health & Vitality' },
    { id: 'spirituality', label: 'Spirituality' }
  ];

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const { data } = await api.getReport(id);
        setReport(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load recommendation report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <LoadingSpinner message="Reconstructing birth houses and reading gemstones..." />;
  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 glass-panel rounded-2xl text-center border-red-950 bg-red-950/20">
        <h3 className="font-serif text-lg font-bold text-red-400 mb-2">Error Loading Report</h3>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <Link to="/recommend" className="inline-block px-4 py-2 bg-cosmic-600 rounded-lg text-xs font-semibold text-slate-100">
          Try Again
        </Link>
      </div>
    );
  }

  const { birthInfo, chartData, analysis, recommendations } = report;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="glow-bubble h-[300px] w-[300px] bg-cosmic-800/5 top-10 left-10"></div>
      <div className="glow-bubble h-[300px] w-[300px] bg-gem-ruby/5 bottom-20 right-10"></div>

      {/* Header */}
      <div className="border-b border-slate-900 pb-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-cosmic-400 block mb-1">
            Astrological Report
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-100">
            Horoscope Analysis for {birthInfo.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            Ascendant Sign: <strong className="text-cosmic-300">{chartData.ascendant.sign}</strong> (Lagna Lord: {analysis.lagnaLord})
          </p>
        </div>
        
        <Link
          to="/recommend"
          className="rounded-lg border border-slate-800 bg-mystic-900/60 px-4 py-2 text-xs font-semibold text-slate-350 hover:bg-slate-800 hover:text-slate-100 transition-all cursor-pointer"
        >
          New Calculation
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Chart & Positions (40% width on large screen) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Birth Chart Summary Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-mystic-900/40 space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-200 border-b border-slate-800/60 pb-3">
              Birth Chart Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">Lagna (Ascendant)</span>
                <span className="text-slate-100 text-sm font-bold">{chartData.ascendant.sign}</span>
                <span className="block text-[10px] text-cosmic-400">Lord: {analysis.lagnaLord}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">Moon Sign</span>
                <span className="text-slate-100 text-sm font-bold">{report.moonSign || analysis.planets.find(p => p.name === 'Moon')?.sign || 'Unknown'}</span>
                <span className="block text-[10px] text-cosmic-400">Nakshatra: {report.nakshatra || 'Unknown'}</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 col-span-2">
                <span className="block text-[10px] text-slate-500 font-bold uppercase">Vimshottari Dasha</span>
                <div className="flex justify-between items-center mt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Mahadasha</span>
                    <span className="text-slate-150 font-semibold text-xs">{report.currentDasha?.mahadasha || 'Unknown'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Antardasha</span>
                    <span className="text-slate-150 font-semibold text-xs">{report.currentDasha?.antardasha || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs">
              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1.5">Current Transits</span>
              <div className="text-slate-350 space-y-1">
                <div className="flex justify-between">
                  <span>Jupiter Transiting House:</span>
                  <span className="text-slate-200 font-semibold">{report.transitData?.jupiterHouse || '1'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sade Sati Status:</span>
                  <span className={report.transitData?.sadeSatiActive ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                    {report.transitData?.sadeSatiActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Birth Details Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-mystic-900/40">
            <h3 className="font-serif text-base font-bold text-slate-200 border-b border-slate-800/60 pb-3 mb-4">
              Birth Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cosmic-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Date</span>
                  <span className="text-slate-200 font-semibold">{birthInfo.dob}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-cosmic-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Time</span>
                  <span className="text-slate-200 font-semibold">{birthInfo.tob}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cosmic-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase">Place</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[120px]" title={birthInfo.pob}>{birthInfo.pob}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 flex justify-between">
              <span>Latitude: {birthInfo.latitude ? parseFloat(birthInfo.latitude).toFixed(4) : '0.0000'}° N</span>
              <span>Longitude: {birthInfo.longitude ? parseFloat(birthInfo.longitude).toFixed(4) : '0.0000'}° E</span>
              {birthInfo.timezone !== undefined && <span>Timezone: GMT{birthInfo.timezone >= 0 ? `+${birthInfo.timezone}` : birthInfo.timezone}</span>}
            </div>
          </div>

          {/* SVG Birth Chart */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-mystic-900/40 flex flex-col items-center">
            <h3 className="font-serif text-base font-bold text-slate-200 self-start mb-4">
              Lagna Kundali (Birth Chart)
            </h3>
            <BirthChartSVG chartData={chartData} />
          </div>

          {/* Planet Table */}
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-slate-200">
              Planetary Placements Detail
            </h3>
            <PlanetTable chartData={chartData} analysis={analysis} />
          </div>
        </div>

        {/* Right Column: Recommendations (60% width) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Core Stones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-cosmic-400" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">Primary Vedic Gemstones</h2>
            </div>
            <p className="text-xs text-slate-400">
              According to Brihat Parashara Hora Shastra, these three stones represent your core benefic planets. 
              They strengthen identity, intellect, and fortune.
            </p>

            <div className="space-y-4">
              {recommendations.lifeStone && (
                <GemstoneCard stone={recommendations.lifeStone} categoryName="Life Stone (Anukul Lagna Lord)" />
              )}
              {recommendations.luckStone && (
                <GemstoneCard stone={recommendations.luckStone} categoryName="Luck Stone (Bhagya Lord)" />
              )}
              {recommendations.intellectStone && (
                <GemstoneCard stone={recommendations.intellectStone} categoryName="Intellect Stone (Punya Lord)" />
              )}
            </div>
          </div>

          {/* Section 2: Sade Sati Transit Warnings (if any) */}
          {recommendations.remedialStones && recommendations.remedialStones.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <h2 className="font-serif text-xl font-bold text-slate-100">Active Transit Remedies</h2>
              </div>
              <div className="space-y-3">
                {recommendations.remedialStones.map((rem, index) => (
                  <div key={index} className="rounded-2xl border border-amber-900/60 bg-amber-950/10 p-5 text-xs text-slate-350">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-amber-400 text-sm uppercase tracking-wider">{rem.type}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800/40">Active Remedy</span>
                    </div>
                    <p className="mb-3 leading-relaxed">{rem.description}</p>
                    <div className="bg-amber-950/40 p-3 rounded-lg border border-amber-900/30 text-amber-300 font-bold">
                      Remedy: {rem.remedy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Goal Specific Gemstones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-cosmic-400" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-100">Specific Life Goal Recommendations</h2>
            </div>
            <p className="text-xs text-slate-400">
              Choose your goal below to view which gemstone aligns best with the ruling lords of that house in your natal chart.
            </p>

            {/* Category selection Tabs */}
            <div className="flex bg-mystic-900/60 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                    activeCategoryTab === cat.id
                      ? 'bg-cosmic-600 text-slate-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tab content displaying matching GemstoneCard */}
            <div className="mt-4">
              {recommendations.categoryRecommendations[activeCategoryTab] && 
               recommendations.categoryRecommendations[activeCategoryTab].map((stone, i) => (
                <div key={i} className="animate-fadeIn">
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs text-cosmic-400 font-bold uppercase tracking-wider pl-1">
                    <CheckCircle className="h-4 w-4" />
                    Best Alignment for {categories.find(c => c.id === activeCategoryTab)?.label}
                  </div>
                  <GemstoneCard stone={stone} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
