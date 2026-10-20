/**
 * Main SEO Audit Engine Orchestrator
 * Free, Zero-Dependency, Zero-API-Key SEO & Local Lighthouse Analyzer
 */

const { normalizeUrl } = require('../utils/urlHelper');
const { fetchUrl, fetchResource, checkBrokenLinks } = require('./crawler');
const { parseHtml } = require('./htmlParser');
const { runLighthouseAudit } = require('./lighthouseAuditor');
const { calculateSeoScore } = require('./scoring');
const { detectTechStack } = require('./techStack');

/**
 * Performs a complete SEO & Lighthouse audit for a website URL.
 */
async function performSeoAudit(targetUrl, options = {}) {
  const urlObj = normalizeUrl(targetUrl);
  const startTime = Date.now();

  // 1. Fetch Primary HTML Page
  const crawlResult = await fetchUrl(urlObj, 5);
  if (!crawlResult.body || crawlResult.statusCode >= 400) {
    throw new Error(`Target returned HTTP ${crawlResult.statusCode || 'Connection Failed'}`);
  }

  // 2. Parse HTML & DOM Metadata
  const parsedData = parseHtml(crawlResult.body, crawlResult.finalUrl);

  // 3. Concurrently fetch robots.txt, sitemap.xml and check broken links sample
  const [robotsTxt, sitemapXml, brokenLinks] = await Promise.all([
    fetchResource(crawlResult.finalUrl, '/robots.txt'),
    fetchResource(crawlResult.finalUrl, '/sitemap.xml'),
    checkBrokenLinks(parsedData.links, options.maxLinksToCheck || 10),
  ]);

  // 4. Run Local Google Lighthouse Audit
  const lighthouse = runLighthouseAudit({
    html: crawlResult.body,
    headers: crawlResult.headers,
    elapsedMs: crawlResult.elapsedMs,
    parsedData,
    finalUrl: crawlResult.finalUrl,
  });

  // 5. Calculate Comprehensive SEO Score, Issues & Recommendations
  const scoring = calculateSeoScore({
    parsedData,
    crawlResult,
    robotsTxt,
    sitemapXml,
    brokenLinks,
    lighthouse,
  });

  // 6. Build Rich Previews (SERP, OpenGraph, Twitter)
  const previews = {
    googleSerp: {
      title: parsedData.title || urlObj.hostname,
      url: crawlResult.finalUrl,
      snippet: parsedData.metaDescription || 'No meta description provided for this page.',
    },
    social: {
      ogTitle: parsedData.openGraph.title || parsedData.title,
      ogDescription: parsedData.openGraph.description || parsedData.metaDescription,
      ogImage: parsedData.openGraph.image || null,
      ogSiteName: parsedData.openGraph.site_name || urlObj.hostname,
      twitterCard: parsedData.twitterCard.card || 'summary',
      twitterTitle: parsedData.twitterCard.title || parsedData.title,
      twitterDescription: parsedData.twitterCard.description || parsedData.metaDescription,
      twitterImage: parsedData.twitterCard.image || parsedData.openGraph.image || null,
    },
  };

  const report = {
    url: targetUrl,
    finalUrl: crawlResult.finalUrl,
    httpStatus: crawlResult.statusCode,
    redirects: crawlResult.chain.length > 1 ? crawlResult.chain.length - 1 : 0,
    redirectChain: crawlResult.chain,
    elapsedMs: crawlResult.elapsedMs,
    timestamp: new Date().toISOString(),

    // Scoring & Overview
    score: scoring.score,
    grade: scoring.grade,
    gradeLabel: scoring.gradeLabel,
    summary: scoring.summary,
    categories: scoring.categories,
    checks: scoring.checks,
    recommendations: scoring.recommendations,

    // Lighthouse Engine
    lighthouse: {
      scores: lighthouse.scores,
      coreWebVitals: lighthouse.coreWebVitals,
      metrics: lighthouse.metrics,
    },

    // Detailed Inspectable Content
    previews,
    metadata: {
      title: parsedData.title,
      metaDescription: parsedData.metaDescription,
      metaKeywords: parsedData.metaKeywords,
      canonicalUrl: parsedData.canonicalUrl,
      metaRobots: parsedData.metaRobots,
      viewport: parsedData.viewport,
      charset: parsedData.charset,
      lang: parsedData.lang,
      wordCount: parsedData.wordCount,
      hasFavicon: parsedData.hasFavicon,
      faviconUrl: parsedData.faviconUrl,
    },
    headings: {
      h1: parsedData.h1,
      h2: parsedData.h2,
      h3: parsedData.h3,
    },
    images: {
      total: parsedData.images.length,
      missingAltCount: parsedData.images.filter((i) => !i.hasAlt).length,
      items: parsedData.images.slice(0, 30),
    },
    links: {
      total: parsedData.links.length,
      internalCount: parsedData.links.filter((l) => l.isInternal).length,
      externalCount: parsedData.links.filter((l) => !l.isInternal).length,
      brokenCount: brokenLinks.length,
      brokenLinks,
      sample: parsedData.links.slice(0, 30),
    },
    resources: {
      robotsTxt: {
        exists: robotsTxt.exists,
        status: robotsTxt.status,
        url: robotsTxt.url,
        contentSample: robotsTxt.content.slice(0, 600),
      },
      sitemapXml: {
        exists: sitemapXml.exists,
        status: sitemapXml.status,
        url: sitemapXml.url,
        contentSample: sitemapXml.content.slice(0, 600),
      },
    },
    structuredData: {
      jsonLdCount: parsedData.jsonLd.length,
      items: parsedData.jsonLd,
    },
  };

  return report;
}

module.exports = {
  performSeoAudit,
  detectTechStack,
};
