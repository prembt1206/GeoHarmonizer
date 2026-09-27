// GeoRecon AI - Enterprise Sidebar Navigation (SIH26013)

import React from 'react';
import {
  LayoutDashboard,
  Database,
  Cpu,
  Split,
  Binary,
  Workflow,
  ShieldAlert,
  Clock,
  AlertTriangle,
  FolderSearch,
  FileCheck2,
  UserCheck,
  History,
  BarChart3,
  DownloadCloud,
  Settings,
  HelpCircle,
  Compass,
  Bot,
  Sparkles
} from 'lucide-react';
import { useGeoRecon, NavPage } from '../../context/GeoReconContext';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    conflicts,
    topologyIssues,
    changes,
    parcels,
    datasets,
    setIsChatOpen
  } = useGeoRecon();


  const openConflictsCount = conflicts.filter(c => c.status !== 'resolved').length;
  const openTopologyCount = topologyIssues.filter(t => t.status === 'open').length;
  const pendingChangesCount = changes.filter(c => c.status === 'pending').length;
  const reviewQueueCount = parcels.filter(p => p.review_status === 'Under Review').length;

  const coreNav: NavItem[] = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'data-hub', label: 'Multi-Source Data Hub', icon: Database, badge: datasets.length },
    { id: 'harmonization', label: 'Harmonization Pipeline', icon: Cpu, badge: 'AI' },
    { id: 'before-after', label: 'Before / After Map', icon: Split, highlight: true }
  ];

  const intelligenceNav: NavItem[] = [
    { id: 'spatial-matching', label: 'AI Spatial Matching', icon: Binary },
    { id: 'attribute-mapping', label: 'Attribute Harmonization', icon: Workflow },
    { id: 'spatial-validation', label: 'Spatial Validation', icon: ShieldAlert, badge: openTopologyCount, badgeColor: 'bg-rose-500' },
    { id: 'change-detection', label: 'Change Detection', icon: Clock, badge: pendingChangesCount, badgeColor: 'bg-amber-500' },
    { id: 'conflict-center', label: 'Conflict Center', icon: AlertTriangle, badge: openConflictsCount, badgeColor: 'bg-rose-500' },
    { id: 'confidence-engine', label: 'Confidence Engine', icon: Compass }
  ];

  const governanceNav: NavItem[] = [
    { id: 'parcel-explorer', label: 'Parcel Explorer', icon: FolderSearch, badge: parcels.length },
    { id: 'canonical-records', label: 'Canonical Records', icon: FileCheck2 },
    { id: 'review-approval', label: 'Review & Approval', icon: UserCheck, badge: reviewQueueCount, badgeColor: 'bg-amber-500' },
    { id: 'audit-trail', label: 'Audit Trail', icon: History }
  ];

  const systemNav: NavItem[] = [
    { id: 'analytics', label: 'Geospatial Analytics', icon: BarChart3 },
    { id: 'data-exchange', label: 'Data Exchange & Sync', icon: DownloadCloud },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'architecture', label: 'Architecture & Traceability', icon: HelpCircle }
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-sm shadow-sky-600/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              } ${item.highlight && !isActive ? 'border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-500' : 'text-slate-400 dark:text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor
                      ? `${item.badgeColor} text-white`
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 shrink-0 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] overflow-y-auto p-3">
      <div className="space-y-1">
        {renderNavGroup('Core Workflows', coreNav)}
        {renderNavGroup('AI Reconciliation', intelligenceNav)}
        {renderNavGroup('Land Governance', governanceNav)}
      </div>

      {/* AI Copilot Quick Launcher */}
      <div className="my-3 p-3 rounded-xl bg-gradient-to-br from-indigo-950/70 to-purple-950/70 border border-purple-500/30 text-white shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-purple-200">GeoRecon Copilot</span>
          </div>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            Gemini 3.8
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mb-2.5 leading-relaxed">
          Ask questions about boundary conflicts, IoU metrics, or SIH26013 workflow.
        </p>
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-purple-400/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch AI Assistant</span>
        </button>
      </div>

      {/* System Health Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Spatial Engine</span>
          <span className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Target CRS</span>
          <span className="font-mono text-slate-700 dark:text-slate-300">EPSG:32643</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Authority</span>
          <span className="truncate max-w-[120px]" title="Bruhat Bengaluru Mahanagara Palike & SSLR">BBMP & SSLR</span>
        </div>
      </div>
    </aside>
  );
};
