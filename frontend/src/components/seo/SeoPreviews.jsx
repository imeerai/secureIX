import React from 'react';
import { Search, Share2, Code, ExternalLink, Image as ImageIcon } from 'lucide-react';

function TwitterIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function SeoPreviews({ report }) {
  const { previews, metadata, headings, structuredData } = report;
  const serp = previews?.googleSerp;
  const social = previews?.social;

  return (
    <div className="space-y-8">
      {/* 1. Google SERP Search Snippet Preview */}
      <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-zinc-100">
          <div className="p-2 bg-[#bfdbfe] border border-black rounded-lg">
            <Search className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-space text-black">Google Search Result (SERP) Preview</h3>
            <p className="text-xs text-zinc-500 font-medium">How your website snippet appears to users on Google Search.</p>
          </div>
        </div>

        {/* Google Mockup Box */}
        <div className="p-5 bg-white border border-zinc-300 rounded-lg shadow-sm font-sans max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-zinc-200 border flex items-center justify-center text-[9px] font-bold">
              {serp.title ? serp.title.charAt(0).toUpperCase() : 'G'}
            </div>
            <div className="text-xs text-zinc-600 truncate max-w-sm font-mono">{serp.url}</div>
          </div>
          <h4 className="text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer leading-snug mb-1 truncate">
            {serp.title || 'Untitled Document'}
          </h4>
          <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
            {serp.snippet || 'No meta description provided for this page. Google will attempt to generate one automatically.'}
          </p>
        </div>
      </div>

      {/* 2. Social Media Sharing Previews (Facebook & Twitter) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OpenGraph / Facebook Preview */}
        <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-zinc-100">
              <div className="p-2 bg-[#86efac] border border-black rounded-lg">
                <Share2 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold font-space text-black">Open Graph (Facebook / LinkedIn)</h3>
                <p className="text-xs text-zinc-500 font-medium">Card generated from og:* tags.</p>
              </div>
            </div>

            {/* OG Mockup Box */}
            <div className="border border-zinc-300 rounded-lg overflow-hidden bg-zinc-50 max-w-md mx-auto">
              <div className="h-44 bg-zinc-200 border-b border-zinc-300 flex items-center justify-center relative overflow-hidden">
                {social?.ogImage ? (
                  <img
                    src={social.ogImage}
                    alt="OpenGraph"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center text-zinc-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs font-mono">No og:image tag provided</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">
                  {social?.ogSiteName || 'DOMAIN.COM'}
                </span>
                <h5 className="text-sm font-bold text-black truncate mb-1">
                  {social?.ogTitle || metadata?.title || 'No Title'}
                </h5>
                <p className="text-xs text-zinc-600 line-clamp-2">
                  {social?.ogDescription || metadata?.metaDescription || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Twitter / X Card Preview */}
        <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-zinc-100">
              <div className="p-2 bg-[#fde047] border border-black rounded-lg">
                <TwitterIcon className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold font-space text-black">Twitter / X Card Preview</h3>
                <p className="text-xs text-zinc-500 font-medium">Card generated from twitter:* tags.</p>
              </div>
            </div>

            {/* Twitter Mockup Box */}
            <div className="border border-zinc-300 rounded-2xl overflow-hidden bg-zinc-50 max-w-md mx-auto">
              <div className="h-44 bg-zinc-200 border-b border-zinc-300 flex items-center justify-center relative overflow-hidden">
                {social?.twitterImage || social?.ogImage ? (
                  <img
                    src={social.twitterImage || social.ogImage}
                    alt="Twitter Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center text-zinc-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-xs font-mono">No twitter:image tag</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <h5 className="text-sm font-bold text-black truncate mb-1">
                  {social?.twitterTitle || metadata?.title || 'No Title'}
                </h5>
                <p className="text-xs text-zinc-600 line-clamp-2 mb-2">
                  {social?.twitterDescription || metadata?.metaDescription || 'No description provided.'}
                </p>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {report.finalUrl ? new URL(report.finalUrl).hostname : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Headings Structure & JSON-LD Structured Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headings Structure */}
        <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow">
          <h3 className="text-base font-bold font-space text-black mb-3">Headings Outline (H1 - H3)</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {headings?.h1 && headings.h1.length > 0 && (
              <div className="space-y-1">
                {headings.h1.map((h, i) => (
                  <div key={i} className="p-2 bg-yellow-50 border border-yellow-300 rounded text-xs font-bold font-space text-yellow-900">
                    <span className="bg-yellow-200 text-black px-1.5 py-0.5 rounded mr-1.5 border border-yellow-400">H1</span>
                    {h}
                  </div>
                ))}
              </div>
            )}

            {headings?.h2 && headings.h2.length > 0 && (
              <div className="space-y-1 pl-3 border-l-2 border-zinc-200">
                {headings.h2.slice(0, 10).map((h, i) => (
                  <div key={i} className="p-1.5 bg-blue-50 border border-blue-200 rounded text-xs font-semibold text-blue-900 truncate">
                    <span className="bg-blue-200 text-black px-1.5 py-0.5 rounded mr-1.5 border border-blue-300">H2</span>
                    {h}
                  </div>
                ))}
              </div>
            )}

            {headings?.h3 && headings.h3.length > 0 && (
              <div className="space-y-1 pl-6 border-l-2 border-zinc-200">
                {headings.h3.slice(0, 8).map((h, i) => (
                  <div key={i} className="p-1 bg-zinc-50 border border-zinc-200 rounded text-[11px] text-zinc-700 truncate">
                    <span className="bg-zinc-200 text-black px-1 py-0.2 rounded mr-1 text-[10px]">H3</span>
                    {h}
                  </div>
                ))}
              </div>
            )}

            {(!headings?.h1 || headings.h1.length === 0) && (!headings?.h2 || headings.h2.length === 0) && (
              <p className="text-xs text-zinc-500 italic">No H1/H2 headings detected in HTML document.</p>
            )}
          </div>
        </div>

        {/* JSON-LD Schema Data */}
        <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-bold font-space text-black flex items-center gap-1.5">
                <Code className="w-4 h-4" /> JSON-LD Structured Data
              </h3>
              <span className="text-xs font-bold font-mono px-2 py-0.5 bg-zinc-100 border border-black rounded">
                {structuredData?.jsonLdCount || 0} Block(s)
              </span>
            </div>

            <div className="bg-zinc-900 text-zinc-100 p-3 rounded-lg border-2 border-black font-mono text-xs max-h-56 overflow-auto">
              {structuredData?.items && structuredData.items.length > 0 ? (
                <pre>{JSON.stringify(structuredData.items, null, 2)}</pre>
              ) : (
                <span className="text-zinc-500 italic">// No Schema.org JSON-LD found on page</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
