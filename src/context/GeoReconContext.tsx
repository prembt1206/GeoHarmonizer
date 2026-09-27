// GeoRecon AI - Global State Management Context (SIH26013)

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  HarmonizedParcel,
  Dataset,
  SpatialMatchResult,
  AttributeMappingProposal,
  TopologyIssue,
  TemporalChange,
  HarmonizationConflict,
  AuditLogEntry,
  UserRole,
  HarmonizationPipelineStep,
  SystemSettings
} from '../types/geospatial';
import {
  INITIAL_PARCELS,
  INITIAL_DATASETS,
  INITIAL_MATCHES,
  INITIAL_ATTRIBUTE_MAPPINGS,
  INITIAL_TOPOLOGY_ISSUES,
  INITIAL_CHANGES,
  INITIAL_CONFLICTS,
  INITIAL_AUDIT_LOGS
} from '../data/mysuruDemoData';
import { topologyService } from '../services/topologyService';
import { conflictResolutionService } from '../services/conflictResolutionService';
import { supabaseDb, isSupabaseConfigured } from '../services/supabaseClient';

export type NavPage =
  | 'overview'
  | 'data-hub'
  | 'harmonization'
  | 'spatial-matching'
  | 'attribute-mapping'
  | 'spatial-validation'
  | 'before-after'
  | 'change-detection'
  | 'conflict-center'
  | 'confidence-engine'
  | 'review-approval'
  | 'parcel-explorer'
  | 'canonical-records'
  | 'data-exchange'
  | 'audit-trail'
  | 'analytics'
  | 'settings'
  | 'architecture';

export const PIPELINE_STEPS: HarmonizationPipelineStep[] = [
  { id: 'step-ingest', name: 'Multi-Source Ingestion', description: 'Ingest and validate cadastral, municipal, revenue & drone layers', status: 'completed', durationMs: 420, itemsProcessed: 18, summary: '10 layers loaded (24,821 source features)' },
  { id: 'step-profile', name: 'Data Profiling & Schema', description: 'Inspect geometry validity, coordinate headers, and null percentage', status: 'completed', durationMs: 380, itemsProcessed: 18, summary: 'Schemas profiled with canonical field heuristics' },
  { id: 'step-crs', name: 'CRS & Georeferencing', description: 'Transform heterogeneous coordinate systems to EPSG:32643 UTM 43N', status: 'completed', durationMs: 510, itemsProcessed: 24821, summary: 'Mean residual transformation error: 0.38m' },
  { id: 'step-match', name: 'AI Spatial Matching', description: 'Calculate polygon IoU overlap, centroid distance & shape similarity', status: 'completed', durationMs: 640, itemsProcessed: 25, summary: '22 high-confidence matches (>90%), 2 medium, 1 low' },
  { id: 'step-attribute', name: 'Attribute Harmonization', description: 'Reconcile departmental naming conventions and tax IDs', status: 'completed', durationMs: 310, itemsProcessed: 37, summary: '9 canonical field mappings synchronized' },
  { id: 'step-topology', name: 'Topology Validation', description: 'Detect and heal polygon overlaps, sliver gaps, and self-intersections', status: 'completed', durationMs: 490, itemsProcessed: 4, summary: '4 issues identified (1 auto-healed, 3 flagged)' },
  { id: 'step-changes', name: 'Change Detection', description: 'Compare 2025 baseline vs 2026 drone imagery for physical shifts', status: 'completed', durationMs: 550, itemsProcessed: 3, summary: '3 temporal alterations detected (1 new building)' },
  { id: 'step-conflicts', name: 'Conflict Resolution', description: 'Evidence weighting against GNSS benchmarks and ground truth', status: 'completed', durationMs: 440, itemsProcessed: 4, summary: '1 auto-resolved, 2 under review, 1 open' },
  { id: 'step-confidence', name: 'Confidence Scoring', description: 'Compute 5-factor transparent explainable confidence index', status: 'completed', durationMs: 290, itemsProcessed: 25, summary: 'Average project confidence: 94.6%' },
  { id: 'step-publish', name: 'Publish & Sync', description: 'Generate validated canonical records and sync downstream GIS indices', status: 'completed', durationMs: 330, itemsProcessed: 25, summary: 'Canonical spatial index refreshed for Mysuru Sector' }
];

