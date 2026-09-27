// GeoRecon AI - Main Application Header (SIH26013)

import React from 'react';
import {
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  User,
  ShieldCheck,
  CheckCircle2,
  Info,
  Database,
  Bot
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { UserRole } from '../../types/geospatial';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    isHarmonizing,
    currentStepIndex,
    pipelineSteps,
    runFullHarmonization,
    resetDemoData,
    setIsJudgeTourOpen,
    setIsChatOpen
  } = useGeoRecon();


  const roleLabels: Record<UserRole, string> = {
    admin: 'System Administrator',
    gis_analyst: 'GIS Analyst (SSLR)',
    revenue_officer: 'Revenue Officer (Bhoomi)',
    municipal_officer: 'Municipal Officer (MCC)',
    field_surveyor: 'Field Surveyor (CORS)',
    reviewer: 'Appeals Reviewer'
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-inner shadow-sky-400/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                GeoRecon AI
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                SIH26013
              </span>
              <span className="hidden md:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v2.4 Prototype
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Powered Multi-Source Geospatial Harmonization for Urban Land Records
            </p>
          </div>
        </div>

        {/* Center: Current Project & Status */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium text-white">Project:</span>
            <span>Bengaluru Urban Land Harmonization Demo</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${isHarmonizing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="text-[11px] text-slate-300 font-mono">
              {isHarmonizing ? `Harmonizing: ${pipelineSteps[currentStepIndex]?.name || 'Processing'}` : 'Engines Online'}
            </span>
          </div>

          <div
            title="Demonstration Mode: Uses synthetic realistic Bengaluru datasets without calling paid external government APIs"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800/80 text-[11px] text-sky-300 cursor-help"
          >
            <Info className="w-3 h-3 text-sky-400" />
            <span>Demo Mode</span>
          </div>

          {isSupabaseConfigured && (
            <div
              title="Connected to Supabase PostgreSQL Cloud with PostGIS extensions"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[11px] text-emerald-300"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold">Supabase PostgreSQL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          )}
        </div>

        {/* Right: Quick Actions, Role Selector & Judge Tour */}
        <div className="flex items-center gap-2.5">
          {/* Judge Guided Demo CTA */}
          <button
            onClick={() => setIsJudgeTourOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition-all shadow-amber-500/20 active:scale-95"
            title="Start 3-Minute Guided Hackathon Tour for Judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span className="font-bold">Judge Demo (3-Min)</span>
          </button>

          {/* AI Copilot CTA */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm transition-all shadow-purple-600/20 active:scale-95 border border-purple-400/30"
            title="Open GeoRecon AI Copilot (Powered by Google Gemini 3.8 Flash)"
          >
            <Bot className="w-3.5 h-3.5 text-purple-200" />
            <span>AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>


          {/* Run Full Harmonization CTA */}
          <button
            disabled={isHarmonizing}
            onClick={runFullHarmonization}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all shadow-sm active:scale-95 ${
              isHarmonizing
                ? 'bg-sky-800 opacity-60 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-500 border border-sky-400/30 shadow-sky-600/20'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isHarmonizing ? 'animate-spin' : ''}`} />
            <span>{isHarmonizing ? 'Harmonizing...' : 'Run Pipeline'}</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            title="Reset demo data to initial seed state"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Role Switcher */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
              >
                {Object.entries(roleLabels).map(([role, label]) => (
                  <option key={role} value={role} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
