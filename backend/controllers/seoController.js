/**
 * SEO Audit Controller
 */

const { performSeoAudit } = require('../seo');
const { addSeoRecord, getSeoHistory } = require('../storage/historyStore');
const { parseRequestBody } = require('../utils/bodyParser');

async function handleSeoAnalyze(req, res, parsedUrl) {
  res.setHeader('Content-Type', 'application/json');

  let targetUrl = '';
  if (req.method === 'POST') {
    const body = await parseRequestBody(req);
    targetUrl = body.url;
  } else {
    targetUrl = parsedUrl.searchParams.get('url');
  }

  if (!targetUrl || !targetUrl.trim()) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: true, message: 'Missing target "url" parameter.' }));
  }

  try {
    const report = await performSeoAudit(targetUrl.trim());

    // Record summary in history store
    addSeoRecord({
      timestamp: report.timestamp,
      url: report.url,
      finalUrl: report.finalUrl,
      score: report.score,
      grade: report.grade,
      gradeLabel: report.gradeLabel,
      summary: report.summary,
      lighthouse: report.lighthouse.scores,
    });

    res.writeHead(200);
    res.end(JSON.stringify(report));
  } catch (err) {
    // 200 response with error details allows frontend to gracefully render audit error states
    res.writeHead(200);
    res.end(
      JSON.stringify({
        error: true,
        message: `Could not complete SEO audit: ${err.message}`,
      })
    );
  }
}

function handleSeoHistory(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(getSeoHistory()));
}

module.exports = {
  handleSeoAnalyze,
  handleSeoHistory,
};
