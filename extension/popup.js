/**
 * SecureIX QuickScan — Extension Popup Controller
 * Neo-Brutalist Theme with 3-in-1 Multi-Engine Scanning
 */

const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_FRONTEND_URL = 'http://localhost:5173';

let activeTabUrl = '';
let currentTargetUrl = '';
let currentHostname = '';
let backendBaseUrl = DEFAULT_API_URL;
let frontendBaseUrl = DEFAULT_FRONTEND_URL;

// DOM Elements
const loadingView = document.getElementById('loadingView');
const loadingText = document.getElementById('loadingText');
const loadingSubText = document.getElementById('loadingSubText');
const resultsView = document.getElementById('resultsView');
const errorView = document.getElementById('errorView');
const errorTitle = document.getElementById('errorTitle');
const errorMessage = document.getElementById('errorMessage');

const scanForm = document.getElementById('scanForm');
const targetUrlInput = document.getElementById('targetUrlInput');
const btnActiveTab = document.getElementById('btnActiveTab');
const chkTechStack = document.getElementById('chkTechStack');
const chkSeo = document.getElementById('chkSeo');

const targetHostname = document.getElementById('targetHostname');
const protocolBadge = document.getElementById('protocolBadge');
const backendStatusPill = document.getElementById('backendStatusPill');
const statusText = document.getElementById('statusText');

const scoreValue = document.getElementById('scoreValue');
const gradeBadge = document.getElementById('gradeBadge');
const classificationBadge = document.getElementById('classificationBadge');
const scanLatency = document.getElementById('scanLatency');
const findingsSummary = document.getElementById('findingsSummary');
const alertBanner = document.getElementById('alertBanner');
const alertText = document.getElementById('alertText');

const badgeTechWrap = document.getElementById('badgeTechWrap');
const badgeTechHost = document.getElementById('badgeTechHost');
const badgeSeoWrap = document.getElementById('badgeSeoWrap');
const badgeSeoScore = document.getElementById('badgeSeoScore');

const valSsl = document.getElementById('valSsl');
const subSsl = document.getElementById('subSsl');
const valHeaders = document.getElementById('valHeaders');
const subHeaders = document.getElementById('subHeaders');
const valDns = document.getElementById('valDns');
const subDns = document.getElementById('subDns');
const valThreat = document.getElementById('valThreat');
const subThreat = document.getElementById('subThreat');
const findingsList = document.getElementById('findingsList');

const btnRefresh = document.getElementById('btnRefresh');
const btnDeepScan = document.getElementById('btnDeepScan');
const btnSettings = document.getElementById('btnSettings');
const settingsPanel = document.getElementById('settingsPanel');
const apiUrlInput = document.getElementById('apiUrlInput');
const frontendUrlInput = document.getElementById('frontendUrlInput');
const btnSaveSettings = document.getElementById('btnSaveSettings');
const btnCloseSettings = document.getElementById('btnCloseSettings');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadStoredConfig();
  setupEventListeners();
  initActiveTabAndScan();
});

async function loadStoredConfig() {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    const data = await chrome.storage.local.get(['apiUrl', 'frontendUrl', 'chkTech', 'chkSeo']);
    if (data.apiUrl) backendBaseUrl = data.apiUrl;
    if (data.frontendUrl) frontendBaseUrl = data.frontendUrl;
    if (data.chkTech !== undefined && chkTechStack) chkTechStack.checked = data.chkTech;
    if (data.chkSeo !== undefined && chkSeo) chkSeo.checked = data.chkSeo;
  }
  apiUrlInput.value = backendBaseUrl;
  frontendUrlInput.value = frontendBaseUrl;
}

