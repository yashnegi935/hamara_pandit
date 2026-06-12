import React from 'react';
import { Compass, Flame, RefreshCcw } from 'lucide-react';

const PlanetTable = ({ chartData, analysis }) => {
  if (!chartData || !analysis) return null;

  const { ascendant } = chartData;
  const { planets } = analysis;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-mystic-900/20 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Planet</th>
              <th className="py-3 px-4">Zodiac Sign</th>
              <th className="py-3 px-4 text-center">Degree</th>
              <th className="py-3 px-4 text-center">House</th>
              <th className="py-3 px-4">Dignity</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
            {/* Ascendant Row */}
            <tr className="hover:bg-slate-900/30 transition-colors">
              <td className="py-3.5 px-4 font-serif font-semibold text-slate-100 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-cosmic-400" />
                Ascendant (Lagna)
              </td>
              <td className="py-3.5 px-4">{ascendant.sign}</td>
              <td className="py-3.5 px-4 text-center">{ascendant.degree.toFixed(2)}°</td>
              <td className="py-3.5 px-4 text-center">1st House</td>
              <td className="py-3.5 px-4 text-slate-500">—</td>
              <td className="py-3.5 px-4 text-center">—</td>
            </tr>

            {/* Planets Rows */}
            {planets.map((p) => (
              <tr key={p.name} className="hover:bg-slate-900/30 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-slate-100">{p.name}</td>
                <td className="py-3.5 px-4">{p.sign}</td>
                <td className="py-3.5 px-4 text-center">{p.degree.toFixed(2)}°</td>
                <td className="py-3.5 px-4 text-center font-bold text-cosmic-300">{p.house} House</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.dignity === 'Exalted' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40' :
                    p.dignity === 'Debilitated' ? 'bg-red-950/80 text-red-400 border border-red-800/40' :
                    'text-slate-400'
                  }`}>
                    {p.dignity}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex gap-2 justify-center items-center">
                    {p.isRetrograde && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.5 rounded" title="Retrograde (Moving Backward)">
                        <RefreshCcw className="h-3 w-3 animate-spin" style={{ animationDuration: '8s' }} />
                        Rx
                      </span>
                    )}
                    {p.isCombust && (
                      <span className="flex items-center gap-0.5 text-[10px] text-gem-ruby bg-red-950/60 border border-red-800/40 px-1.5 py-0.5 rounded" title="Combust (Close to Sun)">
                        <Flame className="h-3 w-3 text-gem-ruby animate-pulse" />
                        Combust
                      </span>
                    )}
                    {!p.isRetrograde && !p.isCombust && <span className="text-slate-500">—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanetTable;
