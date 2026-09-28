// GeoHarmonizer AI - AI Spatial Matching View (SIH26013 - Section 12)

import React, { useState } from 'react';
import {
  Binary,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { StatusBadge } from '../common/StatusBadge';
import { SpatialMatchResult } from '../../types/geospatial';

export const SpatialMatchingView: React.FC = () => {
  const { matches, parcels, setActivePage, setSelectedParcelId } = useGeoRecon();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMatch, setSelectedMatch] = useState<SpatialMatchResult>(matches[0]);
  const [matchList, setMatchList] = useState<SpatialMatchResult[]>(matches);

  const handleAction = (matchId: string, newStatus: 'accepted' | 'rejected') => {
    setMatchList(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
    if (selectedMatch.id === matchId) {
      setSelectedMatch(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredMatches = matchList.filter(m => {
    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchesSearch =
      m.cadastralId.toLowerCase().includes(search.toLowerCase()) ||
      m.municipalId.toLowerCase().includes(search.toLowerCase()) ||
      m.details.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Geometric Inference
          </span>
          <span className="text-xs text-slate-500">IoU & Centroid Proximity Engine</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          AI Spatial Matching
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Automatically associates parcel geometries across disparate departments using multi-criteria geometric similarity: polygon Intersection-over-Union (IoU), centroid Euclidean displacement, Hausdorff shape compactness, and attribute correlation.
        </p>
      </div>

      {/* Grid: Matches Table / List + Match Detail Factor Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Match List Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search parcel or property ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Filter:</span>
              {['all', 'accepted', 'pending'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                    filterStatus === st
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-3 py-2">Match ID</th>
                  <th className="px-3 py-2">Cadastral ID</th>
                  <th className="px-3 py-2">Municipal Tax PID</th>
                  <th className="px-3 py-2">IoU Overlap</th>
                  <th className="px-3 py-2">Centroid Δ</th>
                  <th className="px-3 py-2">Confidence</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredMatches.map(m => {
                  const isSelected = selectedMatch.id === m.id;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMatch(m)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-3 py-2.5 font-mono text-[11px] font-bold">{m.id}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white">{m.cadastralId}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">{m.municipalId}</td>
                      <td className="px-3 py-2.5 font-mono">{m.factors.overlap_iou}%</td>
                      <td className="px-3 py-2.5 font-mono">{m.factors.centroid_distance_m}m</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status="" type="confidence" score={m.confidence} />
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={m.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Column: Match Evaluation Card (Section 12 Example) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {selectedMatch.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Match Factor Breakdown
              </h3>
            </div>
            <StatusBadge status={selectedMatch.status} />
          </div>

          {/* Departmental Source Features (Section 12 Requirements) */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-500">Cadastral Parcel:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{selectedMatch.cadastralId}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-500">Municipal Feature:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{selectedMatch.municipalId}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-500">Building Feature:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{selectedMatch.buildingId || 'B-0091'}</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-500">GNSS Reference:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{selectedMatch.gnssRefId || 'GNSS-MY-101'}</strong>
            </div>
          </div>

          {/* 5 Matching Factors Progress Bars (Section 12) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-semibold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider">
              Geometric & Attribute Correlation
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Polygon Overlap (IoU)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedMatch.factors.overlap_iou}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${selectedMatch.factors.overlap_iou}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Centroid Distance</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedMatch.factors.centroid_distance_m} m</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.max(10, 100 - selectedMatch.factors.centroid_distance_m * 20)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Shape Similarity (Hausdorff)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedMatch.factors.shape_similarity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${selectedMatch.factors.shape_similarity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Area Similarity</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedMatch.factors.area_similarity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${selectedMatch.factors.area_similarity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-500">Attribute Similarity</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedMatch.factors.attribute_similarity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${selectedMatch.factors.attribute_similarity}%` }} />
              </div>
            </div>
          </div>

          {/* Composite Match Confidence Card (Section 12) */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              MATCH CONFIDENCE
            </span>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-0.5">
              {selectedMatch.confidence}%
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {selectedMatch.confidence >= 90 ? 'High Confidence' : 'Review Required'}
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              {selectedMatch.details}
            </p>
          </div>

          {/* Action Buttons (Section 12) */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => handleAction(selectedMatch.id, 'accepted')}
              className="flex-1 py-2 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept Match</span>
            </button>

            <button
              onClick={() => handleAction(selectedMatch.id, 'rejected')}
              className="px-3 py-2 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <span>Reject</span>
            </button>

            <button
              onClick={() => {
                setSelectedParcelId(selectedMatch.cadastralId);
                setActivePage('parcel-explorer');
              }}
              className="px-3 py-2 rounded-lg font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 hover:bg-sky-100 text-xs border border-sky-200 dark:border-sky-800 transition-colors"
            >
              <span>Review Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