interface GeoReconContextType {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  parcels: HarmonizedParcel[];
  datasets: Dataset[];
  matches: SpatialMatchResult[];
  attributeMappings: AttributeMappingProposal[];
  topologyIssues: TopologyIssue[];
  changes: TemporalChange[];
  conflicts: HarmonizationConflict[];
  auditLogs: AuditLogEntry[];
  settings: SystemSettings;

  selectedParcelId: string | null;
  setSelectedParcelId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isHarmonizing: boolean;
  pipelineProgress: number;
  currentStepIndex: number;
  pipelineSteps: HarmonizationPipelineStep[];
  runFullHarmonization: () => Promise<void>;

  resolveConflict: (conflictId: string, actionText: string) => void;
  fixTopologyIssue: (issueId: string) => void;
  confirmChange: (changeId: string) => void;
  rejectChange: (changeId: string) => void;
  approveParcelReview: (parcelId: string) => void;
  rejectParcelReview: (parcelId: string) => void;
  addDataset: (dataset: Dataset) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetDemoData: () => void;

  isJudgeTourOpen: boolean;
  setIsJudgeTourOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  selectedConflictId: string | null;
  setSelectedConflictId: (id: string | null) => void;
}

const GeoReconContext = createContext<GeoReconContextType | undefined>(undefined);

