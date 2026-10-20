import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Activity, Shield, Calendar, RefreshCw, Award, ArrowUpRight, BarChart3 } from 'lucide-react';
import { useDomainTrend } from '../hooks/useScanner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function HistoricalTrendGraph({ currentDomain, onRescan }) {
  const { trendData, loading, selectedDomain, setSelectedDomain, fetchTrend } = useDomainTrend();
  const [customInput, setCustomInput] = useState('');

  // Default domains to quickly toggle
  const quickDomains = trendData?.trackedDomains?.length
    ? trendData.trackedDomains
    : ['github.com', 'google.com', 'amazon.com', 'example.com'];

  const handleSelectDomain = (dom) => {
    setSelectedDomain(dom);
    fetchTrend(dom);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      handleSelectDomain(customInput.trim());
      setCustomInput('');
    }
  };

  const trendPoints = trendData?.trend || [];

  // Chart data formatting
  const chartLabels = trendPoints.map((p, idx) => {
    const d = new Date(p.timestamp);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  });

  const chartScores = trendPoints.map((p) => p.score);

  // Gradient / Styling configuration for Chart.js
  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ['Audit 1', 'Audit 2', 'Audit 3'],
    datasets: [
      {
        label: 'SecurIn Security Score',
        data: chartScores.length > 0 ? chartScores : [80, 85, 90],
        borderColor: '#000000',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(134, 239, 172, 0.65)'); // pastel green
          gradient.addColorStop(1, 'rgba(253, 224, 71, 0.05)'); // pastel yellow fade
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: '#fde047',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#86efac',
        pointHoverBorderColor: '#000000',
        pointHoverBorderWidth: 3,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleFont: { family: 'Space Grotesk, sans-serif', weight: 'bold', size: 13 },
        bodyFont: { family: 'Space Grotesk, sans-serif', size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: '#000000',
        borderWidth: 2,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const pt = trendPoints[context.dataIndex];
            const grade = pt?.grade ? ` (Grade ${pt.grade})` : '';
            return `Score: ${context.parsed.y}/100${grade} • Latency: ${pt?.latencyMs || 250}ms`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1,
        },
        ticks: {
          font: { family: 'Space Grotesk, monospace', weight: 'bold', size: 11 },
          color: '#52525b',
          stepSize: 20,
          callback: (value) => `${value} pts`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: 'Space Grotesk, sans-serif', size: 10 },
          color: '#52525b',
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  const latestScore = trendPoints.length > 0 ? trendPoints[trendPoints.length - 1].score : null;
  const initialScore = trendPoints.length > 0 ? trendPoints[0].score : null;
  const scoreDelta = latestScore !== null && initialScore !== null ? latestScore - initialScore : 0;
  const highestScore = trendPoints.length > 0 ? Math.max(...trendPoints.map((t) => t.score)) : null;
  const lowestScore = trendPoints.length > 0 ? Math.min(...trendPoints.map((t) => t.score)) : null;
  const avgScore =
    trendPoints.length > 0
      ? Math.round(trendPoints.reduce((acc, t) => acc + t.score, 0) / trendPoints.length)
      : null;

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-6 md:p-8 brutal-shadow-lg">
      {/* Header with Title and Domain Selector */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b-2 border-black/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#fde047] text-black font-bold px-2.5 py-0.5 rounded border border-black text-xs uppercase font-space flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Historical Intelligence
            </span>
            <span className="text-xs text-zinc-500 font-space font-medium">Multi-Scan Trend Engine</span>
          </div>
          <h3 className="text-2xl font-bold font-space flex items-center gap-2 text-zinc-900">
            <BarChart3 className="w-6 h-6 stroke-[2.5]" />
            Security Score Evolution & Trend Graph
          </h3>
          <p className="text-sm font-medium text-zinc-600 mt-0.5">
            Audit trajectory across multiple scans for <strong className="text-black font-space">{selectedDomain}</strong>
          </p>
        </div>

        {/* Quick Domain Selector Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {quickDomains.slice(0, 5).map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => handleSelectDomain(dom)}
              className={`px-3 py-1.5 rounded-lg border-2 border-black font-bold text-xs font-space transition-all cursor-pointer ${
                selectedDomain.toLowerCase() === dom.toLowerCase()
                  ? 'bg-black text-white brutal-shadow-sm'
                  : 'bg-zinc-100 hover:bg-yellow-100 text-black'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        <div className="bg-[#fffdf7] p-3.5 rounded-xl border-2 border-black/15">
          <div className="text-[11px] font-bold text-zinc-500 font-space uppercase">Latest Score</div>
          <div className="text-2xl font-bold font-space text-black mt-0.5 flex items-center gap-1.5">
            {latestScore !== null ? `${latestScore}/100` : '—'}
            {scoreDelta > 0 && (
              <span className="text-xs font-bold text-green-700 bg-green-100 border border-green-300 px-1.5 py-0.2 rounded font-mono">
                +{scoreDelta}
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#fffdf7] p-3.5 rounded-xl border-2 border-black/15">
          <div className="text-[11px] font-bold text-zinc-500 font-space uppercase">Peak Security</div>
          <div className="text-2xl font-bold font-space text-black mt-0.5">
            {highestScore !== null ? `${highestScore}/100` : '—'}
          </div>
        </div>

        <div className="bg-[#fffdf7] p-3.5 rounded-xl border-2 border-black/15">
          <div className="text-[11px] font-bold text-zinc-500 font-space uppercase">Average Posture</div>
          <div className="text-2xl font-bold font-space text-black mt-0.5">
            {avgScore !== null ? `${avgScore}/100` : '—'}
          </div>
        </div>

        <div className="bg-[#fffdf7] p-3.5 rounded-xl border-2 border-black/15">
          <div className="text-[11px] font-bold text-zinc-500 font-space uppercase">Total Tracked Audits</div>
          <div className="text-2xl font-bold font-space text-black mt-0.5 flex items-center justify-between">
            <span>{trendPoints.length}</span>
            {onRescan && (
              <button
                type="button"
                onClick={() => onRescan(`https://${selectedDomain}`)}
                className="text-[11px] bg-yellow-200 hover:bg-yellow-300 border border-black px-2 py-0.5 rounded font-space font-bold cursor-pointer flex items-center gap-1"
                title="Scan again to record new data point"
              >
                <RefreshCw className="w-3 h-3" /> Re-scan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] bg-zinc-50/50 rounded-xl border-2 border-black/20 p-3 sm:p-4">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-xl z-10">
            <div className="flex items-center gap-2 font-bold font-space text-sm text-zinc-700">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading Domain Trend...
            </div>
          </div>
        ) : null}

        {trendPoints.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Activity className="w-10 h-10 text-zinc-300 mb-2" />
            <p className="font-bold font-space text-zinc-700">No historical data recorded for this domain yet.</p>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Run a security scan on <strong>{selectedDomain}</strong> to record the first historical posture point!
            </p>
          </div>
        )}
      </div>

      {/* Footer / Custom Domain Query */}
      <div className="mt-4 pt-4 border-t-2 border-dashed border-black/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-space">
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Track other domain (e.g. cloudflare.com)..."
            className="px-3 py-1.5 bg-zinc-100 border border-black rounded-lg text-xs font-medium outline-none focus:bg-white w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-black text-white rounded-lg font-bold border border-black hover:bg-zinc-800 cursor-pointer flex-shrink-0"
          >
            Track Trend
          </button>
        </form>

        <div className="text-zinc-500 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Chart.js Reactive Visualization Engine • Live Point Ingestion
        </div>
      </div>
    </div>
  );
}
