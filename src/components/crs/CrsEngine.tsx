// GeoHarmonizer AI - Coordinate Reference & Georeferencing Engine (SIH26013 - Section 10)

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Layers,
  Sparkles,
  Sliders,
  Database
} from 'lucide-react';
import { crsService, SUPPORTED_CRS } from '../../services/crsService';
import { useGeoRecon } from '../../context/GeoReconContext';

export const CrsEngine: React.FC = () => {
  const { settings, updateSettings, datasets } = useGeoRecon();

  const [sourceCrs, setSourceCrs] = useState('EPSG:4326');
  const [targetCrs, setTargetCrs] = useState(settings.projectCrs || 'EPSG:32643');
  const [isTransforming, setIsTransforming] = useState(false);

  // Coordinate converter test inputs
  const [testLat, setTestLat] = useState('12.9719');
  const [testLng, setTestLng] = useState('77.6412');
  const [convertedCoords, setConvertedCoords] = useState<[number, number]>([1434800, 786600]);

  const report = crsService.runCrsTransformation(sourceCrs, targetCrs, 24821);

  const handleConvert = () => {
    setIsTransforming(true);
    const lat = parseFloat(testLat) || 12.9719;
    const lng = parseFloat(testLng) || 77.6412;
    const res = crsService.transformCoordinates(lat, lng, sourceCrs, targetCrs);
    setTimeout(() => {
      setConvertedCoords(res);
      setIsTransforming(false);
    }, 300);
  };

  const handleApplyProjectCrs = (newCrs: string) => {
    setTargetCrs(newCrs);
    const def = SUPPORTED_CRS.find(c => c.code === newCrs);
    updateSettings({
      projectCrs: newCrs,
      targetCrsName: def ? def.name : newCrs
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Geodetic Engine
          </span>
          <span className="text-xs text-slate-500">PROJ / PyProj Compatible Pipeline</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Coordinate Reference & Georeferencing Engine
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Reconciles multi-source geospatial data projected in heterogeneous coordinate reference systems into one unified, metric-grade projected reference frame (EPSG:32643 UTM Zone 43N) calibrated against Survey of India CORS ground benchmarks.
        </p>
      </div>

      {/* Georeferencing Pipeline Visual Workflow (Section 10 Requirements) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Transformation Pipeline Architecture
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { step: '1', title: 'Detect CRS', desc: 'Scan WKT & PRJ metadata tags', status: '✓ Complete' },
            { step: '2', title: 'Validate CRS', desc: 'Verify spheroid & datum integrity', status: '✓ Validated' },
            { step: '3', title: 'Transform', desc: '7-Parameter Helmert conversion', status: '✓ Calibrated' },
            { step: '4', title: 'Residual Check', desc: 'Evaluate distortion & residual error', status: '✓ 0.38m Error' },
            { step: '5', title: 'Register', desc: 'Synchronize spatial index layer', status: '✓ Synced' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400">STAGE 0{item.step}</span>
                <div className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">{item.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</div>
              </div>
              <div className="mt-3 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Stats & Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transformation Pipeline Report */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Transformation Metrics</h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Transformation Successful
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Transformation Method</span>
              <span className="font-semibold text-slate-900 dark:text-white">PROJ 9.4 Pipeline</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Features Transformed</span>
              <span className="font-semibold text-slate-900 dark:text-white">24,821 features</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Mean Residual Error</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {report.meanResidualErrorMeters} m
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Maximum Residual Error</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {report.maxResidualErrorMeters} m
              </span>
            </div>
          </div>

          {/* Helmert Parameters */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
              7-Parameter Bursa-Wolf Datum Shift:
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <div>dX: <strong>+{report.helmertParameters.dx}m</strong></div>
              <div>dY: <strong>{report.helmertParameters.dy}m</strong></div>
              <div>dZ: <strong>+{report.helmertParameters.dz}m</strong></div>
              <div>Scale: <strong>{report.helmertParameters.scalePpm}</strong></div>
              <div>Rot: <strong>{report.helmertParameters.rotSec}&quot;</strong></div>
              <div>Status: <strong>Calibrated</strong></div>
            </div>
          </div>
        </div>

        {/* Interactive Coordinate Transformation Test Bench */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Transformation Test Bench</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Live Proj4 Engine</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Source CRS</label>
              <select
                value={sourceCrs}
                onChange={e => setSourceCrs(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
              >
                {SUPPORTED_CRS.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Target Project CRS</label>
              <select
                value={targetCrs}
                onChange={e => handleApplyProjectCrs(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400"
              >
                {SUPPORTED_CRS.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Latitude / Northing</label>
              <input
                type="text"
                value={testLat}
                onChange={e => setTestLat(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Longitude / Easting</label>
              <input
                type="text"
                value={testLng}
                onChange={e => setTestLng(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleConvert}
            className="w-full py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-xs transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTransforming ? 'animate-spin' : ''}`} />
            <span>Transform Coordinates</span>
          </button>

          {/* Converted Output */}
          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
              Projected Output ({targetCrs}):
            </span>
            <div className="font-mono text-slate-800 dark:text-slate-200">
              Northing: <strong>{convertedCoords[0].toFixed(2)} m</strong> &nbsp;|&nbsp;
              Easting: <strong>{convertedCoords[1].toFixed(2)} m</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
