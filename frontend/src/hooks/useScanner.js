import { useState, useCallback, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export function useScanner() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'scanning' | 'done' | 'error'
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // Countdown timer when rate limited
  useEffect(() => {
    if (retryCountdown <= 0) return;
    const interval = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          setIsRateLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [retryCountdown]);

  const scan = useCallback(async (url) => {
    if (!url || !url.trim()) return;
    setStatus('scanning');
    setError(null);
    setReport(null);
    setIsRateLimited(false);

    try {
      const res = await fetch(`${API_BASE}/api/scan?url=${encodeURIComponent(url.trim())}`);
      
      // Extract Rate Limit Headers
      const limit = res.headers.get('X-RateLimit-Limit');
      const remaining = res.headers.get('X-RateLimit-Remaining');
      const reset = res.headers.get('X-RateLimit-Reset');
      if (limit) {
        setRateLimitInfo({
          limit: parseInt(limit, 10),
          remaining: parseInt(remaining || '0', 10),
          reset: parseInt(reset || '0', 10),
        });
      }

      const data = await res.json();

      if (res.status === 429 || data.isRateLimited) {
        setStatus('error');
        setIsRateLimited(true);
        const retrySecs = data.retryAfterSeconds || 60;
        setRetryCountdown(retrySecs);
        setError(`Rate limit reached: ${data.message || 'Too many scans. Please wait.'}`);
        return;
      }
      
      if (data.error && data.message) {
        setStatus('error');
        setError(data.message);
      } else {
        setReport(data);
        setStatus('done');
      }
    } catch (err) {
      setStatus('error');
      setError('Could not connect to scanner backend. Ensure the backend server is running on port 3000.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setReport(null);
    setError(null);
    setIsRateLimited(false);
  }, []);

  return {
    status,
    report,
    error,
    isRateLimited,
    retryCountdown,
    rateLimitInfo,
    scan,
    reset,
  };
}

export function useScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/history`);
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

  return { history, loading, fetchHistory };
}

export function useDomainTrend() {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('github.com');

  const fetchTrend = useCallback(async (domain) => {
    setLoading(true);
    try {
      const query = domain ? `?domain=${encodeURIComponent(domain)}` : '';
      const res = await fetch(`${API_BASE}/api/history/trend${query}`);
      if (res.ok) {
        const data = await res.json();
        setTrendData(data);
        if (data.domain) setSelectedDomain(data.domain);
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrend(selectedDomain);
  }, [fetchTrend, selectedDomain]);

  return { trendData, loading, selectedDomain, setSelectedDomain, fetchTrend };
}

export function useObservatoryBenchmark() {
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBenchmark = useCallback(async (url) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/benchmark?url=${encodeURIComponent(url.trim())}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.error && data.message) {
        setError(data.message);
      } else {
        setBenchmark(data);
      }
    } catch (err) {
      // If direct backend query has an issue, provide message or let component fallback to report
      setError(err.message || 'Failed to fetch benchmark comparison.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { benchmark, setBenchmark, loading, error, fetchBenchmark };
}

export function useSecurityShieldStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(`${API_BASE}/api/security-status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // fallback
      }
    }
    checkStatus();
  }, []);

  return status;
}
