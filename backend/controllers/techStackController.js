/**
 * Technology Stack & Hosting Detector Controller
 */

const { detectTechStack } = require('../seo/techStack');

async function handleTechStack(req, res, parsedUrl) {
  res.setHeader('Content-Type', 'application/json');
  const target = parsedUrl.searchParams.get('url');

  if (!target) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: true, message: 'Missing "url" query parameter.' }));
  }

  try {
    const report = await detectTechStack(target);
    res.writeHead(200);
    res.end(JSON.stringify(report));
  } catch (err) {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        error: true,
        message: `Tech stack detection failed: ${err.message}`,
      })
    );
  }
}

module.exports = {
  handleTechStack,
};
