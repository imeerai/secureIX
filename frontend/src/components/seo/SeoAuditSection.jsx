import React, { useState } from "react";
import {
  Sparkles,
  Gauge,
  Image as ImageIcon,
  FileText,
  Share2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Search,
  Zap,
  Globe,
  CheckSquare,
} from "lucide-react";

const SAMPLE_SEO_PREVIEWS = [
  {
    id: "optimized",
    title: "Optimized SaaS Homepage",
    domain: "https://secureix.dev",
    score: 96,
    metaTitle: "SecureIX — 10-Channel Web Security & SEO Engine",
    metaDesc:
      "Audit URL security, detect phishing risks, SSL cipher suites, DNS security, and inspect on-page SEO with Google Lighthouse metrics in real time.",
    serpUrl: "https://secureix.dev › scanner › web-security",
    lighthouse: { perf: 98, acc: 100, bp: 96, seo: 100 },
    checks: [
      { name: "H1 Tag Present & Unique (1 found)", status: "pass" },
      { name: "Meta Description Optimal (154 characters)", status: "pass" },
      {
        name: "OpenGraph & Twitter Card Active (og:image, twitter:card)",
        status: "pass",
      },
      { name: "Robots.txt & XML Sitemap Discovered", status: "pass" },
      { name: "Canonical Tag & Viewport Responsive", status: "pass" },
    ],
  },
  {
    id: "needs_work",
    title: "Needs Optimization Example",
    domain: "https://example-shop.com",
    score: 62,
    metaTitle: "Home | Buy Best Products Online Fast Delivery Today",
    metaDesc:
      "Welcome to our online store. We sell lots of good items with discount and fast shipping.",
    serpUrl: "https://example-shop.com › home",
    lighthouse: { perf: 58, acc: 74, bp: 70, seo: 72 },
    checks: [
      {
        name: "Multiple H1 Tags Detected (3 separate H1 elements)",
        status: "warn",
      },
      { name: "Missing OpenGraph Social Image (og:image)", status: "fail" },
      { name: "4 Image Elements Missing alt Text Attributes", status: "fail" },
      { name: "Canonical URL Tag Missing in Head", status: "warn" },
      {
        name: "Cumulative Layout Shift (CLS) Exceeds Threshold",
        status: "fail",
      },
    ],
  },
];

