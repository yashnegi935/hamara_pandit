import React, { useState } from 'react';

// Maps zodiac sign numbers to their abbreviations
const SIGN_ABBR = [
  'Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi',
  'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'
];

const PLANET_ABBR = {
  'Sun': 'Su',
  'Moon': 'Mo',
  'Mars': 'Ma',
  'Mercury': 'Me',
  'Jupiter': 'Ju',
  'Venus': 'Ve',
  'Saturn': 'Sa',
  'Rahu': 'Ra',
  'Ketu': 'Ke'
};

const BirthChartSVG = ({ chartData }) => {
  const [chartStyle, setChartStyle] = useState('north'); // 'north' or 'south'

  if (!chartData) return null;

  const { ascendant, planets } = chartData;
  const ascSignName = ascendant.sign;
  
  // Zodiac Signs Array
  const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const ascSignNum = ZODIAC_SIGNS.indexOf(ascSignName) + 1; // 1 to 12

  // 1. Group planets by house (North Indian uses houses 1-12)
  const planetsByHouse = Array.from({ length: 13 }, () => []);
  planets.forEach(p => {
    planetsByHouse[p.house].push(`${PLANET_ABBR[p.name]}${p.isRetrograde ? '®' : ''}${p.isCombust ? '*' : ''}`);
  });
  
  // Group planets by zodiac sign (South Indian uses fixed signs 1-12)
  const planetsBySign = Array.from({ length: 13 }, () => []);
  planets.forEach(p => {
    const signNum = ZODIAC_SIGNS.indexOf(p.sign) + 1;
    planetsBySign[signNum].push(`${PLANET_ABBR[p.name]}${p.isRetrograde ? '®' : ''}${p.isCombust ? '*' : ''}`);
  });
  // Add Ascendant to South Indian sign box
  planetsBySign[ascSignNum].push('Asc');

  // North Indian Chart Coordinates (400x400 px)
  // Maps house index (1-12) to positions for displaying sign number and planets
  const northHouseCoords = {
    1: { signX: 200, signY: 130, planX: 200, planY: 90 },
    2: { signX: 135, signY: 75, planX: 100, planY: 50 },
    3: { signX: 75, signY: 135, planX: 50, planY: 100 },
    4: { signX: 130, signY: 200, planX: 90, planY: 200 },
    5: { signX: 75, signY: 265, planX: 50, planY: 300 },
    6: { signX: 135, signY: 325, planX: 100, planY: 350 },
    7: { signX: 200, signY: 275, planX: 200, planY: 310 },
    8: { signX: 265, signY: 325, planX: 300, planY: 350 },
    9: { signX: 325, signY: 265, planX: 350, planY: 300 },
    10: { signX: 270, signY: 200, planX: 310, planY: 200 },
    11: { signX: 325, signY: 135, planX: 350, planY: 100 },
    12: { signX: 265, signY: 75, planX: 300, planY: 50 }
  };

  // South Indian fixed coordinate layout (12 boxes around a central 4x4 block)
  // Grid Index: 0 to 11 starting from Pisces (top left second box, etc.)
  // Box indices clockwise:
  // 12 (Pisces), 1 (Aries), 2 (Taurus), 3 (Gemini)
  // 11 (Aquarius),                 , 4 (Cancer)
  // 10 (Capricorn),                , 5 (Leo)
  // 9 (Sagittarius), 8 (Scorpio), 7 (Libra), 6 (Virgo)
  const southBoxCoords = {
    12: { x: 0, y: 0, label: 'Pisces' },
    1: { x: 100, y: 0, label: 'Aries' },
    2: { x: 200, y: 0, label: 'Taurus' },
    3: { x: 300, y: 0, label: 'Gemini' },
    4: { x: 300, y: 100, label: 'Cancer' },
    5: { x: 300, y: 200, label: 'Leo' },
    6: { x: 300, y: 300, label: 'Virgo' },
    7: { x: 200, y: 300, label: 'Libra' },
    8: { x: 100, y: 300, label: 'Scorpio' },
    9: { x: 0, y: 300, label: 'Sagittarius' },
    10: { x: 0, y: 200, label: 'Capricorn' },
    11: { x: 0, y: 100, label: 'Aquarius' }
  };

  // Render North Indian Style Chart
  const renderNorthChart = () => {
    const lines = [];
    const elements = [];

    // Draw lines
    // Outer border
    lines.push(<rect key="border" x="10" y="10" width="380" height="380" fill="none" stroke="#475569" strokeWidth="2" />);
    // Diagonals
    lines.push(<line key="d1" x1="10" y1="10" x2="390" y2="390" stroke="#475569" strokeWidth="1.5" />);
    lines.push(<line key="d2" x1="10" y1="390" x2="390" y2="10" stroke="#475569" strokeWidth="1.5" />);
    // Inner diamond
    lines.push(<line key="dia1" x1="200" y1="10" x2="390" y2="200" stroke="#475569" strokeWidth="1.5" />);
    lines.push(<line key="dia2" x1="390" y1="200" x2="200" y2="390" stroke="#475569" strokeWidth="1.5" />);
    lines.push(<line key="dia3" x1="200" y1="390" x2="10" y2="200" stroke="#475569" strokeWidth="1.5" />);
    lines.push(<line key="dia4" x1="10" y1="200" x2="200" y2="10" stroke="#475569" strokeWidth="1.5" />);

    // Place house signs and planets
    for (let house = 1; house <= 12; house++) {
      const signNumber = ((ascSignNum - 1 + house - 1) % 12) + 1;
      const coords = northHouseCoords[house];
      const housePlanets = planetsByHouse[house];

      // Lagna marker on first house
      if (house === 1) {
        elements.push(
          <text key="lagna-mark" x="200" y="45" textAnchor="middle" className="text-[10px] fill-cosmic-400 font-bold uppercase tracking-widest">
            Lagna (Asc)
          </text>
        );
      }

      // Draw Zodiac Sign Number
      elements.push(
        <text key={`sign-${house}`} x={coords.signX} y={coords.signY} textAnchor="middle" className="text-xs fill-slate-500 font-semibold">
          {signNumber}
        </text>
      );

      // Draw Planets
      if (housePlanets.length > 0) {
        // Render in row or stack depending on planet count
        elements.push(
          <text key={`planets-${house}`} x={coords.planX} y={coords.planY} textAnchor="middle" className="text-sm fill-slate-200 font-bold tracking-tight">
            {housePlanets.join(' ')}
          </text>
        );
      }
    }

    return (
      <svg width="100%" height="100%" viewBox="0 0 400 400" className="max-w-[400px] mx-auto select-none">
        {lines}
        {elements}
      </svg>
    );
  };

  // Render South Indian Style Chart
  const renderSouthChart = () => {
    const boxes = [];
    const elements = [];

    // Outer frame & inside empty block (since center is blank)
    boxes.push(<rect key="border" x="5" y="5" width="390" height="390" fill="none" stroke="#475569" strokeWidth="2" />);
    boxes.push(<rect key="center-empty" x="105" y="105" width="190" height="190" fill="#09090b" stroke="#475569" strokeWidth="1.5" />);

    // Draw the 12 boxes
    Object.keys(southBoxCoords).forEach((signNumStr) => {
      const signNum = Number(signNumStr);
      const coord = southBoxCoords[signNum];
      
      // Box boundary
      boxes.push(
        <rect
          key={`box-${signNum}`}
          x={coord.x + 5}
          y={coord.y + 5}
          width="90"
          height="90"
          fill="none"
          stroke="#475569"
          strokeWidth="1"
        />
      );

      // Zodiac Sign abbreviation
      elements.push(
        <text
          key={`south-label-${signNum}`}
          x={coord.x + 15}
          y={coord.y + 25}
          className="text-[10px] fill-slate-500 font-semibold"
        >
          {SIGN_ABBR[signNum - 1]}
        </text>
      );

      // Check if this box is the Lagna sign
      if (signNum === ascSignNum) {
        boxes.push(
          <line
            key={`lagna-line-${signNum}`}
            x1={coord.x + 5}
            y1={coord.y + 5}
            x2={coord.x + 95}
            y2={coord.y + 95}
            stroke="#584bf6"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        );
      }

      // Display planets
      const boxPlanets = planetsBySign[signNum];
      if (boxPlanets.length > 0) {
        elements.push(
          <foreignObject
            key={`south-planets-${signNum}`}
            x={coord.x + 10}
            y={coord.y + 35}
            width="80"
            height="55"
          >
            <div className="flex flex-wrap gap-1 leading-tight text-xs font-bold text-slate-200">
              {boxPlanets.map((p, idx) => (
                <span
                  key={idx}
                  className={p === 'Asc' ? 'text-cosmic-400 border-b border-cosmic-500' : ''}
                >
                  {p}
                </span>
              ))}
            </div>
          </foreignObject>
        );
      }
    });

    return (
      <svg width="100%" height="100%" viewBox="0 0 400 400" className="max-w-[400px] mx-auto select-none">
        {boxes}
        {elements}
      </svg>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Chart Selector Toggle */}
      <div className="flex bg-mystic-900/60 p-1 rounded-lg border border-slate-800/80 mb-6 w-full max-w-[400px]">
        <button
          onClick={() => setChartStyle('north')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
            chartStyle === 'north'
              ? 'bg-cosmic-600 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          North Indian
        </button>
        <button
          onClick={() => setChartStyle('south')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
            chartStyle === 'south'
              ? 'bg-cosmic-600 text-slate-100 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          South Indian
        </button>
      </div>

      {/* SVG Container */}
      <div className="w-full max-w-[400px] aspect-square rounded-2xl border border-slate-800/60 bg-mystic-900/40 p-4 shadow-glow-sm relative">
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(88,75,246,0.03) 0%, transparent 70%) pointer-events-none"></div>
        {chartStyle === 'north' ? renderNorthChart() : renderSouthChart()}
      </div>
      
      {/* Chart Legend */}
      <div className="mt-4 text-[10px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 justify-center max-w-[400px]">
        <span><strong>®</strong> = Retrograde</span>
        <span><strong>*</strong> = Combust</span>
        <span><strong>Asc</strong> = Lagna (Ascendant)</span>
      </div>
    </div>
  );
};

export default BirthChartSVG;
