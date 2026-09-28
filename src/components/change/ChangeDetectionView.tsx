// GeoHarmonizer AI - Temporal Change Detection View (SIH26013 - Section 16)

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  MapPin,
  Calendar,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { TemporalChange } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';

export const ChangeDetectionView: React.FC = () => {
  const { changes, confirmChange, rejectChange, setSelectedParcelId, setActivePage } = useGeoRecon();

  const [selectedChange, setSelectedChange] = useState<TemporalChange>(changes[0]);
  const [versionA, setVersionA] = useState('2025 Baseline (Satellite / Revenue)');
  const [versionB, setVersionB] = useState('2026 Current (Drone ORI 5cm)');

  const unconfirmed = changes.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Temporal Multi-Epoch Analysis
          </span>
          <span className="text-xs text-slate-500">2025 Baseline vs 2026 Drone Survey</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Temporal Change Detection
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Compares multi-epoch geospatial datasets to uncover physical real-world alterations: newly constructed unassessed building footprints, unauthorized demolitions, cadastral boundary modifications, and utility easement encroachments.
        </p>
      </div>

      {/* Epoch Comparison Selectors (Section 16 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-64">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Epoch A (Baseline)
            </label>
            <select
              value={versionA}
              onChange={e => setVersionA(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option>2025 Baseline (Satellite / Revenue)</option>
              <option>2024 Cadastral Survey Revision</option>
              <option>2023 Municipal Property Tax Master</option>
            </select>
          </div>

          <div className="text-slate-400 font-bold text-sm mt-4">vs</div>

          <div className="flex-1 sm:w-64">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Epoch B (Current Survey)
            </label>
            <select
              value={versionB}
              onChange={e => setVersionB(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-sky-600 dark:text-sky-400"
            >
              <option>2026 Current (Drone ORI 5cm)</option>
              <option>2026 Q3 LiDAR DSM / DTM</option>
              <option>2026 MCC Building Footprint Ingestion</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">Detected Changes:</span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            {unconfirmed} Unconfirmed Alterations
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Active Change Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map Viewport */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Change Spatial Location: #{selectedChange.id} (Parcel {selectedChange.parcel_id})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Coordinates: {selectedChange.coordinates[0].toFixed(5)}, {selectedChange.coordinates[1].toFixed(5)}
            </span>
          </div>

          <InteractiveMap
            height="460px"
            activeConflictLocation={selectedChange.coordinates}
          />
        </div>

        {/* Right 1 Column: Active Change Card (Section 16 Example) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">
                Change #{selectedChange.id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                {(selectedChange?.changeType || 'Structural Change').replace(/_/g, ' ')}
              </h3>
            </div>
            <StatusBadge status={selectedChange.status} />
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Associated Parcel:</span>
              <strong className="font-mono text-slate-900 dark:text-white">{selectedChange.parcel_id}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex justify-between">
              <span className="text-slate-500">Footprint Extent Delta:</span>
              <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                +{selectedChange.areaDiffSqm} m²
              </strong>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Temporal Evidence</span>
              <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedChange.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-300 dark:border-amber-800">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Confidence Rating</span>
              </div>
              <div className="text-xl font-black text-amber-600 font-mono">
                {selectedChange.confidence}%
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                High spectral and edge gradient correlation between baseline and 2026 orthomosaic.
              </p>
            </div>
          </div>

          {/* Action Buttons (Section 16) */}
          <div className="space-y-2 pt-2">
            {selectedChange.status === 'pending' ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => confirmChange(selectedChange.id)}
                  className="py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Change</span>
                </button>

                <button
                  onClick={() => rejectChange(selectedChange.id)}
                  className="py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 text-slate-700 dark:text-slate-300 hover:text-rose-600 text-xs border border-slate-300 dark:border-slate-700"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status: <strong className="capitalize">{selectedChange.status}</strong>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedParcelId(selectedChange.parcel_id);
                setActivePage('parcel-explorer');
              }}
              className="w-full py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Inspect Parcel Details
            </button>
          </div>
        </div>
      </div>

      {/* Changes Queue Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          Detected Physical Alterations ({changes.length} events)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-3 py-2">Change ID</th>
                <th className="px-3 py-2">Parcel ID</th>
                <th className="px-3 py-2">Change Type</th>
                <th className="px-3 py-2">Area Delta</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {changes.map(c => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedChange(c)}
                  className={`cursor-pointer transition-colors ${
                    selectedChange.id === c.id
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold">{c.id}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{c.parcel_id}</td>
                  <td className="px-3 py-2 capitalize">{(c.changeType || 'change').replace(/_/g, ' ')}</td>
                  <td className="px-3 py-2 font-mono text-emerald-600 font-bold">+{c.areaDiffSqm} m²</td>
                  <td className="px-3 py-2 max-w-xs truncate">{c.description}</td>
                  <td className="px-3 py-2 font-mono">{c.confidence}%</td>
                  <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                  <td className="px-3 py-2 text-right">
                    {c.status === 'pending' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmChange(c.id);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Locked</span>
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