export const GeoReconProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [userRole, setUserRole] = useState<UserRole>('gis_analyst');
  const [parcels, setParcels] = useState<HarmonizedParcel[]>(INITIAL_PARCELS);
  const [datasets, setDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [matches, setMatches] = useState<SpatialMatchResult[]>(INITIAL_MATCHES);
  const [attributeMappings, setAttributeMappings] = useState<AttributeMappingProposal[]>(INITIAL_ATTRIBUTE_MAPPINGS);
  const [topologyIssues, setTopologyIssues] = useState<TopologyIssue[]>(INITIAL_TOPOLOGY_ISSUES);
  const [changes, setChanges] = useState<TemporalChange[]>(INITIAL_CHANGES);
  const [conflicts, setConflicts] = useState<HarmonizationConflict[]>(INITIAL_CONFLICTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);


  const [isHarmonizing, setIsHarmonizing] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<number>(100);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(PIPELINE_STEPS.length - 1);
  const [pipelineSteps, setPipelineSteps] = useState<HarmonizationPipelineStep[]>(PIPELINE_STEPS);

  const [settings, setSettings] = useState<SystemSettings>({
    projectCrs: 'EPSG:32643',
    targetCrsName: 'WGS 84 / UTM Zone 43N',
    autoApprovalThreshold: 90,
    manualReviewThreshold: 75,
    topologyToleranceMeters: 0.05,
    spatialMatchMinIou: 80,
    weights: {
      spatialAlignment: 0.35,
      geometrySimilarity: 0.20,
      attributeConsistency: 0.20,
      gnssVerification: 0.15,
      sourceQuality: 0.10
    }
  });

  // Automatic synchronization with Supabase Cloud PostgreSQL
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    async function loadCloudData() {
      try {
        const [cloudParcels, cloudDatasets, cloudConflicts] = await Promise.all([
          supabaseDb.fetchParcels(),
          supabaseDb.fetchDatasets(),
          supabaseDb.fetchConflicts()
        ]);

        if (isMounted) {
          if (cloudParcels && cloudParcels.length > 0) {
            setParcels(cloudParcels);
            console.log(`[GeoRecon AI] Synchronized ${cloudParcels.length} parcels from Supabase Cloud`);
          }
          if (cloudDatasets && cloudDatasets.length > 0) {
            setDatasets(cloudDatasets);
            console.log(`[GeoRecon AI] Synchronized ${cloudDatasets.length} datasets from Supabase Cloud`);
          }
          if (cloudConflicts && cloudConflicts.length > 0) {
            setConflicts(cloudConflicts);
            console.log(`[GeoRecon AI] Synchronized ${cloudConflicts.length} conflicts from Supabase Cloud`);
          }
        }
      } catch (err) {
        console.warn('[GeoRecon AI] Using local state fallback:', err);
      }
    }

    loadCloudData();
    return () => { isMounted = false; };
  }, []);

  const addAuditEntry = (action: string, targetObject: string, notes?: string, status: AuditLogEntry['status'] = 'Success') => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      userRole,
      userName: userRole === 'admin' ? 'System Administrator' : userRole === 'gis_analyst' ? 'K. Ramesh (GIS Analyst)' : 'S. Nanjappa (Officer)',
      action,
      targetObject,
      status,
      notes
    };
    setAuditLogs(prev => [entry, ...prev]);

    // Live sync to Supabase Cloud audit_logs table
    if (isSupabaseConfigured) {
      supabaseDb.insertAuditLog({
        id: entry.id,
        timestamp: new Date().toISOString(),
        user_role: entry.userRole,
        user_name: entry.userName,
        action: entry.action,
        target_object: entry.targetObject,
        status: entry.status,
        notes: entry.notes
      }).catch(err => console.warn('[Supabase Sync] Audit log deferred:', err));
    }
  };

  const resolveConflict = (conflictId: string, actionText: string) => {
    const target = conflicts.find(c => c.id === conflictId);
    if (!target) return;

    const resolved = conflictResolutionService.resolveConflict(target, actionText, `${userRole.toUpperCase()}`);
    setConflicts(prev => prev.map(c => c.id === conflictId ? resolved : c));

    // Also update affected parcel confidence if applicable
    setParcels(prev => prev.map(p => {
      if (p.parcel_id === target.parcel_id) {
        return {
          ...p,
          review_status: 'Approved by Officer',
          confidence_score: Math.min(99, p.confidence_score + 4.2),
          validation_status: 'Validated'
        };
      }
      return p;
    }));

    // Live sync to Supabase Cloud
    if (isSupabaseConfigured) {
      supabaseDb.updateConflictStatus(conflictId, resolved.status, actionText, userRole.toUpperCase())
        .catch(err => console.warn('[Supabase Sync] Conflict status deferred:', err));
    }

    addAuditEntry(`Conflict #${conflictId} Resolved`, `Parcel ${target.parcel_id}`, actionText, 'Success');
  };

  const fixTopologyIssue = (issueId: string) => {
    const target = topologyIssues.find(t => t.id === issueId);
    if (!target) return;

    const { correctedIssue, message } = topologyService.applyCorrection(target);
    setTopologyIssues(prev => prev.map(t => t.id === issueId ? correctedIssue : t));

    // Update affected parcels
    setParcels(prev => prev.map(p => {
      if (target.affectedParcels.includes(p.parcel_id)) {
        return {
          ...p,
          validation_status: 'Validated',
          confidence_score: Math.min(99, p.confidence_score + 3.5)
        };
      }
      return p;
    }));

    addAuditEntry(`Topology Corrected (${target.type})`, `Parcels: ${target.affectedParcels.join(', ')}`, message, 'Success');
  };

  const confirmChange = (changeId: string) => {
    setChanges(prev => prev.map(c => c.id === changeId ? { ...c, status: 'confirmed' } : c));
    const target = changes.find(c => c.id === changeId);
    if (target) {
      addAuditEntry(`Temporal Change Confirmed (#${changeId})`, `Parcel ${target.parcel_id}`, target.description, 'Success');
    }
  };

  const rejectChange = (changeId: string) => {
    setChanges(prev => prev.map(c => c.id === changeId ? { ...c, status: 'rejected' } : c));
    const target = changes.find(c => c.id === changeId);
    if (target) {
      addAuditEntry(`Temporal Change Dismissed (#${changeId})`, `Parcel ${target.parcel_id}`, 'Marked as false-positive artifact', 'Warning');
    }
  };

  const approveParcelReview = (parcelId: string) => {
    setParcels(prev => prev.map(p => {
      if (p.parcel_id === parcelId) {
        return {
          ...p,
          review_status: 'Approved by Officer',
          validation_status: 'Validated',
          confidence_score: Math.max(92, p.confidence_score)
        };
      }
      return p;
    }));
    addAuditEntry('Parcel Approved & Locked into Canonical Layer', `Parcel ${parcelId}`, 'Officer approved reconciled geometry and attributes');
  };

  const rejectParcelReview = (parcelId: string) => {
    setParcels(prev => prev.map(p => {
      if (p.parcel_id === parcelId) {
        return {
          ...p,
          review_status: 'Rejected',
          validation_status: 'Flagged'
        };
      }
      return p;
    }));
    addAuditEntry('Parcel Review Rejected', `Parcel ${parcelId}`, 'Discrepancy exceeds tolerance; marked for re-survey', 'Warning');
  };

  const addDataset = (newDs: Dataset) => {
    setDatasets(prev => [newDs, ...prev]);
    addAuditEntry('External Dataset Ingested', `${newDs.name} (${newDs.format})`, `Added ${newDs.featureCount} features to Data Hub`);
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addAuditEntry('System Parameters Updated', 'Configuration', 'Tolerance thresholds updated by administrator');
  };

  const resetDemoData = () => {
    setParcels(INITIAL_PARCELS);
    setDatasets(INITIAL_DATASETS);
    setMatches(INITIAL_MATCHES);
    setAttributeMappings(INITIAL_ATTRIBUTE_MAPPINGS);
    setTopologyIssues(INITIAL_TOPOLOGY_ISSUES);
    setChanges(INITIAL_CHANGES);
    setConflicts(INITIAL_CONFLICTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSelectedParcelId(null);
    setPipelineProgress(100);
    setCurrentStepIndex(PIPELINE_STEPS.length - 1);
    setPipelineSteps(PIPELINE_STEPS);
    addAuditEntry('Demo Dataset Reset', 'Mysuru Urban Demo', 'Reset all records and test cases to initial seed state');
  };

  const runFullHarmonization = async (): Promise<void> => {
    setIsHarmonizing(true);
    setPipelineProgress(0);

    const stepsCopy = PIPELINE_STEPS.map(s => ({ ...s, status: 'idle' as const }));
    setPipelineSteps(stepsCopy);

    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      setCurrentStepIndex(i);
      setPipelineSteps(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: 'running' };
        if (idx < i) return { ...s, status: 'completed' };
        return { ...s, status: 'idle' };
      }));

      // Realistic processing delay for demo visualization
      await new Promise(r => setTimeout(r, 650));
      setPipelineProgress(Math.round(((i + 1) / PIPELINE_STEPS.length) * 100));
    }

    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    setIsHarmonizing(false);
    setPipelineProgress(100);

    // Delightful completion effect
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // non-critical
    }

    addAuditEntry('Full AI Harmonization Pipeline Executed', 'Mysuru Urban Sector (25 Parcels)', '10/10 stages completed with high confidence');
  };

  return (
    <GeoReconContext.Provider
      value={{
        activePage,
        setActivePage,
        userRole,
        setUserRole,
        parcels,
        datasets,
        matches,
        attributeMappings,
        topologyIssues,
        changes,
        conflicts,
        auditLogs,
        settings,
        selectedParcelId,
        setSelectedParcelId,
        selectedConflictId,
        setSelectedConflictId,
        searchQuery,
        setSearchQuery,
        isHarmonizing,
        pipelineProgress,
        currentStepIndex,
        pipelineSteps,
        runFullHarmonization,
        resolveConflict,
        fixTopologyIssue,
        confirmChange,
        rejectChange,
        approveParcelReview,
        rejectParcelReview,
        addDataset,
        updateSettings,
        resetDemoData,
        isJudgeTourOpen,
        setIsJudgeTourOpen,
        isChatOpen,
        setIsChatOpen
      }}

    >
      {children}
    </GeoReconContext.Provider>
  );
};

export const useGeoRecon = () => {
  const context = useContext(GeoReconContext);
  if (!context) {
    throw new Error('useGeoRecon must be used within a GeoReconProvider');
  }
  return context;
};
