/**
 * In-Memory Sliding-Window Rate Limiter & Self-Defense Middleware
 * Protects backend analyzer endpoints (/api/scan, /api/seo/analyze, etc.)
 */

const clientWindows = new Map();

// Default limit configurations (relaxed for unrestricted scanning & demos)
const DEFAULT_CONFIG = {
  windowMs: 60 * 1000,
  maxRequests: 10000, // Unlimited / High throughput
  message: 'API rate limit exceeded. Please wait before scanning again.',
};

/**
 * Extracts client IP from request headers or socket
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Cleans up stale IP buckets periodically to prevent memory leaks
 */
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of clientWindows.entries()) {
    if (now - data.resetTime > 60000) {
      clientWindows.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Middleware function for rate-limiting
 * Returns true if allowed, false if rejected (and sends 429 response)
 */
function checkRateLimit(req, res, customOptions = {}) {
  const config = { ...DEFAULT_CONFIG, ...customOptions };
  const ip = getClientIp(req);
  const now = Date.now();

  let clientData = clientWindows.get(ip);

  if (!clientData || now > clientData.resetTime) {
    clientData = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    clientWindows.set(ip, clientData);
  } else {
    clientData.count += 1;
  }

  const remaining = Math.max(0, config.maxRequests - clientData.count);
  const resetSeconds = Math.ceil((clientData.resetTime - now) / 1000);

  // Standard Rate Limit Headers
  res.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(clientData.resetTime / 1000).toString());

  if (clientData.count > config.maxRequests) {
    res.setHeader('Retry-After', resetSeconds.toString());
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(429);
    res.end(
      JSON.stringify({
        error: true,
        isRateLimited: true,
        statusCode: 429,
        message: config.message,
        retryAfterSeconds: resetSeconds,
        limit: config.maxRequests,
        windowSeconds: Math.ceil(config.windowMs / 1000),
      })
    );
    return false;
  }

  return true;
}

/**
 * Retrieves current rate limit stats for client (non-incrementing)
 */
function getRateLimitStatus(req, customOptions = {}) {
  const config = { ...DEFAULT_CONFIG, ...customOptions };
  const ip = getClientIp(req);
  const now = Date.now();

  const clientData = clientWindows.get(ip);
  if (!clientData || now > clientData.resetTime) {
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetSeconds: Math.ceil(config.windowMs / 1000),
      clientIp: ip,
    };
  }

  return {
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - clientData.count),
    resetSeconds: Math.max(0, Math.ceil((clientData.resetTime - now) / 1000)),
    clientIp: ip,
  };
}

module.exports = {
  checkRateLimit,
  getRateLimitStatus,
  getClientIp,
};
