/**
 * Security Evaluator & Scoring Engine
 * Evaluates comprehensive security channels and computes overall score/grade.
 */

const { parseCsp } = require('../utils/urlHelper');

/**
 * Build the evaluated security channels + calculate earned points for each.
 */
function evaluateChannels({ scanResult, certInfo, urlStructure, cookieInfo, corsInfo, dnsInfo }) {
  const headers = scanResult.headers || {};
  const finalProtocol = scanResult.finalUrl.protocol;
  const channels = [];

  // 1. HTTPS Usage (weight 10)
  {
    const usesHttps = finalProtocol === 'https:';
    channels.push({
      id: 'https',
      name: 'HTTPS Usage & Protocol',
      weight: 10,
      earned: usesHttps ? 10 : 0,
      status: usesHttps ? 'PASS' : 'FAIL',
      detail: usesHttps
        ? 'The site is served over HTTPS, encrypting traffic between the browser and server.'
        : 'The site does not use HTTPS. Traffic can be intercepted or modified in transit.',
      recommendation: usesHttps
        ? null
        : 'Enable HTTPS with a valid TLS certificate and redirect all HTTP traffic to HTTPS.',
    });
  }

  // 2. TLS Certificate (weight 10)
  {
    let status = 'FAIL',
      earned = 0,
      detail,
      recommendation = 'Install a valid, unexpired TLS certificate from a trusted CA.';
    if (finalProtocol !== 'https:') {
      detail = 'Site is not served over HTTPS, so no certificate could be evaluated.';
    } else if (!certInfo) {
      detail = 'Could not retrieve certificate details from the server.';
    } else {
      const now = Date.now();
      const validTo = new Date(certInfo.validTo).getTime();
      const daysLeft = Math.round((validTo - now) / (1000 * 60 * 60 * 24));
      if (!certInfo.authorized) {
        status = 'FAIL';
        earned = 0;
        detail = `Certificate is not trusted/valid (${certInfo.authError || 'unknown error'}).`;
      } else if (daysLeft < 0) {
        status = 'FAIL';
        earned = 0;
        detail = 'Certificate has expired.';
      } else if (daysLeft < 30) {
        status = 'WARN';
        earned = 6;
        detail = `Certificate is valid but expires soon (in ${daysLeft} days). Issuer: ${certInfo.issuer}.`;
        recommendation = 'Renew the TLS certificate before it expires.';
      } else {
        status = 'PASS';
        earned = 10;
        detail = `Certificate is valid until ${certInfo.validTo}, issued by ${certInfo.issuer}. TLS version: ${certInfo.tlsVersion}.`;
        recommendation = null;
      }
    }
    channels.push({ id: 'tls', name: 'TLS / SSL Certificate', weight: 10, earned, status, detail, recommendation });
  }

  // 3. HSTS (weight 10)
  {
    const hsts = headers['strict-transport-security'];
    let status = 'FAIL',
      earned = 0,
      detail,
      recommendation =
        'Add a Strict-Transport-Security header (e.g. max-age=31536000; includeSubDomains) to force HTTPS.';
    if (hsts) {
      const maxAgeMatch = /max-age=(\d+)/i.exec(hsts);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;
      if (maxAge >= 15552000) {
        status = 'PASS';
        earned = 10;
        detail = `HSTS is enabled: "${hsts}".`;
        recommendation = null;
      } else {
        status = 'WARN';
        earned = 5;
        detail = `HSTS is present but max-age is short: "${hsts}".`;
        recommendation = 'Increase max-age to at least 180 days (15552000 seconds).';
      }
    } else {
      detail = 'No Strict-Transport-Security header found. Browsers will not force HTTPS on future visits.';
    }
    channels.push({ id: 'hsts', name: 'Strict-Transport-Security', weight: 10, earned, status, detail, recommendation });
  }

  // 4. Content-Security-Policy (weight 10)
  const csp = headers['content-security-policy'];
  const cspDirectives = parseCsp(csp);
  {
    let status = 'FAIL',
      earned = 0,
      detail,
      recommendation = 'Add a Content-Security-Policy header restricting script, style, and object sources.';
    if (csp) {
      const risky = /unsafe-inline|unsafe-eval|\*/i.test(csp);
      if (risky) {
        status = 'WARN';
        earned = 6;
        detail = `CSP is present but uses permissive directives (e.g. 'unsafe-inline'/'*'): "${csp.slice(0, 160)}${csp.length > 160 ? '…' : ''}"`;
        recommendation = "Tighten CSP by removing 'unsafe-inline'/'unsafe-eval' and wildcard sources.";
      } else {
        status = 'PASS';
        earned = 10;
        detail = 'A restrictive Content-Security-Policy is in place, reducing the risk of injected scripts.';
        recommendation = null;
      }
    } else {
      detail = 'No Content-Security-Policy header found. The site has no defense-in-depth against injected content.';
    }
    channels.push({ id: 'csp', name: 'Content-Security-Policy', weight: 10, earned, status, detail, recommendation });
  }

  // 5. X-Frame-Options / clickjacking (weight 10)
  {
    const xfo = headers['x-frame-options'];
    const frameAncestors = cspDirectives['frame-ancestors'];
    let status = 'FAIL',
      earned = 0,
      detail,
      recommendation = "Add 'X-Frame-Options: DENY' or CSP 'frame-ancestors: none' to fully prevent clickjacking.";

    if (frameAncestors) {
      const val = frameAncestors.join(' ').toLowerCase();
      if (val.includes("'none'") || val === 'none') {
        status = 'PASS';
        earned = 10;
        detail = `Clickjacking fully blocked via CSP frame-ancestors: "${frameAncestors.join(' ')}".`;
        recommendation = null;
      } else {
        status = 'WARN';
        earned = 7;
        detail = `CSP frame-ancestors is set to "${frameAncestors.join(' ')}" — same-origin framing is still allowed.`;
        recommendation = "Tighten to frame-ancestors 'none' for full clickjacking protection.";
      }
    } else if (xfo) {
      const xfoUpper = xfo.toUpperCase().trim();
      if (xfoUpper === 'DENY') {
        status = 'PASS';
        earned = 10;
        detail = `X-Frame-Options is set to DENY — the page cannot be framed by any site.`;
        recommendation = null;
      } else if (xfoUpper === 'SAMEORIGIN') {
        status = 'WARN';
        earned = 7;
        detail = `X-Frame-Options is SAMEORIGIN — cross-origin framing is blocked, but same-origin framing is allowed.`;
        recommendation = "Use 'X-Frame-Options: DENY' or CSP 'frame-ancestors: none' for stronger clickjacking protection.";
      } else {
        status = 'WARN';
        earned = 5;
        detail = `X-Frame-Options is set to "${xfo}".`;
        recommendation = "Use 'X-Frame-Options: DENY' for the strongest clickjacking protection.";
      }
    } else {
      detail = 'No X-Frame-Options or CSP frame-ancestors found. The page could be embedded in a malicious iframe.';
    }
    channels.push({ id: 'xfo', name: 'Clickjacking & Framing', weight: 10, earned, status, detail, recommendation });
  }

  // 6. X-Content-Type-Options (weight 5)
  {
    const xcto = headers['x-content-type-options'];
    const ok = xcto && xcto.toLowerCase().includes('nosniff');
    channels.push({
      id: 'xcto',
      name: 'MIME Sniffing (nosniff)',
      weight: 5,
      earned: ok ? 5 : 0,
      status: ok ? 'PASS' : 'FAIL',
      detail: ok
        ? 'X-Content-Type-Options: nosniff is set, preventing MIME-type sniffing.'
        : 'X-Content-Type-Options header is missing or not set to "nosniff".',
      recommendation: ok ? null : "Add the header 'X-Content-Type-Options: nosniff'.",
    });
  }

  // 7. XSS Mitigation (weight 10)
  {
    const scriptSrc = cspDirectives['script-src'] || cspDirectives['default-src'];
    const xxp = headers['x-xss-protection'];
    let status = 'FAIL',
      earned = 0,
      detail,
      recommendation = "Add a strict CSP 'script-src' directive to mitigate reflected/stored XSS.";
    if (scriptSrc && !/unsafe-inline|\*/i.test(scriptSrc.join(' '))) {
      status = 'PASS';
      earned = 10;
      detail = `CSP restricts script sources ("${scriptSrc.join(' ')}"), providing modern defense against XSS.`;
      recommendation = null;
    } else if (csp) {
      status = 'WARN';
      earned = 6;
      detail = 'CSP exists but allows inline/wildcard scripts, weakening XSS protection.';
      recommendation = "Remove 'unsafe-inline' from script-src and use nonces or hashes instead.";
    } else if (xxp) {
      status = 'WARN';
      earned = 4;
      detail = `Legacy X-XSS-Protection header present ("${xxp}"). CSP is preferred.`;
      recommendation = 'Adopt a Content-Security-Policy instead of relying on the deprecated X-XSS-Protection header.';
    } else {
      detail = 'No CSP script-src restriction and no X-XSS-Protection header found. No explicit XSS mitigation detected.';
    }
    channels.push({ id: 'xss', name: 'XSS Defense & Script Origin', weight: 10, earned, status, detail, recommendation });
  }

  // 8. Referrer & Permissions Policy (weight 5)
  {
    const rp = headers['referrer-policy'];
    const pp = headers['permissions-policy'];
    let earned = 0;
    if (rp && /no-referrer|strict-origin/i.test(rp)) earned += 3;
    else if (rp) earned += 1.5;
    if (pp) earned += 2;

    const status = earned >= 4 ? 'PASS' : earned > 0 ? 'WARN' : 'FAIL';
    const detail = `Referrer-Policy: ${rp || 'missing'} | Permissions-Policy: ${pp ? 'configured' : 'missing'}`;
    const recommendation = earned < 5 ? "Set 'Referrer-Policy: strict-origin-when-cross-origin' and define 'Permissions-Policy'." : null;

    channels.push({
      id: 'privacy',
      name: 'Referrer & Permissions Privacy',
      weight: 5,
      earned: Math.round(earned),
      status,
      detail,
      recommendation,
    });
  }

  // 9. Cookie Security Analyzer (weight 10) [NEW]
  {
    const cookieScore = cookieInfo ? cookieInfo.score : 10;
    const cookieStatus = cookieInfo ? cookieInfo.status : 'PASS';
    const cookieDetail = cookieInfo ? cookieInfo.summary : 'No cookies detected on response.';
    const cookieRec =
      cookieStatus === 'FAIL'
        ? 'Enforce Secure, HttpOnly, and SameSite=Strict on all authentication & session cookies.'
        : cookieStatus === 'WARN'
          ? 'Set SameSite=Lax or SameSite=Strict to defend against CSRF attacks.'
          : null;

    channels.push({
      id: 'cookies',
      name: 'Cookie Security & Flags',
      weight: 10,
      earned: cookieScore,
      status: cookieStatus,
      detail: cookieDetail,
      recommendation: cookieRec,
    });
  }

  // 10. CORS Misconfiguration Detector (weight 10) [NEW]
  {
    const corsScore = corsInfo ? corsInfo.score : 10;
    const corsStatus = corsInfo ? corsInfo.status : 'PASS';
    const corsDetail = corsInfo ? corsInfo.detail : 'CORS headers are safely configured.';
    const corsRec = corsInfo ? corsInfo.recommendation : null;

    channels.push({
      id: 'cors',
      name: 'CORS Policy & Access Control',
      weight: 10,
      earned: corsScore,
      status: corsStatus,
      detail: corsDetail,
      recommendation: corsRec,
    });
  }

  // 11. DNS Security (SPF / DMARC / CAA) (weight 10) [NEW]
  {
    let dnsEarned = 0;
    if (dnsInfo) {
      if (dnsInfo.spf?.status === 'PASS') dnsEarned += 3.5;
      else if (dnsInfo.spf?.status === 'WARN') dnsEarned += 2;

      if (dnsInfo.dmarc?.status === 'PASS') dnsEarned += 4.5;
      else if (dnsInfo.dmarc?.status === 'WARN') dnsEarned += 2.5;

      if (dnsInfo.caa?.status === 'PASS') dnsEarned += 2;
    }
    const finalEarned = Math.min(10, Math.round(dnsEarned));
    const status = finalEarned >= 8 ? 'PASS' : finalEarned >= 4 ? 'WARN' : 'FAIL';
    const detail = dnsInfo
      ? `SPF: ${dnsInfo.spf?.status || 'FAIL'} | DMARC: ${dnsInfo.dmarc?.status || 'FAIL'} (${dnsInfo.dmarc?.policy || 'none'}) | CAA: ${dnsInfo.caa?.status || 'WARN'}. Email Spoofing Risk: ${dnsInfo.emailProtection}.`
      : 'DNS email and CA security records could not be resolved.';
    const recommendation =
      status !== 'PASS'
        ? 'Publish valid SPF (v=spf1), DMARC (v=DMARC1; p=reject), and CAA records in DNS to block email spoofing and rogue certificates.'
        : null;

    channels.push({
      id: 'dns',
      name: 'DNS Security (SPF/DMARC/CAA)',
      weight: 10,
      earned: finalEarned,
      status,
      detail,
      recommendation,
    });
  }

  // 12. URL / Phishing Structure (weight 10)
  {
    const { score, flags } = urlStructure;
    let status = 'PASS';
    if (score <= 3) status = 'FAIL';
    else if (score < 8) status = 'WARN';
    channels.push({
      id: 'phishing',
      name: 'URL & Phishing Indicators',
      weight: 10,
      earned: score,
      status,
      detail: flags.length
        ? flags.join(' | ')
        : 'No suspicious URL patterns detected (no IP host, punycode, excessive subdomains, or sensitive keywords).',
      recommendation: flags.length
        ? 'Review the domain carefully before trusting it; avoid entering credentials.'
        : null,
    });
  }

  return channels;
}

function gradeFor(score) {
  if (score >= 90) return { grade: 'A', label: 'Excellent security posture' };
  if (score >= 80) return { grade: 'B', label: 'Solid, with room to improve' };
  if (score >= 70) return { grade: 'C', label: 'Adequate, several gaps to close' };
  if (score >= 60) return { grade: 'D', label: 'Weak security configuration' };
  return { grade: 'F', label: 'Poor security posture' };
}

function classify(score, phishingScore) {
  if (phishingScore <= 3) return 'High Risk / Malicious';
  if (score >= 80) return 'Safe';
  if (score >= 50) return 'Suspicious';
  return 'High Risk / Malicious';
}

module.exports = {
  evaluateChannels,
  gradeFor,
  classify,
};
