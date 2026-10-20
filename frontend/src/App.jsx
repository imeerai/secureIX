import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStackSection from './components/TechStackSection';
import SeoAuditSection from './components/seo/SeoAuditSection';
import Features from './components/Features';
import Portfolio from './components/Portfolio';
import Integrations from './components/Integrations';
import HowItWorks from './components/HowItWorks';
import Comparison from './components/Comparison';
import ExtensionPromoSection from './components/ExtensionPromoSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ExtensionPromoModal from './components/ExtensionPromoModal';
import { useScanner, useScanHistory } from './hooks/useScanner';
import { useSeoScanner } from './hooks/useSeoScanner';
import { useTechStack } from './hooks/useTechStack';

export default function App() {
  const [extensionOpen, setExtensionOpen] = useState(false);
  const scanner = useScanner();
  const techStack = useTechStack();
  const seoScanner = useSeoScanner();
  const { history, fetchHistory } = useScanHistory();

  // Load history on mount
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Refresh history whenever a scan finishes
  useEffect(() => {
    if (scanner.status === 'done') {
      fetchHistory();
    }
  }, [scanner.status, fetchHistory]);

  // Auto-scan when opened from the extension: /?scan=<url>
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get('scan');
    if (target) {
      handleScanUrl(target);
      setTimeout(() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScrollToScanner = () => {
    const el = document.getElementById('scanner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSeo = () => {
    const el = document.getElementById('seo-audit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScanUrl = (url, options = {}) => {
    const { includeSecurity = true, includeTechStack = true, includeSeo = true } = options;
    
    if (includeSecurity) {
      scanner.scan(url);
    } else {
      scanner.reset();
    }

    if (includeTechStack) {
      techStack.detect(url);
    } else {
      techStack.reset();
    }

    if (includeSeo) {
      seoScanner.audit(url);
    } else {
      seoScanner.reset();
    }

    handleScrollToScanner();
  };

  const handleSeoAudit = (url) => {
    seoScanner.audit(url);
    handleScrollToSeo();
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] text-[#18181b] antialiased selection:bg-yellow-200 selection:text-black">
      <Navbar
        onScrollToScanner={handleScrollToScanner}
        onOpenExtension={() => setExtensionOpen(true)}
      />

      <Hero
        scannerState={scanner}
        techStackState={techStack}
        seoState={seoScanner}
        onScan={handleScanUrl}
        onRescan={handleScanUrl}
      />

      {/* Tech Stack & Hosting Infrastructure Intelligence Section */}
      <TechStackSection
        techStackState={techStack}
        initialUrl={scanner.report?.finalUrl || 'https://wordpress.org'}
      />

      {/* Complete SEO & Lighthouse Performance Audit Section */}
      <SeoAuditSection />

      <Features />

      <Portfolio
        history={history}
        onRescan={handleScanUrl}
      />

      <Integrations />
      <HowItWorks />
      <Comparison />
      
      <ExtensionPromoSection onOpenExtension={() => setExtensionOpen(true)} />

      <FinalCTA onScrollToScanner={handleScrollToScanner} />

      <Footer
        onOpenExtension={() => setExtensionOpen(true)}
      />

      {/* Interactive Chrome Extension Modal */}
      <ExtensionPromoModal
        isOpen={extensionOpen}
        onClose={() => setExtensionOpen(false)}
      />
    </div>
  );
}
