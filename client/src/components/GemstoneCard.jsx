import React, { useState } from 'react';
import { Sparkles, ShieldAlert, BookOpen, AlertCircle, BookmarkCheck, Flame } from 'lucide-react';

const GemstoneCard = ({ stone, categoryName }) => {
  const [activeTab, setActiveTab] = useState('benefits'); // 'benefits', 'instructions', 'about'

  if (!stone) return null;

  const { gemstone, planet, reason, warnings, cautions, isAllowed, details } = stone;

  // Define styling based on the stone name
  const gemColors = {
    'Ruby': 'border-rose-900/60 shadow-rose-950/20 bg-gradient-to-br from-rose-950/20 to-mystic-900/40 text-rose-400',
    'Pearl': 'border-slate-800/80 shadow-slate-950/20 bg-gradient-to-br from-slate-900/20 to-mystic-900/40 text-slate-300',
    'Red Coral': 'border-orange-900/60 shadow-orange-950/20 bg-gradient-to-br from-orange-950/20 to-mystic-900/40 text-orange-400',
    'Emerald': 'border-emerald-900/60 shadow-emerald-950/20 bg-gradient-to-br from-emerald-950/20 to-mystic-900/40 text-emerald-400',
    'Yellow Sapphire': 'border-amber-900/60 shadow-amber-950/20 bg-gradient-to-br from-amber-950/20 to-mystic-900/40 text-amber-400',
    'Diamond': 'border-sky-900/60 shadow-sky-950/20 bg-gradient-to-br from-sky-950/20 to-mystic-900/40 text-sky-400',
    'Blue Sapphire': 'border-blue-900/60 shadow-blue-950/20 bg-gradient-to-br from-blue-950/20 to-mystic-900/40 text-blue-400',
    'Hessonite': 'border-amber-950/80 shadow-amber-950/20 bg-gradient-to-br from-amber-950/10 to-mystic-900/40 text-amber-600',
    "Cat's Eye": 'border-yellow-950/80 shadow-yellow-950/20 bg-gradient-to-br from-yellow-950/10 to-mystic-900/40 text-yellow-500'
  };

  const getGemStyle = () => gemColors[gemstone] || 'border-slate-800 bg-mystic-900/40 text-cosmic-400';

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 ${getGemStyle()} ${!isAllowed ? 'opacity-70 grayscale border-slate-900' : ''}`}>
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 border-b border-slate-800/60 pb-4 mb-4">
        <div>
          {categoryName && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 block mb-1">
              {categoryName}
            </span>
          )}
          <h3 className="font-serif text-2xl font-bold text-slate-100 flex items-center gap-2">
            {gemstone}
            {details?.sanskritName && (
              <span className="text-sm font-normal text-slate-400 font-sans italic">
                ({details.sanskritName} / {details.hindiName})
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Governed by <strong className="text-slate-300">{planet}</strong> (Deity: {details?.deity || 'N/A'})
          </p>
        </div>

        {/* Gem Color Preview Dot */}
        {details?.color && (
          <div className="flex items-center gap-2 bg-slate-900/40 border border-slate-800 rounded-full px-3 py-1 text-xs">
            <span
              className="h-3.5 w-3.5 rounded-full inline-block animate-pulse"
              style={{ backgroundColor: details.color }}
            ></span>
            <span className="font-semibold text-slate-300">{gemstone}</span>
          </div>
        )}
      </div>

      {/* Main Reason / Description */}
      <div className="text-sm text-slate-300 mb-4 leading-relaxed bg-slate-900/20 rounded-xl p-3 border border-slate-800/30">
        <div className="flex gap-2 items-start">
          <BookmarkCheck className="h-4.5 w-4.5 text-cosmic-400 shrink-0 mt-0.5" />
          <p>{reason}</p>
        </div>
      </div>

      {/* Warnings & Cautions */}
      {warnings && (
        <div className="mb-4 rounded-xl border border-red-950 bg-red-950/30 p-3 text-xs text-red-400 flex gap-2">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <div>
            <strong className="font-bold block mb-0.5">Strict Restriction</strong>
            {warnings.map((warn, i) => <p key={i}>{warn}</p>)}
          </div>
        </div>
      )}

      {cautions && (
        <div className="mb-4 rounded-xl border border-amber-950 bg-amber-950/20 p-3 text-xs text-amber-400 flex gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <strong className="font-bold block mb-0.5">Astrological Caution</strong>
            {cautions.map((caut, i) => <p key={i}>{caut}</p>)}
          </div>
        </div>
      )}

      {/* If stone is allowed, show wearing instructions and details tabs */}
      {isAllowed && details && (
        <div>
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/30 rounded-xl p-3 border border-slate-800/40 text-xs text-slate-400 mb-4">
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-bold">Metal</span>
              <span className="text-slate-200 font-semibold">{details.metal}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-bold">Finger</span>
              <span className="text-slate-200 font-semibold">{details.finger}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-bold">Day / Time</span>
              <span className="text-slate-200 font-semibold">{details.day}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-500 font-bold">Weight Rule</span>
              <span className="text-slate-200 font-semibold">{details.weightRule.split('(')[0]}</span>
            </div>
          </div>

          {/* Interactive details tabs */}
          <div className="border-b border-slate-800 mb-3 flex gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'benefits'
                  ? 'border-cosmic-500 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Benefits
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'instructions'
                  ? 'border-cosmic-500 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Wearing Ritual
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'border-cosmic-500 text-slate-100'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              About Stone
            </button>
          </div>

          {/* Tab content */}
          <div className="text-xs text-slate-300 min-h-[80px]">
            {activeTab === 'benefits' && (
              <ul className="list-disc list-inside space-y-1">
                {details.benefits.map((ben, i) => <li key={i} className="leading-relaxed">{ben}</li>)}
              </ul>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-2.5">
                <div className="bg-cosmic-950/40 border border-cosmic-900/60 rounded-lg p-2.5">
                  <span className="block text-[9px] uppercase tracking-wider text-cosmic-400 font-bold mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Chant Vedic Mantra (108 times)
                  </span>
                  <p className="font-serif text-[13px] text-slate-100 font-bold text-center italic py-1 bg-mystic-950/80 rounded border border-slate-850">
                    "{details.mantra}"
                  </p>
                </div>
                <p className="leading-relaxed text-slate-400"><strong className="text-slate-350">Ritual:</strong> {details.wearingInstructions}</p>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-2">
                <p className="leading-relaxed">{details.description}</p>
                <div className="bg-slate-900/40 p-2 rounded-lg text-slate-400 flex flex-col gap-1">
                  <span><strong className="text-slate-300">Precautions:</strong> {details.precautions[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GemstoneCard;
