import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, Compass, Sparkles, BookOpen, Scroll, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
      {/* Background glow effects */}
      <div className="glow-bubble h-[400px] w-[400px] bg-cosmic-800/10 top-20 left-10"></div>
      <div className="glow-bubble h-[450px] w-[450px] bg-gem-ruby/5 bottom-10 right-10"></div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center py-16 sm:py-24 relative z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cosmic-800/60 bg-cosmic-950/60 px-4 py-1.5 text-xs font-semibold text-cosmic-300 backdrop-blur-md mb-6 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          Vedic Astrology & Gemstone Remedies
        </div>
        
        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 mb-6 leading-tight">
          Unlock Your Destiny With{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-400 via-cosmic-200 to-gem-ruby">
            GemGuide AI
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate your Vedic birth chart instantly and discover gemstone recommendations powered by 
          <strong> Brihat Parashara Hora Shastra</strong>, <strong>Lal Kitab</strong>, and current planetary transits.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/recommend"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-600 to-cosmic-700 px-8 py-3.5 text-sm font-bold text-slate-100 shadow-glow-sm hover:from-cosmic-500 hover:to-cosmic-600 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            Calculate Gemstones
            <ChevronRight className="h-4 w-4" />
          </Link>
          
          {!user && (
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-mystic-900/40 px-8 py-3.5 text-sm font-bold text-slate-350 hover:bg-slate-800 hover:text-slate-100 transition-all hover:-translate-y-0.5"
            >
              Sign Up / Save Profiles
            </Link>
          )}
        </div>
      </div>

      {/* Feature Section explaining BPHS / Lal Kitab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full border-t border-slate-900 bg-mystic-950/40">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-slate-100">Our Astrological Methodology</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            We employ structured Vedic guidelines rather than random matching, ensuring accurate remedies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: BPHS */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 bg-mystic-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cosmic-950 border border-cosmic-800 text-cosmic-400 mb-5">
              <Scroll className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-150 mb-2">BPHS Principles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes house lordships to identify your <strong>Life Stone</strong> (Lagna Lord), 
              <strong>Luck Stone</strong> (9th Lord), and <strong>Intellect Stone</strong> (5th Lord). 
              Prioritizes functional benefics and Yogakaraka planets.
            </p>
          </div>

          {/* Card 2: Lal Kitab */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 bg-mystic-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cosmic-950 border border-cosmic-800 text-cosmic-400 mb-5">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-150 mb-2">Lal Kitab Constraints</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies safety restrictions: bans gemstones for planets placed in the 6th or 8th houses. 
              Recommends charities instead of stones for malefic configurations to avoid adverse effects.
            </p>
          </div>

          {/* Card 3: Transit warning */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 bg-mystic-900/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cosmic-950 border border-cosmic-800 text-cosmic-400 mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-150 mb-2">Transit Real-Time Rules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitors dynamic planet positions to detect <strong>Saturn Sade Sati</strong> or <strong>Dhayya</strong> transits, 
              providing alternate remedies like Amethyst or Iron Rings when primary gemstones are unsafe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
