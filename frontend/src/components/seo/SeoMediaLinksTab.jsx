import React from 'react';
import { Image as ImageIcon, Link as LinkIcon, AlertTriangle, CheckCircle2, FileCode, ExternalLink } from 'lucide-react';

export default function SeoMediaLinksTab({ report }) {
  const { images, links, resources } = report;

  return (
    <div className="space-y-8">
      {/* 1. Robots.txt & Sitemap.xml Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-bold text-sm font-space text-black flex items-center gap-1.5">
              <FileCode className="w-4 h-4" /> robots.txt Discovery
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border font-space uppercase ${
                resources?.robotsTxt?.exists
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-300'
              }`}
            >
              {resources?.robotsTxt?.exists ? `HTTP ${resources.robotsTxt.status} Found` : 'Not Found'}
            </span>
          </div>
          <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs max-h-36 overflow-auto">
            {resources?.robotsTxt?.contentSample ? (
              <pre>{resources.robotsTxt.contentSample}</pre>
            ) : (
              <span className="text-zinc-500 italic">// No robots.txt content located</span>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="font-bold text-sm font-space text-black flex items-center gap-1.5">
              <FileCode className="w-4 h-4" /> sitemap.xml Discovery
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border font-space uppercase ${
                resources?.sitemapXml?.exists
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-300'
              }`}
            >
              {resources?.sitemapXml?.exists ? `HTTP ${resources.sitemapXml.status} Found` : 'Not Found'}
            </span>
          </div>
          <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg font-mono text-xs max-h-36 overflow-auto">
            {resources?.sitemapXml?.contentSample ? (
              <pre>{resources.sitemapXml.contentSample}</pre>
            ) : (
              <span className="text-zinc-500 italic">// No sitemap.xml content located</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Images & Alt Text Audit */}
      <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b-2 border-zinc-100">
          <div>
            <h3 className="text-lg font-bold font-space text-black flex items-center gap-1.5">
              <ImageIcon className="w-5 h-5 text-black" /> Image Assets & Alt Text Audit
            </h3>
            <p className="text-xs text-zinc-600 font-medium">
              Found {images?.total || 0} image(s) on page • {images?.missingAltCount || 0} missing alt tags.
            </p>
          </div>
          <span
            className={`text-xs font-bold font-space px-3 py-1 rounded-lg border-2 ${
              images?.missingAltCount === 0
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                : 'bg-amber-100 text-amber-900 border-amber-400'
            }`}
          >
            {images?.missingAltCount === 0 ? 'All Images Tagged' : `${images?.missingAltCount} Needs Alt Tag`}
          </span>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {images?.items && images.items.length > 0 ? (
            images.items.map((img, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-200 border flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-zinc-700 truncate max-w-sm">{img.src || '(no src)'}</div>
                    <div className="text-[11px] text-zinc-500">
                      Alt:{' '}
                      <span className={img.hasAlt ? 'font-semibold text-emerald-700' : 'italic text-red-600 font-bold'}>
                        {img.hasAlt ? `"${img.alt}"` : 'Missing Alt Attribute'}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-space uppercase border flex-shrink-0 ${
                    img.hasAlt
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {img.hasAlt ? 'Pass' : 'Missing Alt'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500 italic py-4 text-center">No images discovered on this page.</p>
          )}
        </div>
      </div>

      {/* 3. Links Summary & Broken Links */}
      <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b-2 border-zinc-100">
          <div>
            <h3 className="text-lg font-bold font-space text-black flex items-center gap-1.5">
              <LinkIcon className="w-5 h-5 text-black" /> Links Architecture & Broken Link Probes
            </h3>
            <p className="text-xs text-zinc-600 font-medium">
              {links?.total || 0} total links ({links?.internalCount || 0} internal, {links?.externalCount || 0} external).
            </p>
          </div>
          <span
            className={`text-xs font-bold font-space px-3 py-1 rounded-lg border-2 ${
              links?.brokenCount === 0
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                : 'bg-red-100 text-red-800 border-red-400'
            }`}
          >
            {links?.brokenCount === 0 ? '0 Broken Links' : `${links?.brokenCount} Broken Link(s)`}
          </span>
        </div>

        {/* Broken links alert if any */}
        {links?.brokenLinks && links.brokenLinks.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <h4 className="font-bold text-xs text-red-900 uppercase font-space mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Broken Links Detected:
            </h4>
            <div className="space-y-1 font-mono text-xs text-red-800">
              {links.brokenLinks.map((b, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-1.5 bg-white/70 rounded border border-red-200">
                  <span className="truncate">{b.url}</span>
                  <span className="font-bold text-red-700 uppercase">Status: {b.status || 'Unreachable'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links Sample Table */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {links?.sample && links.sample.length > 0 ? (
            links.sample.map((lnk, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-black truncate max-w-sm flex items-center gap-1">
                    {lnk.text} <ExternalLink className="w-3 h-3 text-zinc-400 inline" />
                  </div>
                  <div className="font-mono text-[11px] text-zinc-500 truncate max-w-md">{lnk.href}</div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-space uppercase border ${
                      lnk.isInternal
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-purple-100 text-purple-800 border-purple-300'
                    }`}
                  >
                    {lnk.isInternal ? 'Internal' : 'External'}
                  </span>
                  {lnk.isNoFollow && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-zinc-200 text-zinc-700">
                      nofollow
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500 italic py-4 text-center">No hyperlinks sampled on this page.</p>
          )}
        </div>
      </div>
    </div>
  );
}
