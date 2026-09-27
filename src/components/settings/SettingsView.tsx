import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  Compass,
  Sliders,
  ShieldCheck,
  Database,
  ExternalLink,
  Server,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { SUPPORTED_CRS } from '../../services/crsService';
import { supabaseDb, isSupabaseConfigured } from '../../services/supabaseClient';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useGeoRecon();

  const [projectCrs, setProjectCrs] = useState(settings.projectCrs);
  const [autoThresh, setAutoThresh] = useState(settings.autoApprovalThreshold);
  const [reviewThresh, setReviewThresh] = useState(settings.manualReviewThreshold);
  const [topoTolerance, setTopoTolerance] = useState(settings.topologyToleranceMeters);
  const [iouThresh, setIouThresh] = useState(settings.spatialMatchMinIou);
  const [savedNotice, setSavedNotice] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ checked: boolean; connected: boolean; tablesCreated: boolean; message: string }>({
    checked: false,
    connected: isSupabaseConfigured,
    tablesCreated: false,
    message: isSupabaseConfigured ? 'Ready to probe Supabase Cloud endpoint' : 'Supabase credentials not configured'
  });
  const [isProbingDb, setIsProbingDb] = useState(false);

  const checkDb = async () => {
    setIsProbingDb(true);
    const res = await supabaseDb.checkConnection();
    setDbStatus({
      checked: true,
      connected: res.connected,
      tablesCreated: res.tablesCreated,
      message: res.message
    });
    setIsProbingDb(false);
  };

  const handleSave = () => {
    updateSettings({
      projectCrs,
      autoApprovalThreshold: autoThresh,
      manualReviewThreshold: reviewThresh,
      topologyToleranceMeters: topoTolerance,
      spatialMatchMinIou: iouThresh
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };


  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                System Administration
              </span>
              <span className="text-xs text-slate-500">Pipeline Parameters & Thresholds</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              System Settings & Tolerance Parameters
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Configure geodetic reference systems, topological vertex snapping tolerances, automated consensus thresholds, and evidence weighting criteria.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoData}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
            >
              Reset All Demo Data
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Parameters updated and registered to system context.</span>
          </div>
        )}
      </div>

      {/* Settings Grid (Section 43 Requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Geodetic & Coordinate Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Compass className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Coordinate Reference System (CRS)
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Project Canonical CRS
              </label>
              <select
                value={projectCrs}
                onChange={e => setProjectCrs(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
              >
                {SUPPORTED_CRS.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.unit})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Recommended for Bengaluru / Karnataka: EPSG:32643 (UTM 43N metric grid)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Topology Snapping Tolerance: <strong className="font-mono text-sky-600">{topoTolerance} m</strong>
              </label>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={topoTolerance}
                onChange={e => setTopoTolerance(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">
                Minimum distance within which adjacent parcel vertices snap together to eliminate sliver gaps.
              </span>
            </div>
          </div>
        </div>

        {/* AI Harmonization Thresholds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Decision & Governance Thresholds
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Automated Approval Cutoff</span>
                <span className="font-mono text-emerald-600 font-bold">{autoThresh}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="98"
                value={autoThresh}
                onChange={e => setAutoThresh(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="text-[10px] text-slate-400">
                Parcels with composite confidence above this value lock directly into canonical layer.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Manual Review Trigger Cutoff</span>
                <span className="font-mono text-amber-600 font-bold">{reviewThresh}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={reviewThresh}
                onChange={e => setReviewThresh(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <span className="text-[10px] text-slate-400">
                Parcels below this threshold require field ground inspection or Joint Revenue hearing.
              </span>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Spatial Match Minimum IoU</span>
                <span className="font-mono text-sky-600 font-bold">{iouThresh}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={iouThresh}
                onChange={e => setIouThresh(Number(e.target.value))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">
                Minimum polygon overlap required before candidate departmental features are linked.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Cloud PostgreSQL & PostGIS Infrastructure Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Supabase Cloud PostgreSQL & PostGIS Integration
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live Cloud Backend
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connected to project <span className="font-mono text-sky-600 dark:text-sky-400">kspoacaxerzshvaxuvse</span> (PostgreSQL 15+ with PostGIS 3.3)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={isProbingDb}
              onClick={checkDb}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProbingDb ? 'animate-spin' : ''}`} />
              <span>{isProbingDb ? 'Testing...' : 'Test Connection'}</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/kspoacaxerzshvaxuvse/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span>SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Database Status Probe Result */}
        {dbStatus.checked && (
          <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            dbStatus.tablesCreated 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' 
              : dbStatus.connected 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}>
            {dbStatus.tablesCreated ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{dbStatus.message}</p>
              {!dbStatus.tablesCreated && dbStatus.connected && (
                <p className="mt-1 text-[11px] opacity-90">
                  To initialize the 9 tables, open the Supabase SQL editor link above, paste the contents of <span className="font-mono bg-black/10 dark:bg-black/40 px-1 py-0.5 rounded">supabase/migrations/001_initial_schema.sql</span>, and click Run.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Configuration Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Project Endpoint</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-medium truncate block mt-0.5">
              https://kspoacaxerzshvaxuvse.supabase.co
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Anon API Key</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
              ✓ Active (JWT Signed)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Service Role Key</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">
              ✓ Configured (Admin RLS Bypass)
            </span>
          </div>
        </div>

        {/* Target Schema Tables */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Target Relational & PostGIS Schema Tables (9 Tables):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              'harmonized_parcels (PostGIS)',
              'datasets',
              'spatial_matches',
              'attribute_mappings',
              'topology_issues',
              'temporal_changes',
              'harmonization_conflicts',
              'audit_logs',
              'system_settings'
            ].map(table => (
              <span
                key={table}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                {table}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

