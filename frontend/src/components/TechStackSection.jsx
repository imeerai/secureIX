import React, { useState } from "react";
import {
  Boxes,
  Cloud,
  Server,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Radio,
  ArrowRight,
  Eye,
  Activity,
  Layers3,
} from "lucide-react";
import TechStackCard from "./TechStackCard";

const SAMPLE_PREVIEWS = [
  {
    id: "Ecommerce",
    title: "Modern E-Commerce Store",
    domain: "store.example.com",
    hosting: {
      provider: "Shopify Cloud Edge",
      ip: "23.227.38.65",
      location: "Ottawa, CA",
      cdn: "Cloudflare Enterprise",
    },
    backend: [
      {
        name: "Shopify Core Engine",
        category: "E-Commerce Platform",
        confidence: 98,
      },
      {
        name: "Ruby on Rails / Liquid",
        category: "Backend Framework",
        confidence: 95,
      },
      {
        name: "Cloudflare Edge Proxy",
        category: "Reverse Proxy",
        confidence: 99,
      },
    ],
    frontend: [
      { name: "React 18", category: "UI Framework", confidence: 95 },
      { name: "TailwindCSS", category: "CSS Framework", confidence: 90 },
      {
        name: "Shopify Dawn Engine",
        category: "Theme Framework",
        confidence: 96,
      },
    ],
  },
  {
    id: "SaaS",
    title: "Modern Full-Stack SaaS",
    domain: "app.saasproduct.io",
    hosting: {
      provider: "Vercel Edge Network",
      ip: "76.76.21.21",
      location: "Washington, US",
      cdn: "Vercel Global CDN",
    },
    backend: [
      {
        name: "Node.js Runtime",
        category: "JavaScript Runtime",
        confidence: 96,
      },
      {
        name: "Next.js Server Actions",
        category: "Fullstack Framework",
        confidence: 98,
      },
      { name: "Vercel Serverless", category: "Edge Computing", confidence: 94 },
    ],
    frontend: [
      {
        name: "Next.js 14 (App Router)",
        category: "React Framework",
        confidence: 99,
      },
      { name: "TailwindCSS & Lucide", category: "UI & Icons", confidence: 95 },
      { name: "Framer Motion", category: "Animation Library", confidence: 90 },
    ],
  },
  {
    id: "cms",
    title: "High-Traffic CMS Portal",
    domain: "news-portal.org",
    hosting: {
      provider: "Amazon Web Services (AWS)",
      ip: "52.95.110.1",
      location: "Frankfurt, DE",
      cdn: "Amazon CloudFront",
    },
    backend: [
      {
        name: "WordPress 6.4",
        category: "Content Management System",
        confidence: 99,
      },
      {
        name: "PHP 8.2 / FastCGI",
        category: "Server Scripting",
        confidence: 95,
      },
      { name: "Nginx 1.24", category: "Web Server", confidence: 92 },
    ],
    frontend: [
      { name: "jQuery 3.7", category: "JavaScript Utility", confidence: 94 },
      {
        name: "Gutenberg Blocks",
        category: "Editor Framework",
        confidence: 92,
      },
      { name: "Bootstrap 5", category: "CSS UI Kit", confidence: 88 },
    ],
  },
];

