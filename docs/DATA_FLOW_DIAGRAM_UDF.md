# 📊 System Architecture: Data Flow Diagrams (DFD) & User Flow Diagrams (UDF)

**Project Name:** SecureIX — Multi-Vector Web Security & Phishing Analyzer  
**Component:** Backend & Distributed Analysis Engine  
**Classification:** Academic & Software Engineering Specification (University IS Project)  
**Standard:** Yourdon & Coad / Gane & Sarson DFD Notation & UML User Flow Specifications

---

## 📑 Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Level 0: Context Data Flow Diagram (Context DFD)](#2-level-0-context-data-flow-diagram-context-dfd)
3. [Level 1: System-Wide Data Flow Diagram (Level 1 DFD)](#3-level-1-system-wide-data-flow-diagram-level-1-dfd)
4. [Level 2: Decomposed Sub-Process Data Flow Diagrams](#4-level-2-decomposed-sub-process-data-flow-diagrams)
   - [4.1 Security Scanning Engine (P2.0 Decomposition)](#41-security-scanning-engine-p20-decomposition)
   - [4.2 SEO & Tech Stack Engine (P3.0 & P4.0 Decomposition)](#42-seo--tech-stack-engine-p30--p40-decomposition)
5. [User Flow Diagram (UFD) / End-to-End User Journey](#5-user-flow-diagram-ufd--end-to-end-user-journey)
6. [Data Dictionary & Data Stores (D1, D2, D3)](#6-data-dictionary--data-stores-d1-d2-d3)
7. [Trust Boundaries & Security Safeguards](#7-trust-boundaries--security-safeguards)

---

## 1. Executive Overview

The **SecureIX Web Security Analyzer** backend is a zero-dependency, event-driven Node.js system designed to receive untrusted target URLs, apply defensive sanitization, orchestrate multi-vector security evaluations across outbound networks (HTTP, TLS, DNS), and persist historical audit telemetry.

This document formally captures the **Data Flow Diagrams (DFD)** from Context Level 0 down to detailed Level 2 sub-processes, along with the **User Flow Diagram (UFD)** representing user and system interactions.

### External Entities

- **E1: End User / Security Researcher** — Operates the React Web Application or Chrome Extension (Manifest V3).
- **E2: Target Web Host / Server** — The external domain or web property being audited.
- **E3: Authoritative DNS Servers** — External DNS infrastructure queried for CAA, SPF, DMARC, and DNSSEC records.
- **E4: Mozilla Observatory API** — External benchmarking service used for side-by-side compliance ratings.

---

## 2. Level 0: Context Data Flow Diagram (Context DFD)

The Context Diagram establishes the boundary between external entities and the **secureIX Analysis System**.

```mermaid
flowchart TD
    E1([External Entity: End User / Security Analyst])
    E2([External Entity: Target Web Host])
    E3([External Entity: Authoritative DNS Servers])
    E4([External Entity: Mozilla Observatory API])

    System((0.0<br/>secureIX Web Security<br/>& Phishing Analyzer System))

    %% User interactions
    E1 -- "1. Target URL + Scan Options (TechStack, SEO)" --> System
    E1 -- "2. History / Trend Query" --> System
    System -- "3. Security Audit Report (Score, Grade, Findings)" --> E1
    System -- "4. Tech Stack & SEO Metrics" --> E1
    System -- "5. Historical Domain Trend Telemetry" --> E1

    %% Target Server interactions
    System -- "6. HTTP(S) Handshake & Redirect Probes" --> E2
    System -- "7. TLS/SSL Handshake via tls.connect" --> E2
    System -- "8. Sensitive File Probes (.env, .git)" --> E2
    E2 -- "9. HTTP Headers, TLS Certificates, File Responses" --> System

    %% DNS interactions
    System -- "10. DNS Security Query (CAA, TXT, SPF, DMARC)" --> E3
    E3 -- "11. DNS Resource Records" --> System

    %% Observatory interactions
    System -- "12. Benchmark Verification Query" --> E4
    E4 -- "13. Mozilla Observatory Grade & Score" --> System

    classDef entity fill:#1e293b,stroke:#0ea5e9,stroke-width:2px,color:#fff;
    classDef sys fill:#0f172a,stroke:#eab308,stroke-width:3px,color:#f8fafc;
    class E1,E2,E3,E4 entity;
    class System sys;
```

---

## 3. Level 1: System-Wide Data Flow Diagram (Level 1 DFD)

The Level 1 DFD decomposes the system into the primary processing subsystems, data stores, and defensive perimeter checks.

```mermaid
flowchart TB
    E1([End User / Client])
    E2([Target Web Host])
    E3([DNS Servers])
    E4([Mozilla Observatory API])

    subgraph Boundary ["secureIX Backend System Boundary"]
        P1["1.0 Request Dispatcher<br/>& Abuse Defense Filter"]
        P2["2.0 Multi-Vector<br/>Security Scan Engine"]
        P3["3.0 Tech Stack & Hosting<br/>Detection Engine"]
        P4["4.0 SEO & Lighthouse<br/>Auditing Engine"]
        P5["5.0 Benchmark<br/>Comparison Engine"]
        P6["6.0 History & Analytics<br/>Store Manager"]

        D1[("D1: Scan History Store")]
        D2[("D2: SEO History Store")]
        D3[("D3: Domain Trends Store")]
    end

    %% Inbound traffic through abuse filter
    E1 -- "Inbound Request (URL, Options)" --> P1
    P1 -- "Sanitized Target URL" --> P2
    P1 -- "Target URL" --> P3
    P1 -- "Target URL" --> P4
    P1 -- "Target URL" --> P5
    P1 -- "Query History / Trend" --> P6

    %% Outbound network probes
    P2 <--> |"HTTP Headers, TLS Cert, Sensitive Files"| E2
    P2 <--> |"CAA, SPF, DMARC, DNSSEC"| E3
    P3 <--> |"Server Headers, HTML Signatures"| E2
    P4 <--> |"Crawler HTML Stream, Metadata"| E2
    P5 <--> |"Observatory API Query"| E4

    %% Storage operations
    P2 -- "Store Scan Record" --> D1
    P2 -- "Record Domain Score" --> D3
    P4 -- "Store SEO Record" --> D2
    P6 <--> |"Read Scan Logs"| D1
    P6 <--> |"Read SEO Logs"| D2
    P6 <--> |"Read Time-Series Data"| D3

    %% Output to client
    P2 -- "Security Report" --> E1
    P3 -- "Tech Stack Profile" --> E1
    P4 -- "SEO Audit Report" --> E1
    P5 -- "Benchmark Comparison" --> E1
    P6 -- "Historical Trend Data" --> E1

    classDef entity fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef process fill:#0f172a,stroke:#22c55e,stroke-width:2px,color:#fff;
    classDef store fill:#312e81,stroke:#a855f7,stroke-width:2px,color:#fff;
    class E1,E2,E3,E4 entity;
    class P1,P2,P3,P4,P5,P6 process;
    class D1,D2,D3 store;
```

---

## 4. Level 2: Decomposed Sub-Process Data Flow Diagrams

### 4.1 Security Scanning Engine (P2.0 Decomposition)

Decomposes the core multi-vector scanning pipeline (`scanService.js` and associated services) into discrete, concurrent auditing steps.

```mermaid
flowchart TD
    InURL(["Input: Sanitized Target URL"])

    subgraph SecurityEngine ["Process 2.0: Multi-Vector Security Scan Engine"]
        P2_1["2.1 URL Heuristic &<br/>Phishing Analyzer"]
        P2_2["2.2 Network & HTTP<br/>Redirect Follower"]
        P2_3["2.3 TLS/SSL Certificate<br/>Extractor"]
        P2_4["2.4 DNS Security<br/>Analyzer"]
        P2_5["2.5 Sensitive File Exposure<br/>Scanner"]
        P2_6["2.6 Cookie & CORS Policy<br/>Inspector"]
        P2_7["2.7 Multi-Channel Security<br/>Evaluator & Scorer"]
    end

    E2_Host([Target Web Host])
    E3_DNS([DNS Name Servers])
    OutReport(["Output: Comprehensive Security Report"])
    D1_Store[("D1: Scan History")]
    D3_Store[("D3: Domain Trends")]

    InURL --> P2_1
    InURL --> P2_2

    P2_2 <--> |"HTTP GET / HEAD (Redirects)"| E2_Host
    P2_2 -- "Resolved Hostname & Protocol" --> P2_3
    P2_2 -- "Resolved Hostname" --> P2_4
    P2_2 -- "Final Base URL" --> P2_5
    P2_2 -- "Response Headers" --> P2_6

    P2_3 <--> |"tls.connect Handshake"| E2_Host
    P2_4 <--> |"dns.resolveCaa, dns.resolveTxt"| E3_DNS
    P2_5 <--> |"HTTP probes (.env, .git/HEAD)"| E2_Host

    P2_1 -- "URL Entropy & Spoof Score" --> P2_7
    P2_2 -- "Redirect Chain & Status" --> P2_7
    P2_3 -- "Cert Validity, Cipher, Expiry" --> P2_7
    P2_4 -- "CAA, SPF, DMARC Findings" --> P2_7
    P2_5 -- "Exposed Files List" --> P2_7
    P2_6 -- "Cookie Flags & CORS Rigidity" --> P2_7

    P2_7 -- "Calculate Weighted Score (0-100), Grade (A+-F)" --> OutReport
    P2_7 -- "Append Scan Entry" --> D1_Store
    P2_7 -- "Update Trend Line" --> D3_Store
```

### 4.2 SEO & Tech Stack Engine (P3.0 & P4.0 Decomposition)

Decomposes the crawler, regex HTML parser, and technology signature matching engines.

```mermaid
flowchart LR
    TargetURL(["Sanitized Target URL"])

    subgraph SubEngine ["Processes 3.0 & 4.0: SEO & Tech Stack Pipeline"]
        Crawler["Crawler & Stream Fetcher<br/>(crawler.js)"]
        Parser["HTML Parser & DOM Extractor<br/>(htmlParser.js)"]
        TechMatcher["Tech Signature Matcher<br/>(techStack.js)"]
        SEOScorer["SEO Scoring Engine<br/>(scoring.js)"]
        LHSim["Simulated Lighthouse Auditor<br/>(lighthouseAuditor.js)"]
    end

    TargetHost([Target Server])
    D2_SEO[("D2: SEO History")]
    ClientOut(["Audit Results Payload"])

    TargetURL --> Crawler
    Crawler <--> |"Fetch Raw HTML Body"| TargetHost
    Crawler -- "Raw HTML + Headers" --> Parser
    Crawler -- "Response Headers" --> TechMatcher

    Parser -- "Meta Tags, Scripts, Links" --> TechMatcher
    Parser -- "DOM Structure, Headings, Alt Tags" --> SEOScorer
    Parser -- "Resource Hints, Scripts Count" --> LHSim

    TechMatcher -- "Detected CMS, CDN, Web Server" --> ClientOut
    SEOScorer -- "SEO Score & Checklist" --> ClientOut
    LHSim -- "Performance & Best Practices Score" --> ClientOut
    SEOScorer -- "Save Audit Record" --> D2_SEO
```

---

## 5. User Flow Diagram (UFD) / End-to-End User Journey

This diagram represents the operational workflow and decision trees experienced by a user or security researcher utilizing SecurIn.

```mermaid
sequenceDiagram
    autonumber
    actor User as Security Researcher / User
    participant Frontend as Web Client / Chrome Extension
    participant Router as API Gateway & Abuse Filter
    participant Security as Security Scan Orchestrator
    participant TechSEO as TechStack & SEO Engines
    participant Storage as In-Memory Storage

    User->>Frontend: Enters target URL (or clicks "Active Tab")
    User->>Frontend: Selects scan options (Include TechStack / Include SEO)
    Frontend->>Router: GET /api/scan?url={target}

    rect rgb(20, 20, 35)
        Note over Router: Perimeter Defense Checks
        Router->>Router: Validate protocol (HTTP/HTTPS only)
        Router->>Router: Check length & sanitize injection payloads
        Router->>Router: Check SSRF Filter (Block RFC 1918, 127.0.0.1, 169.254.169.254)
        Router->>Router: Sliding-window Rate Limit check
    end

    alt SSRF / Invalid URL Detected
        Router-->>Frontend: 400 Bad Request / 403 Forbidden (Violation reason)
        Frontend-->>User: Displays error notification & threat shield warning
    else Validation Successful
        par Concurrent Security Scanning
            Router->>Security: Execute performScan(targetUrl)
            Security->>Security: Fetch redirects & inspect headers
            Security->>Security: Parallel TLS cert check & DNS records lookup
            Security->>Security: Probe sensitive paths (.env, .git)
            Security->>Security: Evaluate 10 security channels & compute score
            Security->>Storage: Store scan record in D1 & D3
        and Concurrent Tech & SEO (if selected)
            Router->>TechSEO: Detect tech stack (headers & HTML signatures)
            Router->>TechSEO: Crawl HTML & compute SEO / Lighthouse metrics
            TechSEO->>Storage: Store SEO record in D2
        end

        Security-->>Frontend: Security posture report (Score, Grade, Findings)
        TechSEO-->>Frontend: Tech stack tags & SEO metrics
        Frontend-->>User: Renders Neo-Brutalist cards, metrics chips & checklist
    end

    opt Exporting Audit Results
        User->>Frontend: Clicks "Download PDF Report"
        Frontend->>Frontend: Client-side jsPDF renders branded security dossier
        Frontend-->>User: Downloads PDF file
    end
```

---

## 6. Data Dictionary & Data Stores (D1, D2, D3)

### Data Stores

| Store ID | Name                | Type                    | Scope                | Maximum Capacity                 | Key Attributes                                                              |
| -------- | ------------------- | ----------------------- | -------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| **D1**   | Scan History Store  | In-Memory Array         | FIFO Circular Buffer | 50 records                       | `timestamp`, `requestedUrl`, `finalUrl`, `score`, `grade`, `classification` |
| **D2**   | SEO History Store   | In-Memory Array         | FIFO Circular Buffer | 50 records                       | `timestamp`, `url`, `overallScore`, `categoryScores`, `metrics`             |
| **D3**   | Domain Trends Store | In-Memory Key-Value Map | Per-domain Array     | Unlimited domains (recent scans) | `domain` -> `[{ timestamp, score, grade }]`                                 |

### Data Flows

| Data Flow Name         | Source             | Destination             | Description                                                                         |
| ---------------------- | ------------------ | ----------------------- | ----------------------------------------------------------------------------------- |
| `Target_URL_Input`     | Client             | Process 1.0             | Raw URL provided by the user via web form or Chrome extension tab query.            |
| `Sanitized_Target`     | Process 1.0        | Processes 2.0, 3.0, 4.0 | URL verified to be valid HTTP/HTTPS and not pointing to internal/loopback IPs.      |
| `TLS_Certificate_Data` | Target Web Host    | Process 2.3             | X.509 certificate subject, issuer, validity period, SAN list, and protocol version. |
| `DNS_Security_Records` | DNS Infrastructure | Process 2.4             | CAA records, SPF directives, DMARC policy, and DNSSEC validation status.            |
| `Channel_Scores`       | Processes 2.1-2.6  | Process 2.7             | Scores earned across 10 evaluation vectors (0-100 normalized).                      |
| `Audit_Report_Payload` | Process 2.0        | Client                  | Final JSON report with overall score, letter grade, and remediation advisories.     |

---

## 7. Trust Boundaries & Security Safeguards

The Data Flow is governed by three critical **Trust Boundaries (TB)**:

```text
[Client / Browser]
       │  (TB-1: Untrusted Inbound Input)
       ▼
[Backend Router & SSRF Shield]
       │  (TB-2: Protected Internal Processing & Storage)
       ▼
[Core Scanners (TLS, DNS, HTTP Probers)]
       │  (TB-3: Untrusted Outbound Remote Networks)
       ▼
[Target Web Host / Third-Party DNS]
```

1. **TB-1 (Inbound Perimeter)**: User inputs are treated as completely untrusted. The backend enforces length limits (< 2048 chars), strips injection characters, and blocks protocols other than `http:` and `https:`.
2. **TB-2 (SSRF Shield)**: Outbound requests are vetted to prevent Server-Side Request Forgery. The system actively blocks:
   - Loopback addresses (`127.0.0.0/8`, `::1`, `localhost`)
   - Private RFC 1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
   - Link-local / Cloud metadata endpoints (`169.254.169.254`, `0.0.0.0/8`)
3. **TB-3 (Outbound Probe Isolation)**: Sensitive file scans and network redirect chains have strict timeout controls (5s per socket) and depth limits (maximum 5 redirects) to prevent denial-of-service or infinite loop conditions.
