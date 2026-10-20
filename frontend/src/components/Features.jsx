import React from 'react';
import { ShieldCheck, Lock, AlertOctagon, Check, Cookie, Globe2, MailCheck, FileCode2 } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white border-y-2 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-3 block font-space">
            Complete Perimeter Audit
          </span>
          <h2 className="text-4xl md:text-5xl tracking-tight font-medium font-space">
            12 evaluated security vectors in one instant scan
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 items-stretch">
          {/* Card 1: Encryption & TLS */}
          <div className="bg-[#fde047] p-6 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-5 brutal-shadow-sm">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-space">TLS & Encryption</h3>
            <p className="font-medium text-xs text-zinc-800 mb-5 flex-1 leading-relaxed">
              Verify SSL/TLS certificates, expiry dates, CA issuer authority, protocol version, and Strict-Transport-Security (HSTS).
            </p>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> TLS 1.2 / 1.3 Handshake
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> Certificate Validity & Expiry
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> HSTS Max-Age Enforcement
              </li>
            </ul>
          </div>

          {/* Card 2: Browser Headers & CORS */}
          <div className="bg-[#86efac] p-6 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform relative z-10 md:-translate-y-3">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded-md border-2 border-black text-[10px] font-bold uppercase tracking-wider brutal-shadow-sm font-space">
              Core Defense
            </div>
            <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-5 brutal-shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-space">Headers & CORS</h3>
            <p className="font-medium text-xs text-zinc-800 mb-5 flex-1 leading-relaxed">
              Inspect CSP, Clickjacking (X-Frame-Options), MIME sniffing, and dangerous CORS wildcard / credential misconfigurations.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> Content-Security-Policy (CSP)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> X-Frame-Options Clickjacking
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> CORS Credential Leakage Check
              </li>
            </ul>
          </div>

          {/* Card 3: Cookies & File Exposure */}
          <div className="bg-[#bfdbfe] p-6 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-5 brutal-shadow-sm">
              <Cookie className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-space">Cookies & Files</h3>
            <p className="font-medium text-xs text-zinc-800 mb-5 flex-1 leading-relaxed">
              Audit HttpOnly, Secure, and SameSite cookie flags, plus passive probes for exposed .env, .git, and server backup files.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> HttpOnly & SameSite Isolation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> Exposed .env & .git Scanner
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> Backup File Signature Checks
              </li>
            </ul>
          </div>

          {/* Card 4: DNS Anti-Spoofing & Phishing */}
          <div className="bg-[#ff9ebb] p-6 rounded-2xl border-2 border-black brutal-shadow flex flex-col hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-white rounded-lg border-2 border-black flex items-center justify-center mb-5 brutal-shadow-sm">
              <MailCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-lg font-bold mb-3 font-space">DNS & Spoofing</h3>
            <p className="font-medium text-xs text-zinc-800 mb-5 flex-1 leading-relaxed">
              Inspect SPF, DMARC policies, CAA record authorization, Punycode homographs, and credential harvesting keywords.
            </p>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> SPF & DMARC Anti-Spoofing
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> CAA Certificate Authorities
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 stroke-[2.5]" /> Phishing & Homograph Vectors
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
