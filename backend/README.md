# Web Security Analyzer - Backend

A high-performance, modular, **zero-dependency** Node.js backend engine for automated URL security evaluation, phishing detection, technology stack identification, and SEO auditing.

Designed and built exclusively with Node.js standard runtime libraries (`http`, `https`, `tls`, `dns`, `net`, `crypto`, `url`, `fs`, `path`), providing maximum security, minimal attack surface, instant startup times, and seamless portability without third-party package dependencies.

---

## ⚡ Highlights & Architecture

- **Zero Third-Party Dependencies**: No `npm install` bloat or supply-chain vulnerability risks.
- **Multi-Vector Security Auditing**:
  - **SSL / TLS Certificate Analysis**: Checks certificate expiration, issuer, subject alternative names (SAN), and protocol versions via native `tls.connect`.
  - **DNS Security Posture**: Queries CAA records, SPF, DMARC, DNSSEC, and TXT security directives.
  - **HTTP Security Headers & Policies**: Verifies HSTS, Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.
  - **Cookie & CORS Hardening**: Inspects flags (`HttpOnly`, `Secure`, `SameSite`) and Access-Control configurations.
  - **Heuristic Phishing Detection**: Detects brand spoofing, punycode/homograph attacks, IP-based hostnames, suspicious TLDs, and path entropy.
  - **Sensitive File & Directory Exposure**: Probes for accidentally exposed files (`.env`, `.git/HEAD`, `wp-config.php`, `id_rsa`, `.DS_Store`, etc.).
- **Mozilla Observatory Benchmarking**: Evaluates and compares target scores side-by-side against standard benchmarks.
- **Technology Stack & Hosting Detector**: Identifies web servers, frontend libraries, CDNs, CMSs, and cloud hosting providers.
- **Full SEO & Lighthouse Auditor**: Automated crawler and HTML parser checking metadata, Open Graph, headings, links, performance indicators, and crawlability.
- **Built-in Defense & Abuse Protection**:
  - **SSRF (Server-Side Request Forgery) Defense**: Blocks loopback, RFC 1918 private subnets, link-local addresses, and cloud provider metadata IPs (`169.254.169.254`).
  - **Sliding Window Rate Limiting**: Per-client request limiting with standard `X-RateLimit-*` headers.
  - **Self-Defense Security Headers**: Strict CSP, clickjacking denial (`X-Frame-Options: DENY`), and MIME-type enforcement.

---

## 📁 Directory Structure

```text
backend/
├── config/
│   └── env.js                   # Environment config & zero-dependency .env parser
├── controllers/
│   ├── benchmarkController.js   # Mozilla Observatory comparison handler
│   ├── healthController.js      # Service liveness & health check
│   ├── scanController.js       # Core security scan & history handlers
│   ├── seoController.js         # SEO audit & SEO history handlers
│   └── techStackController.js   # Tech stack detection handler
├── middleware/
│   ├── abuseProtection.js       # SSRF protection, URL sanitizer, security headers
│   └── rateLimiter.js           # Sliding-window rate limiter
├── routes/
│   └── router.js                # Core request dispatcher & CORS router
├── seo/
│   ├── crawler.js               # Lightweight page crawler
│   ├── htmlParser.js            # Native regex/stream-based HTML parser
│   ├── lighthouseAuditor.js     # Simulated lighthouse metrics & audit checks
│   ├── scoring.js               # SEO scoring engine
│   └── techStack.js             # Signature database for framework/CMS detection
├── services/
│   ├── cookieCorsService.js     # Cookie flag & CORS policy analyzer
│   ├── dnsSecurityService.js    # DNS record lookups (CAA, SPF, DMARC, DNSSEC)
│   ├── heuristicService.js      # Phishing & URL anomaly heuristic engine
│   ├── networkService.js        # Redirect follower & raw TLS cert extractor
│   ├── observatoryBenchmarkService.js # Observatory standard benchmark evaluator
│   ├── scanService.js           # Security scan orchestration pipeline
│   ├── securityEvaluator.js     # Multi-channel weighted score & grade calculator
│   └── sensitiveFileService.js  # Sensitive file exposure prober
├── storage/
│   └── historyStore.js          # In-memory history and domain trend repository
├── utils/
│   ├── staticServer.js          # Static asset & SPA fallback server
│   └── urlHelper.js             # URL normalization and validation helpers
├── index.js                     # Server entry point and exported services
└── package.json                 # Project configuration
```

---

## 🔌 API Endpoints

### System & Health

| Method | Endpoint               | Description                                                       |
| ------ | ---------------------- | ----------------------------------------------------------------- |
| `GET`  | `/api/health`          | Service liveness health check                                     |
| `GET`  | `/api/security-status` | Backend self-defense status, SSRF filters, and rate-limit details |

### Security Scanner

| Method | Endpoint             | Query Parameters      | Description                                                                                                          |
| ------ | -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/scan`          | `url` _(required)_    | Runs complete multi-vector security scan and returns report with score (0-100), grade (A+ to F), and channel details |
| `GET`  | `/api/benchmark`     | `url` _(required)_    | Generates a Mozilla Observatory standard benchmark comparison                                                        |
| `GET`  | `/api/history`       | -                     | Returns recent scan history records                                                                                  |
| `GET`  | `/api/history/trend` | `domain` _(required)_ | Returns historical security score trends for a given domain                                                          |

### Tech Stack & Infrastructure

| Method | Endpoint         | Query Parameters   | Description                                                                                     |
| ------ | ---------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `GET`  | `/api/techstack` | `url` _(required)_ | Analyzes HTTP headers, HTML footprints, and scripts to detect frameworks, CMS, CDN, and servers |

### SEO & Performance Audit

| Method         | Endpoint           | Query / Body Parameters | Description                                                                       |
| -------------- | ------------------ | ----------------------- | --------------------------------------------------------------------------------- |
| `POST` / `GET` | `/api/seo/analyze` | `url` _(required)_      | Performs SEO crawl, meta audit, Open Graph inspection, and performance evaluation |
| `GET`          | `/api/seo/history` | -                       | Returns recent SEO audit history records                                          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0.0 or higher.
- _No additional packages or npm dependencies are required!_

### Running the Server

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Start the server:

   ```bash
   # Production mode
   npm start

   # Development mode with native file watcher (Node 18+)
   npm run dev
   ```

The backend server will start on `http://localhost:3000` (or the port specified via `PORT` environment variable).

---

## ⚙️ Environment Variables

Configuration can be customized via environment variables or an optional `.env` file in the root directory:

| Variable | Default | Description                           |
| -------- | ------- | ------------------------------------- |
| `PORT`   | `3000`  | Port on which the HTTP server listens |

---
