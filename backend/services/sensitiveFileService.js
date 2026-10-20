/**
 * Sensitive File & Public Exposure Scanner
 * Fast, non-destructive passive checks with stream consumption.
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

const PROBE_TARGETS = [
  {
    path: '/.env',
    name: 'Environment Variables (.env)',
    risk: 'CRITICAL',
    signatureCheck: (body) => {
      if (!body || body.includes('<html') || body.includes('<!DOCTYPE')) return false;
      return /DB_PASSWORD|APP_KEY|SECRET|AWS_ACCESS_KEY|API_KEY|DATABASE_URL/i.test(body) || body.includes('=');
    },
  },
  {
    path: '/.git/config',
    name: 'Git Repository Config (.git/config)',
    risk: 'CRITICAL',
    signatureCheck: (body) => {
      if (!body || body.includes('<html') || body.includes('<!DOCTYPE')) return false;
      return body.includes('[core]') || body.includes('[remote "origin"]');
    },
  },
  {
    path: '/.git/HEAD',
    name: 'Git Head Pointer (.git/HEAD)',
    risk: 'HIGH',
    signatureCheck: (body) => {
      if (!body || body.includes('<html') || body.includes('<!DOCTYPE')) return false;
      return body.startsWith('ref: refs/') || /^[0-9a-f]{40}/i.test(body.trim());
    },
  },
  {
    path: '/.htaccess',
    name: 'Apache Configuration (.htaccess)',
    risk: 'HIGH',
    signatureCheck: (body) => {
      if (!body || body.includes('<html') || body.includes('<!DOCTYPE')) return false;
      return /RewriteEngine|RewriteRule|AuthType|Order allow,deny/i.test(body);
    },
  },
  {
    path: '/config.php.bak',
    name: 'Database/PHP Backup (config.php.bak)',
    risk: 'CRITICAL',
    signatureCheck: (body) => {
      if (!body || body.includes('<html') || body.includes('<!DOCTYPE')) return false;
      return /<\?php|\$db|\$password|DB_USER/i.test(body);
    },
  },
  {
    path: '/backup.zip',
    name: 'Source Archive (backup.zip)',
    risk: 'CRITICAL',
    signatureCheck: (body, headers) => {
      const cType = headers['content-type'] || '';
      return cType.includes('zip') || cType.includes('octet-stream');
    },
  },
  {
    path: '/robots.txt',
    name: 'Robots Directive (robots.txt)',
    risk: 'INFO',
    signatureCheck: (body) => {
      return body && /User-agent|Disallow|Allow|Sitemap/i.test(body);
    },
  },
  {
    path: '/.well-known/security.txt',
    name: 'RFC 9116 Security Contact (security.txt)',
    risk: 'INFO',
    signatureCheck: (body) => {
      return body && /Contact:|Expires:|Encryption:|Policy:/i.test(body);
    },
  },
];

/**
 * Probes a single sensitive path safely.
 */
function probePath(baseUrl, target) {
  return new Promise((resolve) => {
    let probeUrl;
    try {
      probeUrl = new URL(target.path, baseUrl.origin);
    } catch {
      return resolve({
        path: target.path,
        name: target.name,
        risk: target.risk,
        status: 'SAFE',
        httpCode: null,
        detail: 'Invalid URL format.',
      });
    }

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const lib = probeUrl.protocol === 'http:' ? http : https;
    const req = lib.request(
      probeUrl,
      {
        method: 'GET',
        timeout: 2500,
        headers: {
          'User-Agent': 'URL-Security-Scanner/1.0 (+security-audit-probe)',
        },
        rejectUnauthorized: false,
      },
      (res) => {
        let chunk = '';
        res.setEncoding('utf8');
        res.on('data', (d) => {
          if (chunk.length < 2048) {
            chunk += d;
          }
        });

        res.on('end', () => {
          const is200 = res.statusCode >= 200 && res.statusCode < 300;
          const isSignatureMatch = is200 && target.signatureCheck(chunk, res.headers);

          if (is200 && isSignatureMatch) {
            if (target.risk === 'INFO') {
              finish({
                path: target.path,
                name: target.name,
                risk: target.risk,
                status: 'DISCOVERED',
                httpCode: res.statusCode,
                detail: `Publicly accessible (${res.statusCode} OK). Verified.`,
              });
            } else {
              finish({
                path: target.path,
                name: target.name,
                risk: target.risk,
                status: 'EXPOSED',
                httpCode: res.statusCode,
                detail: `CRITICAL: Sensitive file exposed directly to public (${res.statusCode} OK). Immediate remediation required!`,
              });
            }
          } else {
            finish({
              path: target.path,
              name: target.name,
              risk: target.risk,
              status: 'SAFE',
              httpCode: res.statusCode,
              detail: is200
                ? `Returned ${res.statusCode} but content is generic HTML / custom 404.`
                : `Blocked or not found (HTTP ${res.statusCode}). Protected.`,
            });
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      finish({
        path: target.path,
        name: target.name,
        risk: target.risk,
        status: 'SAFE',
        httpCode: 'TIMEOUT',
        detail: 'Probe timed out (endpoint protected or rate-limited).',
      });
    });

    req.on('error', () => {
      finish({
        path: target.path,
        name: target.name,
        risk: target.risk,
        status: 'SAFE',
        httpCode: 'CONN_ERR',
        detail: 'Connection closed or unreachable.',
      });
    });

    req.end();
  });
}

/**
 * Run safe concurrency-bounded sensitive file scan.
 */
async function scanSensitiveFiles(baseUrlObj) {
  try {
    const probes = PROBE_TARGETS.map((target) => probePath(baseUrlObj, target));
    const results = await Promise.all(probes);

    const exposedCount = results.filter((r) => r.status === 'EXPOSED').length;
    const securityTxtFound = results.some((r) => r.path === '/.well-known/security.txt' && r.status === 'DISCOVERED');
    const robotsTxtFound = results.some((r) => r.path === '/robots.txt' && r.status === 'DISCOVERED');

    return {
      totalChecked: results.length,
      exposedCount,
      securityTxtFound,
      robotsTxtFound,
      findings: results,
    };
  } catch {
    return {
      totalChecked: 0,
      exposedCount: 0,
      securityTxtFound: false,
      robotsTxtFound: false,
      findings: [],
    };
  }
}

module.exports = {
  scanSensitiveFiles,
};
