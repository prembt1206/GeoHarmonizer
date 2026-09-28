// GeoHarmonizer AI - Human-in-the-Loop Review & Approval (SIH26013 - Section 19)

import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  HelpCircle,
  Layers,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  History
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { HarmonizedParcel } from '../../types/geospatial';
import { StatusBadge } from '../common/StatusBadge';
import { InteractiveMap } from '../map/InteractiveMap';

export const ReviewApprovalView: React.FC = () => {
  const { parcels, approveParcelReview, rejectParcelReview, setSelectedParcelId, setActivePage } = useGeoRecon();

  const reviewParcels = parcels.filter(p => p.review_status === 'Under Review' || p.confidence_score < 93);
  const [selectedParcel, setSelectedParcel] = useState<HarmonizedParcel>(reviewParcels[0] || parcels[2]);

  const handleApprove = (parcelId: string) => {
    approveParcelReview(parcelId);
    setSelectedParcel(prev => ({
      ...prev,
      review_status: 'Approved by Officer',
      confidence_score: Math.max(93, prev.confidence_score)
    }));
  };

  const handleReject = (parcelId: string) => {
    rejectParcelReview(parcelId);
    setSelectedParcel(prev => ({
      ...prev,
      review_status: 'Rejected',
      validation_status: 'Flagged'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Responsible AI & Administrative Governance
          </span>
          <span className="text-xs text-slate-500">Human-in-the-Loop Verification</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Review & Approval Queue
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          GeoHarmonizer AI never makes autonomous decisions for low-confidence or disputed land records. When multi-source variances exceed automatic thresholds, cases are routed to designated municipal and revenue officers for review, evidence scrutiny, and statutory sign-off.
        </p>
      </div>

      {/* Review Queue Grid: Map & Evidence Scrutiny Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Map Focused on Selected Review Parcel */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Inspection Viewport: Parcel {selectedParcel.parcel_id} ({selectedParcel.survey_number})</span>
            </h3>
            <span className="text-xs text-slate-500">
              Review Status: <strong className="text-amber-600">{selectedParcel.review_status}</strong>
            </span>
          </div>

          <InteractiveMap
            height="460px"
            highlightParcelId={selectedParcel.parcel_id}
            onParcelSelect={(id) => {
              const found = parcels.find(p => p.parcel_id === id);
              if (found) setSelectedParcel(found);
            }}
          />
        </div>

        {/* Right 1 Column: Decision & Evidence Scrutiny Card (Section 19 Requirements) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                Statutory Review Case
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Parcel {selectedParcel.parcel_id}
              </h3>
            </div>
            <StatusBadge status={selectedParcel.review_status} />
          </div>

          {/* Quick Parcel Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="text-[10px] text-slate-400 block">Survey No</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedParcel.survey_number}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="text-[10px] text-slate-400 block">Municipal Tax PID</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedParcel.municipal_property_id}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="text-[10px] text-slate-400 block">Reconciled Area</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedParcel.area_sqm} m²</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="text-[10px] text-slate-400 block">Confidence</span>
              <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">{selectedParcel.confidence_score}%</span>
            </div>
          </div>

          {/* AI Recommendation & Rationale (Section 19) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-200 dark:border-sky-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-sky-900 dark:text-sky-300 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Reconciliation Summary</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              Multi-source boundary difference of ~1.2m successfully aligned using GNSS ground benchmark. Revenue land-use tenure matched to MCC commercial classification.
            </p>
          </div>

          {/* Discrepancy Evidence Table */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Departmental Evidence Stack
            </span>

            {selectedParcel.source_polygons?.map((src, i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">{src.source}</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{src.area} m²</span>
              </div>
            )) || (
              <div className="text-slate-400 text-xs">Cadastral & Municipal sources aligned.</div>
            )}
          </div>

          {/* Officer Decision Buttons (Section 19) */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleApprove(selectedParcel.parcel_id)}
                className="py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Lock</span>
              </button>

              <button
                onClick={() => handleReject(selectedParcel.parcel_id)}
                className="py-2.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject / Re-Survey</span>
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedParcelId(selectedParcel.parcel_id);
                setActivePage('parcel-explorer');
              }}
              className="w-full py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Open Full Parcel Explorer
            </button>
          </div>
        </div>
      </div>

      {/* Review Queue List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
          Cases Pending Administrative Sign-Off ({reviewParcels.length} records)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-3 py-2">Parcel ID</th>
                <th className="px-3 py-2">Survey Number</th>
                <th className="px-3 py-2">Municipal PID</th>
                <th className="px-3 py-2">Harmonized Area</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Review Status</th>
                <th className="px-3 py-2 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {reviewParcels.map(p => (
                <tr
                  key={p.parcel_id}
                  onClick={() => setSelectedParcel(p)}
                  className={`cursor-pointer transition-colors ${
                    selectedParcel.parcel_id === p.parcel_id
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 font-medium'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="px-3 py-2 font-mono font-bold">{p.parcel_id}</td>
                  <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">{p.survey_number}</td>
                  <td className="px-3 py-2 font-mono text-slate-500">{p.municipal_property_id}</td>
                  <td className="px-3 py-2 font-mono">{p.area_sqm} m²</td>
                  <td className="px-3 py-2">
                    <StatusBadge status="" type="confidence" score={p.confidence_score} />
                  </td>
                  <td className="px-3 py-2"><StatusBadge status={p.review_status} /></td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(p.parcel_id);
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                    >
                      Approve
                    </button>
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