function setupEventListeners() {
  // Form submission: Scan any custom URL entered
  scanForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawVal = targetUrlInput.value.trim();
    if (rawVal) {
      scanTargetUrl(rawVal);
    }
  });

  // Checkbox persistent changes
  if (chkTechStack) {
    chkTechStack.addEventListener('change', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ chkTech: chkTechStack.checked });
      }
    });
  }
  if (chkSeo) {
    chkSeo.addEventListener('change', () => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ chkSeo: chkSeo.checked });
      }
    });
  }

  // Fill active tab URL button
  btnActiveTab.addEventListener('click', () => {
    if (activeTabUrl) {
      targetUrlInput.value = activeTabUrl;
      scanTargetUrl(activeTabUrl);
    } else {
      initActiveTabAndScan();
    }
  });

  // Re-scan button
  btnRefresh.addEventListener('click', () => {
    btnRefresh.classList.add('rotating');
    const urlToScan = targetUrlInput.value.trim() || currentTargetUrl || activeTabUrl;
    if (urlToScan) {
      scanTargetUrl(urlToScan).finally(() => {
        setTimeout(() => btnRefresh.classList.remove('rotating'), 500);
      });
    }
  });

  // Open full dashboard in web app
  btnDeepScan.addEventListener('click', () => {
    const urlToDeepScan = currentTargetUrl || targetUrlInput.value.trim() || activeTabUrl;
    if (!urlToDeepScan) return;
    const targetUrl = `${frontendBaseUrl}/?scan=${encodeURIComponent(urlToDeepScan)}`;
    chrome.tabs.create({ url: targetUrl });
  });

  // Settings drawer toggles
  btnSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
  });

  btnSaveSettings.addEventListener('click', async () => {
    const newApi = apiUrlInput.value.trim().replace(/\/+$/, '') || DEFAULT_API_URL;
    const newFront = frontendUrlInput.value.trim().replace(/\/+$/, '') || DEFAULT_FRONTEND_URL;
    backendBaseUrl = newApi;
    frontendBaseUrl = newFront;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ apiUrl: newApi, frontendUrl: newFront });
    }
    settingsPanel.classList.add('hidden');
    const urlToScan = targetUrlInput.value.trim() || currentTargetUrl || activeTabUrl;
    if (urlToScan) scanTargetUrl(urlToScan);
  });
}

/**
 * Retrieve active browser tab URL on startup
 */
async function initActiveTabAndScan() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0 && tabs[0].url) {
      const tabUrl = tabs[0].url;
      // Skip system tabs from auto-filling unusable URLs
      if (!tabUrl.startsWith('chrome://') && !tabUrl.startsWith('edge://') && !tabUrl.startsWith('about:') && !tabUrl.startsWith('chrome-extension://')) {
        activeTabUrl = tabUrl;
        targetUrlInput.value = tabUrl;
        scanTargetUrl(tabUrl);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not query active tab:', err);
  }

  // If on chrome:// or empty, suggest default domain e.g. github.com
  targetUrlInput.value = 'github.com';
  scanTargetUrl('github.com');
}

/**
 * Normalize and execute scan on target URL
 */
async function scanTargetUrl(rawUrl) {
  showLoading();

  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  currentTargetUrl = normalized;
  targetUrlInput.value = normalized;

  try {
    const parsed = new URL(normalized);
    currentHostname = parsed.hostname;
    targetHostname.textContent = currentHostname;
    targetHostname.title = normalized;

    if (parsed.protocol === 'https:') {
      protocolBadge.textContent = 'HTTPS';
      protocolBadge.className = 'url-protocol-badge';
    } else {
      protocolBadge.textContent = 'HTTP';
      protocolBadge.className = 'url-protocol-badge badge-insecure';
    }

    // Run parallel multi-engine queries
    await runMultiScan(normalized);
  } catch (err) {
    console.error('URL parse or scan error:', err);
    runHeuristicFallback(normalized);
  }
}

/**
 * Queries SecureIX Backend API across enabled engines (Security, Tech Stack, SEO)
 */
