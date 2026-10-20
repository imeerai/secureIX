/**
 * Multi-Resource SEO Web Crawler & Probe Engine
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (SecurIn-SEO-Auditor/1.0)';

/**
 * Fetches text content from a URL with redirection tracking and timeout.
 */
function fetchUrl(urlObj, maxRedirects = 5, chain = [], startTime = Date.now()) {
  return new Promise((resolve, reject) => {
    const lib = urlObj.protocol === 'http:' ? http : https;
    const req = lib.request(
      urlObj,
      {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': DEFAULT_USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        rejectUnauthorized: false,
      },
      (res) => {
        chain.push({ url: urlObj.toString(), status: res.statusCode });

        // Handle Redirects
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && maxRedirects > 0) {
          res.resume();
          let nextUrl;
          try {
            nextUrl = new URL(res.headers.location, urlObj);
          } catch {
            return resolve({
              finalUrl: urlObj.toString(),
              statusCode: res.statusCode,
              headers: res.headers,
              chain,
              body: '',
              elapsedMs: Date.now() - startTime,
            });
          }
          return resolve(fetchUrl(nextUrl, maxRedirects - 1, chain, startTime));
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
          if (data.length > 5 * 1024 * 1024) {
            // Cap at 5MB
            req.destroy();
          }
        });

        res.on('end', () => {
          resolve({
            finalUrl: urlObj.toString(),
            statusCode: res.statusCode,
            headers: res.headers,
            chain,
            body: data,
            elapsedMs: Date.now() - startTime,
          });
        });
      }
    );

    req.on('timeout', () => req.destroy(new Error('Request timed out after 10 seconds')));
    req.on('error', reject);
    req.end();
  });
}

/**
 * Checks a specific resource (e.g. robots.txt or sitemap.xml) status and presence.
 */
async function fetchResource(targetBaseUrl, relativePath) {
  try {
    const resourceUrl = new URL(relativePath, targetBaseUrl);
    const res = await fetchUrl(resourceUrl, 3);
    const exists = res.statusCode >= 200 && res.statusCode < 300 && res.body.trim().length > 0;
    return {
      url: resourceUrl.toString(),
      status: res.statusCode,
      exists,
      content: exists ? res.body.slice(0, 5000) : '',
      sizeBytes: res.body.length,
    };
  } catch {
    return {
      url: new URL(relativePath, targetBaseUrl).toString(),
      status: 0,
      exists: false,
      content: '',
      sizeBytes: 0,
    };
  }
}

/**
 * Probes link status (HEAD/GET) with quick 4s timeout.
 */
function probeLink(linkUrl) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(linkUrl);
      const lib = urlObj.protocol === 'http:' ? http : https;
      const req = lib.request(
        urlObj,
        {
          method: 'HEAD',
          timeout: 4000,
          headers: { 'User-Agent': DEFAULT_USER_AGENT },
          rejectUnauthorized: false,
        },
        (res) => {
          res.resume();
          resolve({ url: linkUrl, status: res.statusCode, ok: res.statusCode < 400 });
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ url: linkUrl, status: 408, ok: false, error: 'Timeout' });
      });
      req.on('error', (err) => {
        resolve({ url: linkUrl, status: 0, ok: false, error: err.message });
      });
      req.end();
    } catch (e) {
      resolve({ url: linkUrl, status: 0, ok: false, error: e.message });
    }
  });
}

/**
 * Samples and probes up to `limit` unique links to find broken links.
 */
async function checkBrokenLinks(links = [], limit = 12) {
  const uniqueUrls = Array.from(new Set(links.map((l) => l.href).filter((u) => /^https?:\/\//i.test(u)))).slice(0, limit);
  const probePromises = uniqueUrls.map((url) => probeLink(url));
  const results = await Promise.all(probePromises);
  return results.filter((r) => !r.ok);
}

module.exports = {
  fetchUrl,
  fetchResource,
  probeLink,
  checkBrokenLinks,
};
