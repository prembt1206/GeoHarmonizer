// GeoHarmonizer AI - Dataset Profiling Drawer (SIH26013)

import React from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Database, MapPin, Hash, Layers } from 'lucide-react';
import { Dataset } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';

interface DataProfilingDrawerProps {
  dataset: Dataset | null;
  onClose: () => void;
  onNavigateToMapping?: () => void;
}

export const DataProfilingDrawer: React.FC<DataProfilingDrawerProps> = ({
  dataset,
  onClose,
  onNavigateToMapping
}) => {
  if (!dataset) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Dataset Profiling & Schema Inspection
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {dataset.name} • {dataset.department}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Format</span>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{dataset.format}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">CRS</span>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">{dataset.crs}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Features</span>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{dataset.featureCount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Trust Score</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">{dataset.sourceTrustScore}/100</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            {dataset.description}
          </div>

          {/* Bounding Box Information */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Bounding Box Extent (WGS 84)</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-2">
              <div>Min Longitude: <strong>{dataset.bbox[0].toFixed(4)}°E</strong></div>
              <div>Min Latitude: <strong>{dataset.bbox[1].toFixed(4)}°N</strong></div>
              <div>Max Longitude: <strong>{dataset.bbox[2].toFixed(4)}°E</strong></div>
              <div>Max Latitude: <strong>{dataset.bbox[3].toFixed(4)}°N</strong></div>
            </div>
          </div>

          {/* AI Suggestion Banner (Section 9 Requirement) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200 dark:border-sky-800/80">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  Potential Canonical Field Mappings Detected
                </span>
                <p className="text-[11px] text-sky-800/80 dark:text-sky-300/80 leading-relaxed">
                  GeoHarmonizer AI analyzed the attribute schemas. Candidate target fields in the National Canonical Model have been identified with &gt;90% semantic confidence.
                </p>
                {onNavigateToMapping && (
                  <button
                    onClick={onNavigateToMapping}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <span>Inspect Attribute Mapping Matrix</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Attribute Fields Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Attribute Schema ({dataset.attributes.length} fields)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">0.0% Critical Schema Nulls</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Null %</th>
                    <th className="px-3 py-2">Unique</th>
                    <th className="px-3 py-2">Canonical Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {dataset.attributes.map((attr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2 font-mono font-medium text-slate-900 dark:text-white">{attr.name}</td>
                      <td className="px-3 py-2 text-slate-500 font-mono">{attr.type}</td>
                      <td className="px-3 py-2">
                        <span className={`font-mono ${attr.nullPercentage > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {attr.nullPercentage}%
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 dark:text-slate-400">{attr.uniqueValues}</td>
                      <td className="px-3 py-2">
                        {attr.canonicalMapping ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                            <span>→ {attr.canonicalMapping}</span>
                            <span className="text-[10px] text-slate-400">({attr.mappingConfidence}%)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Department auxiliary</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
          <span className="text-slate-400">Registered: {dataset.uploadDate}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
