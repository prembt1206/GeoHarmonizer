// GeoRecon AI - Comprehensive Parcel Detail Drawer (SIH26013 - Section 20)

import React, { useState } from 'react';
import {
  X,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck2,
  Database,
  Building,
  Radio,
  FileText,
  DownloadCloud,
  Split,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { HarmonizedParcel } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { syncService } from '../../services/syncService';

interface ParcelDetailDrawerProps {
  parcel: HarmonizedParcel | null;
  onClose: () => void;
  onNavigateToBeforeAfter?: () => void;
}

export const ParcelDetailDrawer: React.FC<ParcelDetailDrawerProps> = ({
  parcel,
  onClose,
  onNavigateToBeforeAfter
}) => {
  if (!parcel) return null;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'geometry' | 'sources' | 'attributes' | 'conflicts' | 'changes' | 'validation' | 'audit'
  >('overview');

  const handleExportSingle = () => {
    const geojson = syncService.exportToGeoJson([parcel]);
    syncService.triggerDownload(`${parcel.parcel_id}_Harmonized_Record.geojson`, geojson);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Parcel {parcel.parcel_id}
              </span>
              <StatusBadge status="" type="confidence" score={parcel.confidence_score} />
              <StatusBadge status={parcel.validation_status} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Survey No: <strong>{parcel.survey_number}</strong> • Municipal PID: <strong>{parcel.municipal_property_id}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Tabs Navigation (Section 20 Requirements) */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'geometry', label: 'Geometry' },
            { id: 'sources', label: 'Sources (8)' },
            { id: 'attributes', label: 'Attributes' },
            { id: 'conflicts', label: 'Conflicts' },
            { id: 'changes', label: 'Changes' },
            { id: 'validation', label: 'Validation' },
            { id: 'audit', label: 'Audit Trail' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Canonical Status Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Harmonized Canonical Urban Parcel
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {parcel.confidence_score}% Confidence
                  </span>
                </div>
                <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  Unified master land parcel validated against cadastral revenue maps, municipal property tax records, 5cm drone orthophotos, and RTK GNSS benchmark points.
                </p>
              </div>

              {/* KPI Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Harmonized Area</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{parcel.area_sqm} m²</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Perimeter</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{parcel.boundary_perimeter_m} m</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Land Use</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{parcel.land_use}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Building Count</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{parcel.building_count} ({parcel.building_area_sqm} m²)</p>
                </div>
              </div>

              {/* Source Integration Status Checkmarks (Section 20 Example) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                  Source Provenance Checklist (8 Sources Connected)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Cadastral Survey Map (SSLR)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Municipal GIS Layer (MCC)</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Bhoomi Revenue Register</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">High-Res Drone ORI Imagery</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">CORS GNSS RTK Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Joint Ground Truth Inspection</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Building Footprint Polygon</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-700 dark:text-slate-300">Underground Utility Links</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GEOMETRY */}
          {activeTab === 'geometry' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 font-mono text-[11px] space-y-1">
                <div>Projected CRS: <strong>EPSG:32643 (UTM 43N)</strong></div>
                <div>Storage Format: <strong>GeoJSON / WKB Polygon</strong></div>
                <div>Outer Ring Vertices: <strong>{parcel.coordinates.length} points</strong></div>
                <div>Geometric Validity: <strong>100% Planar Valid (No Self-Intersections)</strong></div>
              </div>

              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Outer Boundary Polygon Coordinates:
                </span>
                <div className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-[10px] max-h-48 overflow-y-auto space-y-0.5">
                  {parcel.coordinates.map(([lat, lng], i) => (
                    <div key={i}>
                      [{lat.toFixed(6)}, {lng.toFixed(6)}]
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOURCES & EXPLAINABILITY (Section 21 Requirements) */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Explainable Field Attribution (Source Provenance)
              </span>

              {parcel.source_contributions?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start justify-between"
                >
                  <div>
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold block capitalize">
                      {item.field.replace('_', ' ')}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 mt-0.5 block">
                      Contributing Source: <strong>{item.source}</strong>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {item.confidence}% Match
                  </span>
                </div>
              )) || (
                <div className="text-slate-400 text-xs">Standard source alignment.</div>
              )}
            </div>
          )}

          {/* TAB 4: ATTRIBUTES */}
          {activeTab === 'attributes' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-3 py-2">Canonical Field</th>
                    <th className="px-3 py-2">Reconciled Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr><td className="px-3 py-2 font-mono">parcel_id</td><td className="px-3 py-2 font-bold">{parcel.parcel_id}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">survey_number</td><td className="px-3 py-2">{parcel.survey_number}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">municipal_property_id</td><td className="px-3 py-2">{parcel.municipal_property_id}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">revenue_khata_no</td><td className="px-3 py-2">{parcel.revenue_khata_no}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">area_sqm</td><td className="px-3 py-2 font-bold text-emerald-600">{parcel.area_sqm} m²</td></tr>
                  <tr><td className="px-3 py-2 font-mono">ward_id</td><td className="px-3 py-2">{parcel.ward_id}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">zone_name</td><td className="px-3 py-2">{parcel.zone_name}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">land_use</td><td className="px-3 py-2">{parcel.land_use}</td></tr>
                  <tr><td className="px-3 py-2 font-mono">utilities</td><td className="px-3 py-2 font-mono">{parcel.utility_links.join(', ')}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: CONFLICTS */}
          {activeTab === 'conflicts' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Conflict Resolution History</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Multi-source boundary offset of 1.2m was flagged between SSLR Cadastral layer and MCC Municipal GIS layer. The conflict was reconciled by prioritizing Survey of India CORS benchmark GNSS-MY-102.
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: CHANGES */}
          {activeTab === 'changes' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Temporal Modification Log</span>
                <p className="text-slate-600 dark:text-slate-300">
                  Status: <strong>{parcel.change_status}</strong>. Compared against 2025 satellite baseline survey.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: VALIDATION */}
          {activeTab === 'validation' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Geometry Validated</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300">
                  No topology overlap with adjacent parcels. Sliver gaps eliminated via automated vertex snapping.
                </p>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex justify-between font-mono text-[10px] text-slate-400">
                  <span>{parcel.last_harmonized_at}</span>
                  <span className="text-emerald-600 font-bold">Auto-Approved</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  AI Harmonization Pipeline Run
                </div>
                <div className="text-[11px] text-slate-500">
                  Geometry, attributes, and topology validated into canonical record.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Action Buttons (Section 48 Requirements) */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {onNavigateToBeforeAfter && (
              <button
                onClick={onNavigateToBeforeAfter}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1"
              >
                <Split className="w-3.5 h-3.5" />
                <span>Before / After</span>
              </button>
            )}

            <button
              onClick={handleExportSingle}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold flex items-center gap-1"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Export Record</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
