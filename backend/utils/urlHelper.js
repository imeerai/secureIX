/**
 * URL and Header Utilities
 */

const { URL } = require('url');

/**
 * Ensures a valid URL with protocol scheme.
 * Throws if invalid or empty.
 */
function normalizeUrl(input) {
  let u = (input || '').trim();
  if (!u) throw new Error('Empty URL');
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return new URL(u); // throws if malformed
}

/**
 * Parses Content-Security-Policy header string into structured object.
 */
function parseCsp(cspHeader) {
  const directives = {};
  if (!cspHeader) return directives;
  cspHeader.split(';').forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    const [name, ...vals] = trimmed.split(/\s+/);
    directives[name.toLowerCase()] = vals;
  });
  return directives;
}

module.exports = {
  normalizeUrl,
  parseCsp,
};
