/**
 * Heuristic URL & Phishing Structure Analyzer
 */

/**
 * Heuristic URL / phishing structure analysis. Returns a 0-10 sub-score plus flags.
 */
function analyzeUrlStructure(urlObj, originalInput) {
  const flags = [];
  let deduction = 0;
  const host = urlObj.hostname;

  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  if (isIp) {
    flags.push('Host is a raw IP address instead of a domain name');
    deduction += 4;
  }
  if (originalInput && originalInput.includes('@')) {
    flags.push('URL contains "@" which can be used to hide the real destination');
    deduction += 3;
  }
  const subdomainCount = Math.max(0, host.split('.').length - 2);
  if (subdomainCount > 3) {
    flags.push('Unusually high number of subdomains');
    deduction += 2;
  }
  if (host.includes('xn--')) {
    flags.push('Domain uses punycode — possible homograph / lookalike domain');
    deduction += 3;
  }
  if (urlObj.href.length > 100) {
    flags.push('URL is unusually long');
    deduction += 1;
  }
  const suspiciousWords = [
    'login',
    'verify',
    'secure',
    'update',
    'account',
    'banking',
    'confirm',
    'password',
    'signin',
    'wallet',
  ];
  const lowerHost = host.toLowerCase();
  const hitWords = suspiciousWords.filter((w) => lowerHost.includes(w));
  if (hitWords.length > 0) {
    flags.push(`Domain contains sensitive-sounding keyword(s): ${hitWords.join(', ')}`);
    deduction += 2;
  }
  const hyphenCount = (host.match(/-/g) || []).length;
  if (hyphenCount > 3) {
    flags.push('Excessive hyphens in domain name');
    deduction += 1;
  }

  const score = Math.max(0, 10 - deduction);
  return { score, flags };
}

module.exports = {
  analyzeUrlStructure,
};