async function runMultiScan(targetUrl) {
  const startTime = Date.now();
  setBackendStatus('CONNECTING', 'status-connecting');

  const doTech = chkTechStack ? chkTechStack.checked : true;
  const doSeo = chkSeo ? chkSeo.checked : true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const promises = [
      fetch(`${backendBaseUrl}/api/scan?url=${encodeURIComponent(targetUrl)}`, { signal: controller.signal })
        .then(r => r.json())
        .catch(e => null),
    ];

    if (doTech) {
      promises.push(
        fetch(`${backendBaseUrl}/api/techstack?url=${encodeURIComponent(targetUrl)}`, { signal: controller.signal })
          .then(r => r.json())
          .catch(e => null)
      );
    } else {
      promises.push(Promise.resolve(null));
    }

    if (doSeo) {
      promises.push(
        fetch(`${backendBaseUrl}/api/seo/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl }),
          signal: controller.signal,
        })
          .then(r => r.json())
          .catch(e => null)
      );
    } else {
      promises.push(Promise.resolve(null));
    }

    const [secData, techData, seoData] = await Promise.all(promises);
    clearTimeout(timeoutId);

    if (!secData || secData.error) {
      throw new Error(secData?.message || 'Backend scan failed');
    }

    setBackendStatus('API LIVE', 'status-online');
    renderBackendResults(secData, techData, seoData, Date.now() - startTime);

    // Update Chrome badge
    updateExtensionBadge(secData.score, secData.grade);
  } catch (backendError) {
    console.warn('Backend unavailable, switching to heuristic scanner:', backendError);
    setBackendStatus('HEURISTIC', 'status-offline');
    runHeuristicFallback(targetUrl);
  }
}

/**
 * Render Backend Result Payload
 */
function renderBackendResults(data, techData, seoData, latencyMs) {
  const score = data.score || 0;
  const grade = data.grade || 'F';
  const classification = data.classification || (score >= 80 ? 'Safe' : score >= 50 ? 'Suspicious' : 'High Risk');

  renderScoreHero(score, grade, classification);

  scanLatency.textContent = `${latencyMs || data.scanTimeMs || 0}ms`;

  // Channels count / findings
  const channels = data.channels || [];
  const passedCount = channels.filter(c => c.status === 'PASS').length;
  findingsSummary.textContent = `${passedCount}/${channels.length} Passed`;

  // Tech Stack & SEO Badges
  if (techData && techData.hosting && techData.hosting.provider) {
    badgeTechWrap.classList.remove('hidden');
    badgeTechHost.textContent = techData.hosting.provider;
  } else {
    badgeTechWrap.classList.add('hidden');
  }

  if (seoData && seoData.score !== undefined) {
    badgeSeoWrap.classList.remove('hidden');
    badgeSeoScore.textContent = `${seoData.score}/100`;
  } else {
    badgeSeoWrap.classList.add('hidden');
  }

  // SSL
  if (data.https && data.certInfo && data.certInfo.valid) {
    valSsl.textContent = data.certInfo.protocol || 'TLS 1.3';
    subSsl.textContent = `Valid (${data.certInfo.daysRemaining || 0}d left)`;
  } else if (data.https) {
    valSsl.textContent = 'HTTPS Active';
    subSsl.textContent = 'Cert verified';
  } else {
    valSsl.textContent = 'INSECURE (HTTP)';
    subSsl.textContent = 'No Encryption';
  }

  // Headers Channel
  const headerChan = channels.find(c => c.id === 'headers') || {};
  valHeaders.textContent = `${headerChan.earned || 0}/${headerChan.max || 25} pts`;
  subHeaders.textContent = headerChan.status === 'PASS' ? 'HSTS, CSP, XFO ok' : 'Missing security headers';

  // DNS Channel
  const dnsChan = channels.find(c => c.id === 'dns') || {};
  valDns.textContent = `${dnsChan.earned || 0}/${dnsChan.max || 10} pts`;
  subDns.textContent = (data.dnsInfo && data.dnsInfo.spf) ? 'SPF/DMARC active' : 'Standard DNS';

  // File Leakage Channel
  const sensChan = channels.find(c => c.id === 'sensitive_files') || {};
  const exposed = data.sensitiveFiles ? data.sensitiveFiles.exposedCount : 0;
  if (exposed > 0) {
    valThreat.textContent = `${exposed} LEAKS!`;
    subThreat.textContent = 'Git/.env exposed';
    showAlert(`${exposed} sensitive file endpoint(s) leaked!`);
  } else {
    valThreat.textContent = '0 Leaks Found';
    subThreat.textContent = 'No .git / .env leaks';
    hideAlert();
  }

  // Render Findings Checklist
  renderChecklist(channels);
  showResults();
}

/**
 * Client-Side Heuristic Fallback Analyzer
 */
function runHeuristicFallback(urlStr) {
  try {
    const u = new URL(urlStr);
    let score = 50;
    const checks = [];

    // 1. Protocol check
    const isHttps = u.protocol === 'https:';
    if (isHttps) {
      score += 20;
      checks.push({ name: 'Transport Layer Security (HTTPS)', status: 'PASS', scoreText: '+20 pts' });
      valSsl.textContent = 'HTTPS Active';
      subSsl.textContent = 'Encrypted Stream';
    } else {
      score -= 30;
      checks.push({ name: 'Transport Layer Security (HTTPS)', status: 'FAIL', scoreText: '-30 pts' });
      valSsl.textContent = 'INSECURE (HTTP)';
      subSsl.textContent = 'Cleartext Protocol';
    }

    // 2. IP Hostname check
    const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname);
    if (isIpHost) {
      score -= 25;
      checks.push({ name: 'Host Identifier Format', status: 'FAIL', scoreText: 'Direct IP' });
    } else {
      checks.push({ name: 'Domain Resolution', status: 'PASS', scoreText: 'FQDN Valid' });
    }

    // 3. Port check
    const nonStdPort = u.port && !['80', '443'].includes(u.port);
    if (nonStdPort) {
      score -= 10;
      checks.push({ name: 'Port Standard Compliance', status: 'WARN', scoreText: `Port :${u.port}` });
    } else {
      checks.push({ name: 'Standard Port Allocation', status: 'PASS', scoreText: 'Standard' });
    }

    // 4. Subdomain & TLD Heuristics
    const parts = u.hostname.split('.');
    if (parts.length > 4) {
      score -= 10;
      checks.push({ name: 'Subdomain Hierarchy', status: 'WARN', scoreText: 'Deep Subdomain' });
    } else {
      checks.push({ name: 'Subdomain Hierarchy', status: 'PASS', scoreText: 'Normal Depth' });
    }

    // 5. Query parameters risk
    if (u.search.includes('redirect') || u.search.includes('url=') || u.search.includes('next=')) {
      score -= 5;
      checks.push({ name: 'Open Redirect Parameter', status: 'WARN', scoreText: 'Redirect Param' });
    }

    valHeaders.textContent = 'Heuristic';
    subHeaders.textContent = 'Connect API for live headers';

    valDns.textContent = 'Domain Active';
    subDns.textContent = u.hostname;

    valThreat.textContent = 'Heuristic';
    subThreat.textContent = 'Probes in Web App';

    score = Math.max(10, Math.min(95, score));
    let grade = 'C';
    let classification = 'Suspicious';

    if (score >= 80) { grade = 'A'; classification = 'Safe'; }
    else if (score >= 65) { grade = 'B'; classification = 'Safe'; }
    else if (score >= 45) { grade = 'C'; classification = 'Suspicious'; }
    else { grade = 'F'; classification = 'High Risk'; }

    renderScoreHero(score, grade, classification);
    scanLatency.textContent = 'Local (Fast)';
    findingsSummary.textContent = `${checks.filter(c => c.status === 'PASS').length}/${checks.length} Passed`;

    if (!isHttps || isIpHost) {
      showAlert('Potential risk: Insecure transport or numeric host');
    } else {
      hideAlert();
    }

    renderCustomChecklist(checks);
    showResults();
    updateExtensionBadge(score, grade);
  } catch (e) {
    showError('Heuristic Error', 'Could not parse target URL.');
  }
}

/**
 * Visual Helpers
 */
function renderScoreHero(score, grade, classification) {
  scoreValue.textContent = score;
  gradeBadge.textContent = grade || 'F';

  // Grade badge color class
  gradeBadge.className = 'grade-badge';
  const g = (grade || 'F').toUpperCase().charAt(0);
  if (g === 'A') gradeBadge.classList.add('grade-a');
  else if (g === 'B') gradeBadge.classList.add('grade-b');
  else if (g === 'C') gradeBadge.classList.add('grade-c');
  else if (g === 'D') gradeBadge.classList.add('grade-d');
  else gradeBadge.classList.add('grade-f');

  // Classification pill text and color
  classificationBadge.textContent = (classification || (score >= 80 ? 'Safe' : score >= 50 ? 'Suspicious' : 'High Risk')).toUpperCase();
  classificationBadge.className = 'classification-pill';
  if (score >= 75) {
    // default green
  } else if (score >= 50) {
    classificationBadge.classList.add('pill-warn');
  } else {
    classificationBadge.classList.add('pill-danger');
  }
}

function renderChecklist(channels) {
  findingsList.innerHTML = '';
  channels.forEach(chan => {
    const item = document.createElement('div');
    const statusClass = chan.status === 'PASS' ? 'pass' : chan.status === 'WARN' ? 'warn' : 'fail';
    item.className = `finding-item ${statusClass}`;
    
    item.innerHTML = `
      <span class="finding-name">${escapeHtml(chan.name || chan.id)}</span>
      <span class="finding-score ${statusClass}">${chan.earned}/${chan.max} pts</span>
    `;
    findingsList.appendChild(item);
  });
}

function renderCustomChecklist(checks) {
  findingsList.innerHTML = '';
  checks.forEach(c => {
    const item = document.createElement('div');
    const statusClass = c.status === 'PASS' ? 'pass' : c.status === 'WARN' ? 'warn' : 'fail';
    item.className = `finding-item ${statusClass}`;
    item.innerHTML = `
      <span class="finding-name">${escapeHtml(c.name)}</span>
      <span class="finding-score ${statusClass}">${escapeHtml(c.scoreText)}</span>
    `;
    findingsList.appendChild(item);
  });
}

function setBackendStatus(text, statusClass) {
  statusText.textContent = text;
  backendStatusPill.className = `status-pill ${statusClass}`;
}

function showAlert(text) {
  alertText.textContent = text;
  alertBanner.classList.remove('hidden');
}

function hideAlert() {
  alertBanner.classList.add('hidden');
}

function showLoading() {
  loadingView.classList.remove('hidden');
  resultsView.classList.add('hidden');
  errorView.classList.add('hidden');
}

function showResults() {
  loadingView.classList.add('hidden');
  resultsView.classList.remove('hidden');
  errorView.classList.add('hidden');
}

function showError(title, msg) {
  loadingView.classList.add('hidden');
  resultsView.classList.add('hidden');
  errorView.classList.remove('hidden');
  errorTitle.textContent = title;
  errorMessage.textContent = msg;
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

function updateExtensionBadge(score, grade) {
  if (typeof chrome !== 'undefined' && chrome.action && chrome.action.setBadgeText) {
    chrome.action.setBadgeText({ text: grade || String(score) });
    let badgeBg = '#86efac';
    if (score < 50) badgeBg = '#ff9ebb';
    else if (score < 75) badgeBg = '#fde047';
    chrome.action.setBadgeBackgroundColor({ color: badgeBg });
  }
}
