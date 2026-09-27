// GeoRecon AI - Multi-Source Data Hub View (SIH26013 - Section 7)

import React, { useState } from 'react';
import {
  Database,
  Upload,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileCode,
  Calendar,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { Dataset, DatasetCategory } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { DataProfilingDrawer } from './DataProfilingDrawer';
import { UploadModal } from './UploadModal';

export const DataHub: React.FC = () => {
  const { datasets, setActivePage } = useGeoRecon();

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDatasets = datasets.filter(ds => {
    const matchesCat = filterCategory === 'all' || ds.category === filterCategory;
    const matchesSearch =
      ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.format.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Departmental Data Ingestion
            </span>
            <span className="text-xs text-slate-500">10 Multi-Source Layers Loaded</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Multi-Source Data Hub
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Central repository for ingesting and profiling multi-departmental land datasets. Ingests Cadastral maps, Municipal tax GIS, Revenue khatas, UAV drone orthophotos, LiDAR DSM/DTMs, and GNSS benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('harmonization')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all active:scale-95"
          >
            <span>Harmonization Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest New Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search datasets, formats, departments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0 font-medium">Filter:</span>
          {['all', 'cadastral', 'municipal', 'revenue', 'ori', 'building_footprints', 'gnss_cors'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all shrink-0 ${
                filterCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {(cat || '').replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset Cards Grid (Section 7 Requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDatasets.map(ds => {
          const hasIssues = ds.validationStatus === 'has_issues';

          return (
            <div
              key={ds.id}
              onClick={() => setSelectedDataset(ds)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {ds.format} • {ds.geometryType}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-0.5">
                      {ds.name}
                    </h3>
                  </div>
                  <StatusBadge status={ds.status === 'ready' ? 'Ready for Harmonization' : ds.status} />
                </div>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {ds.department}
                </p>

                {/* Metadata Badges */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">CRS</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {ds.crs}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Features</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {ds.featureCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Validation Status Indicators (Section 7 Example) */}
                <div className="mt-3 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Geometry & SRS Validated</span>
                  </div>

                  {hasIssues ? (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>⚠ {ds.issuesCount} topology / schema issues flagged</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Zero Critical Schema Errors</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Trust: <strong className="text-emerald-600 dark:text-emerald-400">{ds.sourceTrustScore}%</strong></span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:underline">
                  Inspect Schema →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dataset Profiling Drawer */}
      <DataProfilingDrawer
        dataset={selectedDataset}
        onClose={() => setSelectedDataset(null)}
        onNavigateToMapping={() => {
          setSelectedDataset(null);
          setActivePage('attribute-mapping');
        }}
      />

      {/* Ingestion Wizard Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