export default function SeoAuditSection() {
  const [activePreviewSample, setActivePreviewSample] = useState(
    SAMPLE_SEO_PREVIEWS[0],
  );

  return (
    <section
      id="seo-audit"
      className="py-20 px-6 bg-[#fffdf7] border-t-2 border-black relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#86efac] border-2 border-black px-3.5 py-1.5 rounded-full brutal-shadow-sm mb-4 font-space text-xs font-bold uppercase tracking-wider text-black">
            <Sparkles className="w-4 h-4 stroke-[2.5]" /> Comprehensive
            Technical SEO & Web Vitals
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-space tracking-tight text-black mb-4">
            Complete Website SEO & Lighthouse Engine
          </h2>
          <p className="text-base md:text-lg font-medium text-zinc-700 leading-relaxed">
            Audit meta tags, H1-H3 hierarchy, canonical rules, robots.txt, XML
            sitemaps, OpenGraph social cards, broken links, image alt
            attributes, and run local Google Lighthouse performance benchmarks
            with zero API keys.
          </p>
        </div>

        {/* 4 Core SEO Pillars */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#86efac] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <FileText className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              On-Page & Meta Tags
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Analyzes title length, meta description, heading structure
              (H1-H6), canonical URLs, charset, and lang tags.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#fde047] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Gauge className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              Lighthouse & Core Vitals
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Benchmarks Performance, FCP, LCP, CLS, Accessibility, Best
              Practices, and mobile rendering readiness.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#bfdbfe] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Share2 className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              SERP & Social Previews
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Renders live previews of Google Search snippets, OpenGraph
              Facebook cards, and Twitter/X summary embeds.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#fed7aa] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <ImageIcon className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              Media & Link Prober
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Validates image alt text coverage, internal vs external linking
              ratios, broken href links, and crawler headers.
            </p>
          </div>
        </div>

        {/* Example Preview Showcase Box */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#86efac] text-black font-bold px-2 py-0.5 rounded border border-black text-[11px] font-space uppercase">
                  SEO Audit Showcase
                </span>
                <span className="text-xs text-zinc-500 font-space font-medium">
                  Interactive Benchmark Samples
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-space text-black">
                How SecureIX Diagnoses Technical SEO & Performance
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 font-medium mt-1">
                Explore how the engine simulates Google SERP rendering,
                validates OpenGraph cards, and inspects Core Web Vitals.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_SEO_PREVIEWS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setActivePreviewSample(sample)}
                  className={`px-3.5 py-2 rounded-xl border-2 font-bold font-space text-xs transition-all cursor-pointer ${
                    activePreviewSample.id === sample.id
                      ? "bg-black text-white border-black brutal-shadow-sm"
                      : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black hover:bg-yellow-50"
                  }`}
                >
                  {sample.title} ({sample.score}/100)
                </button>
              ))}
            </div>
          </div>

          {/* Sample Details */}
          <div className="mt-6 grid lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Google SERP Simulated Snippet */}
            <div className="lg:col-span-7 bg-zinc-50 border-2 border-black rounded-xl p-5 brutal-shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-3">
                Simulated Google Search Snippet
              </span>
              <div className="bg-white p-4 rounded-lg border border-zinc-200 font-sans shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-xs text-zinc-600">
                  <div className="w-4 h-4 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-[9px]">
                    G
                  </div>
                  <span>{activePreviewSample.domain}</span>
                </div>
                <h4 className="text-blue-700 hover:underline text-base md:text-lg font-medium cursor-pointer leading-tight mb-1">
                  {activePreviewSample.metaTitle}
                </h4>
                <p className="text-xs md:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                  {activePreviewSample.metaDesc}
                </p>
              </div>

              {/* Lighthouse Mini Ring Scores */}
              <div className="mt-4 pt-4 border-t border-black/10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-space block mb-2">
                  Lighthouse Core Scores
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-black text-xs font-space">
                    <span className="text-[10px] text-zinc-500 block">
                      Performance
                    </span>
                    <strong className="text-sm font-bold text-black">
                      {activePreviewSample.lighthouse.perf}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-black text-xs font-space">
                    <span className="text-[10px] text-zinc-500 block">
                      Accessibility
                    </span>
                    <strong className="text-sm font-bold text-black">
                      {activePreviewSample.lighthouse.acc}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-black text-xs font-space">
                    <span className="text-[10px] text-zinc-500 block">
                      Best Practices
                    </span>
                    <strong className="text-sm font-bold text-black">
                      {activePreviewSample.lighthouse.bp}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-black text-xs font-space">
                    <span className="text-[10px] text-zinc-500 block">SEO</span>
                    <strong className="text-sm font-bold text-black">
                      {activePreviewSample.lighthouse.seo}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Checklist */}
            <div className="lg:col-span-5 bg-[#fffdf7] border-2 border-black rounded-xl p-5 brutal-shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-black font-space">
                    Audit Checks Preview
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border border-black font-space ${
                      activePreviewSample.score >= 80
                        ? "bg-[#86efac]"
                        : "bg-[#fde047]"
                    }`}
                  >
                    Score: {activePreviewSample.score}/100
                  </span>
                </div>
                <div className="space-y-2.5">
                  {activePreviewSample.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs font-space"
                    >
                      {chk.status === "pass" && (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      )}
                      {chk.status === "warn" && (
                        <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      {chk.status === "fail" && (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-zinc-800 font-medium">
                        {chk.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 text-[11px] text-zinc-500 font-space">
                💡 To audit any live website, enter the URL in the main scanner
                at the top of the page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