export default function TechStackSection({ techStackState, initialUrl }) {
  const [activePreview, setActivePreview] = useState(SAMPLE_PREVIEWS[0]);

  return (
    <section
      id="techstack"
      className="py-20 px-6 bg-[#fffdf7] border-t-2 border-black relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#fde047] border-2 border-black px-3.5 py-1.5 rounded-full brutal-shadow-sm mb-4 font-space text-xs font-bold uppercase tracking-wider text-black">
            <Boxes className="w-4 h-4 stroke-[2.5]" /> Technology Stack &
            Hosting Detector
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-space tracking-tight text-black mb-4">
            Full-Spectrum Infrastructure & Stack Intelligence
          </h2>
          <p className="text-base md:text-lg font-medium text-zinc-700 leading-relaxed">
            Uncover the complete technology footprint of any website. Instantly
            identify hosting providers (Hostinger, AWS, Vercel, Hetzner, etc.),
            CDN routing layers, backend engines, and frontend frameworks with
            zero third-party API dependencies.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#bfdbfe] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Cloud className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              Hosting & ASN Intel
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Resolves server IP addresses, Autonomous System Numbers (ASN), ISP
              metadata, and physical server geolocation.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#86efac] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Zap className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              CDN & Edge Routing
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Detects Cloudflare, Fastly, CloudFront, Akamai, and caching
              headers like{" "}
              <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">
                cf-ray
              </code>{" "}
              and{" "}
              <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">
                x-cache
              </code>
              .
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#fed7aa] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Server className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              Backend & Server Runtimes
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Identifies PHP, Node.js, Python/Django, ASP.NET, Ruby on Rails,
              Nginx, Apache, and CMS engines like WordPress & Shopify.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-5 brutal-shadow hover:translate-y-[-2px] transition-transform">
            <div className="w-10 h-10 bg-[#fde047] border-2 border-black rounded-lg flex items-center justify-center mb-3 brutal-shadow-sm">
              <Code2 className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <h3 className="font-bold text-base font-space text-black mb-1">
              Frontend & UI Frameworks
            </h3>
            <p className="text-xs text-zinc-600 font-medium leading-relaxed">
              Pinpoints React, Next.js, Vue, Nuxt, Angular, Svelte, TailwindCSS,
              Bootstrap, jQuery, and script bundles.
            </p>
          </div>
        </div>

        {/* Live Interactive Scanner Card */}
        <div className="mb-16">
          <TechStackCard
            initialUrl={initialUrl || "https://wordpress.org"}
            externalTechStack={techStackState?.report}
            externalLoading={techStackState?.status === "detecting"}
          />
        </div>

        {/* Example Preview Showcase Box */}
        <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#86efac] text-black font-bold px-2 py-0.5 rounded border border-black text-[11px] font-space uppercase">
                  Interactive Showcase
                </span>
                <span className="text-xs text-zinc-500 font-space font-medium">
                  Sample Fingerprint Reports
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-space text-black">
                How SecurIn Categorizes Complex Web Architectures
              </h3>
              <p className="text-xs md:text-sm text-zinc-600 font-medium mt-1">
                Click any architecture pattern below to inspect how the engine
                discovers and ranks hosting, backend, and frontend fingerprints.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PREVIEWS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setActivePreview(sample)}
                  className={`px-3.5 py-2 rounded-xl border-2 font-bold font-space text-xs transition-all cursor-pointer ${
                    activePreview.id === sample.id
                      ? "bg-black text-white border-black brutal-shadow-sm"
                      : "bg-zinc-50 text-zinc-700 border-zinc-300 hover:border-black hover:bg-yellow-50"
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Example Detail Preview */}
          <div className="mt-6 space-y-4 animate-in fade-in duration-200">
            {/* Hosting Row */}
            <div className="bg-[#bfdbfe] border-2 border-black rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border-2 border-black flex items-center justify-center brutal-shadow-sm flex-shrink-0">
                  <Cloud className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-black/70 font-space">
                    Identified Cloud / Web Host
                  </div>
                  <strong className="text-base font-space text-zinc-900">
                    {activePreview.hosting.provider}
                  </strong>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                <span className="bg-white px-2.5 py-1 rounded border border-black">
                  IP: {activePreview.hosting.ip}
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-black font-space">
                  {activePreview.hosting.location}
                </span>
                <span className="bg-white px-2.5 py-1 rounded border border-black font-space">
                  CDN: {activePreview.hosting.cdn}
                </span>
              </div>
            </div>

            {/* Split Backend and Frontend */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Backend */}
              <div className="bg-[#fffdf7] border-2 border-black rounded-xl p-4">
                <h4 className="font-bold text-sm font-space flex items-center gap-1.5 text-zinc-900 mb-3 pb-2 border-b border-black/10">
                  <Server className="w-4 h-4 text-black" /> Backend & Server
                  Signals
                </h4>
                <div className="space-y-2">
                  {activePreview.backend.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-lg border border-black flex items-center justify-between text-xs font-space"
                    >
                      <div>
                        <strong className="text-zinc-900 block">
                          {item.name}
                        </strong>
                        <span className="text-[11px] text-zinc-500">
                          {item.category}
                        </span>
                      </div>
                      <span className="bg-[#86efac] text-black font-bold px-2 py-0.5 rounded border border-black text-[10px]">
                        {item.confidence}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frontend */}
              <div className="bg-[#fffdf7] border-2 border-black rounded-xl p-4">
                <h4 className="font-bold text-sm font-space flex items-center gap-1.5 text-zinc-900 mb-3 pb-2 border-b border-black/10">
                  <Code2 className="w-4 h-4 text-black" /> Frontend & UI Library
                  Signals
                </h4>
                <div className="space-y-2">
                  {activePreview.frontend.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded-lg border border-black flex items-center justify-between text-xs font-space"
                    >
                      <div>
                        <strong className="text-zinc-900 block">
                          {item.name}
                        </strong>
                        <span className="text-[11px] text-zinc-500">
                          {item.category}
                        </span>
                      </div>
                      <span className="bg-[#fde047] text-black font-bold px-2 py-0.5 rounded border border-black text-[10px]">
                        {item.confidence}% Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
