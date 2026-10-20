import React from 'react';
import { Search } from 'lucide-react';

export default function FinalCTA({ onScrollToScanner }) {
  return (
    <section className="py-32 px-6 bg-yellow-400 relative overflow-hidden border-t-2 border-black">
      <div className="absolute inset-0 bg-grid-pattern -z-10 opacity-10"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl tracking-tight mb-6 leading-[1.1] font-medium font-space">
          Stop guessing. Audit security now.
        </h2>
        <p className="text-xl font-bold text-black/80 mb-12 max-w-2xl mx-auto font-space">
          Verify any web domain in milliseconds with our zero-dependency inspection engine and automated AI threat analysis.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onScrollToScanner}
            className="bg-black text-white text-xl px-12 py-5 rounded-xl border-2 border-white font-bold brutal-shadow brutal-hover-lift font-space cursor-pointer flex items-center gap-3"
          >
            <Search className="w-6 h-6 stroke-[2.5]" />
            Scan a Website Now
          </button>
        </div>
        <p className="mt-8 text-black font-bold text-sm tracking-wide font-space">
          Open Source • Zero Registration Required • Port 3000 Engine
        </p>
      </div>
    </section>
  );
}
