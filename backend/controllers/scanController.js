/**
 * Security Scanner Controller with Abuse Protection & Historical Trend Support
 */

const { performScan } = require('../services/scanService');
const { getScanHistory, getDomainTrend, getAllTrackedDomains } = require('../storage/historyStore');
const { validateTargetUrl } = require('../middleware/abuseProtection');

async function handleScan(req, res, parsedUrl) {
  res.setHeader('Content-Type', 'application/json');
  const rawTarget = parsedUrl.searchParams.get('url');

  const validation = validateTargetUrl(rawTarget);
  if (!validation.valid) {
    res.writeHead(400);
    return res.end(
      JSON.stringify({
        error: true,
        isBlocked: true,
        message: validation.message,
      })
    );
  }

  try {
    const report = await performScan(validation.normalizedUrl);
    res.writeHead(200);
    res.end(JSON.stringify(report));
  } catch (err) {
    // 200 response with error details allows frontend to gracefully render scanner error states
    res.writeHead(200);
    res.end(
      JSON.stringify({
        error: true,
        message: `Could not reach or analyze this URL: ${err.message}`,
      })
    );
  }
}

function handleHistory(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(getScanHistory()));
}

function handleDomainTrend(req, res, parsedUrl) {
  res.setHeader('Content-Type', 'application/json');
  const domain = parsedUrl.searchParams.get('domain') || parsedUrl.searchParams.get('url');

  if (!domain) {
    const tracked = getAllTrackedDomains();
    return res.end(
      JSON.stringify({
        trackedDomains: tracked,
        trend: tracked.length > 0 ? getDomainTrend(tracked[0]) : [],
      })
    );
  }

  const trend = getDomainTrend(domain);
  const tracked = getAllTrackedDomains();

  res.writeHead(200);
  res.end(
    JSON.stringify({
      domain,
      trend,
      trackedDomains: tracked,
      summary: {
        totalAudits: trend.length,
        latestScore: trend.length > 0 ? trend[trend.length - 1].score : null,
        bestScore: trend.length > 0 ? Math.max(...trend.map((t) => t.score)) : null,
        lowestScore: trend.length > 0 ? Math.min(...trend.map((t) => t.score)) : null,
      },
    })
  );
}

module.exports = {
  handleScan,
  handleHistory,
  handleDomainTrend,
};
