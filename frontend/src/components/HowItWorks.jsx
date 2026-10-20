import React from 'react';

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-zinc-50 border-b-2 border-black relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl leading-none tracking-tight mb-16 text-center font-bold font-space text-zinc-900">
          From vulnerability to fortified in 3 steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white border-2 border-black rounded-xl p-8 min-h-[320px] flex flex-col justify-between brutal-shadow hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-5xl text-black font-bold font-space">01</span>
                <span className="bg-[#fde047] text-black text-xs font-bold font-space px-2.5 py-1 rounded border-2 border-black">STEP 1</span>
              </div>
              <h3 className="text-2xl leading-tight mb-4 font-bold font-space text-zinc-900">Submit Target URL</h3>
              <p className="font-medium text-zinc-700 border-l-4 border-[#fde047] pl-3">
                Paste any domain or URL into the live auditor. No browser extensions, logins, or CLI installations required.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border-2 border-black rounded-xl p-8 min-h-[320px] flex flex-col justify-between brutal-shadow hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-5xl text-black font-bold font-space">02</span>
                <span className="bg-[#86efac] text-black text-xs font-bold font-space px-2.5 py-1 rounded border-2 border-black">STEP 2</span>
              </div>
              <h3 className="text-2xl leading-tight mb-4 font-bold font-space text-zinc-900">Full 10-Channel Probe</h3>
              <p className="font-medium text-zinc-700 border-l-4 border-[#86efac] pl-3">
                Our backend negotiates raw TLS handshakes, analyzes HTTP response headers, tracks redirect chains, and scores phishing heuristics.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border-2 border-black rounded-xl p-8 min-h-[320px] flex flex-col justify-between brutal-shadow hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-5xl text-black font-bold font-space">03</span>
                <span className="bg-[#ff9ebb] text-black text-xs font-bold font-space px-2.5 py-1 rounded border-2 border-black">STEP 3</span>
              </div>
              <h3 className="text-2xl leading-tight mb-4 font-bold font-space text-zinc-900">AI Remediation Report</h3>
              <p className="font-medium text-zinc-700 border-l-4 border-[#ff9ebb] pl-3">
                Receive an immediate security grade (A-F), total score out of 100, channel breakdown, and exact copy-paste fix snippets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
