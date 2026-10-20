/**
 * Backend Environment Configuration & Zero-dependency .env Loader
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');

// Load .env from project root
(function loadDotEnv() {
  try {
    const envPath = path.join(ROOT_DIR, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx < 0) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && !(key in process.env)) process.env[key] = val;
      }
    }
  } catch {
    /* .env is optional */
  }
})();

const PORT = parseInt(process.env.PORT || '3000', 10);
const NEBULA_DIST = path.join(ROOT_DIR, 'nebula-deploy', 'dist');
const PUBLIC_DIR = fs.existsSync(NEBULA_DIST) ? NEBULA_DIST : path.join(ROOT_DIR, 'public');
const MAX_HISTORY = 50;

module.exports = {
  ROOT_DIR,
  PORT,
  NEBULA_DIST,
  PUBLIC_DIR,
  MAX_HISTORY,
};
