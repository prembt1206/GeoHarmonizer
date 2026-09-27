// GeoRecon AI - Command Center Overview Dashboard (SIH26013)

import React from 'react';
import {
  Database,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Percent,
  TrendingUp,
  Cpu,
  Play,
  ArrowRight,
  ExternalLink,
  Split,
  Compass
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { MetricCard, StatusBadge } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';

export const OverviewDashboard: React.FC = () => {
  const {
    parcels,
    datasets,
    conflicts,
    topologyIssues,
    runFullHarmonization,
    isHarmonizing,
    pipelineProgress,
    currentStepIndex,
    pipelineSteps,
    setActivePage,
    setSelectedParcelId,
    auditLogs
  } = useGeoRecon();

  const openConflicts = conflicts.filter(c => c.status !== 'resolved').length;
  const openTopology = topologyIssues.filter(t => t.status === 'open').length;
  const avgConfidence = (parcels.reduce((acc, p) => acc + p.confidence_score, 0) / Math.max(1, parcels.length)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Operational Command Center
            </span>
            <span className="text-xs text-slate-400">Mysuru Urban Sector</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Urban Land Harmonization Command Center
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Monitor multi-source geospatial integration, coordinate alignment, AI spatial matching, topology validation, and evidence-backed conflict resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('before-after')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-all active:scale-95"
          >
            <Split className="w-4 h-4" />
            <span>Before / After View</span>
          </button>

          <button
            disabled={isHarmonizing}
            onClick={runFullHarmonization}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
              isHarmonizing
                ? 'bg-sky-800 opacity-70 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-600/30 border border-sky-400/30'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isHarmonizing ? 'animate-spin' : ''}`} />
            <span>{isHarmonizing ? 'Running Pipeline...' : 'Run Full Harmonization'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Section 6 Requirements) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Datasets Integrated"
          value={datasets.length}
          subtitle="Cadastral, Municipal, Drone, GNSS"
          icon={Database}
          highlightColor="brand"
          onClick={() => setActivePage('data-hub')}
        />
        <MetricCard
          title="Parcels Processed"
          value="24,821"
          subtitle={`${parcels.length} demo parcels in view`}
          icon={Layers}
          trend="+100% harmonized"
          trendPositive={true}
          highlightColor="indigo"
          onClick={() => setActivePage('parcel-explorer')}
        />
        <MetricCard
          title="Spatial Matches"
          value="22,914"
          subtitle="92.3% IoU match rate"
          icon={CheckCircle2}
          highlightColor="emerald"
          onClick={() => setActivePage('spatial-matching')}
        />
        <MetricCard
          title="Topology Issues"
          value={openTopology}
          subtitle="Overlaps & sliver gaps"
          icon={ShieldAlert}
          trend={openTopology > 0 ? `${openTopology} open` : 'All healed'}
          trendPositive={openTopology === 0}
          highlightColor="amber"
          onClick={() => setActivePage('spatial-validation')}
        />
        <MetricCard
          title="Attribute Conflicts"
          value={openConflicts}
          subtitle="Multi-department variance"
          icon={AlertTriangle}
          trend={openConflicts > 0 ? `${openConflicts} pending` : 'Resolved'}
          trendPositive={openConflicts === 0}
          highlightColor="rose"
          onClick={() => setActivePage('conflict-center')}
        />
        <MetricCard
          title="Low Confidence Parcels"
          value="93"
          subtitle="1 in demo queue (<75%)"
          icon={Compass}
          highlightColor="amber"
          onClick={() => setActivePage('review-approval')}
        />
        <MetricCard
          title="Auto-Corrected Rate"
          value="87.4%"
          subtitle="Automated edge snapping"
          icon={TrendingUp}
          trend="+14% vs manual"
          trendPositive={true}
          highlightColor="emerald"
        />
        <MetricCard
          title="Average Confidence"
          value={`${avgConfidence}%`}
          subtitle="5-Factor Transparent Index"
          icon={Percent}
          trend="High Confidence"
          trendPositive={true}
          highlightColor="emerald"
          onClick={() => setActivePage('confidence-engine')}
        />
      </div>

      {/* Main Grid: Interactive Map + Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map (2 Columns) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Harmonized Urban Parcel Map
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('before-after')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Compare Before / After</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <InteractiveMap
            height="520px"
            onParcelSelect={(id) => {
              setSelectedParcelId(id);
              setActivePage('parcel-explorer');
            }}
          />
        </div>

        {/* Pipeline Stepper & Conflict Breakdown (1 Column) */}
        <div className="space-y-6">
          {/* Pipeline Status Stepper */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Harmonization Pipeline</h3>
              </div>
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                {pipelineProgress}% Complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${pipelineProgress}%` }}
              />
            </div>

            {/* Stages List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 text-xs">
              {pipelineSteps.map((step, idx) => {
                const isCurrent = isHarmonizing && idx === currentStepIndex;
                const isDone = step.status === 'completed';

                return (
                  <div
                    key={step.id}
                    className={`p-2 rounded-lg border transition-all flex items-start justify-between ${
                      isCurrent
                        ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                        : isDone
                        ? 'bg-slate-50 dark:bg-slate-850/50 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-sky-500 text-white animate-spin'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </span>
                      <div>
                        <div className="font-semibold text-xs">{step.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {step.summary}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePage('harmonization')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Open Full Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Conflicts Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Conflict Queue</h3>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {openConflicts} Pending
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {conflicts.slice(0, 3).map(c => (
                <div
                  key={c.id}
                  onClick={() => setActivePage('conflict-center')}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-400 cursor-pointer transition-all bg-slate-50/60 dark:bg-slate-850/40"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                    <span>{c.id}</span>
                    <StatusBadge status={c.severity} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                    Parcel {c.parcel_id} • AI Conf: {c.confidence}%
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActivePage('conflict-center')}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>View All Conflicts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Processing Activity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Geospatial Harmonization Events</h3>
          </div>
          <button
            onClick={() => setActivePage('audit-trail')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Complete Audit Log</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Operator / Role</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Target Object</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {auditLogs.slice(0, 5).map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                  <td className="px-3 py-2 font-medium">{log.userName}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{log.action}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{log.targetObject}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={log.status} />
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
