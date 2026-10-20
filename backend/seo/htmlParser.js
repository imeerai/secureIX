/**
 * Zero-Dependency Fast HTML & DOM Metadata Parser for SEO Analysis
 */

function decodeHtmlEntities(text = '') {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function parseAttributes(attrString = '') {
  const attrs = {};
  const regex = /([a-zA-Z0-9_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = regex.exec(attrString)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attrs[key] = decodeHtmlEntities(value);
  }
  return attrs;
}

function parseHtml(html = '', baseUrl = 'https://example.com') {
  const result = {
    title: '',
    metaDescription: '',
    metaKeywords: '',
    metaRobots: '',
    canonicalUrl: '',
    viewport: '',
    charset: '',
    lang: '',
    h1: [],
    h2: [],
    h3: [],
    images: [],
    links: [],
    openGraph: {},
    twitterCard: {},
    jsonLd: [],
    text: '',
    wordCount: 0,
    hasFavicon: false,
    faviconUrl: '',
  };

  if (!html || typeof html !== 'string') return result;

  // 1. HTML lang attribute
  const htmlTagMatch = /<html\s+([^>]*?)>/i.exec(html);
  if (htmlTagMatch) {
    const htmlAttrs = parseAttributes(htmlTagMatch[1]);
    result.lang = htmlAttrs.lang || '';
  }

  // 2. Title Tag
  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (titleMatch) {
    result.title = decodeHtmlEntities(titleMatch[1].replace(/\s+/g, ' '));
  }

  // 3. Meta Tags
  const metaRegex = /<meta\s+([^>]*?)>/gi;
  let metaMatch;
  while ((metaMatch = metaRegex.exec(html)) !== null) {
    const attrs = parseAttributes(metaMatch[1]);
    const name = (attrs.name || attrs.property || attrs['http-equiv'] || '').toLowerCase();
    const content = attrs.content || '';

    if (attrs.charset) {
      result.charset = attrs.charset;
    } else if (name === 'content-type' && content.includes('charset=')) {
      result.charset = content.split('charset=')[1].trim();
    }

    if (name === 'description') result.metaDescription = content;
    if (name === 'keywords') result.metaKeywords = content;
    if (name === 'robots') result.metaRobots = content;
    if (name === 'viewport') result.viewport = content;

    // OpenGraph
    if (name.startsWith('og:')) {
      const key = name.slice(3);
      result.openGraph[key] = content;
    }

    // Twitter Card
    if (name.startsWith('twitter:')) {
      const key = name.slice(8);
      result.twitterCard[key] = content;
    }
  }

  // 4. Link Tags (Canonical, Alternate, Favicon)
  const linkRegex = /<link\s+([^>]*?)>/gi;
  let linkTagMatch;
  while ((linkTagMatch = linkRegex.exec(html)) !== null) {
    const attrs = parseAttributes(linkTagMatch[1]);
    const rel = (attrs.rel || '').toLowerCase();
    const href = attrs.href || '';

    if (rel.includes('canonical')) {
      result.canonicalUrl = href;
    }
    if (rel.includes('icon')) {
      result.hasFavicon = true;
      result.faviconUrl = href;
    }
  }

  // 5. Headings (H1, H2, H3)
  const headingRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(html)) !== null) {
    const level = headingMatch[1].toLowerCase();
    const text = decodeHtmlEntities(headingMatch[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' '));
    if (text) {
      result[level].push(text);
    }
  }

  // 6. Images
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const attrs = parseAttributes(imgMatch[1]);
    const src = attrs.src || attrs['data-src'] || '';
    const alt = attrs.alt;
    result.images.push({
      src,
      alt: alt !== undefined ? alt : null, // null means alt attribute missing entirely
      hasAlt: alt !== undefined && alt.trim().length > 0,
      width: attrs.width || null,
      height: attrs.height || null,
      loading: attrs.loading || 'eager',
    });
  }

  // 7. Links (Internal vs External)
  let baseHostname = '';
  try {
    baseHostname = new URL(baseUrl).hostname.toLowerCase();
  } catch {
    baseHostname = '';
  }

  const aRegex = /<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi;
  let aMatch;
  while ((aMatch = aRegex.exec(html)) !== null) {
    const attrs = parseAttributes(aMatch[1]);
    const href = (attrs.href || '').trim();
    const text = decodeHtmlEntities(aMatch[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' '));
    const rel = (attrs.rel || '').toLowerCase();

    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    let absoluteUrl = href;
    let isInternal = false;
    try {
      const resolved = new URL(href, baseUrl);
      absoluteUrl = resolved.href;
      isInternal = resolved.hostname.toLowerCase() === baseHostname;
    } catch {
      isInternal = !href.startsWith('http');
    }

    result.links.push({
      href: absoluteUrl,
      rawHref: href,
      text: text || '(no anchor text)',
      isInternal,
      isNoFollow: rel.includes('nofollow'),
      rel,
      target: attrs.target || '',
    });
  }

  // 8. JSON-LD Structured Data
  const jsonLdRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(jsonMatch[1].trim());
      result.jsonLd.push(parsed);
    } catch {
      // ignore malformed JSON-LD
    }
  }

  // 9. Plain text & Word count extraction
  // Strip script, style, comments, and HTML tags
  const cleanText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  result.text = cleanText;
  result.wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;

  return result;
}

module.exports = {
  parseHtml,
  decodeHtmlEntities,
};
