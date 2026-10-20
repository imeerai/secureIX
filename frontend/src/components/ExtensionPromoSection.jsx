import React, { useState } from 'react';
import {
  Puzzle,
  ShieldCheck,
  Zap,
  Lock,
  Globe,
  CheckCircle2,
  ExternalLink,
  Download,
  Boxes,
  Sparkles,
  Search,
  Check,
  Terminal,
  Activity,
  ArrowRight,
  Settings,
  RefreshCw,
  FolderLock,
  Sliders,
} from 'lucide-react';

const EXTENSION_MOCK_DATA = {
  'github.com': {
    url: 'https://github.com/',
    hostname: 'github.com',
    grade: 'B',
    gradeBg: 'bg-[#bfdbfe]',
    score: 70,
    metaPill1: 'Local (Fast)',
    metaPill2: '4/4 Passed',
    statusBadge: 'SAFE',
    statusBadgeBg: 'bg-[#fde047]',
    sslTitle: 'HTTPS Active',
    sslSub: 'Encrypted Stream',
    headersTitle: 'Heuristic',
    headersSub: 'Connect API for live headers',
    dnsTitle: 'Domain Active',
    dnsSub: 'github.com',
    leaksTitle: 'Heuristic',
    leaksSub: 'Probes in Web App',
    channels: [
      { name: 'Transport Layer Security (HTTPS)', tag: '+20 pts', color: 'bg-[#86efac]' },
      { name: 'Domain Resolution', tag: 'FQDN Valid', color: 'bg-[#86efac]' },
      { name: 'Standard Port Allocation', tag: 'Standard', color: 'bg-[#86efac]' },
      { name: 'Subdomain Hierarchy', tag: 'Normal Depth', color: 'bg-[#86efac]' },
    ],
  },
  'wordpress.org': {
    url: 'https://wordpress.org/',
    hostname: 'wordpress.org',
    grade: 'A',
    gradeBg: 'bg-[#86efac]',
    score: 88,
    metaPill1: 'Connected API',
    metaPill2: '10/10 Channels',
    statusBadge: 'SAFE',
    statusBadgeBg: 'bg-[#86efac]',
    sslTitle: 'TLS 1.3 Active',
    sslSub: 'Let\'s Encrypt Valid',
    headersTitle: 'HSTS & CSP Active',
    headersSub: 'Strict Security Headers',
    dnsTitle: 'DNSSEC Verified',
    dnsSub: 'Automattic AS2635',
    leaksTitle: 'Clean Source',
    leaksSub: 'Zero .env/.git Exposure',
    channels: [
      { name: 'Transport Layer Security (HTTPS)', tag: '+20 pts', color: 'bg-[#86efac]' },
      { name: 'HTTP Strict Transport (HSTS)', tag: '+15 pts', color: 'bg-[#86efac]' },
      { name: 'Hosting / CMS Fingerprint', tag: 'WordPress 6.4', color: 'bg-[#bfdbfe]' },
      { name: 'On-Page SEO Health', tag: '92 / 100', color: 'bg-[#fde047]' },
    ],
  },
  'vercel.com': {
    url: 'https://vercel.com/',
    hostname: 'vercel.com',
    grade: 'A+',
    gradeBg: 'bg-[#86efac]',
    score: 95,
    metaPill1: 'Connected API',
    metaPill2: 'Multi-Engine',
    statusBadge: 'SAFE',
    statusBadgeBg: 'bg-[#86efac]',
    sslTitle: 'TLS 1.3 Valid',
    sslSub: 'DigiCert Cloudflare',
    headersTitle: 'Full CSP & XFO',
    headersSub: 'Maximum Header Score',
    dnsTitle: 'Cloudflare Edge',
    dnsSub: 'Global Anycast DNS',
    leaksTitle: 'Protected Assets',
    leaksSub: 'Edge Shield Active',
    channels: [
      { name: 'Transport Layer Security (HTTPS)', tag: '+20 pts', color: 'bg-[#86efac]' },
      { name: 'Tech Stack (Next.js 14)', tag: 'Vercel Edge', color: 'bg-[#bfdbfe]' },
      { name: 'Core Web Vitals & SEO', tag: '96 / 100', color: 'bg-[#86efac]' },
      { name: 'Zero Sensitive Leaks', tag: 'Secure', color: 'bg-[#86efac]' },
    ],
  },
};

