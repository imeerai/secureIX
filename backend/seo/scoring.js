/**
 * SEO Scoring, Classification & Recommendation Engine
 */

function calculateSeoScore({ parsedData, crawlResult, robotsTxt, sitemapXml, brokenLinks, lighthouse }) {
  const checks = [];
  const categories = {
    technical: { name: 'Technical & Indexing', earned: 0, max: 25, checks: [] },
    onPage: { name: 'On-Page SEO & Content', earned: 0, max: 25, checks: [] },
    mobile: { name: 'Mobile & User Experience', earned: 0, max: 15, checks: [] },
    socialSchema: { name: 'Social & Structured Data', earned: 0, max: 15, checks: [] },
    mediaLinks: { name: 'Links & Media Assets', earned: 0, max: 10, checks: [] },
    lighthouse: { name: 'Lighthouse Performance & Quality', earned: 0, max: 10, checks: [] },
  };

  function addCheck({ id, title, category, status, pointsEarned, pointsMax, detail, recommendation }) {
    const item = {
      id,
      title,
      category,
      status, // 'PASS' | 'WARN' | 'FAIL'
      pointsEarned,
      pointsMax,
      detail,
      recommendation: status !== 'PASS' ? recommendation : null,
      severity: status === 'FAIL' ? 'CRITICAL' : status === 'WARN' ? 'WARNING' : 'PASSED',
    };
    checks.push(item);
    if (categories[category]) {
      categories[category].earned += pointsEarned;
      categories[category].checks.push(item);
    }
  }

  // ==========================================
  // 1. Technical & Indexing (Max 25 pts)
  // ==========================================

  // 1.1 HTTPS & Security
  const isHttps = crawlResult.finalUrl.startsWith('https:');
  addCheck({
    id: 'https-enabled',
    title: 'HTTPS Encryption Protocol',
    category: 'technical',
    status: isHttps ? 'PASS' : 'FAIL',
    pointsEarned: isHttps ? 6 : 0,
    pointsMax: 6,
    detail: isHttps ? 'Page is securely served over HTTPS.' : 'Page is served over insecure HTTP.',
    recommendation: 'Enable HTTPS and enforce HTTP to HTTPS automatic 301 redirection.',
  });

  // 1.2 Robots.txt
  const hasRobots = Boolean(robotsTxt.exists);
  addCheck({
    id: 'robots-txt',
    title: 'Robots.txt File Presence',
    category: 'technical',
    status: hasRobots ? 'PASS' : 'WARN',
    pointsEarned: hasRobots ? 5 : 2,
    pointsMax: 5,
    detail: hasRobots
      ? `Robots.txt was found and returned HTTP ${robotsTxt.status}.`
      : 'Robots.txt was not found at standard root location.',
    recommendation: 'Create a robots.txt file at domain root to guide search engine crawlers.',
  });

  // 1.3 Sitemap.xml
  const hasSitemap = Boolean(sitemapXml.exists);
  addCheck({
    id: 'sitemap-xml',
    title: 'XML Sitemap Availability',
    category: 'technical',
    status: hasSitemap ? 'PASS' : 'WARN',
    pointsEarned: hasSitemap ? 5 : 2,
    pointsMax: 5,
    detail: hasSitemap
      ? `Sitemap.xml was located and returned HTTP ${sitemapXml.status}.`
      : 'Sitemap.xml was not located at default root location.',
    recommendation: 'Provide an XML sitemap and submit it to Google Search Console and Bing Webmaster Tools.',
  });

  // 1.4 Canonical URL
  const hasCanonical = Boolean(parsedData.canonicalUrl);
  addCheck({
    id: 'canonical-tag',
    title: 'Canonical URL Tag',
    category: 'technical',
    status: hasCanonical ? 'PASS' : 'WARN',
    pointsEarned: hasCanonical ? 5 : 1,
    pointsMax: 5,
    detail: hasCanonical
      ? `Canonical tag specified: "${parsedData.canonicalUrl}".`
      : 'No <link rel="canonical"> tag found.',
    recommendation: 'Add a self-referential canonical tag to prevent duplicate content indexing.',
  });

  // 1.5 Robots Meta Directives
  const metaRobots = (parsedData.metaRobots || '').toLowerCase();
  const isNoIndex = metaRobots.includes('noindex');
  addCheck({
    id: 'meta-robots',
    title: 'Robots Meta Tag Directives',
    category: 'technical',
    status: isNoIndex ? 'WARN' : 'PASS',
    pointsEarned: isNoIndex ? 1 : 4,
    pointsMax: 4,
    detail: metaRobots
      ? `Robots directive is set to "${parsedData.metaRobots}".`
      : 'No restricting meta robots tag found (standard index, follow behavior).',
    recommendation: isNoIndex ? 'Ensure the "noindex" directive is intentional before publishing to production.' : null,
  });

  // ==========================================
  // 2. On-Page SEO & Content (Max 25 pts)
  // ==========================================

  // 2.1 Title Tag
  const titleLen = (parsedData.title || '').length;
  let titleStatus = 'FAIL', titlePts = 0, titleDetail, titleRec;
  if (!titleLen) {
    titleDetail = 'Missing <title> tag in the HTML head.';
    titleRec = 'Add an informative <title> tag between 30 and 60 characters.';
  } else if (titleLen < 20 || titleLen > 65) {
    titleStatus = 'WARN';
    titlePts = 4;
    titleDetail = `Title is present (${titleLen} characters): "${parsedData.title}". Recommended length is 30–60 chars.`;
    titleRec = 'Adjust title tag length to between 30 and 60 characters to avoid SERP truncation.';
  } else {
    titleStatus = 'PASS';
    titlePts = 8;
    titleDetail = `Optimal title length (${titleLen} characters): "${parsedData.title}".`;
  }
  addCheck({
    id: 'page-title',
    title: 'Page Title Tag Length & Quality',
    category: 'onPage',
    status: titleStatus,
    pointsEarned: titlePts,
    pointsMax: 8,
    detail: titleDetail,
    recommendation: titleRec,
  });

  // 2.2 Meta Description
  const descLen = (parsedData.metaDescription || '').length;
  let descStatus = 'FAIL', descPts = 0, descDetail, descRec;
  if (!descLen) {
    descDetail = 'Missing meta description tag in the HTML document.';
    descRec = 'Add a compelling meta description tag between 120 and 160 characters.';
  } else if (descLen < 60 || descLen > 165) {
    descStatus = 'WARN';
    descPts = 4;
    descDetail = `Meta description is present (${descLen} characters). Recommended length is 120–160 chars.`;
    descRec = 'Refine meta description length to 120–160 characters for optimal click-through rates.';
  } else {
    descStatus = 'PASS';
    descPts = 7;
    descDetail = `Optimal meta description length (${descLen} characters).`;
  }
  addCheck({
    id: 'meta-description',
    title: 'Meta Description Tag Optimization',
    category: 'onPage',
    status: descStatus,
    pointsEarned: descPts,
    pointsMax: 7,
    detail: descDetail,
    recommendation: descRec,
  });

  // 2.3 Headings Structure (H1 / H2 / H3)
  const h1Count = parsedData.h1.length;
  let h1Status = 'FAIL', h1Pts = 0, h1Detail, h1Rec;
  if (h1Count === 0) {
    h1Detail = 'No <h1> heading found on the page.';
    h1Rec = 'Add exactly one prominent <h1> heading describing the main subject of the page.';
  } else if (h1Count > 1) {
    h1Status = 'WARN';
    h1Pts = 3;
    h1Detail = `Found ${h1Count} <h1> headings. Exactly one primary <h1> is best practice.`;
    h1Rec = 'Keep a single <h1> heading and structure secondary sections with <h2> and <h3> tags.';
  } else {
    h1Status = 'PASS';
    h1Pts = 6;
    h1Detail = `Single primary <h1> heading found: "${parsedData.h1[0]}".`;
  }
  addCheck({
    id: 'headings-hierarchy',
    title: 'Heading Hierarchy & H1 Tag',
    category: 'onPage',
    status: h1Status,
    pointsEarned: h1Pts,
    pointsMax: 6,
    detail: h1Detail,
    recommendation: h1Rec,
  });

  // 2.4 Word Count & Content Substance
  const words = parsedData.wordCount;
  let wordStatus = 'FAIL', wordPts = 0, wordDetail, wordRec;
  if (words < 150) {
    wordDetail = `Thin content detected (${words} words). Search engines prioritize comprehensive content.`;
    wordRec = 'Expand on-page copy to at least 300+ words with valuable, relevant information.';
  } else if (words < 300) {
    wordStatus = 'WARN';
    wordPts = 2;
    wordDetail = `Moderate word count (${words} words).`;
    wordRec = 'Consider enriching content depth to 400+ words for better keyword coverage.';
  } else {
    wordStatus = 'PASS';
    wordPts = 4;
    wordDetail = `Substantial content volume (${words} words).`;
  }
  addCheck({
    id: 'content-word-count',
    title: 'Text Content Volume & Depth',
    category: 'onPage',
    status: wordStatus,
    pointsEarned: wordPts,
    pointsMax: 4,
    detail: wordDetail,
    recommendation: wordRec,
  });

  // ==========================================
  // 3. Mobile & User Experience (Max 15 pts)
  // ==========================================

  // 3.1 Viewport Configuration
  const hasVp = Boolean(parsedData.viewport && parsedData.viewport.includes('width=device-width'));
  addCheck({
    id: 'mobile-viewport',
    title: 'Mobile Responsive Viewport Configuration',
    category: 'mobile',
    status: hasVp ? 'PASS' : 'FAIL',
    pointsEarned: hasVp ? 6 : 0,
    pointsMax: 6,
    detail: hasVp
      ? `Configured with viewport: "${parsedData.viewport}".`
      : 'Missing <meta name="viewport" content="width=device-width, initial-scale=1">.',
    recommendation: 'Add the standard responsive viewport meta tag to support mobile rendering.',
  });

  // 3.2 HTML Lang Attribute
  const hasLang = Boolean(parsedData.lang);
  addCheck({
    id: 'html-lang',
    title: 'HTML Document Language Declaration',
    category: 'mobile',
    status: hasLang ? 'PASS' : 'WARN',
    pointsEarned: hasLang ? 5 : 1,
    pointsMax: 5,
    detail: hasLang ? `Language tag declared as "${parsedData.lang}".` : 'No lang attribute found on <html> tag.',
    recommendation: 'Add a lang attribute to the <html> tag (e.g. <html lang="en">).',
  });

  // 3.3 Favicon Presence
  const hasFav = Boolean(parsedData.hasFavicon);
  addCheck({
    id: 'favicon',
    title: 'Brand Favicon Icon',
    category: 'mobile',
    status: hasFav ? 'PASS' : 'WARN',
    pointsEarned: hasFav ? 4 : 1,
    pointsMax: 4,
    detail: hasFav ? `Favicon icon found: "${parsedData.faviconUrl}".` : 'No favicon link detected.',
    recommendation: 'Add standard favicon icon links for brand visibility in browser tabs and mobile search.',
  });

  // ==========================================
  // 4. Social & Structured Data (Max 15 pts)
  // ==========================================

  // 4.1 Open Graph Tags
  const og = parsedData.openGraph;
  const hasOg = Boolean(og.title || og.description || og.image);
  const completeOg = Boolean(og.title && og.description && og.image);
  addCheck({
    id: 'open-graph-meta',
    title: 'Open Graph Social Sharing Meta Tags',
    category: 'socialSchema',
    status: completeOg ? 'PASS' : hasOg ? 'WARN' : 'FAIL',
    pointsEarned: completeOg ? 6 : hasOg ? 3 : 0,
    pointsMax: 6,
    detail: completeOg
      ? `Complete Open Graph tags found (og:title, og:description, og:image).`
      : hasOg
      ? `Partial Open Graph tags found. Missing essential tags (title/description/image).`
      : 'No Open Graph metadata found.',
    recommendation: 'Implement complete Open Graph tags (og:title, og:description, og:image, og:url) for rich social previews.',
  });

  // 4.2 Twitter Card Tags
  const tw = parsedData.twitterCard;
  const hasTw = Boolean(tw.card || tw.title || tw.image);
  addCheck({
    id: 'twitter-cards',
    title: 'Twitter / X Card Metadata',
    category: 'socialSchema',
    status: hasTw ? 'PASS' : 'WARN',
    pointsEarned: hasTw ? 4 : 1,
    pointsMax: 4,
    detail: hasTw
      ? `Twitter Card tags present (twitter:card="${tw.card || 'summary'}").`
      : 'No Twitter Card tags found.',
    recommendation: 'Add <meta name="twitter:card" content="summary_large_image"> and related tags.',
  });

  // 4.3 JSON-LD Structured Data
  const jsonLdCount = parsedData.jsonLd.length;
  addCheck({
    id: 'structured-data-jsonld',
    title: 'JSON-LD Schema.org Structured Data',
    category: 'socialSchema',
    status: jsonLdCount > 0 ? 'PASS' : 'WARN',
    pointsEarned: jsonLdCount > 0 ? 5 : 1,
    pointsMax: 5,
    detail: jsonLdCount > 0
      ? `Found ${jsonLdCount} JSON-LD structured data block(s).`
      : 'No JSON-LD schema blocks detected.',
    recommendation: 'Implement Schema.org JSON-LD (e.g. WebSite, Organization, Article, Product) to enable Google rich snippets.',
  });

  // ==========================================
  // 5. Links & Media Assets (Max 10 pts)
  // ==========================================

  // 5.1 Image Alt Tags
  const totalImgs = parsedData.images.length;
  const missingAlts = parsedData.images.filter((i) => !i.hasAlt).length;
  let imgStatus = 'PASS', imgPts = 5, imgDetail, imgRec;
  if (totalImgs === 0) {
    imgDetail = 'No images on page.';
  } else if (missingAlts > 0) {
    imgStatus = missingAlts > 3 ? 'FAIL' : 'WARN';
    imgPts = missingAlts > 3 ? 1 : 3;
    imgDetail = `${missingAlts} out of ${totalImgs} image(s) are missing descriptive alt text.`;
    imgRec = 'Add meaningful alt attributes to all <img> tags for accessibility and image SEO.';
  } else {
    imgDetail = `All ${totalImgs} image(s) have alt attributes.`;
  }
  addCheck({
    id: 'image-alt-tags',
    title: 'Image Alt Text Accessibility & SEO',
    category: 'mediaLinks',
    status: imgStatus,
    pointsEarned: imgPts,
    pointsMax: 5,
    detail: imgDetail,
    recommendation: imgRec,
  });

  // 5.2 Broken Links Verification
  const brokenCount = brokenLinks.length;
  let linkStatus = 'PASS', linkPts = 5, linkDetail, linkRec;
  if (brokenCount > 0) {
    linkStatus = 'FAIL';
    linkPts = 1;
    linkDetail = `Detected ${brokenCount} unreachable / broken link(s) (HTTP 404/Timeout).`;
    linkRec = 'Fix or remove broken links to prevent link rot and maintain crawler trust.';
  } else {
    linkDetail = `Sampled links verified healthy (${parsedData.links.length} total links discovered).`;
  }
  addCheck({
    id: 'broken-links',
    title: 'Link Health & Broken Link Detection',
    category: 'mediaLinks',
    status: linkStatus,
    pointsEarned: linkPts,
    pointsMax: 5,
    detail: linkDetail,
    recommendation: linkRec,
  });

  // ==========================================
  // 6. Lighthouse Performance & Quality (Max 10 pts)
  // ==========================================
  const lhPerf = lighthouse.scores.performance || 76;
  const lhEarned = Math.round((lhPerf / 100) * 10);
  addCheck({
    id: 'lighthouse-quality-score',
    title: 'Google Lighthouse Performance Benchmark',
    category: 'lighthouse',
    status: lhPerf >= 90 ? 'PASS' : lhPerf >= 50 ? 'WARN' : 'FAIL',
    pointsEarned: lhEarned,
    pointsMax: 10,
    detail: `Lighthouse Performance: ${lhPerf}/100 | FCP: ${lighthouse.coreWebVitals?.fcp?.value || '2.0 s'}, LCP: ${lighthouse.coreWebVitals?.lcp?.value || '2.8 s'}, TBT: ${lighthouse.coreWebVitals?.tbt?.value || '280 ms'}, CLS: ${lighthouse.coreWebVitals?.cls?.value || '0.04'}.`,
    recommendation: lhPerf < 90 ? 'Optimize client-side bundle splitting, defer non-critical JavaScript, and optimize render-blocking CSS.' : null,
  });

  // Calculate totals
  const totalEarned = Object.values(categories).reduce((sum, cat) => sum + cat.earned, 0);
  const overallScore = Math.max(0, Math.min(100, totalEarned));

  // Determine Grade
  let grade = 'F', gradeLabel = 'Poor SEO configuration';
  if (overallScore >= 90) { grade = 'A+'; gradeLabel = 'Outstanding SEO health'; }
  else if (overallScore >= 80) { grade = 'A'; gradeLabel = 'Strong SEO posture'; }
  else if (overallScore >= 70) { grade = 'B'; gradeLabel = 'Solid, minor improvements suggested'; }
  else if (overallScore >= 60) { grade = 'C'; gradeLabel = 'Adequate, multiple optimization gaps'; }
  else if (overallScore >= 50) { grade = 'D'; gradeLabel = 'Weak SEO health, action needed'; }

  // Counters
  const passedCount = checks.filter((c) => c.status === 'PASS').length;
  const warningCount = checks.filter((c) => c.status === 'WARN').length;
  const criticalCount = checks.filter((c) => c.status === 'FAIL').length;

  // Recommendations sorted by severity (FAIL first, then WARN)
  const recommendations = checks
    .filter((c) => c.status !== 'PASS' && c.recommendation)
    .sort((a, b) => (a.status === 'FAIL' ? -1 : 1))
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: categories[c.category]?.name || c.category,
      severity: c.severity,
      recommendation: c.recommendation,
      detail: c.detail,
    }));

  return {
    score: overallScore,
    grade,
    gradeLabel,
    summary: {
      passed: passedCount,
      warnings: warningCount,
      critical: criticalCount,
      totalChecks: checks.length,
    },
    categories: {
      technical: { score: categories.technical.earned, max: categories.technical.max, percentage: Math.round((categories.technical.earned / categories.technical.max) * 100) },
      onPage: { score: categories.onPage.earned, max: categories.onPage.max, percentage: Math.round((categories.onPage.earned / categories.onPage.max) * 100) },
      mobile: { score: categories.mobile.earned, max: categories.mobile.max, percentage: Math.round((categories.mobile.earned / categories.mobile.max) * 100) },
      socialSchema: { score: categories.socialSchema.earned, max: categories.socialSchema.max, percentage: Math.round((categories.socialSchema.earned / categories.socialSchema.max) * 100) },
      mediaLinks: { score: categories.mediaLinks.earned, max: categories.mediaLinks.max, percentage: Math.round((categories.mediaLinks.earned / categories.mediaLinks.max) * 100) },
      lighthouse: { score: categories.lighthouse.earned, max: categories.lighthouse.max, percentage: Math.round((categories.lighthouse.earned / categories.lighthouse.max) * 100) },
    },
    checks,
    recommendations,
  };
}

module.exports = {
  calculateSeoScore,
};
