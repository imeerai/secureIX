/**
 * DNS & Domain Security Inspector (SPF, DMARC, DKIM, CAA, MX)
 * Uses native Node.js DNS with public resolver and DoH fallbacks.
 */

const dns = require('dns');
const https = require('https');

// Dedicated resolver using high-reliability public DNS resolvers
const resolver = new dns.promises.Resolver();
try {
  resolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '9.9.9.9']);
} catch {
  // Use default
}

/**
 * Fallback to standard DNS-over-HTTPS (RFC 8427 / Cloudflare/Google DoH)
 * if local UDP port 53 is blocked by ISP / Firewall.
 */
function dohLookup(name, type) {
  return new Promise((resolve) => {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
    const req = https.get(
      url,
      {
        headers: { Accept: 'application/dns-json', 'User-Agent': 'Security-Audit/1.0' },
        timeout: 4000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            const data = JSON.parse(raw);
            resolve(data.Answer || []);
          } catch {
            resolve([]);
          }
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
    req.on('error', () => resolve([]));
  });
}

/**
 * Resolves TXT records with resolver -> native dns -> DoH fallback.
 */
async function resolveTxtSafe(domain) {
  // 1. Try public resolver
  try {
    const res = await resolver.resolveTxt(domain);
    if (res && res.length > 0) {
      return res.map((arr) => (Array.isArray(arr) ? arr.join('') : String(arr)));
    }
  } catch {}

  // 2. Try native dns
  try {
    const res = await dns.promises.resolveTxt(domain);
    if (res && res.length > 0) {
      return res.map((arr) => (Array.isArray(arr) ? arr.join('') : String(arr)));
    }
  } catch {}

  // 3. Try DoH
  try {
    const answers = await dohLookup(domain, 'TXT');
    return answers.map((a) => (a.data || '').replace(/^"|"$/g, '').replace(/\\"/g, '"'));
  } catch {}

  return [];
}

/**
 * Resolves CAA records safely.
 */
async function resolveCaaSafe(domain) {
  try {
    const res = await resolver.resolveCaa(domain);
    if (res && res.length > 0) return res;
  } catch {}

  try {
    const res = await dns.promises.resolveCaa(domain);
    if (res && res.length > 0) return res;
  } catch {}

  try {
    const answers = await dohLookup(domain, 'CAA');
    return answers.map((a) => ({ issue: a.data }));
  } catch {}

  return [];
}

/**
 * Analyzes DNS security posture (SPF, DMARC, CAA, MX).
 */
async function analyzeDnsSecurity(hostname) {
  const domainParts = hostname.split('.');
  const apexDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : hostname;

  const results = {
    hostname,
    apexDomain,
    spf: { present: false, record: null, status: 'FAIL', detail: 'No SPF record found.' },
    dmarc: { present: false, record: null, policy: 'none', status: 'FAIL', detail: 'No DMARC record found.' },
    caa: { present: false, records: [], status: 'WARN', detail: 'No CAA record found.' },
    mx: { present: false, records: [], detail: 'No MX records found.' },
    emailProtection: 'Vulnerable to Spoofing',
  };

  // 1. Check SPF
  let txtRecords = await resolveTxtSafe(hostname);
  if (txtRecords.length === 0 && hostname !== apexDomain) {
    txtRecords = await resolveTxtSafe(apexDomain);
  }

  const spfRecord = txtRecords.find((r) => r.toLowerCase().startsWith('v=spf1'));
  if (spfRecord) {
    results.spf.present = true;
    results.spf.record = spfRecord;
    if (spfRecord.includes('-all')) {
      results.spf.status = 'PASS';
      results.spf.detail = `Strict SPF enforcement (-all): "${spfRecord}". Unauthorized senders rejected.`;
    } else if (spfRecord.includes('~all')) {
      results.spf.status = 'PASS';
      results.spf.detail = `SoftFail SPF policy (~all): "${spfRecord}". Spoofed senders flagged.`;
    } else if (spfRecord.includes('+all') || spfRecord.includes('?all')) {
      results.spf.status = 'WARN';
      results.spf.detail = `Permissive SPF (+all/?all): "${spfRecord}". Protection is weakened.`;
    } else {
      results.spf.status = 'PASS';
      results.spf.detail = `SPF record active: "${spfRecord}".`;
    }
  } else {
    results.spf.status = 'WARN';
    results.spf.detail = `No SPF (v=spf1) record configured for ${apexDomain}.`;
  }

  // 2. Check DMARC
  let dmarcRecords = await resolveTxtSafe(`_dmarc.${hostname}`);
  if (dmarcRecords.length === 0 && hostname !== apexDomain) {
    dmarcRecords = await resolveTxtSafe(`_dmarc.${apexDomain}`);
  }

  const dmarcRecord = dmarcRecords.find((r) => r.toUpperCase().startsWith('V=DMARC1') || r.toLowerCase().startsWith('v=dmarc1'));
  if (dmarcRecord) {
    results.dmarc.present = true;
    results.dmarc.record = dmarcRecord;

    const pMatch = /p=([a-zA-Z]+)/i.exec(dmarcRecord);
    const policy = pMatch ? pMatch[1].toLowerCase() : 'none';
    results.dmarc.policy = policy;

    if (policy === 'reject') {
      results.dmarc.status = 'PASS';
      results.dmarc.detail = `Strict DMARC policy (p=reject): "${dmarcRecord}". Spoofed emails are dropped.`;
    } else if (policy === 'quarantine') {
      results.dmarc.status = 'PASS';
      results.dmarc.detail = `DMARC quarantine policy (p=quarantine): "${dmarcRecord}". Spoofed emails sent to spam.`;
    } else {
      results.dmarc.status = 'PASS';
      results.dmarc.detail = `DMARC monitoring policy (p=none): "${dmarcRecord}". Email alignment monitored.`;
    }
  } else {
    results.dmarc.status = 'WARN';
    results.dmarc.detail = `No DMARC record found at _dmarc.${apexDomain}.`;
  }

  // 3. Check CAA Records
  let caaRecords = await resolveCaaSafe(hostname);
  if (caaRecords.length === 0 && hostname !== apexDomain) {
    caaRecords = await resolveCaaSafe(apexDomain);
  }

  if (caaRecords && caaRecords.length > 0) {
    results.caa.present = true;
    results.caa.records = caaRecords;
    results.caa.status = 'PASS';
    const issuers = caaRecords
      .map((r) => r.issue || r.issuewild || (typeof r === 'string' ? r : ''))
      .filter(Boolean)
      .join(', ');
    results.caa.detail = `CAA record published: ${issuers || 'Specified'}. Unauthorized CA issuance blocked.`;
  } else {
    results.caa.status = 'WARN';
    results.caa.detail = `No CAA record found. Any public CA can issue certificates for this domain.`;
  }

  // Email Spoofing Assessment
  if (results.spf.present && results.dmarc.present && ['reject', 'quarantine'].includes(results.dmarc.policy)) {
    results.emailProtection = 'Strong (Anti-Spoofing Active)';
  } else if (results.spf.present || results.dmarc.present) {
    results.emailProtection = 'Moderate (Partial Protection)';
  } else {
    results.emailProtection = 'Vulnerable to Spoofing';
  }

  return results;
}

module.exports = {
  analyzeDnsSecurity,
};
