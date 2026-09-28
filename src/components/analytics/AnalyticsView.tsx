// GeoHarmonizer AI - Geospatial Analytics & Quality Benchmarking (SIH26013 - Section 24)

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Percent,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { MetricCard } from '../common/StatusBadge';

export const AnalyticsView: React.FC = () => {
  const { parcels, conflicts, topologyIssues } = useGeoRecon();

  const highConfCount = parcels.filter(p => p.confidence_score >= 90).length;
  const reviewCount = parcels.filter(p => p.confidence_score >= 75 && p.confidence_score < 90).length;
  const flaggedCount = parcels.filter(p => p.confidence_score < 75).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Performance & Quality Metrics
          </span>
          <span className="text-xs text-slate-500">Prototype Simulation Benchmarking</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Geospatial Analytics & Integrity Index
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Quantitative assessment of spatial harmonization efficacy: multi-source data quality ratings, automated topology remediation rates, confidence distribution curves, and projected administrative turnaround reduction.
        </p>
      </div>

      {/* Top Benchmark KPI Cards (Section 24 Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Harmonization Rate"
          value="96.2%"
          subtitle="24,821 parcels integrated"
          icon={CheckCircle2}
          highlightColor="emerald"
        />
        <MetricCard
          title="Auto-Correction Rate"
          value="87.4%"
          subtitle="Automated edge snapping"
          icon={TrendingUp}
          highlightColor="brand"
        />
        <MetricCard
          title="Estimated Workload Drop"
          value="~78%"
          subtitle="Prototype simulation index"
          icon={Clock}
          highlightColor="indigo"
        />
        <MetricCard
          title="Manual Review Volume"
          value="12.6%"
          subtitle="Channeled to officer desk"
          icon={AlertTriangle}
          highlightColor="amber"
        />
      </div>

      {/* Comparative Analysis: Manual GIS vs GeoHarmonizer AI (Section 24) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operational Efficiency Benchmark (Prototype Simulation)
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              Manual GIS Reconciliation vs. AI-Assisted GeoHarmonizer
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Estimated turnaround modeling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Manual GIS Legacy Workflow */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="font-bold text-slate-700 dark:text-slate-300 block text-xs uppercase">
              Manual GIS Processing (Before GeoHarmonizer)
            </span>
            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Ingestion & CRS Setup:</span>
                <strong className="text-slate-800 dark:text-slate-200">3–5 days per urban ward</strong>
              </div>
              <div className="flex justify-between">
                <span>Manual Boundary Snapping:</span>
                <strong className="text-slate-800 dark:text-slate-200">15–20 minutes / parcel</strong>
              </div>
              <div className="flex justify-between">
                <span>Cross-Department Discrepancy:</span>
                <strong className="text-rose-600 dark:text-rose-400">Unresolved disputes</strong>
              </div>
              <div className="flex justify-between">
                <span>Audit Trail Logging:</span>
                <strong className="text-slate-800 dark:text-slate-200">Paper registers & memos</strong>
              </div>
            </div>
          </div>

          {/* AI-Assisted GeoHarmonizer AI Workflow */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50/80 to-sky-50/80 dark:from-emerald-950/20 dark:to-sky-950/20 border border-emerald-300 dark:border-emerald-800/80 space-y-3">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Assisted Harmonization (With GeoHarmonizer)</span>
            </span>
            <div className="space-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Automated Ingestion & CRS:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">&lt; 2 minutes pipeline</strong>
              </div>
              <div className="flex justify-between">
                <span>AI Spatial Matching:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">Sub-second / parcel (IoU)</strong>
              </div>
              <div className="flex justify-between">
                <span>Evidence-Backed Resolution:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">CORS GNSS ground calibration</strong>
              </div>
              <div className="flex justify-between">
                <span>Audit Trail Logging:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">Immutable automated log</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid: Quality & Confidence Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Confidence Tier Distribution Curve */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Confidence Score Distribution
            </h3>
            <span className="text-xs font-mono text-slate-400">{parcels.length} Master Parcels</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">High Confidence (&ge;90%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {highConfCount} parcels ({Math.round((highConfCount / parcels.length) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(highConfCount / parcels.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Review Recommended (75–89%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {reviewCount} parcels ({Math.round((reviewCount / parcels.length) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(reviewCount / parcels.length) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-rose-600 dark:text-rose-400">Flagged / Low (&lt;75%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {flaggedCount} parcels ({Math.round((flaggedCount / parcels.length) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${(flaggedCount / parcels.length) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Classification Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Spatial Conflict Categorization
            </h3>
            <span className="text-xs font-mono text-slate-400">{conflicts.length} Total Registered</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-medium">Boundary & Edge Discrepancies</span>
              <strong className="font-mono text-rose-600">42% (SSLR vs MCC offset)</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-medium">Land-Use & Tenure Inconsistency</span>
              <strong className="font-mono text-amber-600">28% (Revenue vs Municipal)</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-medium">Building Setback Encroachments</span>
              <strong className="font-mono text-purple-600">18% (Road corridor violations)</strong>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="font-medium">Duplicate Archive Features</span>
              <strong className="font-mono text-emerald-600">12% (100% deduplicated)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
