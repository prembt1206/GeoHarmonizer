// GeoHarmonizer AI - Spatial Validation Center (SIH26013 - Section 14)

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  XCircle,
  MapPin,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { topologyService } from '../../services/topologyService';
import { TopologyIssue } from '../../types/geospatial';
import { StatusBadge, MetricCard } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';

export const SpatialValidationView: React.FC = () => {
  const { topologyIssues, fixTopologyIssue, parcels, setSelectedParcelId, setActivePage } = useGeoRecon();

  const [selectedIssue, setSelectedIssue] = useState<TopologyIssue>(topologyIssues[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const summary = topologyService.calculateSummary(topologyIssues, parcels.length);

  const handleApplyFix = (issueId: string) => {
    fixTopologyIssue(issueId);
    // Update local selection
    setSelectedIssue(prev => ({ ...prev, status: 'corrected' }));
  };

  const filteredIssues = topologyIssues.filter(i => {
    if (filterType === 'all') return true;
    if (filterType === 'open') return i.status === 'open';
    if (filterType === 'corrected') return i.status === 'corrected';
    return i.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Geometric Integrity
          </span>
          <span className="text-xs text-slate-500">Shapely / GEOS Topology Engine</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Spatial Validation Center
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Enforces topological rules across multi-departmental land layers. Identifies non-planar overlaps, sliver gaps, self-intersecting rings, duplicate polygons, and building setback encroachments with automated vertex snapping repairs.
        </p>
      </div>

      {/* KPI Cards (Section 14 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Valid Parcels</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{summary.validFeatures}</p>
          <span className="text-[10px] text-slate-500">Clean planar polygons</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Overlaps</span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{summary.overlaps}</p>
          <span className="text-[10px] text-slate-500">Boundary conflicts</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Sliver Gaps</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{summary.gaps}</p>
          <span className="text-[10px] text-slate-500">Unassigned slivers</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Encroachments</span>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{summary.encroachments}</p>
          <span className="text-[10px] text-slate-500">Setback violations</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Duplicates</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{summary.duplicateFeatures}</p>
          <span className="text-[10px] text-slate-500">Redundant records</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Health Score</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{summary.overallHealthScore}%</p>
          <span className="text-[10px] text-slate-500">Topology index</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map with Error Location & Detailed Issue Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map Focused on Error */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Spatial Issue Map Viewport (Active: #{selectedIssue?.id})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Coordinates: {selectedIssue?.location[0].toFixed(5)}, {selectedIssue?.location[1].toFixed(5)}
            </span>
          </div>

          <InteractiveMap
            height="460px"
            activeConflictLocation={selectedIssue?.location}
          />
        </div>

        {/* Right 1 Column: Active Issue Inspector & Repair CTA (Section 14) */}
        {selectedIssue && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                  Issue #{selectedIssue.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                  {(selectedIssue.type || 'Topology Anomaly').replace(/_/g, ' ')}
                </h3>
              </div>
              <StatusBadge status={selectedIssue.status} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Affected Parcels</span>
                <div className="flex items-center gap-1.5 mt-0.5 font-mono font-bold text-slate-900 dark:text-white">
                  {(selectedIssue.affectedParcels || []).map(p => (
                    <span key={p} className="px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {selectedIssue.area_sqm && (
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Discrepancy Magnitude</span>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5">
                    {selectedIssue.area_sqm} m²
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Problem Diagnosis</span>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>

              {/* AI Suggested Correction */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggested Correction</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                  {selectedIssue.suggestedCorrection}
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                  Confidence: {selectedIssue.confidence}%
                </div>
              </div>
            </div>

            {/* Action Buttons (Section 14) */}
            <div className="space-y-2 pt-2">
              {selectedIssue.status === 'open' ? (
                <button
                  onClick={() => handleApplyFix(selectedIssue.id)}
                  className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Apply Correction</span>
                </button>
              ) : (
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-xs">
                  ✓ Correction Applied & Topology Healed
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedParcelId(selectedIssue.affectedParcels[0]);
                    setActivePage('parcel-explorer');
                  }}
                  className="py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Inspect Parcel
                </button>
                <button
                  onClick={() => setActivePage('before-after')}
                  className="py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Before / After
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Issues Queue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Topology Exceptions Queue ({topologyIssues.length} items)
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'open', 'corrected', 'overlap', 'gap', 'encroachment'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filterType === f
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-3 py-2">Issue ID</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Affected Parcels</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredIssues.map(issue => (
                <tr
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className={`cursor-pointer transition-colors ${
                    selectedIssue?.id === issue.id
                      ? 'bg-sky-50 dark:bg-sky-950/40 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold">{issue.id}</td>
                  <td className="px-3 py-2 uppercase font-semibold text-[11px]">{issue.type}</td>
                  <td className="px-3 py-2"><StatusBadge status={issue.severity} /></td>
                  <td className="px-3 py-2 font-mono">{issue.affectedParcels.join(', ')}</td>
                  <td className="px-3 py-2 max-w-xs truncate">{issue.description}</td>
                  <td className="px-3 py-2 font-mono">{issue.confidence}%</td>
                  <td className="px-3 py-2"><StatusBadge status={issue.status} /></td>
                  <td className="px-3 py-2 text-right">
                    {issue.status === 'open' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyFix(issue.id);
                        }}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                      >
                        Repair
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">✓ Healed</span>
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
