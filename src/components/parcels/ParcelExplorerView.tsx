// GeoRecon AI - Interactive Parcel Explorer (SIH26013 - Section 20)

import React, { useState } from 'react';
import {
  FolderSearch,
  Search,
  Filter,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  DownloadCloud,
  FileText
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { HarmonizedParcel } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';
import { ParcelDetailDrawer } from './ParcelDetailDrawer';

export const ParcelExplorerView: React.FC = () => {
  const { parcels, selectedParcelId, setSelectedParcelId, setActivePage } = useGeoRecon();

  const [search, setSearch] = useState('');
  const [filterLandUse, setFilterLandUse] = useState<string>('all');
  const [filterConfidence, setFilterConfidence] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedParcel = parcels.find(p => p.parcel_id === selectedParcelId) || null;

  const filtered = parcels.filter(p => {
    const matchesSearch =
      p.parcel_id.toLowerCase().includes(search.toLowerCase()) ||
      p.survey_number.toLowerCase().includes(search.toLowerCase()) ||
      p.municipal_property_id.toLowerCase().includes(search.toLowerCase()) ||
      p.ward_id.toLowerCase().includes(search.toLowerCase());

    const matchesLandUse = filterLandUse === 'all' || p.land_use === filterLandUse;
    const matchesStatus = filterStatus === 'all' || p.review_status === filterStatus;
    const matchesConf =
      filterConfidence === 'all'
        ? true
        : filterConfidence === 'high'
        ? p.confidence_score >= 90
        : filterConfidence === 'review'
        ? p.confidence_score >= 75 && p.confidence_score < 90
        : p.confidence_score < 75;

    return matchesSearch && matchesLandUse && matchesStatus && matchesConf;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Land Register Browser
              </span>
              <span className="text-xs text-slate-500">Mysuru Urban Sector (Ward 14)</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Interactive Parcel Explorer
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore harmonized parcel records, inspect individual spatial geometry rings, review multi-source attribution, and access legal survey evidence.
            </p>
          </div>

          <button
            onClick={() => setActivePage('canonical-records')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
          >
            <span>Canonical Model View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search and Filters Bar (Section 20 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Parcel ID, Survey No, Municipal PID, Ward..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Land Use Filter */}
          <select
            value={filterLandUse}
            onChange={e => setFilterLandUse(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Land Uses</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Mixed Use">Mixed Use</option>
            <option value="Institutional">Institutional</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={filterConfidence}
            onChange={e => setFilterConfidence(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Confidence</option>
            <option value="high">High (≥90%)</option>
            <option value="review">Review (75–89%)</option>
            <option value="flagged">Flagged (&lt;75%)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          >
            <option value="all">All Review Statuses</option>
            <option value="Auto-Approved">Auto-Approved</option>
            <option value="Approved by Officer">Approved by Officer</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Interactive Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Interactive GIS Map (Click polygon to inspect)
            </span>
            <span className="text-slate-500">Showing {filtered.length} parcels</span>
          </div>

          <InteractiveMap
            height="500px"
            highlightParcelId={selectedParcelId}
            onParcelSelect={(id) => setSelectedParcelId(id)}
          />
        </div>

        {/* Right: Parcels List Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2.5">Parcel ID</th>
                  <th className="px-3 py-2.5">Survey No</th>
                  <th className="px-3 py-2.5">Municipal PID</th>
                  <th className="px-3 py-2.5">Area</th>
                  <th className="px-3 py-2.5">Confidence</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filtered.map(p => {
                  const isSelected = selectedParcelId === p.parcel_id;
                  return (
                    <tr
                      key={p.parcel_id}
                      onClick={() => setSelectedParcelId(p.parcel_id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono font-bold">{p.parcel_id}</td>
                      <td className="px-3 py-2">{p.survey_number}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-500">{p.municipal_property_id}</td>
                      <td className="px-3 py-2 font-mono font-semibold">{p.area_sqm} m²</td>
                      <td className="px-3 py-2">
                        <StatusBadge status="" type="confidence" score={p.confidence_score} />
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={p.review_status} />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-sky-600 dark:text-sky-400 font-semibold hover:underline">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Parcel Detail Drawer */}
      <ParcelDetailDrawer
        parcel={selectedParcel}
        onClose={() => setSelectedParcelId(null)}
        onNavigateToBeforeAfter={() => setActivePage('before-after')}
      />
    </div>
  );
};
