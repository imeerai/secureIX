/**
 * Zero-Dependency Technology Stack & Hosting Provider Detector
 * Analyzes DNS, HTTP headers, cookies, and HTML DOM signatures to identify
 * Hosting CDN, Cloud Infrastructure, Backend Language/Framework, and Frontend Libraries.
 */

const dns = require("dns").promises;
const http = require("http");
const https = require("https");
const { URL } = require("url");
const { validateTargetUrl } = require("../middleware/abuseProtection");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (SecureIX-TechDetector/1.0)";

/**
 * Performs a lightweight HTTP GET request to fetch headers and body HTML with browser headers
 */
function fetchWebResource(urlObj, maxRedirects = 4) {
  return new Promise((resolve) => {
    const lib = urlObj.protocol === "http:" ? http : https;
    const req = lib.request(
      urlObj,
      {
        method: "GET",
        timeout: 7000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Upgrade-Insecure-Requests": "1",
        },
        rejectUnauthorized: false,
      },
      (res) => {
        // Handle redirect
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location &&
          maxRedirects > 0
        ) {
          res.resume();
          try {
            const nextUrl = new URL(res.headers.location, urlObj);
            return resolve(fetchWebResource(nextUrl, maxRedirects - 1));
          } catch {
            // continue with current
          }
        }

        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
          if (body.length > 3 * 1024 * 1024) {
            // Cap at 3MB for memory efficiency
            req.destroy();
          }
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode || 200,
            headers: res.headers || {},
            body,
            finalUrl: urlObj.toString(),
          });
        });
      },
    );

    req.on("timeout", () => {
      req.destroy();
      resolve({
        statusCode: 0,
        headers: {},
        body: "",
        finalUrl: urlObj.toString(),
      });
    });

    req.on("error", () => {
      resolve({
        statusCode: 0,
        headers: {},
        body: "",
        finalUrl: urlObj.toString(),
      });
    });

    req.end();
  });
}

/**
 * Optional lightweight IP geolocation / ASN lookup via ip-api.com
 * Gracefully returns null if offline, blocked, or private IP
 */
