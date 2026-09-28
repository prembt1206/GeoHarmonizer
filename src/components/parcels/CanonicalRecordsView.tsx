// GeoHarmonizer AI - Canonical Parcel Record View (SIH26013 - Section 21)

import React, { useState } from 'react';
import {
  FileCheck2,
  DownloadCloud,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  Split
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { HarmonizedParcel } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { syncService } from '../../services/syncService';

export const CanonicalRecordsView: React.FC = () => {
  const { parcels, setActivePage, setSelectedParcelId } = useGeoRecon();

  const [activeParcel, setActiveParcel] = useState<HarmonizedParcel>(parcels[1]); // P-0102

  const handleExportJson = () => {
    const geojson = syncService.exportToGeoJson([activeParcel]);
    syncService.triggerDownload(`Canonical_${activeParcel.parcel_id}.json`, geojson);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Single Source of Truth
              </span>
              <span className="text-xs text-slate-500">Unified Urban Cadastre Standard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Canonical Harmonized Parcel Records
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              The authoritative target data model of GeoHarmonizer AI. Fuses revenue records, municipal property identifiers, drone photogrammetry, and geodetic CORS observations into explainable, legally auditable master records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('before-after')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Before / After</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Export Canonical JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Canonical Record Card (Section 21 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Record Header & Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Authoritative Master Record
              </span>
              <StatusBadge status={activeParcel.review_status} />
              <StatusBadge status="" type="confidence" score={activeParcel.confidence_score} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Harmonized Canonical Record: {activeParcel.parcel_id}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Last Synchronized: {activeParcel.last_harmonized_at} • Projected CRS: EPSG:32643 (UTM Zone 43N)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Switch Parcel:</span>
            <select
              value={activeParcel.parcel_id}
              onChange={e => {
                const found = parcels.find(p => p.parcel_id === e.target.value);
                if (found) setActiveParcel(found);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
            >
              {parcels.map(p => (
                <option key={p.parcel_id} value={p.parcel_id}>
                  {p.parcel_id} ({p.survey_number}) - {p.confidence_score}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Explainable Attribution Grid (Section 21 Requirements) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Explainable Multi-Source Field Attribution</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* Field: parcel_id */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">1. parcel_id</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{activeParcel.parcel_id}</p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>Cadastral Master Index</strong> • Conf: <strong>99%</strong>
              </div>
            </div>

            {/* Field: survey_number */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">2. survey_number</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{activeParcel.survey_number}</p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>SSLR Revenue Map 2024</strong> • Conf: <strong>98%</strong>
              </div>
            </div>

            {/* Field: municipal_property_id */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">3. municipal_property_id</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{activeParcel.municipal_property_id}</p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>MCC Property Tax System</strong> • Conf: <strong>96%</strong>
              </div>
            </div>

            {/* Field: revenue_khata_no */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">4. revenue_khata_no</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{activeParcel.revenue_khata_no}</p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>Bhoomi Revenue Register</strong> • Conf: <strong>99%</strong>
              </div>
            </div>

            {/* Field: area_sqm */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold block">5. area_sqm (Harmonized)</span>
              <p className="text-base font-black text-emerald-600 font-mono">{activeParcel.area_sqm} m²</p>
              <div className="pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Contributing Source: <strong>GNSS CORS + Cadastral</strong> • Conf: <strong>96%</strong>
              </div>
            </div>

            {/* Field: land_use */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">6. land_use</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{activeParcel.land_use}</p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>Municipal Master Plan</strong> • Conf: <strong>95%</strong>
              </div>
            </div>

            {/* Field: building_footprint */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">7. building_count & area</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {activeParcel.building_count} Structure ({activeParcel.building_area_sqm} m²)
              </p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>2026 Drone ORI Photogrammetry</strong> • Conf: <strong>98%</strong>
              </div>
            </div>

            {/* Field: gnss_verified */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">8. gnss_verified</span>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>TRUE (±0.008m RTK)</span>
              </p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>SoI CORS Benchmark Station</strong> • Conf: <strong>99%</strong>
              </div>
            </div>

            {/* Field: utility_links */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">9. utility_links</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {activeParcel.utility_links.join(', ')}
              </p>
              <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                Contributing Source: <strong>KUWSDB Water & Electric Layer</strong> • Conf: <strong>94%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* JSON Schema Representation Preview */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
          <div className="text-slate-400 mb-2 font-bold uppercase text-[10px]">
            GeoJSON Canonical Feature Schema Preview (urn:ogc:def:crs:EPSG::32643)
          </div>
          <pre className="overflow-x-auto text-sky-400">
{JSON.stringify({
  type: "Feature",
  id: activeParcel.parcel_id,
  properties: {
    canonical_parcel_id: activeParcel.parcel_id,
    survey_number: activeParcel.survey_number,
    municipal_property_id: activeParcel.municipal_property_id,
    revenue_khata_no: activeParcel.revenue_khata_no,
    area_sqm: activeParcel.area_sqm,
    land_use: activeParcel.land_use,
    gnss_verified: activeParcel.gnss_verified,
    confidence_score: activeParcel.confidence_score,
    provenance_hash: "0x8fa4c2199b7"
  },
  geometry: {
    type: "Polygon",
    coordinates: "[[ [77.6412, 12.9719], ... ]]"
  }
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
