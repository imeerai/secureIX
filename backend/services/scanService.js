/**
 * Core Security Scan Orchestrator Service
 */

const { normalizeUrl } = require('../utils/urlHelper');
const { fetchWithRedirects, getCertInfo } = require('./networkService');
const { analyzeUrlStructure } = require('./heuristicService');
const { analyzeDnsSecurity } = require('./dnsSecurityService');
const { scanSensitiveFiles } = require('./sensitiveFileService');
const { analyzeCookies, analyzeCors } = require('./cookieCorsService');
const { evaluateChannels, gradeFor, classify } = require('./securityEvaluator');
const { addScanRecord } = require('../storage/historyStore');

/**
 * Executes a full multi-vector security scan on a target URL.
 */
async function performScan(rawInput) {
  const startedAt = Date.now();
  const urlObj = normalizeUrl(rawInput);

  // 1. Fetch live headers + redirects
  const scanResult = await fetchWithRedirects(urlObj, 5, [], startedAt);
  const finalHost = scanResult.finalUrl.hostname;

  // 2. Parallel Deep Probes (TLS, DNS, Sensitive Files)
  const [certInfo, dnsInfo, sensitiveFiles] = await Promise.all([
    scanResult.finalUrl.protocol === 'https:' ? getCertInfo(finalHost) : Promise.resolve(null),
    analyzeDnsSecurity(finalHost).catch(() => null),
    scanSensitiveFiles(scanResult.finalUrl).catch(() => ({ totalChecked: 0, exposedCount: 0, findings: [] })),
  ]);

  // 3. Inspect Cookies, CORS, and URL Heuristics
  const cookieInfo = analyzeCookies(scanResult.headers || {});
  const corsInfo = analyzeCors(scanResult.headers || {});
  const urlStructure = analyzeUrlStructure(scanResult.finalUrl, rawInput);

  // 4. Compute Channel Scores & Final Posture
  const channels = evaluateChannels({
    scanResult,
    certInfo,
    urlStructure,
    cookieInfo,
    corsInfo,
    dnsInfo,
  });

  const rawScore = channels.reduce((sum, c) => sum + c.earned, 0);
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const { grade, label } = gradeFor(score);
  const classification = classify(score, urlStructure.score);

  const report = {
    requestedUrl: rawInput,
    finalUrl: scanResult.finalUrl.toString(),
    hostname: finalHost,
    httpStatus: scanResult.status,
    https: scanResult.finalUrl.protocol === 'https:',
    redirects: scanResult.chain.length > 1 ? scanResult.chain.length - 1 : 0,
    redirectChain: scanResult.chain,
    scanTimeMs: Date.now() - startedAt,
    score,
    grade,
    gradeLabel: label,
    classification,
    channels,
    cookieInfo,
    corsInfo,
    dnsInfo,
    sensitiveFiles,
    certInfo,
    timestamp: new Date().toISOString(),
  };

  // Add to in-memory history
  addScanRecord({
    timestamp: report.timestamp,
    requestedUrl: report.requestedUrl,
    finalUrl: report.finalUrl,
    score: report.score,
    grade: report.grade,
    classification: report.classification,
  });

  return report;
}

module.exports = {
  performScan,
};
