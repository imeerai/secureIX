import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function useSeoScanner() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'auditing' | 'done' | 'error'
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const audit = useCallback(async (url) => {
    if (!url || !url.trim()) return;
    setStatus('auditing');
    setError(null);
    setReport(null);

    try {
      const res = await fetch(`${API_BASE}/api/seo/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (data.error && data.message) {
        setStatus('error');
        setError(data.message);
      } else {
        setReport(data);
        setStatus('done');
      }
    } catch (err) {
      setStatus('error');
      setError('Could not connect to SEO analyzer backend. Ensure the backend server is running on port 3000.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setReport(null);
    setError(null);
  }, []);

  return {
    status,
    report,
    error,
    audit,
    reset,
  };
}

export function useSeoHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSeoHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/seo/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch {
      // silently fallback
    } finally {
      setLoading(false);
    }
  }, []);

  return { history, loading, fetchSeoHistory };
}
