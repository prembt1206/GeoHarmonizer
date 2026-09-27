// GeoRecon AI - Main Application Entrypoint (SIH26013)

import React from 'react';
import { GeoReconProvider, useGeoRecon } from './context/GeoReconContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { DataHub } from './components/datahub/DataHub';
import { HarmonizationWorkspace } from './components/harmonization/HarmonizationWorkspace';
import { BeforeAfterMap } from './components/map/BeforeAfterMap';
import { SpatialMatchingView } from './components/matching/SpatialMatchingView';
import { AttributeMappingView } from './components/matching/AttributeMappingView';
import { SpatialValidationView } from './components/topology/SpatialValidationView';
import { ChangeDetectionView } from './components/change/ChangeDetectionView';
import { ConflictCenterView } from './components/conflicts/ConflictCenterView';
import { ConfidenceEngineView } from './components/confidence/ConfidenceEngineView';
import { ReviewApprovalView } from './components/review/ReviewApprovalView';
import { ParcelExplorerView } from './components/parcels/ParcelExplorerView';
import { CanonicalRecordsView } from './components/parcels/CanonicalRecordsView';
import { DataExchangeView } from './components/exchange/DataExchangeView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { ArchitectureAboutView } from './components/about/ArchitectureAboutView';
import { JudgeTourModal } from './components/judge/JudgeTourModal';
import { GeoReconChatbot } from './components/chat/GeoReconChatbot';


const AppContent: React.FC = () => {
  const { activePage } = useGeoRecon();

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewDashboard />;
      case 'data-hub':
        return <DataHub />;
      case 'harmonization':
        return <HarmonizationWorkspace />;
      case 'before-after':
        return <BeforeAfterMap />;
      case 'spatial-matching':
        return <SpatialMatchingView />;
      case 'attribute-mapping':
        return <AttributeMappingView />;
      case 'spatial-validation':
        return <SpatialValidationView />;
      case 'change-detection':
        return <ChangeDetectionView />;
      case 'conflict-center':
        return <ConflictCenterView />;
      case 'confidence-engine':
        return <ConfidenceEngineView />;
      case 'review-approval':
        return <ReviewApprovalView />;
      case 'parcel-explorer':
        return <ParcelExplorerView />;
      case 'canonical-records':
        return <CanonicalRecordsView />;
      case 'data-exchange':
        return <DataExchangeView />;
      case 'audit-trail':
        return <AuditTrailView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      case 'architecture':
        return <ArchitectureAboutView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
      <JudgeTourModal />
      <GeoReconChatbot />
    </div>
  );
};


export const App: React.FC = () => {
  return (
    <GeoReconProvider>
      <AppContent />
    </GeoReconProvider>
  );
};

export default App;