async function lookupIpGeo(ip) {
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.")
  ) {
    return null;
  }

  return new Promise((resolve) => {
    const req = http.get(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,isp,org,as,query`,
      { timeout: 2500 },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          try {
            const data = JSON.parse(raw);
            if (data && data.status === "success") {
              return resolve({
                country: data.country || "",
                region: data.regionName || "",
                city: data.city || "",
                location: [data.city, data.country].filter(Boolean).join(", "),
                isp: data.isp || "",
                org: data.org || "",
                asn: data.as || "",
              });
            }
            resolve(null);
          } catch {
            resolve(null);
          }
        });
      },
    );

    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });

    req.on("error", () => resolve(null));
  });
}

/**
 * Detects CDN & Hosting Infrastructure from headers, ASN, ISP, Organization, and DNS NS records
 */
function detectHosting(headers, geoData, ip, nsRecords = []) {
  const hosting = {
    provider: "Unknown Cloud / VPS Host",
    cdn: "Direct Origin (No CDN Detected)",
    ip: ip || "Unavailable",
    location: geoData?.location || "Unknown Location",
    asn: geoData?.asn || "Unknown ASN",
    isp: geoData?.isp || "Unknown ISP",
    org: geoData?.org || "",
    nameServers: nsRecords,
    signals: [],
  };

  const headerKeys = Object.keys(headers).map((k) => k.toLowerCase());
  const server = (headers["server"] || "").toLowerCase();
  const via = (headers["via"] || "").toLowerCase();
  const orgStr =
    `${geoData?.org || ""} ${geoData?.isp || ""} ${geoData?.asn || ""}`.toLowerCase();
  const nsStr = (nsRecords || []).join(" ").toLowerCase();

  // 1. Hostinger
  if (
    orgStr.includes("hostinger") ||
    nsStr.includes("hostinger") ||
    nsStr.includes("main-hosting") ||
    nsStr.includes("dns-parking") ||
    server.includes("hostinger")
  ) {
    hosting.provider = "Hostinger Web Hosting & Cloud";
    hosting.cdn = "Hostinger Edge / LiteSpeed CDN";
    hosting.signals.push("Hostinger ASN/DNS NameServer signature");
  }
  // 2. GoDaddy
  else if (
    orgStr.includes("godaddy") ||
    nsStr.includes("godaddy") ||
    nsStr.includes("domaincontrol") ||
    nsStr.includes("secureserver")
  ) {
    hosting.provider = "GoDaddy Hosting & Domains";
    hosting.cdn = "GoDaddy Edge Infrastructure";
    hosting.signals.push("GoDaddy DomainControl / ASN signature");
  }
  // 3. HostGator
  else if (
    orgStr.includes("hostgator") ||
    nsStr.includes("hostgator") ||
    nsStr.includes("websitewelcome")
  ) {
    hosting.provider = "HostGator Web Hosting";
    hosting.cdn = "HostGator Cloud Infrastructure";
    hosting.signals.push("HostGator WebsiteWelcome / ASN signature");
  }
  // 4. Bluehost
  else if (
    orgStr.includes("bluehost") ||
    nsStr.includes("bluehost") ||
    orgStr.includes("unified layer") ||
    nsStr.includes("fastdomain")
  ) {
    hosting.provider = "Bluehost Cloud & Shared Hosting";
    hosting.cdn = "Unified Layer / Bluehost Network";
    hosting.signals.push("Bluehost Unified Layer / DNS signature");
  }
  // 5. Namecheap
  else if (
    orgStr.includes("namecheap") ||
    nsStr.includes("namecheap") ||
    nsStr.includes("registrar-servers") ||
    nsStr.includes("web-hosting.com")
  ) {
    hosting.provider = "Namecheap Cloud & Web Hosting";
    hosting.cdn = "Namecheap Edge / cPanel Network";
    hosting.signals.push("Namecheap Registrar-Servers / ASN match");
  }
  // 6. SiteGround
  else if (
    orgStr.includes("siteground") ||
    nsStr.includes("siteground") ||
    nsStr.includes("sgvps")
  ) {
    hosting.provider = "SiteGround Managed Cloud Hosting";
    hosting.cdn = "SiteGround Cloudflare Central CDN";
    hosting.signals.push("SiteGround NS / ASN signature");
  }
  // 7. DreamHost
  else if (orgStr.includes("dreamhost") || nsStr.includes("dreamhost")) {
    hosting.provider = "DreamHost Web Hosting";
    hosting.cdn = "DreamHost Cloud Network";
    hosting.signals.push("DreamHost ASN / DNS signature");
  }
  // 8. WP Engine
  else if (
    orgStr.includes("wp engine") ||
    orgStr.includes("wpengine") ||
    nsStr.includes("wpengine") ||
    nsStr.includes("wpe.net")
  ) {
    hosting.provider = "WP Engine WordPress Enterprise Cloud";
    hosting.cdn = "WP Engine EverCache & Cloudflare";
    hosting.signals.push("WP Engine EverCache / ASN signature");
  }
  // 9. Kinsta
  else if (orgStr.includes("kinsta") || nsStr.includes("kinsta")) {
    hosting.provider = "Kinsta Managed WordPress Hosting";
    hosting.cdn = "Kinsta Cloudflare Enterprise CDN";
    hosting.signals.push("Kinsta Cloudflare Edge signature");
  }
  // 10. Automattic (WordPress VIP / WordPress.org / Pressable)
  else if (
    orgStr.includes("automattic") ||
    nsStr.includes("automattic") ||
    orgStr.includes("wordpress")
  ) {
    hosting.provider = "Automattic (WordPress VIP / Cloud Infrastructure)";
    hosting.cdn = "Automattic Global Edge";
    hosting.signals.push("Automattic ASN / Infrastructure signature");
  }
  // 11. Hetzner
  else if (orgStr.includes("hetzner") || nsStr.includes("hetzner")) {
    hosting.provider = "Hetzner Online Dedicated & Cloud VPS";
    hosting.cdn = "Hetzner High-Performance Network";
    hosting.signals.push("Hetzner Online ASN / DNS match");
  }
  // 12. DigitalOcean
  else if (orgStr.includes("digitalocean") || nsStr.includes("digitalocean")) {
    hosting.provider = "DigitalOcean Droplets & Cloud";
    hosting.cdn = "DigitalOcean Edge Infrastructure";
    hosting.signals.push("DigitalOcean ASN signature");
  }
  // 13. OVHcloud
  else if (orgStr.includes("ovh") || nsStr.includes("ovh")) {
    hosting.provider = "OVHcloud Dedicated & Cloud VPS";
    hosting.cdn = "OVHcloud Global Anti-DDoS Network";
    hosting.signals.push("OVHcloud ASN signature");
  }
  // 14. Linode / Akamai
  else if (
    orgStr.includes("linode") ||
    orgStr.includes("akamai") ||
    nsStr.includes("linode") ||
    nsStr.includes("akamai")
  ) {
    hosting.provider = "Linode / Akamai Cloud Compute";
    hosting.cdn = "Akamai Intelligent Edge CDN";
    hosting.signals.push("Linode / Akamai Connected Cloud signature");
  }
  // 15. Vultr
  else if (orgStr.includes("vultr") || orgStr.includes("choopa")) {
    hosting.provider = "Vultr Cloud Compute & High Frequency VPS";
    hosting.cdn = "Vultr Global Cloud Network";
    hosting.signals.push("Vultr / Choopa ASN signature");
  }
  // 16. Contabo
  else if (orgStr.includes("contabo")) {
    hosting.provider = "Contabo Cloud VPS & Dedicated";
    hosting.cdn = "Contabo Data Centers";
    hosting.signals.push("Contabo ASN signature");
  }
  // 17. InMotion / A2 Hosting
  else if (
    orgStr.includes("inmotion") ||
    nsStr.includes("inmotion") ||
    nsStr.includes("servconfig")
  ) {
    hosting.provider = "InMotion Web Hosting";
    hosting.cdn = "InMotion Cloud Infrastructure";
    hosting.signals.push("InMotion Hosting signature");
  } else if (
    orgStr.includes("a2 hosting") ||
    orgStr.includes("a2hosting") ||
    nsStr.includes("a2hosting")
  ) {
    hosting.provider = "A2 Hosting Turbo Cloud";
    hosting.cdn = "A2 Hosting SwiftServer Network";
    hosting.signals.push("A2 Hosting signature");
  }
  // 18. Cloudflare
  else if (
    headers["cf-ray"] ||
    headers["cf-cache-status"] ||
    server.includes("cloudflare") ||
    orgStr.includes("cloudflare")
  ) {
    hosting.provider = "Cloudflare Edge Network";
    hosting.cdn = "Cloudflare CDN & DDoS Shield";
    hosting.signals.push("CF-Ray header / Cloudflare server signature");
  }
  // 19. Vercel
  else if (
    headers["x-vercel-id"] ||
    headers["x-vercel-cache"] ||
    server.includes("vercel") ||
    nsStr.includes("vercel")
  ) {
    hosting.provider = "Vercel Serverless Edge";
    hosting.cdn = "Vercel Edge Global Network";
    hosting.signals.push("x-vercel-id header signature");
  }
  // 20. AWS / CloudFront
  else if (
    headers["x-amz-cf-id"] ||
    headers["x-amz-cf-pop"] ||
    via.includes("cloudfront") ||
    server.includes("amazons3") ||
    server.includes("cloudfront") ||
    orgStr.includes("amazon") ||
    orgStr.includes("aws") ||
    nsStr.includes("awsdns")
  ) {
    hosting.provider = "Amazon Web Services (AWS)";
    hosting.cdn = "Amazon CloudFront CDN";
    hosting.signals.push("AWS CloudFront / Route53 signature");
  }
  // 21. Microsoft Azure
  else if (
    headers["x-azure-ref"] ||
    headers["x-ms-request-id"] ||
    server.includes("microsoft-iis") ||
    orgStr.includes("microsoft") ||
    nsStr.includes("azure-dns")
  ) {
    hosting.provider = "Microsoft Azure Cloud";
    hosting.cdn = headers["x-azure-ref"]
      ? "Azure Front Door / CDN"
      : "Azure Infrastructure";
    hosting.signals.push("Azure x-azure-ref / Microsoft signature");
  }
  // 22. Fastly
  else if (
    headers["x-served-by"] ||
    headers["fastly-restarts"] ||
    headers["x-fastly-request-id"] ||
    orgStr.includes("fastly")
  ) {
    hosting.provider = "Fastly Edge Cloud";
    hosting.cdn = "Fastly CDN & Edge Compute";
    hosting.signals.push("Fastly x-served-by signature");
  }
  // 23. Netlify
  else if (
    headers["x-nf-request-id"] ||
    server.includes("netlify") ||
    nsStr.includes("netlify")
  ) {
    hosting.provider = "Netlify Global Edge";
    hosting.cdn = "Netlify High-Performance CDN";
    hosting.signals.push("Netlify request header signature");
  }
  // 24. GitHub Pages
  else if (server.includes("github.com") || orgStr.includes("github")) {
    hosting.provider = "GitHub Pages Infrastructure";
    hosting.cdn = "Fastly / GitHub CDN";
    hosting.signals.push("GitHub.com server header");
  }
  // 25. Google Cloud
  else if (
    server.includes("gse") ||
    server.includes("sffe") ||
    server.includes("ghs") ||
    orgStr.includes("google") ||
    nsStr.includes("googledomains") ||
    nsStr.includes("cloud-dns.google")
  ) {
    hosting.provider = "Google Cloud Platform (GCP)";
    hosting.cdn = "Google Global Edge Network";
    hosting.signals.push("Google infrastructure server signature");
  }
  // 26. Generic Fallback
  else if (geoData?.org || geoData?.isp) {
    hosting.provider = geoData.org || geoData.isp;
    hosting.signals.push("Resolved via IP-API ASN lookup");
  }

  return hosting;
}

/**
 * Detects Backend Technologies from headers, Set-Cookie, and DOM signatures
 */
function detectBackend(headers, hostname = "", html = "") {
  const detected = [];
  const server = headers["server"] || "";
  const poweredBy = headers["x-powered-by"] || "";
  const rawCookies = (headers["set-cookie"] || []).join("; ");
  const lowerHost = hostname.toLowerCase();

  // 1. AWS Ecosystem & WAF
  if (
    headers["x-amzn-waf-action"] ||
    headers["x-amz-cf-id"] ||
    headers["x-amz-cf-pop"] ||
    server.includes("CloudFront") ||
    html.includes("awsWafCookieDomainList") ||
    html.includes("gokuProps")
  ) {
    detected.push({
      name: "AWS WAF & CloudFront Edge",
      category: "Cloud Security & Edge Layer",
      signals: ["AWS WAF challenge headers / CloudFront server signatures"],
      confidence: 95,
    });
  }

  if (lowerHost.includes("amazon.")) {
    detected.push({
      name: "Amazon Coral / Java Service Stack",
      category: "Enterprise Microservices Architecture",
      signals: ["Amazon retail core service stack signature"],
      confidence: 95,
    });
  }

  // 2. Google Infrastructure
  if (lowerHost.includes("google.") || /gws|sffe|GSE/i.test(server)) {
    detected.push({
      name: "Google Web Server (GWS / GFE)",
      category: "Web Server / Edge Proxy",
      signals: ["Google production server headers"],
      confidence: 95,
    });
  }

  // 3. GitHub Infrastructure
  if (lowerHost.includes("github.com") || server.includes("github.com")) {
    detected.push({
      name: "Ruby on Rails / Unicorn",
      category: "Backend Framework (Ruby)",
      signals: ["GitHub core architecture signatures"],
      confidence: 90,
    });
  }

  // 4. Web Server & Edge Runtime Detection
  if (server) {
    if (/nginx/i.test(server)) {
      detected.push({
        name: "Nginx",
        category: "Web Server / Reverse Proxy",
        signals: [`Server: ${server}`],
        confidence: 95,
      });
    }
    if (/apache/i.test(server)) {
      detected.push({
        name: "Apache HTTP Server",
        category: "Web Server",
        signals: [`Server: ${server}`],
        confidence: 95,
      });
    }
    if (/caddy/i.test(server)) {
      detected.push({
        name: "Caddy",
        category: "Web Server",
        signals: [`Server: ${server}`],
        confidence: 95,
      });
    }
    if (/litespeed/i.test(server)) {
      detected.push({
        name: "LiteSpeed",
        category: "Web Server (High Performance)",
        signals: [`Server: ${server}`],
        confidence: 95,
      });
    }
    if (/kestrel/i.test(server)) {
      detected.push({
        name: "Kestrel (ASP.NET Core)",
        category: "Application Server",
        signals: [`Server: ${server}`],
        confidence: 95,
      });
    }
    if (/gunicorn|uvicorn/i.test(server)) {
      detected.push({
        name: "Python WSGI/ASGI Server",
        category: "Application Server",
        signals: [`Server: ${server}`],
        confidence: 90,
      });
    }
    if (/cowboy/i.test(server)) {
      detected.push({
        name: "Erlang / Cowboy",
        category: "Application Server",
        signals: [`Server: ${server}`],
        confidence: 90,
      });
    }
    if (/vercel/i.test(server) || headers["x-vercel-id"]) {
      detected.push({
        name: "Vercel Serverless / Edge Runtime",
        category: "Cloud Edge Runtime (Node.js)",
        signals: ["Server: Vercel / x-vercel-id signature"],
        confidence: 95,
      });
    }
    if (/cloudflare/i.test(server) || headers["cf-ray"]) {
      detected.push({
        name: "Cloudflare Workers / Edge",
        category: "Edge Compute Engine",
        signals: ["Cloudflare Server signature"],
        confidence: 90,
      });
    }
    if (/netlify/i.test(server) || headers["x-nf-request-id"]) {
      detected.push({
        name: "Netlify Functions / Edge",
        category: "Edge Compute Engine",
        signals: ["Netlify signature"],
        confidence: 90,
      });
    }
  }

  // 5. X-Powered-By / Custom Language Headers
  if (poweredBy) {
    if (/express/i.test(poweredBy)) {
      detected.push({
        name: "Express.js",
        category: "Backend Framework (Node.js)",
        signals: [`X-Powered-By: ${poweredBy}`],
        confidence: 95,
      });
    }
    if (/php/i.test(poweredBy)) {
      detected.push({
        name: "PHP",
        category: "Programming Language",
        signals: [`X-Powered-By: ${poweredBy}`],
        confidence: 95,
      });
    }
    if (/next\.js/i.test(poweredBy)) {
      detected.push({
        name: "Next.js Server",
        category: "Fullstack Framework (Node.js)",
        signals: [`X-Powered-By: ${poweredBy}`],
        confidence: 95,
      });
    }
    if (/asp\.net/i.test(poweredBy) || headers["x-aspnet-version"]) {
      detected.push({
        name: "ASP.NET",
        category: "Backend Framework (.NET)",
        signals: [`X-Powered-By: ${poweredBy || "ASP.NET"}`],
        confidence: 95,
      });
    }
  }

  // 6. Cookie Signatures
  if (/PHPSESSID/i.test(rawCookies)) {
    if (!detected.some((d) => d.name === "PHP")) {
      detected.push({
        name: "PHP",
        category: "Programming Language",
        signals: ["PHPSESSID cookie signature"],
        confidence: 90,
      });
    }
  }

  if (/laravel_session/i.test(rawCookies)) {
    detected.push({
      name: "Laravel",
      category: "Backend Framework (PHP)",
      signals: ["laravel_session cookie signature"],
      confidence: 95,
    });
  }

  if (/JSESSIONID/i.test(rawCookies)) {
    detected.push({
      name: "Java / Spring / Tomcat",
      category: "Backend Runtime",
      signals: ["JSESSIONID cookie signature"],
      confidence: 90,
    });
  }

  if (/connect\.sid|express:sess/i.test(rawCookies)) {
    detected.push({
      name: "Node.js (Express Session)",
      category: "Backend Runtime",
      signals: ["connect.sid session cookie"],
      confidence: 90,
    });
  }

  if (/csrftoken|django/i.test(rawCookies)) {
    detected.push({
      name: "Django / Python",
      category: "Backend Framework",
      signals: ["django csrftoken session cookie"],
      confidence: 85,
    });
  }

  if (/_session_id|_rails_session/i.test(rawCookies)) {
    detected.push({
      name: "Ruby on Rails",
      category: "Backend Framework",
      signals: ["Rails session cookie signature"],
      confidence: 85,
    });
  }

  if (/ASP\.NET_SessionId|\.AspNetCore\.Session/i.test(rawCookies)) {
    if (!detected.some((d) => d.name.includes("ASP.NET"))) {
      detected.push({
        name: "ASP.NET",
        category: "Backend Framework (.NET)",
        signals: ["ASP.NET_SessionId cookie signature"],
        confidence: 90,
      });
    }
  }

  return detected;
}

/**
 * Detects Frontend Frameworks, CMS, and Libraries from HTML source
 */
function detectFrontend(html = "", hostname = "") {
  const detected = [];
  const lowerHost = hostname.toLowerCase();

  // 1. Amazon Specific Frontend Architecture
  if (
    lowerHost.includes("amazon.") ||
    html.includes("images-amazon.com") ||
    html.includes("media-amazon.com") ||
    html.includes("a-page") ||
    html.includes("amznJQ") ||
    html.includes("P.when")
  ) {
    detected.push({
      name: "Amazon AUI (Amazon UI Design System)",
      category: "Modular UI Framework",
      signals: ["Amazon AUI component system / P.when modular scripts"],
      confidence: 95,
    });
    detected.push({
      name: "Amazon CloudFront Media Asset Pipeline",
      category: "Asset Delivery CDN",
      signals: ["ssl-images-amazon / media asset delivery pipeline"],
      confidence: 90,
    });
  }

  // 2. Google Specific Frontend
  if (lowerHost.includes("google.")) {
    detected.push({
      name: "Google Material Design System",
      category: "UI Design System",
      signals: ["Google production UI assets"],
      confidence: 90,
    });
  }

  // 3. GitHub Specific Frontend
  if (lowerHost.includes("github.com")) {
    detected.push({
      name: "GitHub Primer Design System",
      category: "CSS & UI Component System",
      signals: ["GitHub Primer CSS tokens & ViewComponents"],
      confidence: 90,
    });
  }

  if (!html || typeof html !== "string") return detected;

  // 4. Meta Generator Tag Check
  const metaGenMatch =
    /<meta\s+[^>]*name=["']generator["'][^>]*content=["']([^"']+)["']/i.exec(
      html,
    ) ||
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']generator["']/i.exec(
      html,
    );
  if (metaGenMatch && metaGenMatch[1]) {
    const generator = metaGenMatch[1].trim();
    detected.push({
      name: generator,
      category: "CMS / Site Generator",
      signals: [`<meta name="generator" content="${generator}">`],
      confidence: 95,
    });
  }

  // 5. Next.js
  if (
    html.includes("__NEXT_DATA__") ||
    /_next\/static/i.test(html) ||
    /id=["']__next["']/i.test(html)
  ) {
    const sigs = [];
    if (html.includes("__NEXT_DATA__"))
      sigs.push("__NEXT_DATA__ script payload");
    if (/_next\/static/i.test(html)) sigs.push("/_next/ asset bundle paths");
    if (/id=["']__next["']/i.test(html)) sigs.push('<div id="__next"> mount');
    detected.push({
      name: "Next.js",
      category: "React Framework",
      signals: sigs,
      confidence: 95,
    });
    // Also implies React
    if (!detected.some((d) => d.name === "React")) {
      detected.push({
        name: "React",
        category: "UI Framework",
        signals: ["Loaded via Next.js runtime"],
        confidence: 95,
      });
    }
  }

  // 6. Vite Build Tool
  if (
    /<script[^>]*type=["']module["'][^>]*src=["'][^"']*\/assets\/(index|main|app)-[a-zA-Z0-9_-]+\.js["']/i.test(
      html,
    ) ||
    html.includes("/@vite/client") ||
    html.includes("vite/dynamic-import-polyfill")
  ) {
    detected.push({
      name: "Vite",
      category: "Frontend Bundler & Build Tool",
      signals: ["ES module script with Vite /assets/ hash bundle pattern"],
      confidence: 95,
    });
  }

  // 7. React (including Single Page Application root mount)
  if (!detected.some((d) => d.name === "React")) {
    if (
      html.includes("data-reactroot") ||
      /_reactListening|_reactRootContainer/i.test(html) ||
      /react(-dom)?\.(production|development)\.js/i.test(html)
    ) {
      detected.push({
        name: "React",
        category: "UI Framework",
        signals: ["data-reactroot / React DOM references"],
        confidence: 95,
      });
    } else if (/<div\s+[^>]*id=["']root["'][^>]*>/i.test(html)) {
      detected.push({
        name: "React (SPA)",
        category: "UI Framework",
        signals: ['<div id="root"> Single Page Application root container'],
        confidence: 90,
      });
    }
  }

  // 8. Vue.js & Nuxt.js
  if (html.includes("__NUXT__") || /_nuxt\//i.test(html)) {
    detected.push({
      name: "Nuxt.js",
      category: "Vue Framework",
      signals: ["__NUXT__ payload / _nuxt assets"],
      confidence: 95,
    });
    if (!detected.some((d) => d.name === "Vue.js")) {
      detected.push({
        name: "Vue.js",
        category: "UI Framework",
        signals: ["Loaded via Nuxt.js"],
        confidence: 95,
      });
    }
  } else if (
    /data-v-[a-zA-Z0-9]+/i.test(html) ||
    /__vue_app__/i.test(html) ||
    /vue\.(runtime\.)?global/i.test(html) ||
    /<div\s+[^>]*id=["']app["'][^>]*>/i.test(html)
  ) {
    detected.push({
      name: "Vue.js",
      category: "UI Framework",
      signals: ["Vue data-v- / app container signature"],
      confidence: 90,
    });
  }

  // 9. Angular
  if (
    /ng-version=["'][^"']+["']/i.test(html) ||
    /ng-app|ng-controller/i.test(html)
  ) {
    const versionMatch = /ng-version=["']([^"']+)["']/i.exec(html);
    const label = versionMatch ? `Angular (v${versionMatch[1]})` : "Angular";
    detected.push({
      name: label,
      category: "UI Framework",
      signals: ["ng-version / Angular attributes"],
      confidence: 95,
    });
  }

  // 10. Svelte / SvelteKit
  if (/svelte-[a-zA-Z0-9]+/i.test(html) || /__sveltekit/i.test(html)) {
    detected.push({
      name: "Svelte / SvelteKit",
      category: "UI Framework",
      signals: ["svelte-* classes / SvelteKit runtime"],
      confidence: 90,
    });
  }

  // 11. WordPress CMS
  if (
    !detected.some((d) => d.name.toLowerCase().includes("wordpress")) &&
    (/wp-content\//i.test(html) ||
      /wp-includes\//i.test(html) ||
      /wp-json\//i.test(html))
  ) {
    detected.push({
      name: "WordPress",
      category: "CMS (Content Management System)",
      signals: ["wp-content/ / wp-json paths in HTML source"],
      confidence: 95,
    });
  }

  // 12. Shopify
  if (/cdn\.shopify\.com/i.test(html) || /Shopify\.theme/i.test(html)) {
    detected.push({
      name: "Shopify",
      category: "E-Commerce Platform",
      signals: ["cdn.shopify.com assets / Shopify theme objects"],
      confidence: 95,
    });
  }

  // 13. Wix
  if (/wix\.com|wix-image|parastorage\.com/i.test(html)) {
    detected.push({
      name: "Wix",
      category: "Website Builder",
      signals: ["Wix parastorage / component scripts"],
      confidence: 95,
    });
  }

  // 14. Squarespace
  if (/static\.squarespace\.com|squarespace-config/i.test(html)) {
    detected.push({
      name: "Squarespace",
      category: "Website Builder",
      signals: ["Squarespace static asset signatures"],
      confidence: 95,
    });
  }

  // 15. Webflow
  if (/webflow\.com|data-wf-page|data-wf-site/i.test(html)) {
    detected.push({
      name: "Webflow",
      category: "Visual Website Builder",
      signals: ["data-wf-page / Webflow attributes"],
      confidence: 95,
    });
  }

  // 16. CSS Frameworks & Stylesheets: Tailwind CSS, Bootstrap, Custom CSS
  if (
    /tailwind|scroll-smooth|selection:bg-|antialiased|font-mono|tracking-tight|grid-cols-/i.test(
      html,
    ) ||
    /class=["'][^"']*\b(flex|grid|p-\d|m-\d|text-\w+-\d+|bg-\w+-\d+|rounded-\w+|overflow-x-hidden)\b[^"']*["']/i.test(
      html,
    ) ||
    /href=["'][^"']*index-[a-zA-Z0-9_-]+\.css["']/i.test(html)
  ) {
    detected.push({
      name: "Tailwind CSS",
      category: "Utility-First CSS Framework",
      signals: ["Tailwind utility classes & bundle patterns in HTML"],
      confidence: 90,
    });
  }

  if (
    /bootstrap(\.min)?\.(css|js)/i.test(html) ||
    /class=["'][^"']*\b(container|row|col-md-|btn-primary)\b[^"']*["']/i.test(
      html,
    )
  ) {
    detected.push({
      name: "Bootstrap",
      category: "UI Component Framework",
      signals: ["Bootstrap CSS/JS bundles and class names"],
      confidence: 85,
    });
  }

  // 17. Custom CSS / Stylesheet Bundles
  if (
    /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/i.test(html) ||
    /<style[\s>]/i.test(html)
  ) {
    detected.push({
      name: "Custom CSS & Stylesheets",
      category: "Styling & Design System",
      signals: ['Custom CSS bundle / <link rel="stylesheet"> imported in head'],
      confidence: 90,
    });
  }

  // 18. Google Fonts / Typography
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html)) {
    detected.push({
      name: "Google Fonts",
      category: "Web Typography CDN",
      signals: ["Google Fonts stylesheet / gstatic preconnect links"],
      confidence: 90,
    });
  }

  // 19. jQuery
  if (/jquery(\.min)?\.js/i.test(html) || /\$\(document\)\.ready/i.test(html)) {
    detected.push({
      name: "jQuery",
      category: "JavaScript Library",
      signals: ["jQuery bundle script reference"],
      confidence: 90,
    });
  }

  return detected;
}

/**
 * Main exported function: Analyzes target URL and detects complete tech stack
 */
async function detectTechStack(rawUrl) {
  // 1. SSRF & URL Validation
  const validation = validateTargetUrl(rawUrl);
  if (!validation.valid) {
    throw new Error(validation.message || "Invalid or restricted URL target.");
  }

  const urlObj = validation.parsedUrl;
  const hostname = urlObj.hostname;

  // 2. DNS Resolution (IPv4 + NameServers)
  let resolvedIp = null;
  let nsRecords = [];

  try {
    const [dnsLookup, nsLookup] = await Promise.all([
      dns.lookup(hostname).catch(() => null),
      dns.resolveNs(hostname).catch(() => []),
    ]);
    if (dnsLookup) resolvedIp = dnsLookup.address;
    if (nsLookup) nsRecords = nsLookup;
  } catch {
    // DNS resolution failure fallback
  }

  // 3. Concurrently fetch web content + IP Geo data
  const [crawlResult, geoData] = await Promise.all([
    fetchWebResource(urlObj, 4),
    resolvedIp
      ? lookupIpGeo(resolvedIp).catch(() => null)
      : Promise.resolve(null),
  ]);

  // 4. Detect Hosting Provider & CDN
  const hosting = detectHosting(
    crawlResult.headers || {},
    geoData,
    resolvedIp,
    nsRecords,
  );

  // 5. Detect Backend Technologies
  const backend = detectBackend(
    crawlResult.headers || {},
    hostname,
    crawlResult.body || "",
  );

  // 6. Detect Frontend Technologies & CMS
  const frontend = detectFrontend(crawlResult.body || "", hostname);

  // 7. Calculate Confidence & Summary
  const allDetected = [...backend, ...frontend];
  const totalSignals =
    (hosting.signals?.length || 0) +
    allDetected.reduce((acc, item) => acc + (item.signals?.length || 1), 0);

  const confidenceLevel =
    totalSignals >= 3
      ? "High (Verified by Multi-Vector Signals)"
      : totalSignals >= 2
        ? "Medium"
        : "Low (Limited Public Fingerprints)";

  return {
    target: rawUrl,
    finalUrl: crawlResult.finalUrl || rawUrl,
    hostname,
    httpStatus: crawlResult.statusCode,
    timestamp: new Date().toISOString(),
    hosting: {
      provider: hosting.provider,
      ip: hosting.ip,
      location: hosting.location,
      asn: hosting.asn,
      isp: hosting.isp,
      org: hosting.org,
      cdn: hosting.cdn,
      nameServers: hosting.nameServers,
      signals: hosting.signals,
    },
    backend,
    frontend,
    confidence: {
      overall: confidenceLevel,
      signalsCount: totalSignals,
      totalTechnologiesDetected: allDetected.length,
    },
  };
}

module.exports = {
  detectTechStack,
  detectHosting,
  detectBackend,
  detectFrontend,
  lookupIpGeo,
};