export default function ExtensionPromoSection({ onOpenExtension }) {
  const [selectedDomain, setSelectedDomain] = useState('github.com');
  const [techStackChecked, setTechStackChecked] = useState(true);
  const [seoChecked, setSeoChecked] = useState(true);

  const activeData = EXTENSION_MOCK_DATA[selectedDomain];

  return (
    <section id="extension" className="py-24 px-6 bg-[#ff9ebb] border-y-2 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column: Extension Details & Features */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-1.5 rounded-md brutal-shadow-sm">
            <Puzzle className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-xs font-bold uppercase tracking-widest font-space text-black">
              Chrome Extension • Manifest V3
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-space text-black leading-tight">
            Security & SEO checks right in your browser toolbar.
          </h2>

          <p className="text-lg text-black/90 font-medium leading-relaxed">
            Audit any website in sub-second response times without leaving your page. Built natively for Chrome, Brave, and Edge with Google Manifest V3, offline heuristic fallback, and instant deep-linking into the web analyzer.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/90 border-2 border-black rounded-xl p-3.5 brutal-shadow-sm flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="text-xs font-bold font-space block text-black">1-Click Active Tab Probing</strong>
                <span className="text-[11px] text-zinc-700 font-medium">Captures current URL and generates security score in under 500ms.</span>
              </div>
            </div>

            <div className="bg-white/90 border-2 border-black rounded-xl p-3.5 brutal-shadow-sm flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="text-xs font-bold font-space block text-black">Zero-Key Heuristic Engine</strong>
                <span className="text-[11px] text-zinc-700 font-medium">Evaluates SSL certs and URL signals locally even if backend is offline.</span>
              </div>
            </div>

            <div className="bg-white/90 border-2 border-black rounded-xl p-3.5 brutal-shadow-sm flex items-start gap-2.5">
              <Boxes className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="text-xs font-bold font-space block text-black">3-in-1 Triple Engine</strong>
                <span className="text-[11px] text-zinc-700 font-medium">Toggles Security, Tech Stack & Hosting, and Technical SEO in one click.</span>
              </div>
            </div>

            <div className="bg-white/90 border-2 border-black rounded-xl p-3.5 brutal-shadow-sm flex items-start gap-2.5">
              <ExternalLink className="w-5 h-5 text-black flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <div>
                <strong className="text-xs font-bold font-space block text-black">Web Dashboard Bridge</strong>
                <span className="text-[11px] text-zinc-700 font-medium">1-click jump from popup to multi-vector PDF export & threat breakdown.</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onOpenExtension}
              className="bg-black text-white px-6 py-3.5 rounded-xl border-2 border-black font-bold font-space text-sm brutal-shadow brutal-hover cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>How to Load Extension (Unpacked)</span>
            </button>
            <div className="bg-white border-2 border-black px-4 py-3 rounded-xl font-mono text-xs font-bold brutal-shadow-sm text-zinc-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-black" />
              <span>Folder: <code className="bg-yellow-200 px-1.5 py-0.5 rounded border border-black">/extension</code></span>
            </div>
          </div>
        </div>

        {/* Right Column: Exact Chrome Extension UI Mockup */}
        <div className="flex-1 relative flex justify-center w-full max-w-[390px]">
          
          {/* Extension Window Container with Brutalist Shadow */}
          <div className="w-full bg-[#fffdf7] border-4 border-black rounded-3xl brutal-shadow-lg p-3.5 space-y-3 z-10 select-none">
            
            {/* Top Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#86efac] border-2 border-black rounded-lg flex items-center justify-center brutal-shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-lg font-space text-black">SecurIn</span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-space">3-IN-1 QUICKSCAN</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#fde047] text-black font-bold text-[10px] px-2.5 py-1 rounded-md border-2 border-black font-space flex items-center gap-1.5 brutal-shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-black"></span> HEURISTIC
                </span>
                <button
                  type="button"
                  onClick={onOpenExtension}
                  className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center brutal-shadow-sm hover:bg-zinc-100 transition-colors cursor-pointer text-black"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-black stroke-[2]" />
                </button>
              </div>
            </div>

            {/* URL Input Box */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border-2 border-black rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 brutal-shadow-sm">
                <span className="text-xs text-blue-500">🔍</span>
                <span className="text-xs font-mono font-bold text-black truncate">{activeData.url}</span>
                <button
                  type="button"
                  className="ml-auto bg-[#fde047] text-black text-[10px] font-bold px-2 py-0.5 rounded border border-black font-space cursor-pointer"
                >
                  Active Tab
                </button>
              </div>
              <button
                type="button"
                className="bg-black text-white px-3.5 py-1.5 rounded-xl border-2 border-black font-bold text-xs font-space brutal-shadow-sm cursor-pointer"
              >
                Scan
              </button>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-2 text-xs font-space font-bold">
              <label
                onClick={() => setTechStackChecked(!techStackChecked)}
                className="bg-white border-2 border-black rounded-lg px-2.5 py-1 flex items-center gap-1.5 cursor-pointer brutal-shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={techStackChecked}
                  onChange={() => {}}
                  className="accent-black w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px]">⚡ Tech Stack</span>
              </label>

              <label
                onClick={() => setSeoChecked(!seoChecked)}
                className="bg-white border-2 border-black rounded-lg px-2.5 py-1 flex items-center gap-1.5 cursor-pointer brutal-shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={seoChecked}
                  onChange={() => {}}
                  className="accent-black w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px]">📈 SEO Audit</span>
              </label>
            </div>

            {/* Target Bar Info */}
            <div className="bg-white border-2 border-black rounded-xl px-3 py-2 flex items-center justify-between brutal-shadow-sm">
              <div className="flex items-center gap-2">
                <span className="bg-[#86efac] text-black font-bold font-mono text-[10px] px-1.5 py-0.5 rounded border border-black">
                  HTTPS
                </span>
                <span className="font-bold font-space text-xs text-black">{activeData.hostname}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(EXTENSION_MOCK_DATA);
                  const nextIdx = (keys.indexOf(selectedDomain) + 1) % keys.length;
                  setSelectedDomain(keys[nextIdx]);
                }}
                className="w-7 h-7 bg-zinc-100 hover:bg-yellow-200 border-2 border-black rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Switch sample site"
              >
                <RefreshCw className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

            {/* Score & Grade Hero Card */}
            <div className="bg-white border-2 border-black rounded-2xl p-3 flex items-center justify-between brutal-shadow">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${activeData.gradeBg} border-2 border-black rounded-xl flex items-center justify-center brutal-shadow-sm font-extrabold text-2xl font-space text-black`}>
                  {activeData.grade}
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-space text-black leading-none">{activeData.score}</span>
                    <span className="text-xs font-bold text-zinc-500 font-space">/100</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="bg-zinc-100 text-black text-[9px] font-bold font-space px-1.5 py-0.5 rounded border border-black">
                      {activeData.metaPill1}
                    </span>
                    <span className="bg-zinc-100 text-black text-[9px] font-bold font-space px-1.5 py-0.5 rounded border border-black">
                      {activeData.metaPill2}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`${activeData.statusBadgeBg} text-black font-bold font-space text-xs px-2.5 py-1 rounded-md border-2 border-black brutal-shadow-sm`}>
                {activeData.statusBadge}
              </div>
            </div>

            {/* 2x2 Metric Cards with Colored Top Borders */}
            <div className="grid grid-cols-2 gap-2 text-xs font-space">
              {/* SSL */}
              <div className="bg-white border-2 border-black rounded-xl p-2.5 border-t-4 border-t-[#86efac] brutal-shadow-sm">
                <div className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                  <span>🔒</span> SSL / TLS
                </div>
                <div className="font-bold text-black text-xs mt-0.5">{activeData.sslTitle}</div>
                <div className="text-[9px] text-zinc-500">{activeData.sslSub}</div>
              </div>

              {/* Headers */}
              <div className="bg-white border-2 border-black rounded-xl p-2.5 border-t-4 border-t-[#fde047] brutal-shadow-sm">
                <div className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                  <span>🛡️</span> HEADERS
                </div>
                <div className="font-bold text-black text-xs mt-0.5">{activeData.headersTitle}</div>
                <div className="text-[9px] text-zinc-500">{activeData.headersSub}</div>
              </div>

              {/* DNS Sec */}
              <div className="bg-white border-2 border-black rounded-xl p-2.5 border-t-4 border-t-[#bfdbfe] brutal-shadow-sm">
                <div className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                  <span>🌐</span> DNS SEC
                </div>
                <div className="font-bold text-black text-xs mt-0.5">{activeData.dnsTitle}</div>
                <div className="text-[9px] text-zinc-500 truncate">{activeData.dnsSub}</div>
              </div>

              {/* File Leaks */}
              <div className="bg-white border-2 border-black rounded-xl p-2.5 border-t-4 border-t-[#ff9ebb] brutal-shadow-sm">
                <div className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                  <span>📁</span> FILE LEAKS
                </div>
                <div className="font-bold text-black text-xs mt-0.5">{activeData.leaksTitle}</div>
                <div className="text-[9px] text-zinc-500">{activeData.leaksSub}</div>
              </div>
            </div>

            {/* Security Channels Breakdown */}
            <div className="bg-white border-2 border-black rounded-xl p-2.5 space-y-1.5 brutal-shadow-sm">
              <div className="flex items-center justify-between pb-1 border-b border-black/10">
                <span className="font-bold text-[10px] uppercase font-space text-black">Security Channels Breakdown</span>
                <span className="bg-[#fde047] text-black font-bold text-[8px] px-1.5 py-0.5 rounded border border-black font-space">
                  REAL-TIME
                </span>
              </div>
              <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                {activeData.channels.map((ch, idx) => (
                  <div key={idx} className="bg-zinc-50 border border-black rounded-md p-1.5 flex items-center justify-between text-[10px] font-space font-medium">
                    <span className="truncate pr-1 text-black">{ch.name}</span>
                    <span className={`${ch.color} text-black font-bold px-1.5 py-0.2 rounded border border-black text-[9px] flex-shrink-0`}>
                      {ch.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Button */}
            <button
              onClick={onOpenExtension}
              className="w-full bg-black hover:bg-zinc-800 text-white font-bold font-space text-xs py-2.5 rounded-xl border-2 border-black flex items-center justify-center gap-1.5 brutal-shadow cursor-pointer transition-colors"
            >
              <span>Open Full Analysis & Download Report</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

          </div>

          {/* Decorative neo-brutalist circle */}
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white rounded-full border-2 border-black z-0"></div>
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#86efac] rounded-full border-2 border-black z-0"></div>
        </div>

      </div>
    </section>
  );
}
