// GeoHarmonizer AI - Type Definitions for SIH26013 Geospatial Harmonization

export type DatasetCategory =
  | 'drone'
  | 'ori'
  | 'dsm_dtm'
  | 'cadastral'
  | 'revenue'
  | 'municipal'
  | 'utilities'
  | 'ground_truth'
  | 'gnss_cors'
  | 'building_footprints';

export type UserRole =
  | 'admin'
  | 'gis_analyst'
  | 'revenue_officer'
  | 'municipal_officer'
  | 'field_surveyor'
  | 'reviewer';

export interface Dataset {
  id: string;
  name: string;
  category: DatasetCategory;
  department: string;
  format: 'GeoJSON' | 'Shapefile' | 'CSV / Tabular' | 'GeoTIFF / Raster' | 'KML';
  crs: string;
  crsName: string;
  featureCount: number;
  uploadDate: string;
  fileSize: string;
  status: 'ready' | 'profiling' | 'harmonized' | 'error';
  validationStatus: 'valid' | 'has_issues' | 'unvalidated';
  issuesCount: number;
  geometryType: 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString' | 'Raster Grid';
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  attributes: DatasetAttribute[];
  description: string;
  sourceTrustScore: number; // 0-100
}

export interface DatasetAttribute {
  name: string;
  type: 'string' | 'number' | 'float' | 'date' | 'boolean';
  nullPercentage: number;
  uniqueValues: number;
  sampleValues: (string | number)[];
  canonicalMapping?: string;
  mappingConfidence?: number;
}

export interface CoordinatePoint {
  lat: number;
  lng: number;
  elevation?: number;
}

export interface GeometryFeature {
  type: 'Feature';
  id: string;
  properties: Record<string, any>;
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString';
    coordinates: any;
  };
}

export interface HarmonizedParcel {
  parcel_id: string; // e.g. "P-0102"
  survey_number: string; // e.g. "SY-142/2A"
  municipal_property_id: string; // e.g. "MUC-8842-B"
  revenue_khata_no: string; // e.g. "KHT-99214"
  area_sqm: number; // e.g. 182.0
  boundary_perimeter_m: number;
  ward_id: string; // e.g. "Ward 14 - Kuvempunagar"
  zone_name: string; // e.g. "South Zone"
  land_use: 'Residential' | 'Commercial' | 'Mixed Use' | 'Institutional' | 'Public Utility';
  building_count: number;
  building_area_sqm: number;
  utility_links: string[]; // e.g. ["Water-M14", "Power-UG-3"]
  gnss_verified: boolean;
  ground_truth_status?: 'Verified' | 'Pending Field Visit' | 'Disputed';
  source_contributions?: {
    field: string;
    source: string;
    confidence: number;
    rawValues: Record<string, any>;
  }[];
  change_status: 'Unchanged' | 'New Structure Detected' | 'Boundary Shifted' | 'Land Use Altered';
  validation_status: 'Validated' | 'Pending Review' | 'Flagged';
  confidence_score: number; // 0 - 100
  confidence_breakdown: {
    spatial_alignment: number;
    geometry_similarity: number;
    attribute_consistency: number;
    gnss_verification: number;
    source_quality: number;
  };
  last_harmonized_at: string;
  review_status: 'Auto-Approved' | 'Approved by Officer' | 'Under Review' | 'Rejected';
  reviewed_by?: string;
  coordinates: [number, number][]; // Polygon outer ring in [lat, lng] for rendering
  source_polygons?: {
    source: string;
    color: string;
    coordinates: [number, number][];
    area: number;
  }[];
}

export interface SpatialMatchResult {
  id: string;
  cadastralId: string;
  municipalId: string;
  buildingId?: string;
  gnssRefId?: string;
  confidence: number;
  status: 'accepted' | 'rejected' | 'pending';
  factors: {
    overlap_iou: number; // %
    centroid_distance_m: number; // meters
    shape_similarity: number; // %
    area_similarity: number; // %
    attribute_similarity: number; // %
  };
  details: string;
}

export interface AttributeMappingProposal {
  id: string;
  sourceDataset: string;
  sourceField: string;
  canonicalField: string;
  confidence: number;
  sampleMatch: string;
  status: 'approved' | 'rejected' | 'customized';
}

export interface TopologyIssue {
  id: string; // e.g. "TP-0183"
  type: 'overlap' | 'gap' | 'sliver' | 'self_intersection' | 'duplicate' | 'encroachment';
  severity: 'high' | 'medium' | 'low';
  affectedParcels: string[];
  area_sqm?: number;
  length_m?: number;
  location: [number, number]; // lat, lng
  description: string;
  suggestedCorrection: string;
  confidence: number;
  status: 'open' | 'corrected' | 'dismissed';
}

export interface TemporalChange {
  id: string; // e.g. "CH-0012"
  parcel_id: string;
  changeType: 'new_building' | 'demolished_building' | 'boundary_shift' | 'land_use_change' | 'utility_encroachment';
  baselineYear: number; // 2025
  currentYear: number; // 2026
  confidence: number;
  areaDiffSqm: number;
  coordinates: [number, number];
  description: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export interface HarmonizationConflict {
  id: string; // e.g. "CF-1042"
  parcel_id: string;
  title: string;
  conflictType:
    | 'boundary_discrepancy'
    | 'area_mismatch'
    | 'land_use_mismatch'
    | 'ownership_mismatch'
    | 'building_encroachment'
    | 'duplicate_record'
    | 'missing_data';
  severity: 'critical' | 'moderate' | 'minor';
  sources: {
    source: string;
    value: string | number;
    weight: number;
  }[];
  aiRecommendation: string;
  confidence: number;
  status: 'open' | 'under_review' | 'resolved';
  resolvedAction?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  location: [number, number];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  action: string;
  targetObject: string;
  previousValue?: string;
  newValue?: string;
  status: 'Success' | 'Warning' | 'Manual Override';
  notes?: string;
}

export interface HarmonizationPipelineStep {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  durationMs: number;
  itemsProcessed: number;
  summary: string;
}

export interface SystemSettings {
  projectCrs: string;
  targetCrsName: string;
  autoApprovalThreshold: number; // e.g. 90%
  manualReviewThreshold: number; // e.g. 75%
  topologyToleranceMeters: number; // e.g. 0.05m
  spatialMatchMinIou: number; // e.g. 80%
  weights: {
    spatialAlignment: number;
    geometrySimilarity: number;
    attributeConsistency: number;
    gnssVerification: number;
    sourceQuality: number;
  };
}
