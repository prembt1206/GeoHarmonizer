// GeoRecon AI - Harmonization Conflict Center (SIH26013 - Section 17)

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileQuestion,
  UserCheck,
  Scale
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { HarmonizationConflict } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';

export const ConflictCenterView: React.FC = () => {
  const { conflicts, resolveConflict, setSelectedParcelId, setActivePage } = useGeoRecon();

  const [selectedConflict, setSelectedConflict] = useState<HarmonizationConflict>(conflicts[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const openCount = conflicts.filter(c => c.status === 'open').length;
  const underReviewCount = conflicts.filter(c => c.status === 'under_review').length;
  const resolvedCount = conflicts.filter(c => c.status === 'resolved').length;

  const handleAcceptRecommendation = (conflict: HarmonizationConflict) => {
    resolveConflict(conflict.id, conflict.aiRecommendation);
    setSelectedConflict(prev => ({
      ...prev,
      status: 'resolved',
      resolvedAction: conflict.aiRecommendation,
      resolvedBy: 'Officer (Accepted AI Recommendation)'
    }));
  };

  const handleRequestReview = (conflict: HarmonizationConflict) => {
    resolveConflict(conflict.id, 'Sent to Joint Revenue-Municipal Appeals Tribunal for Field Hearing');
    setSelectedConflict(prev => ({
      ...prev,
      status: 'under_review',
      resolvedAction: 'Queued for Human Tribunal Review'
    }));
  };

  const filteredConflicts = conflicts.filter(c => {
    if (filterType === 'all') return true;
    if (filterType === 'open') return c.status === 'open';
    if (filterType === 'under_review') return c.status === 'under_review';
    if (filterType === 'resolved') return c.status === 'resolved';
    return c.conflictType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Evidence-Based Arbitration
          </span>
          <span className="text-xs text-slate-500">Cross-Departmental Variance Queue</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Harmonization Conflict Center
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Reconciles disagreements between Cadastral survey records, Municipal property tax assessments, UAV drone photogrammetry, and GNSS benchmarks using transparent evidence weighting and verifiable recommendation heuristics.
        </p>
      </div>

      {/* Queue Status KPIs (Section 17 Requirements) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase">Open Discrepancies</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{openCount}</p>
            <span className="text-[11px] text-slate-500">Awaiting officer or AI triage</span>
          </div>
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase">Under Review</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{underReviewCount}</p>
            <span className="text-[11px] text-slate-500">Field visit / joint hearing</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase">Auto & Officer Resolved</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{resolvedCount}</p>
            <span className="text-[11px] text-slate-500">Validated into canonical record</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map with Conflict Focus + Detailed Conflict Evidence Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Conflict Map Viewport */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Conflict Location Map: #{selectedConflict.id} ({selectedConflict.parcel_id})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Coordinates: {selectedConflict.location[0].toFixed(5)}, {selectedConflict.location[1].toFixed(5)}
            </span>
          </div>

          <InteractiveMap
            height="460px"
            activeConflictLocation={selectedConflict.location}
          />
        </div>

        {/* Right 1 Column: Detailed Conflict Evidence Card (Section 17 Example) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                Conflict #{selectedConflict.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Parcel: {selectedConflict.parcel_id}
              </h3>
            </div>
            <StatusBadge status={selectedConflict.status} />
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {selectedConflict.title}
            </h4>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">
              Type: {selectedConflict.conflictType.replace('_', ' ')} • Severity: {selectedConflict.severity}
            </span>
          </div>

          {/* Departmental Source Claims (Section 17 Requirements) */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Multi-Source Evidence Breakdown
            </span>

            {selectedConflict.sources.map((src, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {src.source}
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white mt-0.5">
                    {src.value}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  Weight: {Math.round(src.weight * 100)}%
                </span>
              </div>
            ))}
          </div>

          {/* AI Recommendation Card (Section 17) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-900 dark:text-sky-300 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Resolution</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {selectedConflict.aiRecommendation}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-sky-200 dark:border-sky-800/60 font-mono">
              <span className="text-slate-500">Confidence:</span>
              <strong className="text-sky-600 dark:text-sky-400 font-bold">{selectedConflict.confidence}%</strong>
            </div>
          </div>

          {/* Action Buttons (Section 17) */}
          <div className="space-y-2 pt-2">
            {selectedConflict.status !== 'resolved' ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleAcceptRecommendation(selectedConflict)}
                  className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Recommendation</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRequestReview(selectedConflict)}
                    className="py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-semibold"
                  >
                    Request Tribunal
                  </button>

                  <button
                    onClick={() => {
                      setSelectedParcelId(selectedConflict.parcel_id);
                      setActivePage('parcel-explorer');
                    }}
                    className="py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Inspect Parcel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conflict Resolved</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {selectedConflict.resolvedAction}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Queue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          Reconciliation Queue ({conflicts.length} cases)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-3 py-2">Conflict ID</th>
                <th className="px-3 py-2">Parcel ID</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Conflict Type</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredConflicts.map(c => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedConflict(c)}
                  className={`cursor-pointer transition-colors ${
                    selectedConflict.id === c.id
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold">{c.id}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{c.parcel_id}</td>
                  <td className="px-3 py-2 max-w-xs truncate">{c.title}</td>
                  <td className="px-3 py-2 capitalize">{c.conflictType.replace('_', ' ')}</td>
                  <td className="px-3 py-2"><StatusBadge status={c.severity} /></td>
                  <td className="px-3 py-2 font-mono">{c.confidence}%</td>
                  <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-2 text-right">
                    {c.status !== 'resolved' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptRecommendation(c);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                      >
                        Accept
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Closed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
