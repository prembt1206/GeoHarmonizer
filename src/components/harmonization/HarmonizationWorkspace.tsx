// GeoRecon AI - AI Harmonization Workspace (SIH26013 - Section 11)

import React from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Split,
  FolderSearch,
  DownloadCloud
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { MetricCard } from '../common/StatusBadge';

const STEP_PAGE_MAP: Record<string, string> = {
  'step-ingest': 'data-hub',
  'step-profile': 'data-hub',
  'step-crs': 'settings',
  'step-match': 'spatial-matching',
  'step-attribute': 'attribute-mapping',
  'step-topology': 'spatial-validation',
  'step-changes': 'change-detection',
  'step-conflicts': 'conflict-center',
  'step-confidence': 'confidence-engine',
  'step-publish': 'canonical-records'
};

export const HarmonizationWorkspace: React.FC = () => {

  const {
    isHarmonizing,
    pipelineProgress,
    currentStepIndex,
    pipelineSteps,
    runFullHarmonization,
    resetDemoData,
    parcels,
    datasets,
    conflicts,
    topologyIssues,
    changes,
    attributeMappings,
    setActivePage
  } = useGeoRecon();

  const isComplete = !isHarmonizing && pipelineProgress === 100;
  const avgConfidence = (parcels.reduce((acc, p) => acc + p.confidence_score, 0) / Math.max(1, parcels.length)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Primary Intelligence Engine
              </span>
              <span className="text-xs text-slate-500">10-Stage Geospatial Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              AI Harmonization Workspace
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Executes the end-to-end multi-source geospatial reconciliation workflow. Aligns disparate coordinate systems, performs spatial polygon matching, normalizes schemas, heals topology defects, and produces an auditable canonical parcel record.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDemoData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>

            <button
              disabled={isHarmonizing}
              onClick={runFullHarmonization}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all active:scale-95 ${
                isHarmonizing
                  ? 'bg-sky-800 opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-600/30'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isHarmonizing ? 'animate-spin' : ''}`} />
              <span>{isHarmonizing ? 'Processing Pipeline...' : 'Run AI Harmonization'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Stepper Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Harmonization Execution Flow
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
            {pipelineProgress}% Completed
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${pipelineProgress}%` }}
          />
        </div>

        {/* 10-Stage Pipeline Grid (Section 11 Architecture) */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          {pipelineSteps.map((step, idx) => {
            const isCur = isHarmonizing && idx === currentStepIndex;
            const isDone = step.status === 'completed';
            const targetPage = STEP_PAGE_MAP[step.id];

            return (
              <div
                key={step.id}
                onClick={() => targetPage && setActivePage(targetPage as any)}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md active:scale-98 ${
                  isCur
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 shadow-sm animate-pulse'
                    : isDone
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 text-slate-400 hover:border-sky-400'
                }`}
                title={`Click to inspect ${step.name}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold">STAGE 0{idx + 1}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCur
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </span>
                  </div>
                  <div className="font-bold text-xs mt-1 text-slate-900 dark:text-white">
                    {step.name}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="truncate">{step.summary}</span>
                  <ArrowRight className="w-3 h-3 shrink-0 ml-1 text-sky-500 opacity-60" />
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Summary Box After Completion (Section 11 & 29 Requirements) */}
      {isComplete && (
        <div className="bg-gradient-to-r from-emerald-50 via-sky-50 to-indigo-50 dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-indigo-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 shadow-md animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-200/80 dark:border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Harmonization Complete & Canonical Layer Generated
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  All multi-source spatial inputs reconciled for Bengaluru Urban Sector. Canonical spatial indices updated.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('conflict-center')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Conflict Center</span>
              </button>

              <button
                onClick={() => setActivePage('before-after')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sky-600 dark:text-sky-400 shadow-xs hover:border-sky-400 transition-all"
              >
                <Split className="w-3.5 h-3.5" />
                <span>View Before / After</span>
              </button>

              <button
                onClick={() => setActivePage('data-exchange')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>Export Canonical Dataset</span>
              </button>
            </div>
          </div>

          {/* Harmonization Statistics Summary Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Datasets</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{datasets.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Parcels</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{parcels.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Matched</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">22</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Needs Review</span>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5">2</p>
            </div>
            <div
              onClick={() => setActivePage('conflict-center')}
              className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-rose-400 hover:scale-105 transition-all"
              title="Click to open Conflict Center"
            >
              <span className="text-[10px] text-slate-400 font-bold uppercase">Unresolved</span>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5">1</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Topo Healed</span>
              <p className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-0.5">{topologyIssues.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Changes</span>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{changes.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Conf</span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{avgConfidence}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
