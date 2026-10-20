/**
 * URL Security & Phishing Detection System — Modular Component-Based Backend
 * Zero-dependency Node.js server (built-in http/https/tls only).
 */

const http = require('http');
const { PORT } = require('./config/env');
const { handleRequest } = require('./routes/router');

// Services & Submodules export for testing and extensibility
const { performScan } = require('./services/scanService');
const { runObservatoryBenchmark } = require('./services/observatoryBenchmarkService');
const { fetchWithRedirects, getCertInfo } = require('./services/networkService');
const { analyzeUrlStructure } = require('./services/heuristicService');
const { evaluateChannels, gradeFor, classify } = require('./services/securityEvaluator');
const {
  scanHistory,
  seoHistory,
  domainTrends,
  addScanRecord,
  addSeoRecord,
  getScanHistory,
  getSeoHistory,
  getDomainTrend,
  getAllTrackedDomains,
} = require('./storage/historyStore');
const { checkRateLimit, getRateLimitStatus } = require('./middleware/rateLimiter');
const { isRestrictedHost, validateTargetUrl, applySecurityHeaders } = require('./middleware/abuseProtection');
const { performSeoAudit, detectTechStack } = require('./seo');

function createServer() {
  return http.createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      console.error('Unhandled request error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: 'Internal Server Error' }));
      }
    });
  });
}

function startServer(port = PORT) {
  const appServer = createServer();
  return new Promise((resolve) => {
    appServer.listen(port, () => {
      console.log(`URL Security & Phishing Detection System running at http://localhost:${port}`);
      resolve(appServer);
    });
  });
}

// Auto-start if run directly via `node backend/index.js`
if (require.main === module) {
  startServer();
}

module.exports = {
  createServer,
  startServer,
  performScan,
  runObservatoryBenchmark,
  performSeoAudit,
  detectTechStack,
  fetchWithRedirects,
  getCertInfo,
  analyzeUrlStructure,
  evaluateChannels,
  gradeFor,
  classify,
  scanHistory,
  seoHistory,
  domainTrends,
  addScanRecord,
  addSeoRecord,
  getScanHistory,
  getSeoHistory,
  getDomainTrend,
  getAllTrackedDomains,
  checkRateLimit,
  getRateLimitStatus,
  isRestrictedHost,
  validateTargetUrl,
  applySecurityHeaders,
};
