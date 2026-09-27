// GeoRecon AI - Professional GIS Map Legend Component (SIH26013)

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface MapLegendProps {
  colorMode?: 'confidence' | 'land_use' | 'status';
}

export const MapLegend: React.FC<MapLegendProps> = ({ colorMode = 'confidence' }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 right-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs max-w-[210px] overflow-hidden transition-all">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="px-2.5 py-1.5 flex items-center justify-between cursor-pointer font-bold text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50"
      >
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
          Map Legend
        </span>
        {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </div>

      {!collapsed && (
        <div className="p-2.5 space-y-2 text-[11px]">
          {colorMode === 'confidence' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Confidence Tiers</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-600"></span>
                <span className="text-slate-700 dark:text-slate-300">High (≥90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Review (75–89%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-rose-500/30 border border-rose-600"></span>
                <span className="text-slate-700 dark:text-slate-300">Flagged (&lt;75%)</span>
              </div>
            </div>
          )}

          {colorMode === 'land_use' && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Land Use</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Residential</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500"></span>
                <span>Commercial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-500"></span>
                <span>Mixed Use</span>
              </div>
            </div>
          )}

          <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Multi-Source Layers</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Cadastral Boundary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Municipal Boundary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-sky-600"></span>
              <span className="text-slate-600 dark:text-slate-400">GNSS CORS Benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-700"></span>
              <span className="text-slate-600 dark:text-slate-400">Conflict / Topology Alert</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[10px] font-semibold text-cyan-500 uppercase">UAV Photogrammetry</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-cyan-400"></span>
              <span className="text-slate-600 dark:text-slate-400">UAV Flight Line (120m)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 border border-cyan-600"></span>
              <span className="text-slate-600 dark:text-slate-400">Camera Station (45MP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 border border-yellow-600"></span>
              <span className="text-slate-600 dark:text-slate-400">DGPS Ground Control (GCP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/20 border border-dashed border-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">5cm Orthomosaic (ORI)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
