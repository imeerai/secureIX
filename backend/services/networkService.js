/**
 * Network Probing & TLS Inspection Services
 */

const http = require('http');
const https = require('https');
const tls = require('tls');
const { URL } = require('url');

/**
 * Follow redirects manually (up to maxRedirects), recording the chain.
 */
function fetchWithRedirects(urlObj, maxRedirects = 5, chain = [], startTime = Date.now()) {
  return new Promise((resolve, reject) => {
    const lib = urlObj.protocol === 'http:' ? http : https;
    const req = lib.request(
      urlObj,
      {
        method: 'GET',
        timeout: 8000,
        headers: { 'User-Agent': 'URL-Security-Scanner/1.0 (+educational-project)' },
        rejectUnauthorized: false, // Inspect broken TLS rather than crash
      },
      (res) => {
        chain.push({ url: urlObj.toString(), status: res.statusCode });
        res.resume(); // discard body, headers only
        res.on('end', () => {
          const loc = res.headers.location;
          if ([301, 302, 303, 307, 308].includes(res.statusCode) && loc && maxRedirects > 0) {
            let next;
            try {
              next = new URL(loc, urlObj);
            } catch {
              return resolve(finish());
            }
            resolve(fetchWithRedirects(next, maxRedirects - 1, chain, startTime));
          } else {
            resolve(finish());
          }
        });

        function finish() {
          return {
            finalUrl: urlObj,
            status: res.statusCode,
            headers: res.headers,
            chain,
            elapsedMs: Date.now() - startTime,
            protocolUsed: urlObj.protocol,
          };
        }
      }
    );
    req.on('timeout', () => req.destroy(new Error('Request timed out after 8s')));
    req.on('error', reject);
    req.end();
  });
}

/**
 * Grab TLS certificate details via a raw TLS handshake.
 */
function getCertInfo(hostname) {
  return new Promise((resolve) => {
    let settled = false;
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, timeout: 6000, rejectUnauthorized: false },
      () => {
        if (settled) return;
        settled = true;
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const authError = socket.authorizationError ? String(socket.authorizationError) : null;
        const protocol = socket.getProtocol && socket.getProtocol();
        socket.end();
        if (!cert || Object.keys(cert).length === 0) return resolve(null);
        resolve({
          issuer: (cert.issuer && (cert.issuer.O || cert.issuer.CN)) || 'Unknown',
          subject: (cert.subject && cert.subject.CN) || hostname,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          authorized,
          authError,
          tlsVersion: protocol || 'Unknown',
        });
      }
    );
    socket.on('timeout', () => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(null);
    });
    socket.on('error', () => {
      if (settled) return;
      settled = true;
      resolve(null);
    });
  });
}

module.exports = {
  fetchWithRedirects,
  getCertInfo,
};
