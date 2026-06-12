import React from 'react';
import { Compass } from 'lucide-react';

const LoadingSpinner = ({ message = 'Calculating astronomical positions...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer Orbiting ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-cosmic-800 border-t-cosmic-400"></div>
        {/* Inner spinning ring */}
        <div className="absolute h-10 w-10 animate-pulse rounded-full bg-cosmic-900/40 border border-slate-700 flex items-center justify-center">
          <Compass className="h-5 w-5 text-cosmic-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>
      <p className="mt-4 font-serif text-sm tracking-wide text-cosmic-300 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
