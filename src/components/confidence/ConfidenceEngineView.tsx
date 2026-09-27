// GeoRecon AI - Explainable Confidence Engine View (SIH26013 - Sections 18 & 39)

import React, { useState } from 'react';
import {
  Compass,
  Sliders,
  Sparkles,
  ShieldCheck,
  Percent,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Info
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { DEFAULT_CONFIDENCE_WEIGHTS } from '../../services/confidenceService';
import { StatusBadge } from '../common/StatusBadge';

export const ConfidenceEngineView: React.FC = () => {
  const { settings, updateSettings, parcels } = useGeoRecon();

  const [weights, setWeights] = useState(settings.weights || DEFAULT_CONFIDENCE_WEIGHTS);
  const [autoThresh, setAutoThresh] = useState(settings.autoApprovalThreshold || 90);
  const [reviewThresh, setReviewThresh] = useState(settings.manualReviewThreshold || 75);

  const sampleParcel = parcels[1]; // P-0102

  const handleSaveSettings = () => {
    updateSettings({
      weights,
      autoApprovalThreshold: autoThresh,
      manualReviewThreshold: reviewThresh
    });
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_CONFIDENCE_WEIGHTS);
    setAutoThresh(90);
    setReviewThresh(75);
    updateSettings({
      weights: DEFAULT_CONFIDENCE_WEIGHTS,
      autoApprovalThreshold: 90,
      manualReviewThreshold: 75
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Explainable Geospatial AI
          </span>
          <span className="text-xs text-slate-500">Prototype Confidence Model (Configurable Weights)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Confidence Engine & Explainability Matrix
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          GeoRecon AI guarantees auditable decisions by decomposing parcel confidence into five transparent, quantifiable factors. Records above the automated approval threshold ({autoThresh}%) lock automatically into the canonical layer, while uncertain records are channeled to human administrative review.
        </p>
      </div>

      {/* Main Grid: Configurable Weights + Explainable Factor Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configurable Weight Formula Sliders (Section 39) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Formula Weights & Decision Thresholds
              </h3>
            </div>
            <button
              onClick={handleResetWeights}
              title="Reset weights to default SIH prototype profile"
              className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Defaults</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Weight 1 */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Spatial Alignment Weight</span>
                <span className="font-mono text-sky-600">{Math.round(weights.spatialAlignment * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={Math.round(weights.spatialAlignment * 100)}
                onChange={e => setWeights(prev => ({ ...prev, spatialAlignment: Number(e.target.value) / 100 }))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">IoU boundary overlap and boundary-edge co-linearity</span>
            </div>

            {/* Weight 2 */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Geometry Similarity Weight</span>
                <span className="font-mono text-sky-600">{Math.round(weights.geometrySimilarity * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={Math.round(weights.geometrySimilarity * 100)}
                onChange={e => setWeights(prev => ({ ...prev, geometrySimilarity: Number(e.target.value) / 100 }))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">Hausdorff distance and polygon compactness ratio</span>
            </div>

            {/* Weight 3 */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Attribute Consistency Weight</span>
                <span className="font-mono text-sky-600">{Math.round(weights.attributeConsistency * 100)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={Math.round(weights.attributeConsistency * 100)}
                onChange={e => setWeights(prev => ({ ...prev, attributeConsistency: Number(e.target.value) / 100 }))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">Land use, property ID, and area agreement</span>
            </div>

            {/* Weight 4 */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Verification Evidence (GNSS / GT)</span>
                <span className="font-mono text-sky-600">{Math.round(weights.gnssVerification * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={Math.round(weights.gnssVerification * 100)}
                onChange={e => setWeights(prev => ({ ...prev, gnssVerification: Number(e.target.value) / 100 }))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">Survey of India CORS sub-centimeter calibration</span>
            </div>

            {/* Weight 5 */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Source Department Quality</span>
                <span className="font-mono text-sky-600">{Math.round(weights.sourceQuality * 100)}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={Math.round(weights.sourceQuality * 100)}
                onChange={e => setWeights(prev => ({ ...prev, sourceQuality: Number(e.target.value) / 100 }))}
                className="w-full accent-sky-600"
              />
              <span className="text-[10px] text-slate-400">Department authority reputation and temporal recency</span>
            </div>

            {/* Threshold Sliders */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Auto-Approval Cutoff: <strong className="text-emerald-600 font-mono">{autoThresh}%</strong>
                </label>
                <input
                  type="range"
                  min="80"
                  max="98"
                  value={autoThresh}
                  onChange={e => setAutoThresh(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Manual Review Cutoff: <strong className="text-amber-600 font-mono">{reviewThresh}%</strong>
                </label>
                <input
                  type="range"
                  min="60"
                  max="85"
                  value={reviewThresh}
                  onChange={e => setReviewThresh(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors"
            >
              Update Confidence Parameters
            </button>
          </div>
        </div>

        {/* Right: Live Parcel Confidence Decomposition (Section 18 Example) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                Sample Live Case: {sampleParcel.parcel_id}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Explainable Score Attribution
              </h3>
            </div>
            <StatusBadge status="" type="confidence" score={sampleParcel.confidence_score} />
          </div>

          {/* Big Score Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-300 dark:border-emerald-800 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OVERALL PARCEL CONFIDENCE
            </span>
            <div className="text-3xl font-black text-emerald-600 font-mono mt-0.5">
              {sampleParcel.confidence_score}%
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
              TIER 1: HIGH CONFIDENCE (AUTO-APPROVED)
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
              Cadastral, municipal, and drone boundaries agree within 0.04m following GNSS-assisted edge adjustment.
            </p>
          </div>

          {/* Factor Breakdown Bars (Section 18 Example) */}
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">Spatial Alignment</span>
                <span className="font-mono font-bold">{sampleParcel.confidence_breakdown.spatial_alignment}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${sampleParcel.confidence_breakdown.spatial_alignment}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">Geometry Similarity</span>
                <span className="font-mono font-bold">{sampleParcel.confidence_breakdown.geometry_similarity}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${sampleParcel.confidence_breakdown.geometry_similarity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">Attribute Consistency</span>
                <span className="font-mono font-bold">{sampleParcel.confidence_breakdown.attribute_consistency}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${sampleParcel.confidence_breakdown.attribute_consistency}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">GNSS Verification</span>
                <span className="font-mono font-bold">{sampleParcel.confidence_breakdown.gnss_verification}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500" style={{ width: `${sampleParcel.confidence_breakdown.gnss_verification}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-600 dark:text-slate-400">Source Department Quality</span>
                <span className="font-mono font-bold">{sampleParcel.confidence_breakdown.source_quality}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${sampleParcel.confidence_breakdown.source_quality}%` }} />
              </div>
            </div>
          </div>

          {/* Three Tiers Reference (Section 18) */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300">
              <span className="font-bold">≥ {autoThresh}%: High Confidence</span>
              <span>Direct insertion into canonical register</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300">
              <span className="font-bold">{reviewThresh}% – {autoThresh - 1}%: Review Recommended</span>
              <span>Officer visual sign-off required</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300">
              <span className="font-bold">&lt; {reviewThresh}%: Verification Required</span>
              <span>Joint hearing or field re-survey</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
