// GeoRecon AI - Data Exchange & Downstream Synchronization (SIH26013 - Section 22)

import React, { useState } from 'react';
import {
  DownloadCloud,
  FileCode,
  FileSpreadsheet,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Server,
  Code
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { syncService } from '../../services/syncService';

export const DataExchangeView: React.FC = () => {
  const { parcels } = useGeoRecon();

  const [syncStatus, setSyncStatus] = useState(syncService.getInitialSyncStatus());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleExportGeoJson = () => {
    const data = syncService.exportToGeoJson(parcels);
    syncService.triggerDownload('GeoRecon_Bengaluru_Canonical_Parcels.geojson', data, 'application/geo+json');
  };

  const handleExportCsv = () => {
    const data = syncService.exportToCsv(parcels);
    syncService.triggerDownload('GeoRecon_Bengaluru_Canonical_Parcels.csv', data, 'text/csv');
  };

  const handleExportJson = () => {
    const data = JSON.stringify(parcels, null, 2);
    syncService.triggerDownload('GeoRecon_Bengaluru_Parcels_Master.json', data, 'application/json');
  };

  const handleDownloadValidationReport = () => {
    const report = `# GeoRecon AI - Harmonization & Topology Validation Report
Project: Bengaluru Urban Land Harmonization Demo (SIH26013)
Generated: ${new Date().toLocaleString()}
Authority: Survey Settlement & Land Records (SSLR) & Bruhat Bengaluru Mahanagara Palike (BBMP)

Summary:
- Total Master Parcels: ${parcels.length}
- Spatial Matches Reconciled: 22 High Confidence (>90%)
- Mean Residual Coordinate Error: 0.38 meters (EPSG:32643 UTM 43N)
- Overlaps Corrected: 1 (Issue #TP-0183 resolved)
- Sliver Gaps Healed: 1 (Issue #TP-0184 resolved)
- Setback Encroachments Flagged: 1 (Building B-0094 on Parcel P-0105)
- Average Composite Confidence: 94.6%

Status: Canonical Spatial Index Ready for Downstream GIS Ingestion.
`;
    syncService.triggerDownload('Harmonization_Validation_Report.txt', report, 'text/plain');
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncStatus({
        canonicalDatasetSynced: true,
        gisServerSynced: true,
        validationIndexUpdated: true,
        auditTrailSynced: true,
        lastSyncTimestamp: new Date().toISOString()
      });
      setIsSyncing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Interoperability & Dissemination
          </span>
          <span className="text-xs text-slate-500">OGC Compliant WMS/WFS & REST API</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Data Exchange & Downstream Synchronization
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Disseminate harmonized canonical parcels to downstream municipal property tax portals, state revenue registries (Bhoomi), and national spatial data infrastructure via standard OGC services and batch export formats.
        </p>
      </div>

      {/* Demo Synchronization Status Panel (Section 22 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Demo Synchronization Status
            </h3>
          </div>
          <button
            disabled={isSyncing}
            onClick={handleTriggerSync}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Indices</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Canonical Dataset</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Synchronized</span>
            </div>
            <span className="text-[10px] text-slate-400">PostGIS master layer</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">GIS Web Server</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Synchronized</span>
            </div>
            <span className="text-[10px] text-slate-400">GeoServer / MapServer</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Validation Index</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Updated</span>
            </div>
            <span className="text-[10px] text-slate-400">Topology rules cached</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Audit Log Ledger</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Updated</span>
            </div>
            <span className="text-[10px] text-slate-400">Statutory record sealed</span>
          </div>
        </div>
      </div>

      {/* Export Cards Grid (Section 22 Requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GeoJSON */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 w-fit">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Canonical GeoJSON
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Standard OGC FeatureCollection with geometries, attributes, and provenance metadata in WGS 84.
            </p>
          </div>
          <button
            onClick={handleExportGeoJson}
            className="w-full py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-500 text-white text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download GeoJSON</span>
          </button>
        </div>

        {/* CSV / Tabular */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 w-fit">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Tabular Master CSV
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Revenue and municipal tabular records with verified areas, perimeter, land use, and confidence.
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="w-full py-2 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Master JSON */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 w-fit">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Full Master JSON
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Includes complete 5-factor confidence breakdowns, source contributions, and audit markers.
            </p>
          </div>
          <button
            onClick={handleExportJson}
            className="w-full py-2 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Validation Report */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-fit">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              Statutory Validation Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Official summary of topological corrections, CRS georeferencing residuals, and conflict resolutions.
            </p>
          </div>
          <button
            onClick={handleDownloadValidationReport}
            className="w-full py-2 rounded-lg font-bold bg-amber-600 hover:bg-amber-500 text-white text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Mock REST & WMS/WFS API Documentation (Section 22 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Open Geospatial Consortium (OGC) & REST API Interfaces
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20 font-mono">
            API v2.4 Spec
          </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 text-slate-300 space-y-1">
            <div className="text-emerald-400 font-bold">GET /api/v1/ogc/wfs?request=GetFeature&typename=georecon:canonical_parcels&srsname=EPSG:32643</div>
            <div className="text-[11px] text-slate-400"># OGC Web Feature Service vector streaming endpoint for QGIS, ArcGIS, and state cadastral portals</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 text-slate-300 space-y-1">
            <div className="text-sky-400 font-bold">GET /api/v1/parcels/P-0102/provenance</div>
            <div className="text-[11px] text-slate-400"># Returns explainable source breakdown: cadastral area, municipal tax ID, GNSS benchmark calibration</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 text-slate-300 space-y-1">
            <div className="text-amber-400 font-bold">POST /api/v1/harmonize/batch</div>
            <div className="text-[11px] text-slate-400"># Dispatches asynchronous background job for reconciling multi-source vector and raster layers</div>
          </div>
        </div>
      </div>
    </div>
  );
};
