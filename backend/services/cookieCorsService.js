/**
 * Cookie Security & CORS Misconfiguration Inspector
 */

/**
 * Parses a single Set-Cookie header string into a structured object.
 */
function parseCookieHeader(rawCookie) {
  const parts = rawCookie.split(';').map((p) => p.trim());
  const [nameVal, ...attrList] = parts;
  const equalsIdx = nameVal.indexOf('=');
  const name = equalsIdx > -1 ? nameVal.slice(0, equalsIdx) : nameVal;
  const value = equalsIdx > -1 ? nameVal.slice(equalsIdx + 1) : '';

  const cookie = {
    name,
    value: value.length > 20 ? `${value.slice(0, 20)}…` : value,
    secure: false,
    httpOnly: false,
    sameSite: 'None (Unset)',
    domain: null,
    path: null,
    maxAge: null,
    expires: null,
    riskFlags: [],
  };

  for (const attr of attrList) {
    const [rawK, rawV] = attr.split('=');
    const k = rawK.trim().toLowerCase();
    const v = rawV ? rawV.trim() : true;

    if (k === 'secure') cookie.secure = true;
    else if (k === 'httponly') cookie.httpOnly = true;
    else if (k === 'samesite') {
      const s = String(v).toLowerCase();
      if (s === 'strict') cookie.sameSite = 'Strict';
      else if (s === 'lax') cookie.sameSite = 'Lax';
      else if (s === 'none') cookie.sameSite = 'None';
      else cookie.sameSite = String(v);
    } else if (k === 'domain') cookie.domain = String(v);
    else if (k === 'path') cookie.path = String(v);
    else if (k === 'max-age') cookie.maxAge = parseInt(String(v), 10);
    else if (k === 'expires') cookie.expires = String(v);
  }

  // Risk Flagging
  if (!cookie.secure) {
    cookie.riskFlags.push({
      flag: 'Missing Secure Flag',
      severity: 'HIGH',
      description: 'Cookie can be transmitted in cleartext over unencrypted HTTP.',
    });
  }
  if (!cookie.httpOnly) {
    cookie.riskFlags.push({
      flag: 'Missing HttpOnly Flag',
      severity: 'HIGH',
      description: 'Cookie accessible to client-side JS (XSS session hijacking risk).',
    });
  }
  if (cookie.sameSite === 'None (Unset)' || cookie.sameSite === 'None') {
    cookie.riskFlags.push({
      flag: 'Missing SameSite Flag',
      severity: 'MEDIUM',
      description: 'Cookie lacks CSRF isolation.',
    });
  }

  return cookie;
}

/**
 * Analyzes all cookies in response headers.
 */
function analyzeCookies(headers) {
  let rawCookies = headers['set-cookie'] || [];
  if (typeof rawCookies === 'string') {
    rawCookies = [rawCookies];
  }

  const cookies = rawCookies.map(parseCookieHeader);
  const total = cookies.length;

  if (total === 0) {
    return {
      total: 0,
      cookies: [],
      status: 'PASS',
      score: 10,
      summary: 'No cookies set on initial response (Zero unencrypted cookie exposure / Stateless endpoint).',
    };
  }

  const missingSecure = cookies.filter((c) => !c.secure).length;
  const missingHttpOnly = cookies.filter((c) => !c.httpOnly).length;
  const missingSameSite = cookies.filter((c) => c.sameSite === 'None (Unset)' || c.sameSite === 'None').length;

  let status = 'PASS';
  let score = 10;
  let summary = `Analyzed ${total} cookie(s). All security flags (Secure, HttpOnly, SameSite) are properly configured.`;

  if (missingSecure > 0 || missingHttpOnly > 0) {
    status = 'FAIL';
    score = Math.max(0, 10 - missingSecure * 3 - missingHttpOnly * 3);
    summary = `Security flaw: ${missingHttpOnly}/${total} cookie(s) lack HttpOnly (XSS risk) and ${missingSecure}/${total} lack Secure (cleartext risk).`;
  } else if (missingSameSite > 0) {
    status = 'WARN';
    score = 8;
    summary = `${missingSameSite}/${total} cookie(s) lack SameSite=Strict or SameSite=Lax (CSRF protection).`;
  }

  return {
    total,
    cookies,
    missingSecure,
    missingHttpOnly,
    missingSameSite,
    status,
    score,
    summary,
  };
}

/**
 * Evaluates CORS (Cross-Origin Resource Sharing) headers.
 */
function analyzeCors(headers) {
  const allowOrigin = headers['access-control-allow-origin'];
  const allowCredentials = headers['access-control-allow-credentials'];
  const allowMethods = headers['access-control-allow-methods'];
  const allowHeaders = headers['access-control-allow-headers'];
  const exposeHeaders = headers['access-control-expose-headers'];

  const corsPresent = Boolean(allowOrigin || allowMethods || allowHeaders);
  const isWildcard = allowOrigin === '*';
  const allowsCreds = allowCredentials === 'true' || allowCredentials === true;

  let status = 'PASS';
  let score = 10;
  let detail = 'Strict Same-Origin Policy (SOP) is enforced. No wildcard or leaky CORS headers detected.';
  let recommendation = null;
  const riskFlags = [];

  if (isWildcard && allowsCreds) {
    // Critical CORS misconfiguration: Wildcard origin with credentials
    status = 'FAIL';
    score = 0;
    detail = 'CRITICAL CORS VULNERABILITY: Access-Control-Allow-Origin is "*" paired with Access-Control-Allow-Credentials: true. Third-party sites can steal authenticated session data.';
    recommendation = 'Never pair Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true. Whitelist trusted domains explicitly.';
    riskFlags.push('Wildcard origin with credentials (CVE-level misconfiguration)');
  } else if (isWildcard) {
    status = 'WARN';
    score = 7;
    detail = 'Access-Control-Allow-Origin is set to wildcard "*". Any website can fetch responses from this endpoint.';
    recommendation = 'If this endpoint serves private user data, restrict Access-Control-Allow-Origin to authorized origins.';
    riskFlags.push('Public wildcard origin (*) allowed');
  } else if (allowOrigin && allowOrigin !== 'null') {
    status = 'PASS';
    score = 10;
    detail = `CORS is restricted to authorized origin: "${allowOrigin}". Credentials: ${allowsCreds ? 'Enabled' : 'Disabled'}.`;
  } else if (corsPresent) {
    status = 'PASS';
    score = 10;
    detail = 'CORS response headers are configured safely without cross-origin leaks.';
  }

  return {
    configured: corsPresent,
    allowOrigin: allowOrigin || null,
    allowCredentials: allowCredentials || null,
    allowMethods: allowMethods || null,
    allowHeaders: allowHeaders || null,
    exposeHeaders: exposeHeaders || null,
    status,
    score,
    detail,
    recommendation,
    riskFlags,
  };
}

module.exports = {
  analyzeCookies,
  analyzeCors,
};
