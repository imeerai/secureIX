/**
 * Abuse, SSRF (Server-Side Request Forgery) Defense & API Security Middleware
 * Protects backend from malicious URLs, internal network scanning, and injection attacks.
 */

const { URL } = require("url");
const net = require("net");

/**
 * Checks whether an IP or hostname is private/loopback/restricted (SSRF Protection)
 */
function isRestrictedHost(hostname) {
  if (!hostname) return true;

  const normalized = hostname.toLowerCase().trim();

  // Block obvious localhost / internal hostnames
  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal") ||
    normalized === "0.0.0.0" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "169.254.169.254" // AWS / GCP / Azure Instance Metadata endpoint
  ) {
    return true;
  }

  // Check if it's an IPv4 address
  if (net.isIPv4(normalized)) {
    const parts = normalized.split(".").map(Number);
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link-Local / Metadata)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8
    if (parts[0] === 0) return true;
  }

  return false;
}

/**
 * Validates target URL against SSRF, dangerous protocols, and malicious payloads
 */
function validateTargetUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, message: "Missing or empty target URL parameter." };
  }

  const trimmed = rawUrl.trim();

  // Length sanity limit (prevent buffer overflow / ReDoS attempts)
  if (trimmed.length > 2048) {
    return {
      valid: false,
      message: "URL exceeds maximum length limit of 2048 characters.",
    };
  }

  // Block dangerous schemes
  if (
    /^(javascript|data|file|ftp|gopher|ssh|telnet|dict|ldap):/i.test(trimmed)
  ) {
    return {
      valid: false,
      message:
        "Invalid URL scheme. Only HTTP and HTTPS are permitted for security scans.",
    };
  }

  // Block suspicious injection payloads in target URL query/path
  if (/<script|union\s+select|eval\(|base64_decode/i.test(trimmed)) {
    return {
      valid: false,
      message:
        "Malicious payload or script injection attempt detected in URL parameter.",
    };
  }

  try {
    const targetWithProto = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(targetWithProto);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, message: "Protocol must be HTTP or HTTPS." };
    }

    if (isRestrictedHost(parsed.hostname)) {
      return {
        valid: false,
        message: `Security Policy Violation: SSRF Protection blocked access to private/internal/loopback target '${parsed.hostname}'.`,
      };
    }

    return { valid: true, parsedUrl: parsed, normalizedUrl: targetWithProto };
  } catch (err) {
    return { valid: false, message: `Malformed URL: ${err.message}` };
  }
}

/**
 * Attaches self-defense security headers to outgoing responses
 */
function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self';",
  );
}

module.exports = {
  isRestrictedHost,
  validateTargetUrl,
  applySecurityHeaders,
};
