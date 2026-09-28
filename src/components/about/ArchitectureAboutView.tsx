// GeoHarmonizer AI - Architecture, Product Positioning & SIH26013 Traceability (Sections 50-53)

import React from 'react';
import {
  HelpCircle,
  Layers,
  Cpu,
  Database,
  CheckCircle2,
  Workflow,
  ShieldCheck,
  Split,
  FileCheck2,
  Server,
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';

export const ArchitectureAboutView: React.FC = () => {
  const { setActivePage } = useGeoRecon();

  const SIH_TRACEABILITY_CHECKLIST = [
    { name: 'Drone Imagery Integration', status: 'Implemented', desc: 'Raw flight path telemetry and orthophoto tile overlays' },
    { name: 'Orthorectified Imagery (ORI) 5cm GSD', status: 'Implemented', desc: 'Photogrammetric surface imagery for visual verification' },
    { name: 'DSM / DTM Elevation Grid', status: 'Implemented', desc: 'LiDAR elevation statistics and 3D surface modeling' },
    { name: 'Cadastral Maps (SSLR)', status: 'Implemented', desc: 'Historical survey numbers, Tippani bounds, and village sheets' },
    { name: 'Revenue Records (Bhoomi)', status: 'Implemented', desc: 'Khata registrations, mutation logs, and tenure categories' },
    { name: 'Municipal GIS Property Tax (MCC)', status: 'Implemented', desc: 'Urban tax assessments, property identifiers, and ward boundaries' },
    { name: 'Utility Networks', status: 'Implemented', desc: 'Potable water pipelines and underground power corridors' },
    { name: 'Ground Truthing Points', status: 'Implemented', desc: 'Field survey GPS inspection markers and site photos' },
    { name: 'GNSS / CORS RTK Benchmarks', status: 'Implemented', desc: 'Survey of India sub-centimeter geodetic calibration points' },
    { name: 'Building Footprints Vector Layer', status: 'Implemented', desc: 'Digitized roof footprints and setback encroachment detection' },
    { name: 'AI Spatial Matching (IoU & Centroid)', status: 'Implemented', desc: 'Multi-criteria geometric correspondence between departments' },
    { name: 'Automated Topology Correction', status: 'Implemented', desc: 'Detects and auto-repairs overlaps, sliver gaps, and self-intersections' },
    { name: 'Intelligent Attribute Mapping', status: 'Implemented', desc: 'Fuzzy semantic mapping into Canonical Land Record schema' },
    { name: 'Georeferencing & CRS Transformation', status: 'Implemented', desc: 'PROJ pipeline transforming to EPSG:32643 UTM 43N' },
    { name: 'Temporal Change Detection (2025 vs 2026)', status: 'Implemented', desc: 'Detects new building footprints and physical shifts' },
    { name: 'Spatial Conflict Resolution Center', status: 'Implemented', desc: 'Evidence-weighted multi-department dispute arbitration' },
    { name: 'Explainable 5-Factor Confidence Scoring', status: 'Implemented', desc: 'Transparent breakdown with configurable formula weights' },
    { name: 'Human-in-the-Loop Review Queue', status: 'Implemented', desc: 'Statutory officer review for low-confidence parcels (<90%)' },
    { name: 'Canonical Harmonized Parcel Model', status: 'Implemented', desc: 'Unified single-source-of-truth master urban cadastre' },
    { name: 'OGC WFS & Multi-Format Data Exchange', status: 'Implemented', desc: 'Batch GeoJSON, CSV, JSON export and WFS streaming' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            System Architecture & Documentation
          </span>
          <span className="text-xs text-slate-500">SIH26013 Hackathon Specification</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          About GeoHarmonizer AI & System Architecture
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          GeoHarmonizer AI is an AI-powered multi-source geospatial reconciliation and intelligent harmonization platform engineered specifically for Smart India Hackathon 2026 Problem Statement SIH26013.
        </p>
      </div>

      {/* Product Positioning Statement (Section 52 Requirements) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-900 text-white shadow-md border border-sky-500/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
          Core Product Positioning
        </span>
        <h2 className="text-xl font-extrabold mt-1 text-white leading-snug">
          “GeoHarmonizer AI is the reconciliation and harmonization layer between fragmented geospatial sources and a trusted canonical urban land record.”
        </h2>
        <p className="mt-2 text-xs text-slate-300 max-w-2xl leading-relaxed">
          It is not merely a GIS viewer or mapping app. It is an automated reconciliation engine that ingests conflicting departmental records, resolves geometric and semantic discrepancies using CORS GNSS evidence, and outputs an auditable canonical land register.
        </p>
      </div>

      {/* Architectural Flow Diagram (Section 51 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              End-to-End SIH26013 System Pipeline Flow
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Production Geoprocessing Pipeline</span>
        </div>

        {/* Diagram Flow Container */}
        <div className="p-5 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-4">
          {/* Layer 1: Sources */}
          <div>
            <div className="text-sky-400 font-bold mb-2">1. INGESTION OF 10 MULTI-SOURCE INPUTS:</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Cadastral Maps (SSLR)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Municipal GIS (MCC)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Revenue Records (Bhoomi)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Drone ORI (5cm GSD)</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">DSM / DTM LiDAR Grid</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Building Footprints</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Underground Utilities</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">CORS GNSS RTK Points</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Ground Truthing Photos</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">Drone Raw Trajectories</div>
            </div>
          </div>

          <div className="text-center text-slate-500 font-bold">↓ (ETL & Schema Profiling)</div>

          {/* Layer 2: Core Processing */}
          <div>
            <div className="text-amber-400 font-bold mb-2">2. INTELLIGENT RECONCILIATION & GEODETIC ALIGNMENT:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block">CRS Transformation</span>
                PROJ Helmert → UTM 43N
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-sky-400 font-bold block">AI Spatial Matching</span>
                IoU overlap + Centroid Δ
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-purple-400 font-bold block">Attribute Harmonization</span>
                Fuzzy canonical normalization
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-rose-400 font-bold block">Topology Validation</span>
                Auto-heal overlaps & slivers
              </div>
            </div>
          </div>

          <div className="text-center text-slate-500 font-bold">↓ (Arbitration & Verification)</div>

          {/* Layer 3: Decision & Output */}
          <div>
            <div className="text-emerald-400 font-bold mb-2">3. ARBITRATION, GOVERNANCE & DOWNSTREAM SYNC:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-sky-400 font-bold block">Change Detection</span>
                2025 vs 2026 alterations
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-amber-400 font-bold block">Confidence Engine</span>
                5-factor explainable index
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold block">Human-in-the-Loop</span>
                Statutory officer approval
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-indigo-400 font-bold block">Canonical Master Layer</span>
                OGC WFS & GeoJSON Sync
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SIH26013 20-Point Feature Traceability Matrix (Section 53 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SIH26013 Requirement Traceability Matrix (20 / 20 Implemented)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            100% Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SIH_TRACEABILITY_CHECKLIST.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item.name}</span>
                </div>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-[11px] pl-5">
                  {item.desc}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
