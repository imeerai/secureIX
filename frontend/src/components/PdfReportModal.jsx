import React, { useState, useEffect } from 'react';
import { Download, X, ExternalLink, CheckCircle2, RefreshCw, FileText, Code2, Boxes, Search } from 'lucide-react';
import { getSecurityPdfBlobUrl, generateSecurityPdf } from '../utils/pdfExportService';

export default function PdfReportModal({ isOpen, onClose, report, techStack = null, seo = null }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && (report || techStack || seo)) {
      try {
        const url = getSecurityPdfBlobUrl(report, techStack, seo);
        setBlobUrl(url);
      } catch (err) {
        console.error('Failed to generate PDF preview:', err);
      }
    } else if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
  }, [isOpen, report, techStack, seo]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || (!report && !techStack && !seo)) return null;

  const handleDownloadPdf = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        generateSecurityPdf(report, techStack, seo);
        setDownloadSuccess(true);
      } catch (err) {
        console.error('Download error:', err);
      } finally {
        setTimeout(() => {
          setDownloading(false);
          setTimeout(() => setDownloadSuccess(false), 2500);
        }, 600);
      }
    }, 400);
  };

  const handleDownloadJson = () => {
    const combinedData = {
      timestamp: new Date().toISOString(),
      security: report || null,
      techStack: techStack || null,
      seo: seo || null,
    };
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanDomain = (report?.hostname || techStack?.target || seo?.url || 'audit')
      .replace(/^https?:\/\//, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_');
    a.download = `Audit_Export_${cleanDomain}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  const targetName = report?.finalUrl || report?.requestedUrl || techStack?.target || seo?.url || 'Target Site';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] bg-white rounded-2xl border-2 border-black brutal-shadow-lg flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-4 md:px-6 bg-[#18181b] text-white flex flex-wrap items-center justify-between gap-4 border-b-2 border-black flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fde047] text-black border-2 border-black flex items-center justify-center font-bold text-lg font-space brutal-shadow-sm">
              {report?.grade || seo?.grade || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider font-space">
                  Executive PDF Audit Preview
                </span>
                <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2 py-0.5 rounded text-zinc-300 font-mono">
                  {report && <span>Sec: {report.score}/100</span>}
                  {seo && <span>• SEO: {seo.score}/100</span>}
                  {techStack && <span>• Hosting: {techStack.hosting?.provider || 'Detected'}</span>}
                </div>
              </div>
              <h4 className="font-bold font-space text-sm md:text-base text-white truncate max-w-xs md:max-w-md">
                {targetName}
              </h4>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Primary Download Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className={`px-4 py-2 rounded-xl font-bold text-xs md:text-sm font-space border-2 border-black brutal-shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                downloadSuccess
                  ? 'bg-[#86efac] text-black'
                  : 'bg-[#fde047] hover:bg-yellow-300 text-black brutal-hover'
              } disabled:opacity-75`}
            >
              {downloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                  <span>Preparing PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            {/* Export JSON Option */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-white/20 font-space text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Download Raw JSON Data"
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            {/* Open in New Window */}
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-white/20 font-space text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open full PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Open Tab</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl border-2 border-black brutal-shadow-sm font-bold cursor-pointer transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Live PDF Document Frame */}
        <div className="flex-1 bg-zinc-900 p-2 md:p-4 overflow-hidden flex items-center justify-center">
          {blobUrl ? (
            <iframe
              src={blobUrl}
              title="Multi-Engine Audit PDF Report"
              className="w-full h-full rounded-xl border-2 border-black bg-white shadow-inner"
            />
          ) : (
            <div className="text-center text-white p-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-yellow-400" />
              <p className="font-space font-bold text-base">Rendering Multi-Engine PDF Document...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
