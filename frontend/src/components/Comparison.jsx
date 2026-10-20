import React from "react";
import { Scale, Shield, Check, Sparkles } from "lucide-react";

export default function Comparison() {
  return (
    <section id="compare" className="py-24 px-6 bg-[#fffdf7]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-black bg-[#bfdbfe] text-black font-bold text-xs uppercase font-space mb-3">
            <Scale className="w-3.5 h-3.5" /> Architectural Benchmark
          </div>
          <h2 className="text-4xl font-medium font-space">
            Why SecurIX vs. Traditional Scanners?
          </h2>
          <p className="text-zinc-600 font-medium max-w-xl mx-auto mt-2 text-sm">
            How our zero-dependency, multi-vector analyzer compares against
            Mozilla Observatory and manual inspection tools.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-2 border-black brutal-shadow-lg text-left border-collapse bg-white">
            <thead>
              <tr className="bg-black text-white font-space">
                <th className="p-4 md:p-5 border-b-2 border-black w-1/4 text-xs uppercase">
                  Security Dimension
                </th>
                <th className="p-4 md:p-5 border-b-2 border-white/20 w-1/4 text-zinc-400 text-xs uppercase">
                  Manual cURL / Old Scripts
                </th>
                <th className="p-4 md:p-5 border-b-2 border-white/20 w-1/4 text-blue-300 text-xs uppercase">
                  Mozilla Observatory
                </th>
                <th className="p-4 md:p-5 border-b-2 border-black bg-[#fde047] text-black w-1/4 text-xs uppercase">
                  SecurIX Engine
                </th>
              </tr>
            </thead>
            <tbody className="font-medium text-xs sm:text-sm">
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  Phishing AI & Impersonation
                </td>
                <td className="p-4 md:p-5 text-zinc-500">
                  None / Manual Inspection
                </td>
                <td className="p-4 md:p-5 text-zinc-500">Not Supported</td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ Automated AI Pattern Scoring
                </td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  Sensitive Files & .git Exposure
                </td>
                <td className="p-4 md:p-5 text-zinc-500">
                  Manual dirbuster / gobuster
                </td>
                <td className="p-4 md:p-5 text-zinc-500">Not Supported</td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ Active Probes (.env, .git, backups)
                </td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  DNS Spoofing (SPF & DMARC)
                </td>
                <td className="p-4 md:p-5 text-zinc-500">
                  dig / nslookup commands
                </td>
                <td className="p-4 md:p-5 text-zinc-500">Not Supported</td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ Real-time DNS Anti-Spoof Audit
                </td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  HTTP Response Headers
                </td>
                <td className="p-4 md:p-5 text-zinc-500">
                  Raw Headers Dump Only
                </td>
                <td className="p-4 md:p-5 text-zinc-700">
                  ✓ Header Penalties (Grade A-F)
                </td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ 12 Channels + Actionable Fixes
                </td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  Historical Evolution Chart
                </td>
                <td className="p-4 md:p-5 text-zinc-500">None</td>
                <td className="p-4 md:p-5 text-zinc-500">
                  History only (No graph)
                </td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ Chart.js Domain Trend Visualizer
                </td>
              </tr>
              <tr className="border-b-2 border-black">
                <td className="p-4 md:p-5 font-bold bg-zinc-50 font-space text-zinc-900">
                  API Self-Defense Protection
                </td>
                <td className="p-4 md:p-5 text-zinc-500">None</td>
                <td className="p-4 md:p-5 text-zinc-700">Cloudflare WAF</td>
                <td className="p-4 md:p-5 bg-yellow-50 font-bold font-space text-black">
                  ✓ Built-in Rate Limiter & SSRF Shield
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#scanner"
            className="inline-flex items-center gap-2 bg-[#fde047] text-black px-6 py-3 rounded-xl border-2 border-black font-bold font-space brutal-shadow brutal-hover cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Side-by-Side Benchmark on Any Domain</span>
          </a>
        </div>
      </div>
    </section>
  );
}
