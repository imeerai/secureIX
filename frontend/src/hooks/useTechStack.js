import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function useTechStack() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'detecting' | 'done' | 'error'
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const detect = useCallback(async (url) => {
    if (!url || !url.trim()) return;
    setStatus('detecting');
    setError(null);
    setReport(null);

    const cleanUrl = url.trim();
    try {
      let res;
      try {
        res = await fetch(`${API_BASE}/api/techstack?url=${encodeURIComponent(cleanUrl)}`);
      } catch {
        res = await fetch(`http://localhost:3000/api/techstack?url=${encodeURIComponent(cleanUrl)}`);
      }

      if (!res.ok && res.status !== 200) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Server responded with HTTP ${res.status}`);
      }

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
      setError(err.message || 'Could not connect to Tech Stack detector backend.');
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
    detect,
    reset,
  };
}
