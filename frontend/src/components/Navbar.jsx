import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Search, Sparkles, Boxes } from 'lucide-react';

export default function Navbar({ onScrollToScanner, onOpenExtension }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 border-b-2 border-black bg-[#fffdf7]/95 backdrop-blur-sm">
      <div className="flex h-20 max-w-7xl mx-auto px-6 items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#86efac] rounded-lg border-2 border-black flex items-center justify-center brutal-shadow-sm group-hover:rotate-6 transition-transform">
            <ShieldCheck className="w-6 h-6 stroke-[2.2] text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-bold tracking-tight font-space">SecurIn</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-space">Security, SEO & Tech Stack</span>
          </div>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 font-semibold text-sm font-space">
          <a href="#scanner" className="hover:underline decoration-2 underline-offset-4">Master Test</a>
          <a href="#techstack" className="hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
            <span className="bg-[#fde047] text-black text-[10px] font-bold px-1.5 py-0.2 rounded border border-black">NEW</span>
            Tech Stack
          </a>
          <a href="#seo-audit" className="hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
            <span className="bg-[#86efac] text-black text-[10px] font-bold px-1.5 py-0.5 rounded border border-black">FREE</span>
            SEO Audit
          </a>
          <a href="#features" className="hover:underline decoration-2 underline-offset-4">12 Channels</a>
          <a href="#history" className="hover:underline decoration-2 underline-offset-4">Threat Feed</a>
          {/* <button 
            onClick={onOpenExtension} 
            className="hover:underline decoration-2 underline-offset-4 cursor-pointer text-blue-900 font-bold flex items-center gap-1"
          >
            🧩 Extension
          </button> */}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenExtension}
            className="bg-[#bfdbfe] text-black px-3 py-2 text-xs font-bold rounded-lg border-2 border-black brutal-shadow-sm brutal-hover font-space cursor-pointer flex items-center gap-1"
            title="Chrome Extension Mini-Version"
          >
            🧩 Chrome Extension
          </button>
          {/* <button
            onClick={onScrollToScanner}
            className="bg-black text-white px-4 py-2 text-xs font-bold rounded-lg border-2 border-black brutal-shadow brutal-hover font-space cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            Security Scan
          </button> */}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border-2 border-black bg-white brutal-shadow-sm"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-black bg-[#fffdf7] px-6 py-6 space-y-4">
          <a
            href="#scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold font-space hover:underline"
          >
            Security Scanner
          </a>
          <a
            href="#techstack"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold font-space hover:underline text-blue-900 flex items-center gap-2"
          >
            <span>⚡ Tech Stack & Hosting Detector</span>
            <span className="bg-[#fde047] text-black text-[10px] font-bold px-1.5 py-0.5 rounded border border-black">NEW</span>
          </a>
          <a
            href="#seo-audit"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold font-space hover:underline text-emerald-800 flex items-center gap-2"
          >
            <span>✨ Complete SEO & Lighthouse Audit</span>
            <span className="bg-[#86efac] text-black text-[10px] font-bold px-1.5 py-0.5 rounded border border-black">FREE</span>
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold font-space hover:underline"
          >
            10 Security Channels
          </a>
          <a
            href="#history"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold font-space hover:underline"
          >
            Threat Feed
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenExtension?.();
            }}
            className="block w-full text-left text-base font-bold font-space hover:underline text-blue-900 flex items-center gap-2"
          >
            <span>🧩 Chrome Extension Mini-App</span>
            <span className="bg-[#bfdbfe] text-black text-[10px] font-bold px-1.5 py-0.5 rounded border border-black">V3</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScrollToScanner?.();
            }}
            className="w-full bg-black text-white py-3 text-sm font-bold rounded-lg border-2 border-black brutal-shadow brutal-hover font-space flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Security Scan URL
          </button>
        </div>
      )}
    </nav>
  );
}
