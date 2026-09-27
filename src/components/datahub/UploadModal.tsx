// GeoRecon AI - Multi-Source Data Ingestion Wizard (SIH26013 - Section 8)

import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { useGeoRecon } from '../../context/GeoReconContext';
import { ingestionService } from '../../services/ingestionService';
import { DatasetCategory } from '../../types/geospatial';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_DEMO_PRESETS = [
  { name: 'Bengaluru_Cadastral_2026.geojson', category: 'cadastral' as DatasetCategory, department: 'Survey Settlement & Land Records (SSLR)', format: 'GeoJSON', size: 14200000 },
  { name: 'BBMP_PropertyTax_Master.geojson', category: 'municipal' as DatasetCategory, department: 'Bruhat Bengaluru Mahanagara Palike (BBMP)', format: 'GeoJSON', size: 18400000 },
  { name: 'Revenue_Bhoomi_Khatas.csv', category: 'revenue' as DatasetCategory, department: 'Bhoomi Revenue Register', format: 'CSV', size: 8200000 },
  { name: 'UAV_Orthomosaic_5cm.tif', category: 'ori' as DatasetCategory, department: 'Karnataka Drone Mission', format: 'GeoTIFF', size: 240000000 }
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addDataset } = useGeoRecon();

  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_DEMO_PRESETS[0]);
  const [customFileName, setCustomFileName] = useState('');
  const [category, setCategory] = useState<DatasetCategory>('cadastral');
  const [department, setDepartment] = useState('Survey Settlement & Land Records');

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  if (!isOpen) return null;

  const handleStartIngestion = async () => {
    setIsProcessing(true);
    setLogs([]);
    setCurrentStage(1);

    const fileName = customFileName || selectedPreset.name;

    // Step 1: File Detection
    setLogs(prev => [...prev, `Analyzing ${fileName}...`]);
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => [...prev, '✓ File parsed successfully']);
    setCurrentStage(2);

    // Step 2: Schema Detection
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => [...prev, '✓ Geometry detected (Polygon / MultiPolygon)']);
    setLogs(prev => [...prev, '✓ 5,482 features identified in geometry collection']);
    setCurrentStage(3);

    // Step 3: CRS Detection
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => [...prev, '✓ CRS detected: EPSG:4326 (WGS 84 Geographic)']);
    setCurrentStage(4);

    // Step 4: Geometry Validation
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => [...prev, '✓ Geometry ring orientation verified']);
    setLogs(prev => [...prev, '⚠ 17 minor vertex discrepancies flagged for auto-repair']);
    setCurrentStage(5);

    // Step 5: Attribute Profiling
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => [...prev, '✓ Attributes profiled: parcel_id, survey_no, area, land_use']);
    setLogs(prev => [...prev, '✓ AI Candidate Mappings: survey_no → survey_number (98%)']);
    setCurrentStage(6);

    // Step 6: Ready for Harmonization
    await new Promise(r => setTimeout(r, 400));
    setLogs(prev => [...prev, '✓ Dataset registered into Data Hub. Ready for Harmonization.']);
    setIsProcessing(false);
    setIsComplete(true);

    // Add dataset to state
    const newDataset = ingestionService.createMockUploadedDataset(
      { name: fileName, size: selectedPreset.size },
      category,
      department
    );
    addDataset(newDataset);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Source Geospatial Ingestion
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SIH26013 6-Stage Automated Schema & Geometry Profiler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {!isProcessing && !isComplete && (
            <>
              {/* Demo Preloaded Sample Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select Preloaded Departmental Dataset (Demo Mode)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_DEMO_PRESETS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPreset(preset);
                        setCategory(preset.category);
                        setDepartment(preset.department);
                        setCustomFileName('');
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        selectedPreset.name === preset.name
                          ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {preset.department}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">{preset.format}</span>
                        <span className="font-mono text-slate-400">{(preset.size / 1000000).toFixed(1)} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Or Custom Upload */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Or Upload Local File (GeoJSON / CSV / Shapefile / GeoTIFF)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ward14_Survey_2026.geojson"
                  value={customFileName}
                  onChange={e => setCustomFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Department & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Layer Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as DatasetCategory)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="cadastral">Cadastral Maps</option>
                    <option value="municipal">Municipal GIS</option>
                    <option value="revenue">Revenue Records</option>
                    <option value="ori">Orthorectified Imagery (ORI)</option>
                    <option value="dsm_dtm">DSM / DTM Elevation</option>
                    <option value="building_footprints">Building Footprints</option>
                    <option value="utilities">Utilities Network</option>
                    <option value="gnss_cors">GNSS / CORS</option>
                    <option value="ground_truth">Ground Truthing</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Processing 6-Step Stepper Display */}
          {(isProcessing || isComplete) && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-center">
                {['Detection', 'Schema', 'CRS', 'Geometry', 'Profiling', 'Ready'].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStage > stepNum || isComplete;
                  const isCur = currentStage === stepNum && !isComplete;

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border text-[10px] font-semibold ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                          : isCur
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-600 animate-pulse'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>Step {stepNum}</div>
                      <div className="truncate">{step}</div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Logs Output (Section 8 Requirement) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.startsWith('✓')
                        ? 'text-emerald-400'
                        : log.startsWith('⚠')
                        ? 'text-amber-400'
                        : 'text-sky-300'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            {isComplete ? 'Done' : 'Cancel'}
          </button>

          {!isProcessing && !isComplete && (
            <button
              onClick={handleStartIngestion}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md active:scale-95 transition-all"
            >
              <span>Ingest & Profile Dataset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {isComplete && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Dataset Ready in Hub</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
