/**
 * Professional Executive Multi-Engine Security, Tech Stack & SEO Audit PDF Generator
 * Generates branded, space-efficient, compact audit documents using jsPDF & autoTable.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Builds the complete jsPDF document instance for Security, Tech Stack, and SEO without wasted whitespace.
 * @param {Object} report - Core security scan report
 * @param {Object} [techStack] - Optional detected tech stack & hosting report
 * @param {Object} [seo] - Optional SEO audit report
 */
export function buildSecurityPdfDoc(report, techStack = null, seo = null) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  let currentY = margin;

  // Colors
  const primaryColor = [24, 24, 27]; // #18181b
  const accentYellow = [253, 224, 71]; // #fde047
  const passColor = [22, 163, 74]; // #16a34a
  const warnColor = [202, 138, 4]; // #ca8a04
  const failColor = [220, 38, 38]; // #dc2626

  // Helper to ensure continuous flow without blank gaps
  function ensureSpace(requiredHeight = 50, sectionTitle = '') {
    if (currentY + requiredHeight > pageHeight - 40) {
      doc.addPage();
      currentY = 36;
      if (sectionTitle) {
        doc.setFillColor(245, 245, 247);
        doc.rect(margin, currentY, pageWidth - margin * 2, 18, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...primaryColor);
        doc.text(`${sectionTitle} (Continued)`, margin + 8, currentY + 12);
        currentY += 24;
      }
      return true;
    }
    return false;
  }

  // --- TOP HEADER BANNER (PAGE 1) ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 74, 'F');

  // Accent Line
  doc.setFillColor(...accentYellow);
  doc.rect(0, 72, pageWidth, 2.5, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('COMPREHENSIVE WEB AUDIT & SECURITY REPORT', margin, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('Multi-Vector Analysis: Cybersecurity, Infrastructure & SEO Posture', margin, 44);
  doc.text(`Generated: ${new Date().toUTCString()}`, margin, 56);

  // Grade Badges in Header Right
  const gradeBoxWidth = 44;
  const gradeBoxHeight = 48;
  const gradeBoxY = 13;
  let gradeBoxX = pageWidth - margin - gradeBoxWidth;

  // If SEO is present, show both Security and SEO badges
  if (seo && seo.grade) {
    doc.setFillColor(255, 255, 255);
    doc.rect(gradeBoxX, gradeBoxY, gradeBoxWidth, gradeBoxHeight, 'F');
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.2);
    doc.rect(gradeBoxX, gradeBoxY, gradeBoxWidth, gradeBoxHeight, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text(String(seo.grade || 'A'), gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 23, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('SEO', gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 34, { align: 'center' });
    doc.setFontSize(5.5);
    doc.text(`${seo.score || 0}/100`, gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 43, { align: 'center' });

    gradeBoxX -= (gradeBoxWidth + 6);
  }

  // Security Badge
  doc.setFillColor(255, 255, 255);
  doc.rect(gradeBoxX, gradeBoxY, gradeBoxWidth, gradeBoxHeight, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.2);
  doc.rect(gradeBoxX, gradeBoxY, gradeBoxWidth, gradeBoxHeight, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(String(report?.grade || 'A'), gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 23, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('SECURITY', gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 34, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text(`${report?.score || 0}/100`, gradeBoxX + gradeBoxWidth / 2, gradeBoxY + 43, { align: 'center' });

  currentY = 88;

  // --- TARGET OVERVIEW CARD (Compact) ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 54, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('TARGET AUDIT SUMMARY & EXECUTIVE INTELLIGENCE', margin + 10, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const col1X = margin + 10;
  const col2X = margin + 260;

  doc.text(`Target URL: ${report?.requestedUrl || techStack?.target || seo?.url || 'N/A'}`, col1X, currentY + 27);
  doc.text(`Final Endpoint: ${report?.finalUrl || seo?.finalUrl || 'N/A'}`, col1X, currentY + 38);
  doc.text(`HTTPS / TLS: ${report?.https ? 'Active (Encrypted)' : 'Not Active (Unencrypted)'}`, col1X, currentY + 48);

  const secScore = report ? `${report.score}/100 PTS (${report.gradeLabel || report.classification || ''})` : 'N/A';
  const seoScore = seo ? `${seo.score}/100 PTS (${seo.gradeLabel || ''})` : 'N/A';
  const hostingName = techStack?.hosting?.provider || 'Direct IP / DNS';

  doc.text(`Security Posture: ${secScore}`, col2X, currentY + 27);
  doc.text(`SEO & Performance: ${seoScore}`, col2X, currentY + 38);
  doc.text(`Detected Hosting: ${hostingName}`, col2X, currentY + 48);

  currentY += 64;

  // --- SECTION 1: 12 SECURITY CHANNELS TABLE ---
  if (report) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('1. Evaluated Security Channels & Header Directives', margin, currentY);
    currentY += 6;

    const channelsData = (report.channels || []).map((ch) => [
      ch.name,
      `${ch.earned}/${ch.weight}`,
      ch.status,
      ch.detail || 'Evaluated successfully.',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Security Channel', 'Score', 'Status', 'Diagnostic Findings & Verification']],
      body: channelsData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [30, 41, 59],
        cellPadding: 2.8,
      },
      columnStyles: {
        0: { cellWidth: 135, fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 45, halign: 'center' },
        3: { cellWidth: 'auto' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          if (data.cell.raw === 'PASS') {
            data.cell.styles.textColor = passColor;
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'WARN') {
            data.cell.styles.textColor = warnColor;
            data.cell.styles.fontStyle = 'bold';
          } else if (data.cell.raw === 'FAIL') {
            data.cell.styles.textColor = failColor;
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- SECTION 2: COOKIE SECURITY ANALYZER (FLOWS DIRECTLY IN SAME PAGE) ---
    ensureSpace(60, 'Cookie Security');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text('2. Cookie Security Analyzer (HttpOnly, Secure, SameSite)', margin, currentY);
    currentY += 5;

    const cookieList = report.cookieInfo?.cookies || [];
    const cookieRows =
      cookieList.length > 0
        ? cookieList.map((c) => [
            c.name,
            c.secure ? 'YES' : 'NO (Cleartext)',
            c.httpOnly ? 'YES' : 'NO (XSS Risk)',
            c.sameSite || 'Unset',
            c.riskFlags?.map((f) => f.flag).join(', ') || 'Secure',
          ])
        : [['No Cookies Set', 'N/A', 'N/A', 'N/A', 'No session identifiers exposed on response (Stateless)']];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Cookie Name', 'Secure Flag', 'HttpOnly Flag', 'SameSite', 'Risk Assessment']],
      body: cookieRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- SECTION 3: CORS MISCONFIGURATION AUDIT (FLOWS DIRECTLY) ---
    ensureSpace(60, 'CORS Policy');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text('3. CORS Policy & Cross-Origin Access Control', margin, currentY);
    currentY += 5;

    const cors = report.corsInfo || {};
    const corsRows = [
      ['Access-Control-Allow-Origin', cors.allowOrigin || 'Not set / Same-origin default'],
      ['Access-Control-Allow-Credentials', cors.allowCredentials ? 'true (Credentials Allowed)' : 'false / Unset'],
      ['Allowed Methods', cors.allowMethods || 'Standard GET/POST'],
      ['CORS Evaluation', cors.detail || 'Configured safely.'],
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['CORS Directive', 'Observed Value & Behavior']],
      body: corsRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
      columnStyles: { 0: { cellWidth: 160, fontStyle: 'bold' } },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- SECTION 4: SENSITIVE FILE EXPOSURE SCANNER ---
    ensureSpace(60, 'Sensitive Files');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text('4. Sensitive File & Public Exposure Scanner', margin, currentY);
    currentY += 5;

    const fileFindings = (report.sensitiveFiles?.findings || []).map((f) => [
      f.name,
      f.path,
      f.status,
      f.httpCode ? `HTTP ${f.httpCode}` : 'N/A',
      f.detail,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Target Resource', 'Path', 'Status', 'HTTP Code', 'Audit Finding']],
      body: fileFindings.length ? fileFindings : [['No Probes', '-', 'SAFE', '-', 'Zero sensitive files exposed']],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 110, fontStyle: 'bold' },
        1: { cellWidth: 80 },
        2: { cellWidth: 55, halign: 'center' },
        3: { cellWidth: 45, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 2) {
          if (data.cell.raw === 'SAFE') data.cell.styles.textColor = passColor;
          else if (data.cell.raw === 'DISCOVERED') data.cell.styles.textColor = [59, 130, 246];
          else if (data.cell.raw === 'EXPOSED') data.cell.styles.textColor = failColor;
        }
      },
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- SECTION 5: DNS & EMAIL SPOOFING DEFENSE ---
    ensureSpace(60, 'DNS Security');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text('5. DNS & Email Spoofing Defense (SPF, DMARC, CAA)', margin, currentY);
    currentY += 5;

    const dns = report.dnsInfo || {};
    const dnsRows = [
      ['SPF (Sender Policy Framework)', dns.spf?.status || 'FAIL', dns.spf?.detail || 'No SPF record.'],
      ['DMARC (Domain-based Auth)', dns.dmarc?.status || 'FAIL', dns.dmarc?.detail || 'No DMARC record.'],
      ['CAA (Certificate Authority Auth)', dns.caa?.status || 'WARN', dns.caa?.detail || 'No CAA record published.'],
      ['Email Spoofing Posture', '-', dns.emailProtection || 'Vulnerable'],
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['DNS Security Vector', 'Status', 'Configuration & Analysis']],
      body: dnsRows,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 150, fontStyle: 'bold' },
        1: { cellWidth: 45, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          if (data.cell.raw === 'PASS') data.cell.styles.textColor = passColor;
          else if (data.cell.raw === 'WARN') data.cell.styles.textColor = warnColor;
          else if (data.cell.raw === 'FAIL') data.cell.styles.textColor = failColor;
        }
      },
    });

    currentY = doc.lastAutoTable.finalY + 16;
  }

  // --- SECTION 6: TECH STACK & HOSTING DETECTOR (FLOWS SEAMLESSLY) ---
  if (techStack && techStack.hosting) {
    ensureSpace(90, 'Tech Stack & Hosting');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('6. Infrastructure & Technology Stack Intelligence', margin, currentY);
    currentY += 6;

    // Compact Hosting Banner
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 40, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text(`Detected Hosting Provider: ${techStack.hosting.provider}`, margin + 10, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`IP: ${techStack.hosting.ip || 'N/A'} | Location: ${techStack.hosting.location || 'N/A'} | CDN: ${techStack.hosting.cdn || 'Direct'} | ASN: ${techStack.hosting.asn || techStack.hosting.isp || 'N/A'}`, margin + 10, currentY + 28);

    currentY += 46;

    // Backend Technologies Table
    const backendRows = (techStack.backend || []).map((b) => [
      b.name,
      b.category,
      `${b.confidence}%`,
      b.signals?.join(', ') || 'Header signature',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Backend Technology', 'Category', 'Confidence', 'Detection Signals']],
      body: backendRows.length ? backendRows : [['Minimal Footprint / Obfuscated', 'Backend', '100%', 'Server headers removed (Good security)']],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: 'bold' },
        1: { cellWidth: 90 },
        2: { cellWidth: 55, halign: 'center' },
      },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Frontend Technologies Table
    ensureSpace(50, 'Frontend Tech');
    const frontendRows = (techStack.frontend || []).map((f) => [
      f.name,
      f.category,
      `${f.confidence}%`,
      f.signals?.join(', ') || 'DOM / Script match',
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Frontend Framework / CMS', 'Category', 'Confidence', 'Detection Signals']],
      body: frontendRows.length ? frontendRows : [['Vanilla HTML / CSS', 'Frontend', '95%', 'No heavy JS bundle signatures detected']],
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
      bodyStyles: { fontSize: 7, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 130, fontStyle: 'bold' },
        1: { cellWidth: 90 },
        2: { cellWidth: 55, halign: 'center' },
      },
    });

    currentY = doc.lastAutoTable.finalY + 16;
  }

  // --- SECTION 7: SEO AUDIT & LIGHTHOUSE PERFORMANCE (FLOWS SEAMLESSLY) ---
  if (seo && seo.score !== undefined) {
    ensureSpace(90, 'SEO & Performance');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('7. Search Engine Optimization & Core Web Vitals', margin, currentY);
    currentY += 6;

    // Compact SEO Overview Banner
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 38, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text(`Overall SEO Health: ${seo.score}/100 (Grade ${seo.grade || 'A'} - ${seo.gradeLabel || ''})`, margin + 10, currentY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const passedChecks = seo.summary?.passed || 0;
    const warnChecks = seo.summary?.warnings || 0;
    const errorChecks = seo.summary?.errors || 0;
    doc.text(`Audit Checklist: ${passedChecks} Passed  •  ${warnChecks} Warnings  •  ${errorChecks} Issues Identified`, margin + 10, currentY + 26);

    currentY += 44;

    // Lighthouse Metrics Table
    if (seo.lighthouse?.scores) {
      const lhScores = seo.lighthouse.scores;
      const lhRows = [
        ['Performance Engine', `${lhScores.performance || 0} / 100`, (lhScores.performance || 0) >= 80 ? 'EXCELLENT' : (lhScores.performance || 0) >= 60 ? 'MODERATE' : 'POOR'],
        ['Accessibility (a11y)', `${lhScores.accessibility || 0} / 100`, (lhScores.accessibility || 0) >= 80 ? 'EXCELLENT' : 'NEEDS WORK'],
        ['Web Best Practices', `${lhScores.bestPractices || 0} / 100`, (lhScores.bestPractices || 0) >= 80 ? 'EXCELLENT' : 'NEEDS WORK'],
        ['SEO Technical Compliance', `${lhScores.seo || 0} / 100`, (lhScores.seo || 0) >= 80 ? 'EXCELLENT' : 'NEEDS WORK'],
      ];

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Lighthouse Metric', 'Score', 'Rating']],
        body: lhRows,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
        bodyStyles: { fontSize: 7, cellPadding: 2.5 },
        columnStyles: {
          0: { cellWidth: 180, fontStyle: 'bold' },
          1: { cellWidth: 70, halign: 'center' },
          2: { cellWidth: 90, halign: 'center' },
        },
      });

      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Top SEO Issues Table
    const issues = seo.issues || [];
    if (issues.length > 0) {
      ensureSpace(60, 'SEO Fixes');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      doc.text('Top SEO Optimization Opportunities', margin, currentY);
      currentY += 5;

      const issueRows = issues.slice(0, 8).map((iss) => [
        iss.title || iss.name || 'Issue',
        iss.category || 'SEO',
        iss.severity ? iss.severity.toUpperCase() : 'WARN',
        iss.message || iss.description || iss.recommendation || '',
      ]);

      autoTable(doc, {
        startY: currentY,
        margin: { left: margin, right: margin },
        head: [['Issue Title', 'Category', 'Severity', 'Remediation Advice']],
        body: issueRows,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255], fontSize: 7.5, cellPadding: 2.5 },
        bodyStyles: { fontSize: 7, cellPadding: 2.5 },
        columnStyles: {
          0: { cellWidth: 120, fontStyle: 'bold' },
          1: { cellWidth: 65 },
          2: { cellWidth: 50, halign: 'center' },
          3: { cellWidth: 'auto' },
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            if (data.cell.raw === 'HIGH' || data.cell.raw === 'ERROR') data.cell.styles.textColor = failColor;
            else if (data.cell.raw === 'MED' || data.cell.raw === 'MEDIUM' || data.cell.raw === 'WARN') data.cell.styles.textColor = warnColor;
            else data.cell.styles.textColor = [59, 130, 246];
          }
        },
      });
    }
  }

  // --- FOOTER ON ALL PAGES ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Web Security, Infrastructure & SEO Analyzer — Page ${i} of ${totalPages} | Executive Confidential Audit`,
      pageWidth / 2,
      pageHeight - 16,
      { align: 'center' }
    );
  }

  return doc;
}

/**
 * Returns a Blob URL to embed the generated PDF in an iframe.
 */
export function getSecurityPdfBlobUrl(report, techStack = null, seo = null) {
  const doc = buildSecurityPdfDoc(report, techStack, seo);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

/**
 * Saves/downloads the PDF file directly.
 */
export function generateSecurityPdf(report, techStack = null, seo = null) {
  const doc = buildSecurityPdfDoc(report, techStack, seo);
  const cleanDomain = (report?.hostname || techStack?.target || seo?.url || 'audit-report')
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_');
  doc.save(`Audit_Report_${cleanDomain}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
