import React from 'react';
import { Shield, Clock, RefreshCw, AlertTriangle, CheckCircle, ExternalLink, Activity, LineChart } from 'lucide-react';
import HistoricalTrendGraph from './HistoricalTrendGraph';

export default function Portfolio({ history, onRescan }) {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-[#86efac] text-black border-black';
      case 'B': return 'bg-[#bfdbfe] text-black border-black';
      case 'C': return 'bg-[#fde047] text-black border-black';
      case 'D': return 'bg-orange-300 text-black border-black';
      default: return 'bg-[#ff9ebb] text-black border-black';
    }
  };

  return (
    <section id="history" className="py-24 px-6 bg-[#bfdbfe] border-t-2 border-black">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Split Section: Threat Feed + Overview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase text-black/70 mb-3 block font-space">
              Real-Time Intelligence
            </span>
            <h2 className="text-4xl mb-6 font-medium font-space">
              Live Threat Feed & Multi-Scan Analytics
            </h2>
            <p className="text-lg font-medium mb-8">
              Every audit conducted through our zero-dependency backend is recorded in real-time. Review past scores, analyze phishing trends, track posture evolution via Chart.js, and run instant one-click re-scans.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-lg border-2 border-black/10">
                <div className="bg-white p-2 rounded border border-black">
                  <Activity className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold font-space">In-Memory Audit Log (50 Scans Buffer)</span>
              </div>
              <div className="flex items-center gap-4 bg-white/50 p-3 rounded-lg border-2 border-black/10">
                <div className="bg-white p-2 rounded border border-black">
                  <LineChart className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold font-space">Automated Historical Trend Graph (Chart.js Engine)</span>
              </div>
            </div>

            <div className="mt-8">
              <a 
                href="#scanner" 
                className="inline-block bg-white text-black px-8 py-3 rounded-lg border-2 border-black font-bold brutal-shadow brutal-hover font-space cursor-pointer"
              >
                Scan a New Target URL
              </a>
            </div>
          </div>

          {/* Live Feed Card */}
          <div className="relative">
            <div className="bg-white rounded-xl border-2 border-black p-6 brutal-shadow-lg rotate-1 hover:rotate-0 transition-transform duration-300">
              <div className="flex justify-between items-center border-b-2 border-zinc-100 pb-4 mb-4">
                <h3 className="font-bold text-xl font-space flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Recent Audits Feed
                </h3>
                <span className="bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded text-xs font-bold font-space flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live API
                </span>
              </div>
              
              {/* Feed items */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {history && history.length > 0 ? (
                  history.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 font-space ${getGradeColor(item.grade)}`}>
                          {item.grade}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm font-space truncate max-w-[180px] md:max-w-[220px]">
                            {item.requestedUrl}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-space">
                            Score: {item.score}/100 • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-space ${
                          item.classification === 'Safe' ? 'bg-green-100 text-green-800 border-green-300' :
                          item.classification === 'Suspicious' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {item.classification}
                        </span>
                        {onRescan && (
                          <button
                            type="button"
                            onClick={() => onRescan(item.requestedUrl)}
                            title="Re-audit this URL"
                            className="p-1.5 rounded hover:bg-zinc-200 border border-zinc-300 cursor-pointer text-zinc-600 hover:text-black"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-zinc-500 font-space">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No recent scans recorded yet.</p>
                    <p className="text-xs text-zinc-400 mt-1">Run a scan above to populate live threat feed!</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t-2 border-dashed border-zinc-200 flex justify-between items-center text-xs font-space font-bold text-zinc-500">
                <span>Backend Endpoints</span>
                <span className="text-black font-mono">GET /api/history • GET /api/history/trend</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Historical Trend Graph Section */}
        <HistoricalTrendGraph onRescan={onRescan} />
      </div>
    </section>
  );
}
