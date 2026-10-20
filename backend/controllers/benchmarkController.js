/**
 * Benchmark Controller
 * Handles Mozilla Observatory vs SecureIX side-by-side benchmark requests
 */

const { runObservatoryBenchmark } = require('../services/observatoryBenchmarkService');
const { validateTargetUrl } = require('../middleware/abuseProtection');

async function handleBenchmark(req, res, parsedUrl) {
  res.setHeader('Content-Type', 'application/json');
  const target = parsedUrl.searchParams.get('url');

  const validation = validateTargetUrl(target);
  if (!validation.valid) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: true, message: validation.message }));
  }

  try {
    const benchmarkResult = await runObservatoryBenchmark(validation.normalizedUrl);
    res.writeHead(200);
    res.end(JSON.stringify(benchmarkResult));
  } catch (err) {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        error: true,
        message: `Benchmark evaluation failed: ${err.message}`,
      })
    );
  }
}

module.exports = {
  handleBenchmark,
};
