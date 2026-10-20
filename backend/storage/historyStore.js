/**
 * In-memory scan and SEO history storage with Domain Trend Analytics
 */

const { MAX_HISTORY } = require('../config/env');

const scanHistory = [];
const seoHistory = [];
// Map of domain -> Array of historical data points [{ timestamp, score, grade, classification, latencyMs }]
const domainTrends = new Map();

// Seed initial realistic historical data for popular demo domains
(function seedHistoricalTrends() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;

  const seeds = [
    {
      domain: 'github.com',
      url: 'https://github.com',
      points: [
        { offset: 5 * day, score: 91, grade: 'A', classification: 'Safe', latencyMs: 380 },
        { offset: 3 * day, score: 94, grade: 'A', classification: 'Safe', latencyMs: 340 },
        { offset: 1 * day, score: 96, grade: 'A', classification: 'Safe', latencyMs: 290 },
        { offset: 2 * hour, score: 96, grade: 'A', classification: 'Safe', latencyMs: 280 },
      ],
    },
    {
      domain: 'google.com',
      url: 'https://google.com',
      points: [
        { offset: 4 * day, score: 85, grade: 'B', classification: 'Safe', latencyMs: 210 },
        { offset: 2 * day, score: 88, grade: 'B', classification: 'Safe', latencyMs: 195 },
        { offset: 6 * hour, score: 92, grade: 'A', classification: 'Safe', latencyMs: 175 },
      ],
    },
    {
      domain: 'amazon.com',
      url: 'https://amazon.com',
      points: [
        { offset: 6 * day, score: 72, grade: 'C', classification: 'Suspicious', latencyMs: 460 },
        { offset: 3 * day, score: 78, grade: 'C', classification: 'Safe', latencyMs: 410 },
        { offset: 1 * day, score: 84, grade: 'B', classification: 'Safe', latencyMs: 390 },
      ],
    },
    {
      domain: 'example.com',
      url: 'http://example.com',
      points: [
        { offset: 7 * day, score: 45, grade: 'D', classification: 'Suspicious', latencyMs: 520 },
        { offset: 4 * day, score: 50, grade: 'D', classification: 'Suspicious', latencyMs: 480 },
        { offset: 12 * hour, score: 55, grade: 'D', classification: 'Suspicious', latencyMs: 460 },
      ],
    },
  ];

  seeds.forEach((item) => {
    const list = item.points.map((p) => ({
      timestamp: new Date(now - p.offset).toISOString(),
      score: p.score,
      grade: p.grade,
      classification: p.classification,
      latencyMs: p.latencyMs,
      url: item.url,
      domain: item.domain,
    }));
    domainTrends.set(item.domain, list);

    // Also populate recent scan history
    const latest = list[list.length - 1];
    scanHistory.push({
      timestamp: latest.timestamp,
      requestedUrl: item.url,
      finalUrl: item.url,
      score: latest.score,
      grade: latest.grade,
      classification: latest.classification,
    });
  });
})();

function extractHostname(urlStr) {
  try {
    const target = /^https?:\/\//i.test(urlStr) ? urlStr : `https://${urlStr}`;
    return new URL(target).hostname.replace(/^www\./i, '');
  } catch {
    return (urlStr || '').replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
  }
}

function addScanRecord(record) {
  scanHistory.unshift(record);
  if (scanHistory.length > MAX_HISTORY) {
    scanHistory.length = MAX_HISTORY;
  }

  // Record into domain trends
  const domain = extractHostname(record.finalUrl || record.requestedUrl);
  if (domain) {
    if (!domainTrends.has(domain)) {
      domainTrends.set(domain, []);
    }
    const trendList = domainTrends.get(domain);
    trendList.push({
      timestamp: record.timestamp || new Date().toISOString(),
      score: record.score,
      grade: record.grade,
      classification: record.classification,
      latencyMs: record.latencyMs || 250,
      url: record.finalUrl || record.requestedUrl,
      domain,
    });
    // Keep up to 30 data points per domain
    if (trendList.length > 30) {
      trendList.shift();
    }
  }

  return record;
}

function getScanHistory() {
  return scanHistory;
}

function getDomainTrend(domainOrUrl) {
  if (!domainOrUrl) return [];
  const domain = extractHostname(domainOrUrl);
  
  if (domainTrends.has(domain)) {
    return domainTrends.get(domain);
  }

  // Check case-insensitive / partial match
  for (const [key, val] of domainTrends.entries()) {
    if (key.toLowerCase() === domain.toLowerCase() || key.includes(domain) || domain.includes(key)) {
      return val;
    }
  }

  return [];
}

function getAllTrackedDomains() {
  return Array.from(domainTrends.keys());
}

function addSeoRecord(record) {
  seoHistory.unshift(record);
  if (seoHistory.length > MAX_HISTORY) {
    seoHistory.length = MAX_HISTORY;
  }
  return record;
}

function getSeoHistory() {
  return seoHistory;
}

module.exports = {
  scanHistory,
  seoHistory,
  domainTrends,
  addScanRecord,
  getScanHistory,
  getDomainTrend,
  getAllTrackedDomains,
  addSeoRecord,
  getSeoHistory,
};
