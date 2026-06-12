import React from 'react';
import { Gem } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-mystic-950 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="flex justify-center gap-2 items-center text-slate-500 mb-3">
          <Gem className="h-4 w-4 text-cosmic-500" />
          <span className="font-serif text-sm font-semibold tracking-wider">GemGuide AI</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Combining BPHS & Lal Kitab principles with modern calculations. 
          Gemstone recommendations are intended as astrological remedies. Consult verified gemstones before wear.
        </p>
        <div className="mt-4 text-[10px] text-slate-600">
          © {new Date().getFullYear()} GemGuide AI. All rights reserved. Built for modern Jyotish.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
