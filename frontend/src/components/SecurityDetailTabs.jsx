import React, { useState } from 'react';
import {
  Cookie,
  Globe,
  FileCode2,
  MailCheck,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Lock,
  ExternalLink,
} from 'lucide-react';
import PdfReportModal from './PdfReportModal';

export default function SecurityDetailTabs({ report }) {
  const [activeTab, setActiveTab] = useState('cookies');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  if (!report) return null;

  const cookieInfo = report.cookieInfo || { total: 0, status: 'PASS', score: 10, cookies: [], summary: 'No cookies detected on response (Safe / Stateless).' };
  const corsInfo = report.corsInfo || { status: 'PASS', score: 10, detail: 'Strict Same-Origin Policy (SOP) enforced. Safe.' };
  const dnsInfo = report.dnsInfo || { emailProtection: 'Evaluating', spf: { status: 'PASS' }, dmarc: { status: 'PASS' }, caa: { status: 'WARN' } };
  const sensitiveFiles = report.sensitiveFiles || { exposedCount: 0, findings: [] };

  const getStatusBadge = (status) => {
    const s = String(status || 'PASS').toUpperCase();
    if (s === 'PASS' || s === 'SAFE') {
      return (
        <span className="inline-flex items-center gap-1 bg-[#86efac] text-black font-bold px-2 py-0.5 rounded border border-black text-xs uppercase font-space">
          <CheckCircle2 className="w-3 h-3" /> PASS
        </span>
      );
    }
    if (s === 'WARN' || s === 'DISCOVERED') {
      return (
        <span className="inline-flex items-center gap-1 bg-[#fde047] text-black font-bold px-2 py-0.5 rounded border border-black text-xs uppercase font-space">
          <AlertTriangle className="w-3 h-3" /> {s}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-[#ff9ebb] text-black font-bold px-2 py-0.5 rounded border border-black text-xs uppercase font-space">
        <XCircle className="w-3 h-3" /> {s}
      </span>
    );
  };

  return (
    <>
      <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow-lg">
        {/* Top Header with Tab Switcher and PDF Export */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b-2 border-black/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border border-black rounded-md text-xs font-bold font-space uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-800" /> Advanced Deep Inspection Suite
            </div>
            <h3 className="text-2xl font-bold font-space text-zinc-900">
              Perimeter Defense & Deep Diagnostics
            </h3>
            <p className="text-sm font-medium text-zinc-600 mt-1">
              Examine cookie isolation, CORS vulnerabilities, sensitive exposed source files, and DNS spoofing vectors.
            </p>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="px-5 py-3 bg-black text-white rounded-xl font-bold border-2 border-black brutal-shadow brutal-hover flex items-center justify-center gap-2.5 font-space cursor-pointer self-start lg:self-center"
          >
            <Download className="w-4 h-4 text-yellow-300 stroke-[2.5]" />
            <span>View & Download Report</span>
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('cookies')}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs md:text-sm font-space flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-[#86efac] brutal-shadow text-black'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Cookie Security ({cookieInfo.total > 0 ? `${cookieInfo.total} Cookies` : 'Stateless ✓'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cors')}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs md:text-sm font-space flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cors'
                ? 'bg-[#bfdbfe] brutal-shadow text-black'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>CORS Policy Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs md:text-sm font-space flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'files'
                ? 'bg-[#ff9ebb] brutal-shadow text-black'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Sensitive Files ({sensitiveFiles.exposedCount > 0 ? `⚠️ ${sensitiveFiles.exposedCount} Exposed` : 'Protected ✓'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dns')}
            className={`px-4 py-2.5 rounded-xl border-2 border-black font-bold text-xs md:text-sm font-space flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dns'
                ? 'bg-[#fde047] brutal-shadow text-black'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            <MailCheck className="w-4 h-4" />
            <span>Subdomain & DNS (SPF/DMARC)</span>
          </button>
        </div>

        {/* TAB 1: COOKIE SECURITY ANALYZER */}
        {activeTab === 'cookies' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black flex items-start gap-3">
              <Info className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-zinc-800">
                <strong className="font-space font-bold">Why Cookie Security Matters:</strong> Cookies without{' '}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">HttpOnly</code> can be stolen via XSS scripts. Cookies without{' '}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">Secure</code> are leaked over unencrypted Wi-Fi/HTTP. Missing{' '}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">SameSite</code> exposes users to Cross-Site Request Forgery (CSRF).
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border-2 border-black">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold font-space text-lg flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-amber-700" />
                  <span>Cookies Detected ({cookieInfo.total || 0})</span>
                </h4>
                {getStatusBadge(cookieInfo.status || 'PASS')}
              </div>
              <p className="text-sm text-zinc-700 font-medium mb-4">{cookieInfo.summary}</p>

              {cookieInfo.cookies?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse font-space">
                    <thead>
                      <tr className="bg-zinc-100 border-2 border-black text-xs font-bold uppercase">
                        <th className="p-3 border-r border-black">Cookie Name</th>
                        <th className="p-3 border-r border-black text-center">Secure</th>
                        <th className="p-3 border-r border-black text-center">HttpOnly</th>
                        <th className="p-3 border-r border-black text-center">SameSite</th>
                        <th className="p-3">Risk Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cookieInfo.cookies.map((c, idx) => (
                        <tr key={idx} className="border-2 border-black hover:bg-zinc-50">
                          <td className="p-3 border-r border-black font-bold font-mono text-xs">{c.name}</td>
                          <td className="p-3 border-r border-black text-center">
                            {c.secure ? (
                              <span className="text-green-600 font-bold">✓ Yes</span>
                            ) : (
                              <span className="text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded border border-red-300 text-xs">
                                ✕ Missing
                              </span>
                            )}
                          </td>
                          <td className="p-3 border-r border-black text-center">
                            {c.httpOnly ? (
                              <span className="text-green-600 font-bold">✓ Yes</span>
                            ) : (
                              <span className="text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded border border-red-300 text-xs">
                                ✕ Missing (XSS Risk)
                              </span>
                            )}
                          </td>
                          <td className="p-3 border-r border-black text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold ${
                                c.sameSite === 'Strict' || c.sameSite === 'Lax'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                              }`}
                            >
                              {c.sameSite}
                            </span>
                          </td>
                          <td className="p-3 text-xs">
                            {c.riskFlags?.length > 0 ? (
                              <div className="space-y-1">
                                {c.riskFlags.map((rf, rIdx) => (
                                  <div key={rIdx} className="text-red-700 font-medium">
                                    • {rf.flag}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-green-700 font-bold">Strictly Isolated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center bg-green-50/50 rounded-xl border border-dashed border-green-400 text-zinc-700 font-medium text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span>No tracking or session cookies were set by the server (Stateless / Safe initial response).</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CORS POLICY AUDIT */}
        {activeTab === 'cors' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black flex items-start gap-3">
              <Info className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-zinc-800">
                <strong className="font-space font-bold">CORS CVE Vulnerability Angle:</strong> Pairing{' '}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">Access-Control-Allow-Origin: *</code> with{' '}
                <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">Access-Control-Allow-Credentials: true</code> allows malicious third-party websites to extract private user session data and API keys.
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border-2 border-black space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-space text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-700" />
                  <span>CORS Header Directives</span>
                </h4>
                {getStatusBadge(corsInfo.status || 'PASS')}
              </div>

              <p className="text-sm text-zinc-700 font-medium">{corsInfo.detail}</p>

              {corsInfo.riskFlags?.length > 0 && (
                <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-900 font-bold font-space text-sm">
                    <ShieldAlert className="w-4 h-4 text-red-600" /> Detected CORS Misconfiguration Risk:
                  </div>
                  {corsInfo.riskFlags.map((risk, idx) => (
                    <div key={idx} className="text-xs font-bold text-red-800 pl-6">
                      • {risk}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 rounded-lg border border-black font-space">
                  <span className="text-xs text-zinc-500 block font-bold">Access-Control-Allow-Origin</span>
                  <span className="font-mono text-sm font-bold text-zinc-900">
                    {corsInfo.allowOrigin || 'Not set (Same-origin default)'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-black font-space">
                  <span className="text-xs text-zinc-500 block font-bold">Access-Control-Allow-Credentials</span>
                  <span className="font-mono text-sm font-bold text-zinc-900">
                    {corsInfo.allowCredentials ? 'true (Credentials Allowed)' : 'false / Unset'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-black font-space">
                  <span className="text-xs text-zinc-500 block font-bold">Access-Control-Allow-Methods</span>
                  <span className="font-mono text-sm font-bold text-zinc-900">
                    {corsInfo.allowMethods || 'Default (GET, POST, HEAD)'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-black font-space">
                  <span className="text-xs text-zinc-500 block font-bold">Access-Control-Allow-Headers</span>
                  <span className="font-mono text-sm font-bold text-zinc-900">
                    {corsInfo.allowHeaders || 'Not specified'}
                  </span>
                </div>
              </div>

              {corsInfo.recommendation && (
                <div className="p-3.5 bg-black text-white rounded-xl text-xs font-medium space-y-1">
                  <strong className="text-yellow-300 font-space uppercase tracking-wider block">Remediation:</strong>
                  <p className="text-zinc-200">{corsInfo.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SENSITIVE FILE EXPOSURE SCANNER */}
        {activeTab === 'files' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black flex items-start gap-3">
              <Info className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-zinc-800">
                <strong className="font-space font-bold">Safe Passive Probing:</strong> Scans for commonly leaked production files (such as database credentials in <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">.env</code>, source code history in <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">.git</code>, and server backups) with signature verification to eliminate false positives.
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border-2 border-black space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-space text-lg flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-purple-700" />
                  <span>Sensitive Public Exposure Scan ({sensitiveFiles.findings?.length || 0} Targets)</span>
                </h4>
                {sensitiveFiles.exposedCount > 0 ? (
                  <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-md text-xs uppercase font-space border border-black animate-pulse">
                    CRITICAL: {sensitiveFiles.exposedCount} Exposed
                  </span>
                ) : (
                  <span className="bg-[#86efac] text-black font-bold px-3 py-1 rounded-md text-xs uppercase font-space border border-black">
                    ✓ All Endpoints Protected (0 Exposed)
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse font-space">
                  <thead>
                    <tr className="bg-zinc-100 border-2 border-black text-xs font-bold uppercase">
                      <th className="p-3 border-r border-black">Target Resource</th>
                      <th className="p-3 border-r border-black">Path</th>
                      <th className="p-3 border-r border-black text-center">Status</th>
                      <th className="p-3 border-r border-black text-center">HTTP Status</th>
                      <th className="p-3">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(sensitiveFiles.findings || []).map((f, idx) => (
                      <tr key={idx} className="border-2 border-black hover:bg-zinc-50">
                        <td className="p-3 border-r border-black font-bold text-xs">{f.name}</td>
                        <td className="p-3 border-r border-black font-mono text-xs text-zinc-700">{f.path}</td>
                        <td className="p-3 border-r border-black text-center">{getStatusBadge(f.status)}</td>
                        <td className="p-3 border-r border-black text-center font-mono text-xs font-bold">
                          {f.httpCode ? `HTTP ${f.httpCode}` : 'N/A'}
                        </td>
                        <td className="p-3 text-xs font-medium text-zinc-700">{f.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUBDOMAIN & DNS SECURITY (SPF/DMARC/CAA) */}
        {activeTab === 'dns' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black flex items-start gap-3">
              <Info className="w-5 h-5 text-zinc-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-zinc-800">
                <strong className="font-space font-bold">Email Spoofing & CA Authority Angle:</strong> Attackers can impersonate company executives and domain emails unless <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">SPF</code> and <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">DMARC</code> policies are published in DNS. <code className="bg-zinc-200 px-1 py-0.5 rounded text-xs font-mono font-bold">CAA</code> records restrict which CAs are authorized to mint SSL certificates for the domain.
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border-2 border-black space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold font-space text-lg flex items-center gap-2">
                  <MailCheck className="w-5 h-5 text-emerald-700" />
                  <span>DNS Email Spoofing & Certificate Authority Audit</span>
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-space text-zinc-500">Spoof Protection:</span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-space border border-black ${
                    dnsInfo.emailProtection?.includes('Strong')
                      ? 'bg-[#86efac] text-black'
                      : dnsInfo.emailProtection?.includes('Moderate')
                      ? 'bg-[#fde047] text-black'
                      : 'bg-[#ff9ebb] text-black'
                  }`}>
                    {dnsInfo.emailProtection || 'Evaluating'}
                  </span>
                </div>
              </div>

              {/* DNS Vector Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {/* SPF */}
                <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-space text-sm">SPF (Sender Policy)</span>
                    {getStatusBadge(dnsInfo.spf?.status || 'PASS')}
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">{dnsInfo.spf?.detail}</p>
                  {dnsInfo.spf?.record && (
                    <div className="p-2 bg-white rounded border border-black font-mono text-[11px] text-zinc-900 break-all">
                      {dnsInfo.spf.record}
                    </div>
                  )}
                </div>

                {/* DMARC */}
                <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-space text-sm">DMARC Policy</span>
                    {getStatusBadge(dnsInfo.dmarc?.status || 'PASS')}
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">{dnsInfo.dmarc?.detail}</p>
                  {dnsInfo.dmarc?.record && (
                    <div className="p-2 bg-white rounded border border-black font-mono text-[11px] text-zinc-900 break-all">
                      {dnsInfo.dmarc.record}
                    </div>
                  )}
                </div>

                {/* CAA */}
                <div className="p-4 bg-zinc-50 rounded-xl border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-space text-sm">CAA (CA Authorization)</span>
                    {getStatusBadge(dnsInfo.caa?.status || 'WARN')}
                  </div>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">{dnsInfo.caa?.detail}</p>
                  {dnsInfo.caa?.records?.length > 0 && (
                    <div className="p-2 bg-white rounded border border-black font-mono text-[11px] text-zinc-900 break-all">
                      {dnsInfo.caa.records.map((r) => r.issue || r.issuewild || (typeof r === 'string' ? r : '')).filter(Boolean).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full-Page PDF Report Modal Viewer */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        report={report}
      />
    </>
  );
}
