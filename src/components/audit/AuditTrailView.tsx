// GeoRecon AI - Audit Trail & Provenance Ledger (SIH26013 - Section 23)

import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  DownloadCloud,
  FileCheck2,
  User,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { StatusBadge } from '../common/StatusBadge';
import { syncService } from '../../services/syncService';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useGeoRecon();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filtered = auditLogs.filter(log => {
    const matchesRole = filterRole === 'all' || log.userRole === filterRole;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.targetObject.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleExportAudit = () => {
    const csvContent = [
      'Timestamp,Operator,Role,Action,Target Object,Previous Value,New Value,Status,Notes',
      ...auditLogs.map(l =>
        `"${l.timestamp}","${l.userName}","${l.userRole}","${l.action}","${l.targetObject}","${l.previousValue || ''}","${l.newValue || ''}","${l.status}","${l.notes || ''}"`
      )
    ].join('\n');
    syncService.triggerDownload('GeoRecon_Audit_Trail_Ledger.csv', csvContent, 'text/csv');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Statutory Accountability
              </span>
              <span className="text-xs text-slate-500">Immutable Administrative Event Ledger</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Audit Trail & Lineage Ledger
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              Every data ingestion, coordinate transformation, spatial match, automated topology repair, human override, and conflict resolution is cryptographically timestamped with operator credentials for statutory administrative compliance.
            </p>
          </div>

          <button
            onClick={handleExportAudit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search actions, parcels, operators, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Role:</span>
          {['all', 'admin', 'gis_analyst', 'revenue_officer', 'municipal_officer'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                filterRole === r
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table (Section 23 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Operator / Role</th>
                <th className="px-4 py-3">Action Executed</th>
                <th className="px-4 py-3">Target Object</th>
                <th className="px-4 py-3">Previous State</th>
                <th className="px-4 py-3">Reconciled State</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Evidence Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{log.userName}</div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{log.userRole}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-sky-600 dark:text-sky-400 font-mono font-medium">
                    {log.targetObject}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px] max-w-xs truncate">
                    {log.previousValue || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium text-[11px] max-w-xs truncate">
                    {log.newValue || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px] max-w-xs truncate">
                    {log.notes || '—'}
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
