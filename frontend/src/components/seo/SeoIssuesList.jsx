import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Filter, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function SeoIssuesList({ checks = [], recommendations = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning' | 'passed'
  const [expandedId, setExpandedId] = useState(null);

  const filteredChecks = checks.filter((c) => {
    if (filter === 'critical') return c.status === 'FAIL';
    if (filter === 'warning') return c.status === 'WARN';
    if (filter === 'passed') return c.status === 'PASS';
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Priority Recommendations Callout */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-[#fffdf7] border-2 border-black rounded-xl p-6 brutal-shadow">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-[#fde047] border border-black rounded-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-space text-black">Top Actionable SEO Fixes</h3>
              <p className="text-xs text-zinc-600 font-medium">
                High-priority recommendations sorted by impact on search indexing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-2 border-black rounded-lg brutal-shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border font-space uppercase ${
                        rec.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      {rec.severity}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">{rec.category}</span>
                  </div>
                  <h4 className="font-bold text-sm font-space text-black mb-1">{rec.title}</h4>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">{rec.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filterable Full Checks Table */}
      <div className="bg-white border-2 border-black rounded-xl p-6 brutal-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b-2 border-zinc-200">
          <div>
            <h3 className="text-xl font-bold font-space text-black">SEO Audit Checks Breakdown</h3>
            <p className="text-xs text-zinc-600 font-medium">
              Review all {checks.length} evaluated rules across all SEO factors.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold font-space rounded-lg border-2 cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-black text-white border-black brutal-shadow-sm'
                  : 'bg-white text-black border-black hover:bg-zinc-100'
              }`}
            >
              All ({checks.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 text-xs font-bold font-space rounded-lg border-2 cursor-pointer transition-all ${
                filter === 'critical'
                  ? 'bg-red-500 text-white border-black brutal-shadow-sm'
                  : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
              }`}
            >
              Critical ({checks.filter((c) => c.status === 'FAIL').length})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1.5 text-xs font-bold font-space rounded-lg border-2 cursor-pointer transition-all ${
                filter === 'warning'
                  ? 'bg-amber-400 text-black border-black brutal-shadow-sm'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              Warnings ({checks.filter((c) => c.status === 'WARN').length})
            </button>
            <button
              onClick={() => setFilter('passed')}
              className={`px-3 py-1.5 text-xs font-bold font-space rounded-lg border-2 cursor-pointer transition-all ${
                filter === 'passed'
                  ? 'bg-emerald-500 text-white border-black brutal-shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              Passed ({checks.filter((c) => c.status === 'PASS').length})
            </button>
          </div>
        </div>

        {/* Checks List */}
        <div className="space-y-3">
          {filteredChecks.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border-2 border-black rounded-lg overflow-hidden transition-all bg-white"
              >
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0">
                      {item.status === 'PASS' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                      )}
                      {item.status === 'WARN' && (
                        <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[2.5]" />
                      )}
                      {item.status === 'FAIL' && (
                        <XCircle className="w-5 h-5 text-red-600 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm font-space text-black truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-600 font-medium truncate">{item.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border font-space uppercase ${
                        item.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : item.status === 'WARN'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      {item.pointsEarned}/{item.pointsMax} pts
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 bg-zinc-50 border-t-2 border-dashed border-zinc-200 text-xs space-y-2">
                    <div>
                      <span className="font-bold font-space text-zinc-700 block mb-0.5">Evaluation:</span>
                      <p className="text-zinc-800 font-mono leading-relaxed bg-white p-2.5 rounded border border-zinc-300">
                        {item.detail}
                      </p>
                    </div>

                    {item.recommendation && (
                      <div>
                        <span className="font-bold font-space text-amber-800 block mb-0.5">Recommended Fix:</span>
                        <p className="text-zinc-800 font-medium leading-relaxed bg-amber-50 p-2.5 rounded border border-amber-300">
                          {item.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
