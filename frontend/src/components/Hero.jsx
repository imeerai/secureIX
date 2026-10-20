import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  ArrowRight,
  PlayCircle,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Cpu,
  Server,
  Globe,
  Download,
  FileCheck2,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Timer,
  Boxes,
  Sparkles,
  CheckSquare,
  Square,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import SecurityDetailTabs from './SecurityDetailTabs';
import PdfReportModal from './PdfReportModal';
import BenchmarkComparison from './BenchmarkComparison';
import TechStackCard from './TechStackCard';
import SeoScoreCard from './seo/SeoScoreCard';
import SeoCategoryCards from './seo/SeoCategoryCards';
import SeoIssuesList from './seo/SeoIssuesList';
import SeoPreviews from './seo/SeoPreviews';
import SeoLighthouseTab from './seo/SeoLighthouseTab';
import SeoMediaLinksTab from './seo/SeoMediaLinksTab';

export default function Hero({ scannerState, techStackState, seoState, onScan, onRescan }) {
  const [inputUrl, setInputUrl] = useState('');
  const [includeSecurity, setIncludeSecurity] = useState(true);
  const [includeTechStack, setIncludeTechStack] = useState(true);
  const [includeSeo, setIncludeSeo] = useState(true);
  const [expandedChannel, setExpandedChannel] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);
  const [activeEngineTab, setActiveEngineTab] = useState('security'); // 'security' | 'techstack' | 'seo'
  const [activeSeoTab, setActiveSeoTab] = useState('overview');

  const { status: secStatus, report: secReport, error: secError, isRateLimited, retryCountdown } = scannerState;
  const techReport = techStackState?.report;
  const techStatus = techStackState?.status;
  const seoReport = seoState?.report;
  const seoStatus = seoState?.status;

  // Active reports based on selected checkboxes
  const activeSecReport = includeSecurity ? secReport : null;
  const activeTechReport = includeTechStack ? techReport : null;
  const activeSeoReport = includeSeo ? seoReport : null;

  const isAnyScanning =
    (includeSecurity && secStatus === 'scanning') ||
    (includeTechStack && techStatus === 'detecting') ||
    (includeSeo && seoStatus === 'auditing');

  const hasResults =
    (includeSecurity && secStatus === 'done' && secReport) ||
    (includeTechStack && techStatus === 'done' && techReport) ||
    (includeSeo && seoStatus === 'done' && seoReport);

  // Synchronize active tab to available engine
  useEffect(() => {
    if (activeEngineTab === 'security' && (!includeSecurity || !secReport)) {
      if (includeTechStack && techReport) setActiveEngineTab('techstack');
      else if (includeSeo && seoReport) setActiveEngineTab('seo');
    } else if (activeEngineTab === 'techstack' && (!includeTechStack || !techReport)) {
      if (includeSecurity && secReport) setActiveEngineTab('security');
      else if (includeSeo && seoReport) setActiveEngineTab('seo');
    } else if (activeEngineTab === 'seo' && (!includeSeo || !seoReport)) {
      if (includeSecurity && secReport) setActiveEngineTab('security');
      else if (includeTechStack && techReport) setActiveEngineTab('techstack');
    }
  }, [includeSecurity, includeTechStack, includeSeo, secReport, techReport, seoReport, activeEngineTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onScan(inputUrl.trim(), { includeSecurity, includeTechStack, includeSeo });
    }
  };

  const handleSampleClick = (url) => {
    setInputUrl(url);
    onScan(url, { includeSecurity, includeTechStack, includeSeo });
  };

  const toggleSecurity = () => {
    if (includeSecurity && !includeTechStack && !includeSeo) return; // Prevent disabling all
    setIncludeSecurity(!includeSecurity);
  };

  const toggleTechStack = () => {
    if (includeTechStack && !includeSecurity && !includeSeo) return;
    setIncludeTechStack(!includeTechStack);
  };

  const toggleSeo = () => {
    if (includeSeo && !includeSecurity && !includeTechStack) return;
    setIncludeSeo(!includeSeo);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-[#86efac] text-black border-black';
      case 'B': return 'bg-[#bfdbfe] text-black border-black';
      case 'C': return 'bg-[#fde047] text-black border-black';
      case 'D': return 'bg-orange-300 text-black border-black';
      default: return 'bg-[#ff9ebb] text-black border-black';
    }
  };

  const getClassificationBadge = (classification) => {
    if (classification === 'Safe') {
      return (
        <span className="bg-[#86efac] text-black font-bold px-3 py-1 border-2 border-black rounded-md text-xs uppercase tracking-wider brutal-shadow-sm flex items-center gap-1.5 font-space">
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Safe Site
        </span>
      );
    }
    if (classification === 'Suspicious') {
      return (
        <span className="bg-[#fde047] text-black font-bold px-3 py-1 border-2 border-black rounded-md text-xs uppercase tracking-wider brutal-shadow-sm flex items-center gap-1.5 font-space">
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" /> Suspicious Patterns
        </span>
      );
    }
    return (
      <span className="bg-[#ff9ebb] text-black font-bold px-3 py-1 border-2 border-black rounded-md text-xs uppercase tracking-wider brutal-shadow-sm flex items-center gap-1.5 font-space">
        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" /> High Risk / Malicious
      </span>
    );
  };

  const selectedEnginesCount = [includeSecurity, includeTechStack, includeSeo].filter(Boolean).length;

  return (
    <section id="scanner" className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern -z-20"></div>
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-black bg-[#fde047] brutal-shadow-sm transform -rotate-1">
              <Zap className="w-4 h-4 stroke-[2]" />
              <span className="text-xs font-bold tracking-wide uppercase font-space">
                Multi-Engine: Security, Tech Stack & SEO Audit
              </span>
            </div>

            {/* Self-Defense Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black bg-white brutal-shadow-sm text-[11px] font-bold font-space">
              <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
              <span>API Self-Defense: Rate-Limiting & SSRF Shield Active</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl tracking-tight leading-[1] mb-6 font-medium font-space">
            Master web security.{" "}
            <span className="relative inline-block px-2 mt-2 md:mt-0">
              <span className="absolute inset-0 bg-[#ff9ebb] -rotate-2 border-2 border-black rounded-lg brutal-shadow-sm -z-10"></span>
              Without the mess.
            </span>
          </h1>

          <p className="text-xl text-zinc-600 leading-relaxed font-medium">
            Scan any website URL in real-time for cybersecurity posture,
            infrastructure & hosting tech stack, and full technical SEO metrics.
          </p>
        </div>

        {/* Live Scanner Search Bar & Engine Checkboxes */}
        <div className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-white p-2.5 rounded-2xl border-2 border-black brutal-shadow-lg flex flex-col sm:flex-row gap-2.5 items-stretch">
              <div className="flex-1 flex items-center gap-3 px-3 bg-zinc-50 rounded-xl border-2 border-black/10">
                <Globe className="w-5 h-5 text-zinc-500 stroke-[2] flex-shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Enter URL to audit (e.g. github.com, wordpress.org)..."
                  className="w-full bg-transparent py-3 text-base font-medium font-space outline-none text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <button
                type="submit"
                disabled={isAnyScanning || !inputUrl.trim() || isRateLimited}
                className="px-8 py-4 bg-black text-white rounded-xl font-bold border-2 border-black brutal-shadow brutal-hover flex items-center justify-center gap-3 font-space cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isAnyScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 stroke-[2.5]" />
                    <span>Run Live Scan</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Engine Selector Checkboxes */}
          <div className="mt-4 p-3.5 bg-white border-2 border-black rounded-xl brutal-shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold font-space text-zinc-600">
              <span className="uppercase tracking-wider">Audit Engines:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Checkbox 1: Primary Security Engine */}
              <button
                type="button"
                onClick={toggleSecurity}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold text-xs font-space transition-all cursor-pointer select-none ${
                  includeSecurity
                    ? "bg-[#86efac] border-black text-black brutal-shadow-sm"
                    : "bg-zinc-100 border-zinc-300 text-zinc-500 hover:border-black hover:text-black"
                }`}
                title="Audit 12 security channels, SSL/TLS, headers, and DNS spoofing"
              >
                {includeSecurity ? (
                  <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 stroke-[2]" />
                )}
                <Shield className="w-3.5 h-3.5" />
                <span>Security Posture (Core)</span>
              </button>

              {/* Checkbox 2: Tech Stack & Hosting Detector */}
              <button
                type="button"
                onClick={toggleTechStack}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold text-xs font-space transition-all cursor-pointer select-none ${
                  includeTechStack
                    ? "bg-[#bfdbfe] border-black text-black brutal-shadow-sm"
                    : "bg-zinc-100 border-zinc-300 text-zinc-500 hover:border-black hover:text-black"
                }`}
                title="Detect hosting provider, ASN, CDN, and backend/frontend frameworks"
              >
                {includeTechStack ? (
                  <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 stroke-[2]" />
                )}
                <Boxes className="w-3.5 h-3.5" />
                <span>Tech Stack & Hosting Detector</span>
              </button>

              {/* Checkbox 3: SEO Audit */}
              <button
                type="button"
                onClick={toggleSeo}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold text-xs font-space transition-all cursor-pointer select-none ${
                  includeSeo
                    ? "bg-[#fde047] border-black text-black brutal-shadow-sm"
                    : "bg-zinc-100 border-zinc-300 text-zinc-500 hover:border-black hover:text-black"
                }`}
                title="Audit SEO metadata, headings, Lighthouse metrics, and broken links"
              >
                {includeSeo ? (
                  <CheckSquare className="w-4 h-4 text-black stroke-[2.5]" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400 stroke-[2]" />
                )}
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEO Audit</span>
              </button>
            </div>
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs font-bold font-space">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-zinc-500">Try Sample:</span>
              {[
                "https://imeer.dev/",
                "https://www.linkedin.com",
                "https://wordpress.org",
                "https://amazon.com",
                "google.com",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => handleSampleClick(sample)}
                  className="bg-white hover:bg-yellow-100 text-black px-2.5 py-1 rounded-md border border-black brutal-shadow-sm transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rate Limit 429 Alert with Live Countdown */}
        {isRateLimited && (
          <div className="max-w-3xl mx-auto mb-10 bg-[#fde047] border-2 border-black rounded-xl p-5 brutal-shadow">
            <div className="flex items-start gap-3.5">
              <Timer className="w-6 h-6 stroke-[2] text-black flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-black font-space text-base">
                    API Rate Limit Enforced (Abuse Protection)
                  </h4>
                  <span className="bg-black text-white px-2.5 py-0.5 rounded text-xs font-mono font-bold">
                    HTTP 429
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-900 mt-1">
                  Our self-defense rate-limiter prevents scan flooding and
                  preserves engine resources. Please wait before submitting
                  additional audits.
                </p>
                <div className="mt-3 flex items-center gap-2 bg-white/70 p-2.5 rounded-lg border border-black text-xs font-space font-bold">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                  <span>Cooldown timer:</span>
                  <span className="text-black font-mono text-sm underline">
                    {retryCountdown} seconds remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {secStatus === "error" && !isRateLimited && (
          <div className="max-w-3xl mx-auto mb-10 bg-[#ff9ebb] border-2 border-black rounded-xl p-5 brutal-shadow">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 stroke-[2] text-red-900 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-black font-space text-base">
                  Audit Connection Notice
                </h4>
                <p className="text-sm font-medium text-zinc-900 mt-1">
                  {secError || "Failed to scan the specified URL."}
                </p>
                <div className="mt-3 pt-3 border-t border-black/20 text-xs text-zinc-800 font-medium">
                  <strong>Tip:</strong> If testing private or restricted
                  targets, SSRF protection blocks them. For live tests, try
                  domains like{" "}
                  <button
                    type="button"
                    onClick={() => handleSampleClick("https://github.com")}
                    className="underline font-bold hover:text-black"
                  >
                    github.com
                  </button>
                  ,{" "}
                  <button
                    type="button"
                    onClick={() => handleSampleClick("https://wordpress.org")}
                    className="underline font-bold hover:text-black"
                  >
                    wordpress.org
                  </button>
                  , or{" "}
                  <button
                    type="button"
                    onClick={() => handleSampleClick("https://cloudflare.com")}
                    className="underline font-bold hover:text-black"
                  >
                    cloudflare.com
                  </button>
                  .
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanning Loader State */}
        {isAnyScanning && (
          <div className="max-w-3xl mx-auto mb-10 bg-white border-2 border-black rounded-2xl p-8 brutal-shadow-lg text-center">
            <div className="w-16 h-16 bg-[#86efac] rounded-2xl border-2 border-black mx-auto flex items-center justify-center mb-4 brutal-shadow animate-spin">
              <RefreshCw className="w-8 h-8 stroke-[2]" />
            </div>
            <h3 className="text-2xl font-bold font-space mb-2">
              Auditing{" "}
              {selectedEnginesCount === 3
                ? "Security, Infrastructure & SEO"
                : selectedEnginesCount === 2
                  ? "Selected 2 Engines"
                  : "Selected Engine"}
              ...
            </h3>
            <p className="text-zinc-600 font-medium max-w-md mx-auto">
              Probing target{" "}
              <span className="font-bold text-black font-space underline">
                {inputUrl}
              </span>{" "}
              across selected diagnostic modules.
            </p>
          </div>
        )}

        {/* Live Multi-Engine Scan Results Display */}
        {hasResults && !isAnyScanning && (
          <div className="max-w-5xl mx-auto mb-12 space-y-8 animate-in fade-in duration-300">
            {/* Multi-Engine Scorecard Header */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
                <div className="flex items-center gap-4">
                  {/* Grade Box */}
                  <div
                    className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center brutal-shadow font-space ${getGradeColor(activeSecReport?.grade || activeSeoReport?.grade || "A")}`}
                  >
                    <span className="text-4xl font-bold leading-none">
                      {activeSecReport?.grade || activeSeoReport?.grade || "A"}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {activeSecReport ? "Security" : "Overall"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-space">
                        {selectedEnginesCount === 3
                          ? "3-in-1 Complete Audit"
                          : `${selectedEnginesCount} Module Audit`}
                      </span>
                      {activeSecReport &&
                        getClassificationBadge(activeSecReport.classification)}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-space truncate max-w-md md:max-w-xl text-zinc-900">
                      {activeSecReport?.finalUrl ||
                        activeSecReport?.requestedUrl ||
                        activeTechReport?.target ||
                        activeSeoReport?.url}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-zinc-600 mt-1">
                      {activeSecReport && (
                        <span>
                          🛡️ Sec: <strong>{activeSecReport.score}/100</strong>
                        </span>
                      )}
                      {activeTechReport && (
                        <span>
                          ⚡ Host:{" "}
                          <strong>{activeTechReport.hosting?.provider}</strong>
                        </span>
                      )}
                      {activeSeoReport && (
                        <span>
                          📈 SEO: <strong>{activeSeoReport.score}/100</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-black/10">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Side-by-Side Benchmark Toggle */}
                    {activeSecReport && (
                      <button
                        type="button"
                        onClick={() => setShowBenchmark(!showBenchmark)}
                        className="px-3.5 py-2.5 bg-[#bfdbfe] hover:bg-blue-200 text-black border-2 border-black rounded-xl font-bold text-xs md:text-sm font-space brutal-shadow-sm brutal-hover flex items-center gap-1.5 cursor-pointer"
                        title="Compare against Mozilla Observatory score"
                      >
                        <Scale className="w-4 h-4 stroke-[2.5]" />
                        <span>
                          {showBenchmark ? "Hide Benchmark" : "Observatory"}
                        </span>
                      </button>
                    )}

                    {/* Download Full Combined PDF Report */}
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="px-4 py-2.5 bg-[#fde047] hover:bg-yellow-300 text-black border-2 border-black rounded-xl font-bold text-xs md:text-sm font-space brutal-shadow-sm brutal-hover flex items-center gap-1.5 cursor-pointer"
                      title="Download full audit report for active modules"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download Report</span>
                    </button>
                  </div>
                  <div className="text-xs font-bold text-zinc-500 font-space">
                    {activeSecReport &&
                      `Latency: ${activeSecReport.scanTimeMs}ms • Status: HTTP ${activeSecReport.httpStatus}`}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {activeSecReport && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold font-space mb-2">
                    <span>Overall Security Posture</span>
                    <span>{activeSecReport.score}% Passed</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-4 rounded-full overflow-hidden border-2 border-black">
                    <div
                      className={`h-full transition-all duration-700 ${
                        activeSecReport.score >= 80
                          ? "bg-[#86efac]"
                          : activeSecReport.score >= 60
                            ? "bg-[#fde047]"
                            : "bg-[#ff9ebb]"
                      }`}
                      style={{ width: `${activeSecReport.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Engine Tabs Switcher — ONLY SHOW TABS FOR SELECTED MODULES */}
            <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-3">
              {activeSecReport && (
                <button
                  type="button"
                  onClick={() => setActiveEngineTab("security")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-sm font-space transition-all cursor-pointer ${
                    activeEngineTab === "security"
                      ? "bg-black text-white border-black brutal-shadow"
                      : "bg-white text-zinc-800 border-zinc-300 hover:border-black"
                  }`}
                >
                  <Shield className="w-4 h-4 stroke-[2.5]" />
                  <span>Security Audit (12 Channels)</span>
                </button>
              )}

              {activeTechReport && (
                <button
                  type="button"
                  onClick={() => setActiveEngineTab("techstack")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-sm font-space transition-all cursor-pointer ${
                    activeEngineTab === "techstack"
                      ? "bg-[#bfdbfe] text-black border-black brutal-shadow"
                      : "bg-white text-zinc-800 border-zinc-300 hover:border-black"
                  }`}
                >
                  <Boxes className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    Tech Stack & Hosting ({activeTechReport.hosting?.provider})
                  </span>
                </button>
              )}

              {activeSeoReport && (
                <button
                  type="button"
                  onClick={() => setActiveEngineTab("seo")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-bold text-sm font-space transition-all cursor-pointer ${
                    activeEngineTab === "seo"
                      ? "bg-[#fde047] text-black border-black brutal-shadow"
                      : "bg-white text-zinc-800 border-zinc-300 hover:border-black"
                  }`}
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>SEO Audit ({activeSeoReport.score}/100)</span>
                </button>
              )}
            </div>

            {/* TAB 1: SECURITY AUDIT VIEW */}
            {activeEngineTab === "security" && activeSecReport && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Optional Side-by-Side Benchmark Comparison View */}
                {showBenchmark && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <BenchmarkComparison
                      initialUrl={
                        activeSecReport.finalUrl || activeSecReport.requestedUrl
                      }
                      report={activeSecReport}
                    />
                  </div>
                )}

                {/* 12 Evaluated Channels Accordion Grid */}
                <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow">
                  <h4 className="text-xl font-bold font-space mb-6 flex items-center justify-between">
                    <span>12 Evaluated Security Channels</span>
                    <span className="text-xs font-normal text-zinc-500 font-space">
                      Click any item for details & recommendations
                    </span>
                  </h4>

                  <div className="space-y-3">
                    {activeSecReport.channels?.map((channel) => {
                      const isExpanded = expandedChannel === channel.id;
                      const isPass = channel.status === "PASS";
                      const isWarn = channel.status === "WARN";

                      return (
                        <div
                          key={channel.id}
                          className={`border-2 border-black rounded-xl overflow-hidden transition-all ${
                            isPass
                              ? "bg-green-50/50"
                              : isWarn
                                ? "bg-yellow-50/50"
                                : "bg-red-50/50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedChannel(isExpanded ? null : channel.id)
                            }
                            className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center font-bold text-sm ${
                                  isPass
                                    ? "bg-[#86efac]"
                                    : isWarn
                                      ? "bg-[#fde047]"
                                      : "bg-[#ff9ebb]"
                                }`}
                              >
                                {isPass ? "✓" : isWarn ? "!" : "✕"}
                              </div>
                              <div>
                                <span className="font-bold text-base font-space text-black">
                                  {channel.name}
                                </span>
                                <span className="text-xs text-zinc-500 font-space block md:inline md:ml-3">
                                  Weight: {channel.earned}/{channel.weight} pts
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs font-bold px-2.5 py-1 border-2 border-black rounded-md font-space uppercase ${
                                  isPass
                                    ? "bg-[#86efac] text-black"
                                    : isWarn
                                      ? "bg-[#fde047] text-black"
                                      : "bg-[#ff9ebb] text-black"
                                }`}
                              >
                                {channel.status}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-1 border-t-2 border-dashed border-black/20 text-sm space-y-3">
                              <div>
                                <strong className="font-space text-zinc-900 block mb-1">
                                  Diagnostic Detail:
                                </strong>
                                <p className="text-zinc-700 font-medium leading-relaxed">
                                  {channel.detail}
                                </p>
                              </div>
                              {channel.recommendation && (
                                <div className="bg-black text-white p-3 rounded-lg border border-black">
                                  <strong className="text-xs text-yellow-300 font-space uppercase tracking-wider block mb-1">
                                    Fix Recommendation:
                                  </strong>
                                  <p className="text-xs text-zinc-200">
                                    {channel.recommendation}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Deep Diagnostics Detail Tabs (Cookies, CORS, Sensitive Files, DNS Spoofing) */}
                <SecurityDetailTabs report={activeSecReport} />

                {/* Redirect Chain info if multiple hops */}
                {activeSecReport.redirectChain &&
                  activeSecReport.redirectChain.length > 1 && (
                    <div className="bg-[#bfdbfe] border-2 border-black rounded-2xl p-6 brutal-shadow">
                      <h4 className="font-bold text-lg font-space mb-3 flex items-center gap-2">
                        <Server className="w-5 h-5" /> Redirect Chain (
                        {activeSecReport.redirectChain.length - 1} hops)
                      </h4>
                      <div className="space-y-2">
                        {activeSecReport.redirectChain.map((hop, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-white p-3 rounded-lg border border-black text-sm font-space"
                          >
                            <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-mono text-xs flex-1 truncate">
                              {hop.url}
                            </span>
                            <span className="font-bold text-xs bg-zinc-100 px-2 py-1 rounded border border-zinc-300">
                              HTTP {hop.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* TAB 2: TECH STACK & HOSTING DETECTOR VIEW */}
            {activeEngineTab === "techstack" && activeTechReport && (
              <div className="animate-in fade-in duration-200">
                <TechStackCard
                  initialUrl={activeSecReport?.finalUrl || inputUrl}
                  externalTechStack={activeTechReport}
                  externalLoading={techStatus === "detecting"}
                />
              </div>
            )}

            {/* TAB 3: SEO AUDIT VIEW */}
            {activeEngineTab === "seo" && activeSeoReport && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <SeoScoreCard report={activeSeoReport} />

                <div className="flex flex-wrap items-center gap-2 border-b-2 border-black pb-3">
                  {[
                    {
                      id: "overview",
                      label: "Overview & Categories",
                      icon: LayoutDashboard,
                    },
                    {
                      id: "issues",
                      label: "All Checks & Fixes",
                      icon: CheckCircle2,
                    },
                    {
                      id: "previews",
                      label: "SERP & Social Previews",
                      icon: Globe,
                    },
                    {
                      id: "lighthouse",
                      label: "Lighthouse Performance",
                      icon: Zap,
                    },
                    {
                      id: "media",
                      label: "Images & Links Prober",
                      icon: FileCheck2,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSeoTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSeoTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-bold text-xs md:text-sm font-space transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#fde047] text-black border-black brutal-shadow-sm"
                            : "bg-white text-zinc-700 border-zinc-300 hover:border-black"
                        }`}
                      >
                        <Icon className="w-4 h-4 stroke-[2]" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div>
                  {activeSeoTab === "overview" && (
                    <div>
                      <SeoCategoryCards
                        categories={activeSeoReport.categories}
                      />
                      <SeoIssuesList
                        checks={activeSeoReport.checks}
                        recommendations={activeSeoReport.recommendations}
                      />
                    </div>
                  )}

                  {activeSeoTab === "issues" && (
                    <SeoIssuesList
                      checks={activeSeoReport.checks}
                      recommendations={activeSeoReport.recommendations}
                    />
                  )}

                  {activeSeoTab === "previews" && (
                    <SeoPreviews report={activeSeoReport} />
                  )}

                  {activeSeoTab === "lighthouse" && (
                    <SeoLighthouseTab lighthouse={activeSeoReport.lighthouse} />
                  )}

                  {activeSeoTab === "media" && (
                    <SeoMediaLinksTab report={activeSeoReport} />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hero Interactive Card Stack (shown when idle) */}
        {!hasResults && !isAnyScanning && (
          <div className="relative max-w-4xl mx-auto min-h-[420px] pt-4 pb-12 hidden md:flex items-center justify-center">
            <div className="relative w-[520px] h-[330px]">
              {/* Card 1: Live TLS & Cert check */}
              <div className="absolute top-0 right-2 w-80 bg-white p-5 rounded-xl border-2 border-black rotate-2 brutal-shadow-lg z-10 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full border-2 border-black flex items-center justify-center">
                      <Shield className="w-5 h-5 stroke-[2] text-green-700" />
                    </div>
                    <div>
                      <div className="font-bold text-sm font-space">
                        TLS 1.3 / SSL Verified
                      </div>
                      <div className="text-xs text-zinc-500">
                        github.com • DigiCert Inc
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-xs bg-[#86efac] text-black px-2 py-0.5 border border-black rounded font-space">
                    PASS
                  </span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-black">
                  <div className="bg-green-400 h-full w-full"></div>
                </div>
                <div className="flex justify-between mt-2 text-[11px] font-bold text-zinc-500 font-space">
                  <span>Certificate Health</span>
                  <span>100% Valid</span>
                </div>
              </div>

              {/* Card 2: Security Score & Channels */}
              <div className="absolute top-12 left-2 w-80 bg-[#bfdbfe] p-5 rounded-xl border-2 border-black -rotate-2 brutal-shadow-lg z-20 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-base font-space">
                      Security Posture
                    </div>
                    <div className="text-xs text-zinc-700 font-space">
                      12 Channels & Vectors
                    </div>
                  </div>
                  <div className="bg-black text-white text-xs font-bold px-2 py-0.5 border border-black rounded font-space">
                    Score 94/100
                  </div>
                </div>
                <div className="h-16 flex items-end justify-between gap-1.5 my-2.5">
                  <div className="w-full bg-blue-600 border border-black h-[100%] rounded-t"></div>
                  <div className="w-full bg-blue-600 border border-black h-[90%] rounded-t"></div>
                  <div className="w-full bg-blue-600 border border-black h-[80%] rounded-t"></div>
                  <div className="w-full bg-blue-600 border border-black h-[95%] rounded-t"></div>
                  <div className="w-full bg-blue-600 border border-black h-[100%] rounded-t"></div>
                </div>
                <div className="text-[11px] font-bold text-center font-space text-zinc-900">
                  HTTPS • HSTS • Cookies • CORS • DNS
                </div>
              </div>

              {/* Card 3: AI Security Analyst Bubble */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] bg-[#18181b] text-white p-4 rounded-xl border-2 border-black z-30 flex items-center gap-3 brutal-shadow-lg hover:scale-105 transition-transform duration-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 border border-white/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold text-yellow-300 font-space">
                      Cyber Defense AI Analyst
                    </span>
                    <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-zinc-200 font-medium truncate">
                    "DMARC reject policy active. Zero sensitive files exposed."
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Multi-Engine PDF Report Modal (only active reports included) */}
        <PdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          report={activeSecReport}
          techStack={activeTechReport}
          seo={activeSeoReport}
        />
      </div>
    </section>
  );
}
