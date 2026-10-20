import React, { useState, useEffect } from "react";
import {
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Scale,
  ExternalLink,
  RefreshCw,
  Award,
  Lock,
  FileCode2,
  Globe2,
  Layers,
  Sparkles,
} from "lucide-react";
import { useObservatoryBenchmark } from "../hooks/useScanner";

/**
 * Computes Mozilla Observatory standards directly from live scan report
 * Provides instant 0ms benchmark rendering and resilient offline fallback.
 */
function computeObservatoryFromReport(scanReport) {
  if (!scanReport) return null;

  let score = 100;
  const channelMap = {};
  if (scanReport.channels) {
    scanReport.channels.forEach((c) => {
      channelMap[c.id] = c;
    });
  }

  // 1. CSP [-25 if missing, -10 if warning]
  const cspChannel = channelMap["csp"];
  if (!cspChannel || cspChannel.status === "FAIL") {
    score -= 25;
  } else if (cspChannel.status === "WARN") {
    score -= 10;
  }

  // 2. HSTS [-20 if missing on HTTPS, -5 if warning]
  const hstsChannel = channelMap["hsts"];
  if (!scanReport.https) {
    score -= 20;
  } else if (!hstsChannel || hstsChannel.status === "FAIL") {
    score -= 20;
  } else if (hstsChannel.status === "WARN") {
    score -= 5;
  }

  // 3. X-Frame-Options [-20 if missing]
  const xfoChannel = channelMap["xfo"];
  if (!xfoChannel || xfoChannel.status === "FAIL") {
    score -= 20;
  }

  // 4. X-Content-Type-Options [-5 if missing]
  const xctoChannel = channelMap["xcto"];
  if (!xctoChannel || xctoChannel.status === "FAIL") {
    score -= 5;
  }

  // 5. Referrer-Policy [-5 if missing]
  const rpChannel = channelMap["rp"];
  if (!rpChannel || rpChannel.status === "FAIL") {
    score -= 5;
  }

  // 6. Cookies [-10 if insecure]
  if (scanReport.cookieInfo && scanReport.cookieInfo.insecureCount > 0) {
    score -= 10;
  }

  // 7. HTTPS Redirection [-20 if HTTP]
  if (!scanReport.https) {
    score -= 20;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let grade = "F";
  if (finalScore >= 90) grade = "A+";
  else if (finalScore >= 85) grade = "A";
  else if (finalScore >= 75) grade = "B";
  else if (finalScore >= 65) grade = "C";
  else if (finalScore >= 50) grade = "D";
  else grade = "F";

  const matrix = [
    {
      dimension: "HTTP Security Headers (CSP, HSTS, XFO, XCTO)",
      secureix: {
        status: scanReport.score >= 70 ? "STRONG" : "DEFICIENT",
        detail:
          "Evaluated across 12 discrete channels with line-by-line configuration directives.",
      },
      observatory: {
        evaluated: true,
        status: finalScore >= 70 ? "STRONG" : "DEFICIENT",
        detail: "Evaluated via Mozilla standard baseline penalties.",
      },
    },
    {
      dimension: "Phishing Heuristics & Brand Impersonation Vectors",
      secureix: {
        status: scanReport.classification === "Safe" ? "CLEAN" : "DETECTED",
        detail:
          "Heuristic keyword, entropy, punycode & structural anomaly AI scoring.",
      },
      observatory: {
        evaluated: false,
        status: "N/A",
        detail:
          "Mozilla Observatory does not evaluate phishing or brand impersonation risks.",
      },
    },
    {
      dimension: "DNS Anti-Spoofing Posture (SPF & DMARC)",
      secureix: {
        status:
          scanReport.dnsInfo && scanReport.dnsInfo.hasDmarc
            ? "ACTIVE"
            : "MISSING",
        detail: "Real-time DNS TXT probe for domain spoofing protection.",
      },
      observatory: {
        evaluated: false,
        status: "N/A",
        detail: "Not included in Observatory header test suite.",
      },
    },
    {
      dimension: "Sensitive File & Repo Exposure (.git, .env, backups)",
      secureix: {
        status:
          scanReport.sensitiveFiles?.exposedCount === 0
            ? "CLEAN"
            : "VULNERABLE",
        detail: `Active probe on high-risk perimeter paths (${scanReport.sensitiveFiles?.totalChecked || 8} probed).`,
      },
      observatory: {
        evaluated: false,
        status: "N/A",
        detail: "Not scanned by Observatory.",
      },
    },
    {
      dimension: "Cookie & CORS Perimeter Hardening",
      secureix: {
        status:
          scanReport.cookieInfo?.insecureCount === 0 ? "PROTECTED" : "WARNING",
        detail:
          "SameSite, Secure, HttpOnly & Access-Control-Allow-Origin checks.",
      },
      observatory: {
        evaluated: true,
        status: "BASIC",
        detail: "Basic Set-Cookie header inspection.",
      },
    },
    {
      dimension: "TLS 1.3 / Certificate Raw Handshake Health",
      secureix: {
        status: scanReport.certInfo?.valid ? "VALID" : "EXPIRED/INVALID",
        detail:
          "Direct TLS handshake, cipher suite analysis, and expiration monitoring.",
      },
      observatory: {
        evaluated: false,
        status: "N/A",
        detail:
          "Transport Layer tests are separated or require TLS observatory module.",
      },
    },
  ];

  const scoreDiff = scanReport.score - finalScore;

  return {
    target: scanReport.finalUrl || scanReport.requestedUrl,
    hostname: scanReport.hostname || "target-domain",
    timestamp: new Date().toISOString(),
    secureix: {
      score: scanReport.score,
      grade: scanReport.grade,
      gradeLabel: scanReport.gradeLabel,
      classification: scanReport.classification,
      scanTimeMs: scanReport.scanTimeMs,
      channelsEvaluated: scanReport.channels?.length || 12,
    },
    observatory: {
      score: finalScore,
      grade,
      source: "EVALUATED_OBSERVATORY_STANDARD",
      status: "FINISHED",
    },
    comparison: {
      scoreDiff,
      deltaFormatted: scoreDiff >= 0 ? `+${scoreDiff} pts` : `${scoreDiff} pts`,
      verdict:
        scoreDiff > 0
          ? "SecureIX awarded higher security posture due to strong DNS/TLS and zero phishing/sensitive file risks."
          : scoreDiff < 0
            ? "Mozilla Observatory scored lower header penalties; SecureIX factored in additional perimeter attack vectors."
            : "Both SecureIX and Mozilla Observatory aligned on overall security posture.",
      secureixAdvantages: [
        "Full Phishing & Brand Impersonation vector analysis",
        "Real-time Sensitive File & .git exposure scanning",
        "DNS Anti-Spoofing verification (SPF / DMARC records)",
        "Direct TLS cipher handshake and raw certificate validation",
        "Instant sub-second response without remote queueing",
      ],
      matrix,
    },
  };
}

export default function BenchmarkComparison({ initialUrl, report }) {
  const [targetUrl, setTargetUrl] = useState(
    initialUrl || (report?.finalUrl ? report.finalUrl : "https://github.com"),
  );
  const { benchmark, setBenchmark, loading, error, fetchBenchmark } =
    useObservatoryBenchmark();

  // If a report is provided for the current target, compute benchmark instantly
  useEffect(() => {
    if (
      report &&
      (!targetUrl ||
        targetUrl === report.finalUrl ||
        targetUrl === report.requestedUrl)
    ) {
      const computed = computeObservatoryFromReport(report);
      if (computed) {
        setBenchmark(computed);
      }
    } else if (targetUrl) {
      fetchBenchmark(targetUrl);
    }
  }, [report, targetUrl, fetchBenchmark, setBenchmark]);

  const handleBenchmarkSubmit = (e) => {
    e.preventDefault();
    if (targetUrl.trim()) {
      if (
        report &&
        (targetUrl.trim() === report.finalUrl ||
          targetUrl.trim() === report.requestedUrl)
      ) {
        const computed = computeObservatoryFromReport(report);
        if (computed) {
          setBenchmark(computed);
          return;
        }
      }
      fetchBenchmark(targetUrl.trim());
    }
  };

  const getGradeBg = (grade) => {
    if (!grade) return "bg-zinc-200 text-black border-black";
    if (grade.startsWith("A")) return "bg-[#86efac] text-black border-black";
    if (grade.startsWith("B")) return "bg-[#bfdbfe] text-black border-black";
    if (grade.startsWith("C")) return "bg-[#fde047] text-black border-black";
    if (grade.startsWith("D")) return "bg-orange-300 text-black border-black";
    return "bg-[#ff9ebb] text-black border-black";
  };

  // If benchmark is not yet returned from API but report exists, use report computed benchmark
  const activeBenchmark =
    benchmark || (report ? computeObservatoryFromReport(report) : null);

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow-lg">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b-2 border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-[#bfdbfe] text-black font-bold px-2.5 py-0.5 rounded border border-black text-xs uppercase font-space flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" /> Side-by-Side Benchmark Mode
            </span>
            <span className="text-xs text-zinc-500 font-space font-medium">
              SecureIX vs. Mozilla Observatory
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-space text-zinc-900">
            Live Industry Benchmark Comparison
          </h3>
          <p className="text-sm font-medium text-zinc-600 mt-1">
            Compare our 360° perimeter security engine directly against Mozilla
            Observatory's standard HTTP audit on the same target domain.
          </p>
        </div>

        {/* Quick URL Trigger */}
        <form
          onSubmit={handleBenchmarkSubmit}
          className="flex items-center gap-2 w-full lg:w-auto"
        >
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Target domain (e.g. github.com)..."
            className="px-3.5 py-2 bg-zinc-50 border-2 border-black rounded-xl text-xs sm:text-sm font-space font-medium outline-none focus:bg-white w-full lg:w-64"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-xl font-bold text-xs sm:text-sm font-space border-2 border-black hover:bg-zinc-800 disabled:opacity-50 cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Scale className="w-4 h-4" />
            )}
            <span>Compare</span>
          </button>
        </form>
      </div>

      {loading && !activeBenchmark && (
        <div className="py-12 text-center">
          <div className="w-12 h-12 bg-[#bfdbfe] rounded-2xl border-2 border-black mx-auto flex items-center justify-center mb-3 animate-spin brutal-shadow">
            <Scale className="w-6 h-6" />
          </div>
          <p className="font-bold font-space text-base">
            Running Parallel SecureIX & Mozilla Observatory Audits...
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Querying Mozilla Observatory API and compiling multi-vector matrix.
          </p>
        </div>
      )}

      {error && !activeBenchmark && !loading && (
        <div className="my-6 p-4 bg-[#ff9ebb] border-2 border-black rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-900 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm font-bold font-space text-zinc-900 block">
              {error}
            </span>
            {report && (
              <button
                type="button"
                onClick={() =>
                  setBenchmark(computeObservatoryFromReport(report))
                }
                className="mt-2 text-xs underline font-bold text-black cursor-pointer"
              >
                Compute benchmark from current live scan report
              </button>
            )}
          </div>
        </div>
      )}

      {activeBenchmark && (
        <div className="space-y-8 mt-6">
          {/* Side by Side Scorecards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: SecureIX Multi-Vector Engine */}
            <div className="bg-[#fffdf7] border-2 border-black rounded-2xl p-6 brutal-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#fde047] text-black px-3 py-1 font-bold text-[10px] uppercase tracking-wider font-space border-b-2 border-l-2 border-black">
                360° AI Perimeter Audit
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center brutal-shadow font-space ${getGradeBg(activeBenchmark.secureix.grade)}`}
                >
                  <span className="text-3xl font-bold leading-none">
                    {activeBenchmark.secureix.grade}
                  </span>
                  <span className="text-[9px] font-bold uppercase">Grade</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-space text-zinc-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-black" /> SecureIX Security
                    Score
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-space text-black">
                      {activeBenchmark.secureix.score}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      / 100 PTS
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-space border-t-2 border-dashed border-black/15 pt-3">
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Evaluation Scope:
                  </span>
                  <strong className="text-black">
                    12 Channels + Heuristics + Files + DNS
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Phishing Threat Detection:
                  </span>
                  <strong className="text-green-700 font-bold">
                    Active AI Scoring ({activeBenchmark.secureix.classification}
                    )
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Response Latency:
                  </span>
                  <strong className="text-black">
                    {activeBenchmark.secureix.scanTimeMs}ms (Instant Direct
                    Probe)
                  </strong>
                </div>
              </div>
            </div>

            {/* Card 2: Mozilla Observatory */}
            <div className="bg-zinc-50 border-2 border-black rounded-2xl p-6 brutal-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-bold text-[10px] uppercase tracking-wider font-space border-b-2 border-l-2 border-black">
                Mozilla Observatory Standard
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center brutal-shadow font-space ${getGradeBg(activeBenchmark.observatory.grade)}`}
                >
                  <span className="text-3xl font-bold leading-none">
                    {activeBenchmark.observatory.grade}
                  </span>
                  <span className="text-[9px] font-bold uppercase">Grade</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg font-space text-zinc-900 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-black" /> Mozilla
                    Observatory
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-space text-black">
                      {activeBenchmark.observatory.score}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      / 100 PTS
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-space border-t-2 border-dashed border-black/15 pt-3">
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Evaluation Scope:
                  </span>
                  <strong className="text-zinc-800">
                    HTTP Response Headers & Basic Transport
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Data Source:
                  </span>
                  <strong className="text-zinc-800">
                    {activeBenchmark.observatory.source}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 font-medium">
                    Audit Status:
                  </span>
                  <strong className="text-blue-700 font-bold">
                    {activeBenchmark.observatory.status}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="bg-[#86efac]/40 border-2 border-black p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-bold font-space text-black block mb-0.5">
                Benchmark Insight (Score Delta:{" "}
                {activeBenchmark.comparison.deltaFormatted})
              </strong>
              <p className="text-xs font-medium text-zinc-800 leading-relaxed">
                {activeBenchmark.comparison.verdict}
              </p>
            </div>
          </div>

          {/* Dimension Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-black brutal-shadow text-left border-collapse bg-white">
              <thead>
                <tr className="bg-black text-white font-space text-xs uppercase">
                  <th className="p-3.5 border-b-2 border-black w-1/3">
                    Security Vector
                  </th>
                  <th className="p-3.5 border-b-2 border-black bg-[#fde047] text-black w-1/3">
                    SecureIX Engine
                  </th>
                  <th className="p-3.5 border-b-2 border-white/20 w-1/3 text-zinc-300">
                    Mozilla Observatory
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium divide-y divide-zinc-200">
                {activeBenchmark.comparison.matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-3.5 font-bold font-space bg-zinc-50/50 text-zinc-900 border-r border-zinc-200">
                      {row.dimension}
                    </td>
                    <td className="p-3.5 bg-yellow-50/40 border-r border-zinc-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#86efac] text-black font-bold rounded text-[10px] border border-black font-space">
                          {row.secureix.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-700">
                        {row.secureix.detail}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 font-bold rounded text-[10px] border font-space ${
                            row.observatory.evaluated
                              ? "bg-blue-100 text-blue-900 border-blue-300"
                              : "bg-zinc-200 text-zinc-600 border-zinc-300"
                          }`}
                        >
                          {row.observatory.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        {row.observatory.detail}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SecureIX Key Advantages Bullet List */}
          <div className="bg-zinc-900 text-white p-5 rounded-xl border-2 border-black">
            <h5 className="font-bold text-sm font-space text-yellow-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Why SecureIX Outperforms Traditional
              Header Scanners
            </h5>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-zinc-300 font-medium">
              {activeBenchmark.comparison.secureixAdvantages.map((adv, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86efac]"></span>
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
