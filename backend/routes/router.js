/**
 * HTTP Router & Request Dispatcher with Rate-Limiting & Security Middleware
 */

const { URL } = require('url');
const { handleHealth } = require('../controllers/healthController');
const { handleScan, handleHistory, handleDomainTrend } = require('../controllers/scanController');
const { handleBenchmark } = require('../controllers/benchmarkController');
const { handleTechStack } = require('../controllers/techStackController');
const { handleSeoAnalyze, handleSeoHistory } = require('../controllers/seoController');
const { checkRateLimit, getRateLimitStatus } = require('../middleware/rateLimiter');
const { applySecurityHeaders } = require('../middleware/abuseProtection');
const { serveStatic } = require('../utils/staticServer');

async function handleRequest(req, res) {
  // 1. Apply Defense Security Headers
  applySecurityHeaders(res);

  // 2. CORS Handling
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Health Endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    return handleHealth(req, res);
  }

  // Security Status & Rate Limit Info Endpoint
  if (pathname === '/api/security-status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    const rateStatus = getRateLimitStatus(req, { maxRequests: 20 });
    res.writeHead(200);
    return res.end(
      JSON.stringify({
        status: 'OPERATIONAL',
        shields: {
          rateLimiting: 'ACTIVE (Sliding Window)',
          ssrfProtection: 'ACTIVE (RFC 1918 + Cloud Metadata Blocked)',
          inputSanitization: 'ACTIVE',
          securityHeaders: 'ACTIVE (Strict-Origin, CSP, Nosniff, DENY)',
        },
        clientRateLimit: rateStatus,
      })
    );
  }

  // Security Scanner Endpoint
  if (pathname === '/api/scan' && req.method === 'GET') {
    if (!checkRateLimit(req, res, { maxRequests: 10000, windowMs: 60 * 1000 })) {
      return; // 429 already sent by checkRateLimit
    }
    return handleScan(req, res, parsedUrl);
  }

  // Tech Stack & Hosting Detector Endpoint
  if (pathname === '/api/techstack' && req.method === 'GET') {
    if (!checkRateLimit(req, res, { maxRequests: 10000, windowMs: 60 * 1000 })) {
      return;
    }
    return handleTechStack(req, res, parsedUrl);
  }

  // Side-by-Side Mozilla Observatory Benchmark Endpoint
  if (pathname === '/api/benchmark' && req.method === 'GET') {
    if (!checkRateLimit(req, res, { maxRequests: 10000, windowMs: 60 * 1000 })) {
      return;
    }
    return handleBenchmark(req, res, parsedUrl);
  }

  // Scan History Endpoints
  if (pathname === '/api/history' && req.method === 'GET') {
    return handleHistory(req, res);
  }

  // Historical Domain Trend Graph Endpoint
  if (pathname === '/api/history/trend' && req.method === 'GET') {
    return handleDomainTrend(req, res, parsedUrl);
  }

  // SEO Audit Endpoints
  if (pathname === '/api/seo/analyze' && (req.method === 'POST' || req.method === 'GET')) {
    if (!checkRateLimit(req, res, { maxRequests: 10000, windowMs: 60 * 1000 })) {
      return;
    }
    return handleSeoAnalyze(req, res, parsedUrl);
  }

  if (pathname === '/api/seo/history' && req.method === 'GET') {
    return handleSeoHistory(req, res);
  }

  // Fallback to Static Asset / SPA Serving
  serveStatic(req, res);
}

module.exports = {
  handleRequest,
};
