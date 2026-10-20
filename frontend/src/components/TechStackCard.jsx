import React, { useState, useEffect } from 'react';
import {
  Server,
  Cloud,
  Code2,
  Cpu,
  Layers,
  Globe,
  MapPin,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Boxes,
  Radio,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export default function TechStackCard({ initialUrl, externalTechStack = null, externalLoading = false }) {
  const [targetUrl, setTargetUrl] = useState(initialUrl || 'https://wordpress.org');
  const [localTechStack, setLocalTechStack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const techStack = externalTechStack || localTechStack;
  const isLoading = externalLoading || loading;

  const fetchTechStack = async (url) => {
    if (!url || !url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const cleanUrl = url.trim();
      let res;
      try {
        res = await fetch(`${API_BASE}/api/techstack?url=${encodeURIComponent(cleanUrl)}`);
      } catch {
        res = await fetch(`http://localhost:3000/api/techstack?url=${encodeURIComponent(cleanUrl)}`);
      }

      if (!res.ok && res.status !== 200) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Server responded with HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.error && data.message) {
        setError(data.message);
      } else {
        setLocalTechStack(data);
      }
    } catch (err) {
      setError(err.message || 'Could not connect to Tech Stack detector backend. Ensure the backend server is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (externalTechStack) {
      setLocalTechStack(externalTechStack);
    } else if (initialUrl && initialUrl.trim()) {
      setTargetUrl(initialUrl.trim());
      fetchTechStack(initialUrl.trim());
    } else if (targetUrl && !localTechStack) {
      fetchTechStack(targetUrl);
    }
  }, [initialUrl, externalTechStack]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTechStack(targetUrl);
  };

  const handleSample = (sample) => {
    setTargetUrl(sample);
    fetchTechStack(sample);
  };

  const getConfidenceBadge = (conf) => {
    if (typeof conf === 'number') {
      if (conf >= 90) return 'bg-[#86efac] text-black border-black';
      if (conf >= 80) return 'bg-[#bfdbfe] text-black border-black';
      return 'bg-[#fde047] text-black border-black';
    }
    if (typeof conf === 'string' && conf.startsWith('High')) {
      return 'bg-[#86efac] text-black border-black';
    }
    return 'bg-[#bfdbfe] text-black border-black';
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b-2 border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#fde047] text-black font-bold px-2.5 py-0.5 rounded border border-black text-xs uppercase font-space flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 stroke-[2.5]" /> Tech Stack & Hosting Detector
            </span>
            <span className="text-xs text-zinc-500 font-space font-medium">Zero-Dependency Fingerprinting</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-space text-zinc-900">
            Infrastructure & Framework Intelligence
          </h3>
          <p className="text-sm font-medium text-zinc-600 mt-1">
            Identifies exact web hosting provider (Hostinger, GoDaddy, Vercel, AWS, Automattic, Hetzner, etc.), CDN edges, backend runtimes, and frontend frameworks.
          </p>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Target URL (e.g. wordpress.org)..."
            className="px-3.5 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs sm:text-sm font-space font-medium outline-none focus:bg-white w-full lg:w-64"
          />
          <button
            type="submit"
            disabled={isLoading || !targetUrl.trim()}
            className="px-4 py-2 bg-black text-white rounded-xl font-bold text-xs sm:text-sm font-space border-2 border-black hover:bg-zinc-800 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Detect</span>
          </button>
        </form>
      </div>

      {/* Quick sample chips */}
      <div className="flex flex-wrap items-center gap-2 my-4 text-xs font-bold font-space">
        <span className="text-zinc-500">Quick Samples:</span>
        {['https://wordpress.org', 'https://hostinger.com', 'https://vercel.com', 'https://github.com', 'https://shopify.com'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSample(s)}
            className="bg-zinc-100 hover:bg-yellow-100 text-black px-2.5 py-1 rounded-md border border-black brutal-shadow-sm transition-colors cursor-pointer"
          >
            {s.replace('https://', '')}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="py-12 text-center">
          <div className="w-12 h-12 bg-[#fde047] rounded-2xl border-2 border-black mx-auto flex items-center justify-center mb-3 animate-spin brutal-shadow">
            <RefreshCw className="w-6 h-6" />
          </div>
          <p className="font-bold font-space text-base">Probing DNS, Hosting ASN, CDN signatures & DOM fingerprints for {targetUrl}...</p>
          <p className="text-xs text-zinc-500 mt-1">Resolving IP, evaluating Server headers and script payloads.</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="my-6 p-5 bg-[#ff9ebb] border-2 border-black rounded-xl flex items-start gap-3.5 brutal-shadow">
          <AlertCircle className="w-6 h-6 text-red-900 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-black font-space text-sm">Detection Notice</h4>
            <p className="text-xs font-medium text-zinc-900 mt-0.5">{error}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchTechStack(targetUrl)}
                className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold font-space border border-black hover:bg-zinc-800 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
              <button
                type="button"
                onClick={() => handleSample('https://wordpress.org')}
                className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold font-space border border-black hover:bg-yellow-100 cursor-pointer"
              >
                Test with wordpress.org
              </button>
            </div>
          </div>
        </div>
      )}

      {techStack && !isLoading && (
        <div className="space-y-6 mt-6 animate-in fade-in duration-300">
          {/* Top Row: Hosting & Cloud Infrastructure Banner */}
          <div className="bg-[#bfdbfe] border-2 border-black rounded-2xl p-6 brutal-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-black/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl border-2 border-black flex items-center justify-center brutal-shadow-sm flex-shrink-0">
                  <Cloud className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-black/70 font-space">
                    Detected Web Hosting & Cloud Provider
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold font-space text-zinc-900">
                    {techStack.hosting.provider}
                  </h4>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white text-black font-bold font-mono text-xs px-3 py-1.5 rounded-lg border border-black brutal-shadow-sm flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> IP: {techStack.hosting.ip}
                </span>
                {techStack.hosting.location && techStack.hosting.location !== 'Unknown Location' && (
                  <span className="bg-white text-black font-bold text-xs px-3 py-1.5 rounded-lg border border-black brutal-shadow-sm flex items-center gap-1.5 font-space">
                    <MapPin className="w-3.5 h-3.5 text-red-600" /> {techStack.hosting.location}
                  </span>
                )}
              </div>
            </div>

            {/* Sub-details for Hosting */}
            <div className="grid sm:grid-cols-3 gap-3 mt-4 text-xs font-space">
              <div className="bg-white/60 p-3 rounded-xl border border-black/15">
                <span className="text-zinc-600 font-bold block mb-0.5">CDN / Edge Layer:</span>
                <strong className="text-zinc-900">{techStack.hosting.cdn}</strong>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-black/15">
                <span className="text-zinc-600 font-bold block mb-0.5">Network ASN / ISP:</span>
                <strong className="text-zinc-900 truncate block">{techStack.hosting.asn || techStack.hosting.isp || 'Direct Autonomous System'}</strong>
              </div>
              <div className="bg-white/60 p-3 rounded-xl border border-black/15">
                <span className="text-zinc-600 font-bold block mb-0.5">Detection Signals:</span>
                <strong className="text-zinc-900">{techStack.hosting.signals?.join(', ') || '1 Header/DNS match'}</strong>
              </div>
            </div>

            {/* NameServers if resolved */}
            {techStack.hosting.nameServers && techStack.hosting.nameServers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-black/10 flex flex-wrap items-center gap-2 text-xs font-space">
                <span className="font-bold text-black/70 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-black" /> NameServers (DNS):
                </span>
                {techStack.hosting.nameServers.map((ns, idx) => (
                  <span key={idx} className="bg-white/80 px-2 py-0.5 rounded border border-black/20 font-mono text-[11px]">
                    {ns}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dual Grid: Backend vs Frontend Technologies */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Backend Column */}
            <div className="bg-[#fffdf7] border-2 border-black rounded-2xl p-6 brutal-shadow">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/10">
                <h4 className="font-bold text-lg font-space flex items-center gap-2 text-zinc-900">
                  <Server className="w-5 h-5 text-black" /> Backend & Server Tech
                </h4>
                <span className="text-xs bg-zinc-100 font-bold px-2.5 py-0.5 rounded border border-black font-space">
                  {techStack.backend?.length || 0} Detected
                </span>
              </div>

              {techStack.backend && techStack.backend.length > 0 ? (
                <div className="space-y-3">
                  {techStack.backend.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border-2 border-black brutal-shadow-sm flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base font-space text-zinc-900">{item.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 border border-zinc-300 rounded font-space">
                            {item.category}
                          </span>
                        </div>
                        {item.signals && item.signals.length > 0 && (
                          <div className="text-xs text-zinc-500 font-space mt-1">
                            Signal: <span className="font-mono text-[11px] text-zinc-700">{item.signals.join(' • ')}</span>
                          </div>
                        )}
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border font-space flex-shrink-0 ${getConfidenceBadge(item.confidence)}`}>
                        {item.confidence}% Conf.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 font-space">
                  <Server className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">Backend Obfuscated / Minimal Footprint</p>
                  <p className="text-xs text-zinc-400 mt-1">Target strips Server and X-Powered-By headers (good security posture).</p>
                </div>
              )}
            </div>

            {/* Frontend Column */}
            <div className="bg-[#fffdf7] border-2 border-black rounded-2xl p-6 brutal-shadow">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/10">
                <h4 className="font-bold text-lg font-space flex items-center gap-2 text-zinc-900">
                  <Code2 className="w-5 h-5 text-black" /> Frontend, CMS & UI Libraries
                </h4>
                <span className="text-xs bg-zinc-100 font-bold px-2.5 py-0.5 rounded border border-black font-space">
                  {techStack.frontend?.length || 0} Detected
                </span>
              </div>

              {techStack.frontend && techStack.frontend.length > 0 ? (
                <div className="space-y-3">
                  {techStack.frontend.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-xl border-2 border-black brutal-shadow-sm flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base font-space text-zinc-900">{item.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 border border-yellow-300 rounded font-space">
                            {item.category}
                          </span>
                        </div>
                        {item.signals && item.signals.length > 0 && (
                          <div className="text-xs text-zinc-500 font-space mt-1">
                            Signal: <span className="font-mono text-[11px] text-zinc-700">{item.signals.join(' • ')}</span>
                          </div>
                        )}
                      </div>

                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border font-space flex-shrink-0 ${getConfidenceBadge(item.confidence)}`}>
                        {item.confidence}% Conf.
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 font-space">
                  <Code2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">Static / Vanilla HTML</p>
                  <p className="text-xs text-zinc-400 mt-1">No heavy framework bundle markers or CMS signatures found in source.</p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Footer Summary & Confidence Meter */}
          <div className="bg-zinc-900 text-white p-4 rounded-xl border-2 border-black flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-space">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>
                Detection Confidence: <strong className="text-yellow-300">{techStack.confidence.overall}</strong> ({techStack.confidence.signalsCount} verified signals)
              </span>
            </div>

            <div className="text-zinc-400 font-mono">
              GET /api/techstack?url={encodeURIComponent(techStack.target)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
