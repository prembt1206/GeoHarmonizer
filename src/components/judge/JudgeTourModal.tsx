// GeoRecon AI - 3-Minute Guided Judge Tour (SIH26013 - Section 30)

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Split,
  Database,
  Cpu,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';

export const JudgeTourModal: React.FC = () => {
  const { isJudgeTourOpen, setIsJudgeTourOpen, setActivePage, runFullHarmonization } = useGeoRecon();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isJudgeTourOpen) return null;

  const TOUR_STEPS = [
    {
      stepNumber: 1,
      tag: 'Step 1: The Urban Land Problem',
      title: 'Different Departments Maintain Conflicting Versions of the Same Land',
      icon: Database,
      content:
        'In Indian cities like Bengaluru, Survey Settlement & Land Records (SSLR) maintains historical Cadastral maps, the Municipal Corporation (BBMP) keeps property tax registers, and Revenue holds Bhoomi khatas. They use conflicting projections, mismatched plot areas (e.g. 182.4 m² vs 184.1 m²), and overlapping boundaries.',
      targetActionText: 'Inspect Fragmented Sources in Data Hub',
      targetPage: 'data-hub' as const
    },
    {
      stepNumber: 2,
      tag: 'Step 2: Automated AI Reconciliation',
      title: 'Unified Projection & Multi-Factor Spatial Matching',
      icon: Cpu,
      content:
        'GeoRecon AI ingests heterogeneous layers, transforms coordinates to EPSG:32643 (UTM Zone 43N), and calculates multi-factor spatial correspondence using IoU polygon overlap, centroid Euclidean proximity, and Hausdorff shape compactness.',
      targetActionText: 'View AI Spatial Matching Matrix',
      targetPage: 'spatial-matching' as const
    },
    {
      stepNumber: 3,
      tag: 'Step 3: Topological Self-Healing',
      title: 'Automated Repair of Non-Planar Overlaps & Gaps',
      icon: ShieldCheck,
      content:
        'Our Shapely/GEOS topological engine detects invalid geometries, 3.7 m² overlaps between adjacent parcels (Issue #TP-0183), unassigned sliver gaps, and building setback violations, applying sub-centimeter vertex snapping automatically.',
      targetActionText: 'Inspect Spatial Validation Center',
      targetPage: 'spatial-validation' as const
    },
    {
      stepNumber: 4,
      tag: 'Step 4: Evidence-Backed Conflict Resolution',
      title: 'Transparent Arbitration Calibrated to CORS GNSS',
      icon: Compass,
      content:
        'When departments disagree, GeoRecon AI weights evidence against high-precision Survey of India CORS benchmarks and drone photogrammetry. For Parcel P-0102, AI resolves the 1.2m offset to the GNSS ground-verified 182.0 m² boundary with 96.4% confidence.',
      targetActionText: 'Open Conflict Resolution Center',
      targetPage: 'conflict-center' as const
    },
    {
      stepNumber: 5,
      tag: 'Step 5: Canonical Record & Before/After Proof',
      title: 'One Trusted, Validated, Explainable Land Parcel',
      icon: Split,
      content:
        'The final output is an immutable Canonical Harmonized Parcel record. Judges can toggle the interactive Before / After slider to immediately see how conflicting departmental boundaries were transformed into a single trusted urban land record.',
      targetActionText: 'Show Before / After Map Slider',
      targetPage: 'before-after' as const
    }
  ];

  const step = TOUR_STEPS[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      setActivePage(TOUR_STEPS[nextIdx].targetPage);
    } else {
      setIsJudgeTourOpen(false);
      setActivePage('before-after');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      setActivePage(TOUR_STEPS[prevIdx].targetPage);
    }
  };

  const handleJumpToStep = (targetPage: any) => {
    setActivePage(targetPage);
    setIsJudgeTourOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">
                  SIH26013 Judge Demonstration
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  3-Min Tour
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                From Fragmented Sources to One Harmonized Urban Land Record
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsJudgeTourOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tour Step Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Progress dots */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-[11px]">
              {step.tag}
            </span>
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'w-6 bg-sky-600'
                      : i < currentStep
                      ? 'bg-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Title & Icon */}
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 shrink-0 border border-sky-200 dark:border-sky-800">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                {step.content}
              </p>
            </div>
          </div>

          {/* Visual Architecture Flow Banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-center font-mono font-semibold text-slate-700 dark:text-slate-300">
            FRAGMENTED SOURCES → AI RECONCILIATION → VALIDATION → CONFLICT RESOLUTION → HARMONIZED RECORD
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
          <button
            disabled={currentStep === 0}
            onClick={handlePrev}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => handleJumpToStep(step.targetPage)}
            className="text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <span>{step.targetActionText}</span>
            <span>↗</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md active:scale-95 transition-all"
          >
            <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
