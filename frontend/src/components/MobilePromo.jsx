import React from 'react';
import { Check, ShieldCheck, Lock, AlertTriangle, Plus } from 'lucide-react';

export default function MobilePromo() {
  return (
    <section className="py-24 px-6 bg-[#ff9ebb] border-y-2 border-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-block bg-white border-2 border-black px-4 py-1.5 rounded-md brutal-shadow-sm mb-6">
            <span className="text-xs font-bold uppercase tracking-widest font-space">Anywhere, Anytime</span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 font-medium font-space">Security checks in your pocket.</h2>
          <p className="text-xl text-black/80 mb-8 font-medium">
            Test links before clicking them on SMS, WhatsApp, or email. Verify unknown domains on the fly from any mobile device.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 font-bold font-space">
              <Check className="w-5 h-5 stroke-[2.5]" /> Instant Phishing Verification on Mobile
            </li>
            <li className="flex items-center gap-3 font-bold font-space">
              <Check className="w-5 h-5 stroke-[2.5]" /> Zero Latency Response (Sub-second)
            </li>
            <li className="flex items-center gap-3 font-bold font-space">
              <Check className="w-5 h-5 stroke-[2.5]" /> 100% Privacy First & Zero Telemetry Leak
            </li>
          </ul>
        </div>
        
        <div className="flex-1 relative flex justify-center">
          {/* Simple Mobile Mockup */}
          <div className="w-[300px] h-[550px] bg-white border-4 border-black rounded-[2.5rem] brutal-shadow-lg p-3 relative z-10">
            <div className="w-full h-full bg-[#18181b] rounded-[2rem] overflow-hidden border-2 border-black flex flex-col text-white relative">
              {/* Screen Header */}
              <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-4">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                <span className="font-bold font-space">SecurIn Mobile</span>
                <div className="w-3 h-3 bg-green-400 rounded-full border border-black animate-pulse"></div>
              </div>
              
              {/* Screen Body */}
              <div className="p-4 space-y-4">
                <div className="text-center py-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                  <div className="text-zinc-400 text-xs uppercase font-space">Audit Score</div>
                  <div className="text-4xl font-bold mt-1 font-space text-[#86efac]">92 / 100</div>
                  <div className="text-xs text-green-400 mt-1 font-space font-bold">Grade A • Verified Safe</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                    <div className="text-green-400 text-xs mb-1 font-space">TLS Status</div>
                    <div className="font-bold font-space">TLS 1.3 Active</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700">
                    <div className="text-blue-400 text-xs mb-1 font-space">HSTS</div>
                    <div className="font-bold font-space">Preloaded</div>
                  </div>
                </div>
                
                <div className="bg-zinc-800 p-3 rounded-xl border border-zinc-700 flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm font-space">github.com</div>
                    <div className="text-xs text-zinc-400 font-space">DigiCert Valid Cert</div>
                  </div>
                  <div className="ml-auto font-bold text-green-400 font-space text-xs">SAFE</div>
                </div>
              </div>
              
              {/* FAB button */}
              <a 
                href="#scanner" 
                className="absolute bottom-6 right-6 w-12 h-12 bg-[#86efac] rounded-full border-2 border-black flex items-center justify-center text-black brutal-shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </a>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white rounded-full border-2 border-black z-0"></div>
        </div>
      </div>
    </section>
  );
}
