import React from 'react';
import { Lock, Shield, Eye, FileCode2, Globe2 } from 'lucide-react';

export default function Integrations() {
  return (
    <section className="py-24 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl mb-12 font-medium font-space">
          Supported Protocols & Header Standards
        </h2>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
            <Lock className="w-6 h-6 text-green-600 stroke-[2]" />
            <span className="font-bold text-lg font-space">TLS 1.3 / SSL</span>
          </div>
          <div className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
            <FileCode2 className="w-6 h-6 text-blue-600 stroke-[2]" />
            <span className="font-bold text-lg font-space">CSP Directives</span>
          </div>
          <div className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
            <Shield className="w-6 h-6 text-purple-600 stroke-[2]" />
            <span className="font-bold text-lg font-space">HSTS Preload</span>
          </div>
          <div className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
            <Eye className="w-6 h-6 text-orange-500 stroke-[2]" />
            <span className="font-bold text-lg font-space">X-Frame-Options</span>
          </div>
          <div className="bg-white border-2 border-black rounded-xl px-8 py-4 flex items-center gap-3 brutal-shadow hover:-translate-y-1 transition-all cursor-default min-w-[160px]">
            <Globe2 className="w-6 h-6 text-indigo-600 stroke-[2]" />
            <span className="font-bold text-lg font-space">Punycode Detection</span>
          </div>
        </div>
      </div>
    </section>
  );
}
