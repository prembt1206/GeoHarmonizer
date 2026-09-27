// GeoRecon AI - Intelligent Attribute Mapping View (SIH26013 - Section 13)

import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Edit2,
  Database,
  Search,
  ShieldCheck
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { CANONICAL_SCHEMA } from '../../services/attributeMappingService';
import { AttributeMappingProposal } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';

export const AttributeMappingView: React.FC = () => {
  const { attributeMappings } = useGeoRecon();

  const [mappings, setMappings] = useState<AttributeMappingProposal[]>(attributeMappings);
  const [filterDataset, setFilterDataset] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, status: 'approved' } : m));
  };

  const handleReject = (id: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, status: 'rejected' } : m));
  };

  const handleUpdateTarget = (id: string, newTarget: string) => {
    setMappings(prev => prev.map(m => m.id === id ? { ...m, canonicalField: newTarget, status: 'customized' } : m));
    setEditingId(null);
  };

  const filtered = mappings.filter(m => {
    const matchesDs = filterDataset === 'all' || m.sourceDataset.toLowerCase().includes(filterDataset.toLowerCase());
    const matchesSearch =
      m.sourceField.toLowerCase().includes(search.toLowerCase()) ||
      m.canonicalField.toLowerCase().includes(search.toLowerCase()) ||
      m.sourceDataset.toLowerCase().includes(search.toLowerCase());
    return matchesDs && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Semantic Normalization
          </span>
          <span className="text-xs text-slate-500">Heterogeneous Departmental Schemas</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Intelligent Attribute Mapping
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          GeoRecon AI employs fuzzy semantic inference and departmental domain heuristics to map non-standard field names (e.g. Municipal `property_id` and Cadastral `survey_no`) into a single Canonical Urban Land Record standard.
        </p>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search source field, canonical target, dataset..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Dataset:</span>
          {['all', 'cadastral', 'municipal', 'revenue', 'building'].map(ds => (
            <button
              key={ds}
              onClick={() => setFilterDataset(ds)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                filterDataset === ds
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {ds}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Schema Mapping Matrix (Section 13 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Source Dataset</th>
                <th className="px-4 py-3">Department Field</th>
                <th className="px-4 py-3 text-center">AI Mapping</th>
                <th className="px-4 py-3">Canonical Target Field</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Sample Value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map(m => {
                const isEditing = editingId === m.id;

                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {m.sourceDataset}
                    </td>
                    <td className="px-4 py-3 font-mono text-sky-600 dark:text-sky-400 font-bold">
                      {m.sourceField}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ArrowRight className="w-4 h-4 text-slate-400 mx-auto" />
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {isEditing ? (
                        <select
                          defaultValue={m.canonicalField}
                          onChange={e => handleUpdateTarget(m.id, e.target.value)}
                          className="bg-white dark:bg-slate-800 border border-sky-500 rounded px-2 py-1 text-xs"
                        >
                          {CANONICAL_SCHEMA.map(cs => (
                            <option key={cs.field} value={cs.field}>
                              {cs.field} ({cs.label})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span>{m.canonicalField}</span>
                          <button
                            onClick={() => setEditingId(m.id)}
                            className="p-1 text-slate-400 hover:text-sky-500"
                            title="Edit mapping"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="w-3 h-3" />
                        {m.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {m.sampleMatch}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(m.id)}
                          title="Approve Mapping"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(m.id)}
                          title="Reject Mapping"
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
