import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Gauge, Globe, ExternalLink, Clock } from 'lucide-react';

export default function SeoScoreCard({ report }) {
  const { score, grade, gradeLabel, summary, url, finalUrl, elapsedMs, lighthouse } = report;

  const getScoreColor = (sc) => {
    if (sc >= 85) return 'text-emerald-700 bg-[#86efac] border-black';
    if (sc >= 70) return 'text-blue-900 bg-[#bfdbfe] border-black';
    if (sc >= 50) return 'text-amber-900 bg-[#fde047] border-black';
    return 'text-rose-900 bg-[#ff9ebb] border-black';
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-6 md:p-8 brutal-shadow mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Score Gauge & Grade */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-[#fffdf7] border-2 border-black rounded-xl brutal-shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 font-space mb-2">
            Overall SEO Health
          </span>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-6xl md:text-7xl font-bold font-space tracking-tight text-black">
              {score}
            </span>
            <span className="text-xl font-bold text-zinc-400 font-space">/100</span>
          </div>

          {/* Grade Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className={`px-4 py-1 text-sm font-bold rounded-lg border-2 font-space uppercase ${getScoreColor(
                score
              )}`}
            >
              Grade {grade}
            </span>
          </div>
          <p className="text-sm font-semibold text-zinc-700 font-space">{gradeLabel}</p>
        </div>

        {/* Audit Details & Target URL */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-black rounded text-xs font-bold font-space">
                <Globe className="w-3.5 h-3.5 text-zinc-600" /> Target URL
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
                <Clock className="w-3.5 h-3.5" /> {elapsedMs}ms crawl
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-space break-all text-black flex items-center gap-2">
              <a
                href={finalUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:underline flex items-center gap-1.5"
              >
                {finalUrl} <ExternalLink className="w-4 h-4 text-zinc-500 inline" />
              </a>
            </h3>
          </div>

          {/* Counters Row (Critical, Warnings, Passed) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-md text-red-700 border border-red-400 flex-shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold font-space text-red-900 block leading-tight">
                  {summary.critical}
                </span>
                <span className="text-xs font-bold text-red-700 uppercase font-space">Critical</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-md text-amber-700 border border-amber-400 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold font-space text-amber-900 block leading-tight">
                  {summary.warnings}
                </span>
                <span className="text-xs font-bold text-amber-700 uppercase font-space">Warnings</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-md text-emerald-700 border border-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-bold font-space text-emerald-900 block leading-tight">
                  {summary.passed}
                </span>
                <span className="text-xs font-bold text-emerald-700 uppercase font-space">Passed</span>
              </div>
            </div>
          </div>

          {/* Quick Lighthouse Pills */}
          {lighthouse?.scores && (
            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t-2 border-dashed border-zinc-200 text-xs font-space">
              <span className="font-bold text-zinc-500 uppercase">Lighthouse Probes:</span>
              <span className={`px-2.5 py-0.5 border rounded font-mono font-bold ${lighthouse.scores.performance >= 90 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : lighthouse.scores.performance >= 50 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-rose-100 border-rose-300 text-rose-900'}`}>
                Performance: {lighthouse.scores.performance}/100
              </span>
              <span className={`px-2.5 py-0.5 border rounded font-mono font-bold ${lighthouse.scores.accessibility >= 90 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                Accessibility: {lighthouse.scores.accessibility}/100
              </span>
              <span className={`px-2.5 py-0.5 border rounded font-mono font-bold ${lighthouse.scores.bestPractices >= 90 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                Best Practices: {lighthouse.scores.bestPractices}/100
              </span>
              <span className={`px-2.5 py-0.5 border rounded font-mono font-bold ${lighthouse.scores.seo >= 90 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-amber-100 border-amber-300 text-amber-900'}`}>
                SEO: {lighthouse.scores.seo}/100
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
