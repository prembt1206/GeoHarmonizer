// GeoRecon AI - Synthetic Demo Data Engine
// Project: Mysuru Urban Land Harmonization Demo (SIH26013)
// Synthetic data modeled on Mysuru (Kuvempunagar / Vijayanagar Sector)

import {
  HarmonizedParcel,
  Dataset,
  SpatialMatchResult,
  AttributeMappingProposal,
  TopologyIssue,
  TemporalChange,
  HarmonizationConflict,
  AuditLogEntry
} from '../types/geospatial';

// Base coordinates for Mysuru Urban Demo (Vijayanagar 2nd Stage)
const BASE_LAT = 12.3120;
const BASE_LNG = 76.6430;
const LAT_OFFSET = 0.00075; // roughly 83 meters
const LNG_OFFSET = 0.00085; // roughly 92 meters

// Helper to generate a rectangular parcel polygon
function generateBox(row: number, col: number, latDrift: number = 0, lngDrift: number = 0): [number, number][] {
  const minLat = BASE_LAT + row * LAT_OFFSET + latDrift;
  const maxLat = minLat + LAT_OFFSET * 0.88;
  const minLng = BASE_LNG + col * LNG_OFFSET + lngDrift;
  const maxLng = minLng + LNG_OFFSET * 0.88;

  return [
    [minLat, minLng],
    [minLat, maxLng],
    [maxLat, maxLng],
    [maxLat, minLng],
    [minLat, minLng]
  ];
}

// 25 Synthetic Parcels with realistic attributes & deliberate multi-source discrepancies
export const INITIAL_PARCELS: HarmonizedParcel[] = [
  {
    parcel_id: 'P-0101',
    survey_number: 'SY-142/1',
    municipal_property_id: 'MUC-8841-A',
    revenue_khata_no: 'KHT-70112',
    area_sqm: 195.4,
    boundary_perimeter_m: 56.2,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 110.2,
    utility_links: ['Water-M14-01', 'Power-UG-11'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 98.4,
    confidence_breakdown: {
      spatial_alignment: 99,
      geometry_similarity: 98,
      attribute_consistency: 99,
      gnss_verification: 98,
      source_quality: 97
    },
    last_harmonized_at: '2026-09-27 10:45:12',
    review_status: 'Auto-Approved',
    coordinates: generateBox(0, 0),
    source_polygons: [
      { source: 'Cadastral (SY-142/1)', color: '#ef4444', coordinates: generateBox(0, 0, 0.00001, 0.00001), area: 195.8 },
      { source: 'Municipal GIS (MUC-8841)', color: '#3b82f6', coordinates: generateBox(0, 0, -0.00001, 0.00001), area: 195.2 },
      { source: 'Drone / ORI Derived', color: '#10b981', coordinates: generateBox(0, 0), area: 195.4 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'GNSS + Cadastral', confidence: 99, rawValues: { survey: 'SY-142/1', crs: 'EPSG:32643' } },
      { field: 'area_sqm', source: 'GNSS Post-Processed', confidence: 98, rawValues: { gnss: 195.4, municipal: 195.2 } },
      { field: 'land_use', source: 'Municipal Assessment', confidence: 97, rawValues: { municipal: 'Residential (A1)', revenue: 'Residential' } }
    ]
  },
  {
    parcel_id: 'P-0102',
    survey_number: 'SY-142/2A',
    municipal_property_id: 'MUC-8842-B',
    revenue_khata_no: 'KHT-70115',
    area_sqm: 182.0,
    boundary_perimeter_m: 54.0,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 98.5,
    utility_links: ['Water-M14-02', 'Power-UG-12'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Validated',
    confidence_score: 95.8,
    confidence_breakdown: {
      spatial_alignment: 96,
      geometry_similarity: 95,
      attribute_consistency: 94,
      gnss_verification: 98,
      source_quality: 94
    },
    last_harmonized_at: '2026-09-27 10:48:30',
    review_status: 'Approved by Officer',
    reviewed_by: 'K. Ramesh (GIS Analyst)',
    coordinates: generateBox(0, 1),
    source_polygons: [
      { source: 'Cadastral (SY-142/2A)', color: '#ef4444', coordinates: generateBox(0, 1, 0.00004, -0.00002), area: 182.4 },
      { source: 'Municipal GIS (MUC-8842)', color: '#3b82f6', coordinates: generateBox(0, 1, -0.00003, 0.00003), area: 184.1 },
      { source: 'Drone / ORI Derived', color: '#10b981', coordinates: generateBox(0, 1, 0.00001, 0.00001), area: 181.8 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'GNSS Alignment', confidence: 96, rawValues: { discrepancy_meters: 1.2, resolved: 'GNSS Edge' } },
      { field: 'area_sqm', source: 'GNSS Verification (182.0 m²)', confidence: 98, rawValues: { cadastral: 182.4, municipal: 184.1, drone: 181.8 } }
    ]
  },
  {
    parcel_id: 'P-0103',
    survey_number: 'SY-142/2B',
    municipal_property_id: 'MUC-8843-C',
    revenue_khata_no: 'KHT-70118',
    area_sqm: 188.5,
    boundary_perimeter_m: 55.4,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 135.0,
    utility_links: ['Water-M14-03', 'Power-UG-13'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Pending Review',
    confidence_score: 91.2,
    confidence_breakdown: {
      spatial_alignment: 89,
      geometry_similarity: 92,
      attribute_consistency: 90,
      gnss_verification: 95,
      source_quality: 90
    },
    last_harmonized_at: '2026-09-27 10:50:00',
    review_status: 'Under Review',
    coordinates: generateBox(0, 2),
    source_polygons: [
      { source: 'Cadastral (SY-142/2B)', color: '#ef4444', coordinates: generateBox(0, 2, 0, 0.00005), area: 191.0 }, // Overlaps P-0104
      { source: 'Municipal GIS', color: '#3b82f6', coordinates: generateBox(0, 2, 0, 0), area: 188.5 },
      { source: 'Drone / ORI Derived', color: '#10b981', coordinates: generateBox(0, 2, 0, 0), area: 188.5 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'Pending Snap to P-0104', confidence: 89, rawValues: { overlap_area_sqm: 3.7 } }
    ]
  },
  {
    parcel_id: 'P-0104',
    survey_number: 'SY-142/3',
    municipal_property_id: 'MUC-8844-D',
    revenue_khata_no: 'KHT-70120',
    area_sqm: 176.2,
    boundary_perimeter_m: 53.2,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 88.0,
    utility_links: ['Water-M14-04'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Pending Review',
    confidence_score: 92.0,
    confidence_breakdown: {
      spatial_alignment: 90,
      geometry_similarity: 93,
      attribute_consistency: 92,
      gnss_verification: 94,
      source_quality: 91
    },
    last_harmonized_at: '2026-09-27 10:50:00',
    review_status: 'Under Review',
    coordinates: generateBox(0, 3),
    source_polygons: [
      { source: 'Cadastral (SY-142/3)', color: '#ef4444', coordinates: generateBox(0, 3, 0, -0.00003), area: 178.5 },
      { source: 'Municipal GIS', color: '#3b82f6', coordinates: generateBox(0, 3), area: 176.2 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'Boundary Shared with P-0103', confidence: 91, rawValues: { issue: 'Overlap with P-0103' } }
    ]
  },
  {
    parcel_id: 'P-0105',
    survey_number: 'SY-142/4',
    municipal_property_id: 'MUC-8845-E',
    revenue_khata_no: 'KHT-70125',
    area_sqm: 210.0,
    boundary_perimeter_m: 58.5,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Mixed Use',
    building_count: 1,
    building_area_sqm: 162.0,
    utility_links: ['Water-M14-05', 'Power-UG-15', 'Telecom-OF-02'],
    gnss_verified: true,
    ground_truth_status: 'Pending Field Visit',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 87.5,
    confidence_breakdown: {
      spatial_alignment: 85,
      geometry_similarity: 88,
      attribute_consistency: 91,
      gnss_verification: 92,
      source_quality: 89
    },
    last_harmonized_at: '2026-09-27 10:52:15',
    review_status: 'Under Review',
    coordinates: generateBox(0, 4),
    source_polygons: [
      { source: 'Cadastral (SY-142/4)', color: '#ef4444', coordinates: generateBox(0, 4), area: 210.0 },
      { source: 'Building Footprint B-0094', color: '#f59e0b', coordinates: generateBox(0, 4, 0.00003, 0), area: 162.0 }
    ],
    source_contributions: [
      { field: 'building_encroachment', source: 'Building Footprint Detection', confidence: 88, rawValues: { offset_m: 0.8, type: 'Road easement encroachment' } }
    ]
  },
  {
    parcel_id: 'P-0106',
    survey_number: 'SY-143/1',
    municipal_property_id: 'MUC-8846-F',
    revenue_khata_no: 'KHT-70130',
    area_sqm: 198.0,
    boundary_perimeter_m: 56.8,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 2,
    building_area_sqm: 142.2,
    utility_links: ['Water-M14-06', 'Power-UG-16'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'New Structure Detected',
    validation_status: 'Validated',
    confidence_score: 93.8,
    confidence_breakdown: {
      spatial_alignment: 95,
      geometry_similarity: 94,
      attribute_consistency: 92,
      gnss_verification: 95,
      source_quality: 93
    },
    last_harmonized_at: '2026-09-27 10:53:00',
    review_status: 'Approved by Officer',
    reviewed_by: 'S. Nanjappa (Revenue Officer)',
    coordinates: generateBox(1, 0),
    source_polygons: [
      { source: 'Cadastral (SY-143/1)', color: '#ef4444', coordinates: generateBox(1, 0), area: 198.0 },
      { source: 'Drone 2026 (New Construction)', color: '#10b981', coordinates: generateBox(1, 0), area: 198.0 }
    ],
    source_contributions: [
      { field: 'change_detection', source: '2025 vs 2026 Drone ORI', confidence: 94, rawValues: { new_building_area_sqm: 46.2, baseline: 'Vacant plot in 2025' } }
    ]
  },
  {
    parcel_id: 'P-0107',
    survey_number: 'SY-143/2',
    municipal_property_id: 'MUC-8847-G',
    revenue_khata_no: 'KHT-70135',
    area_sqm: 185.0,
    boundary_perimeter_m: 54.6,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 92.0,
    utility_links: ['Water-M14-07'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 97.2,
    confidence_breakdown: {
      spatial_alignment: 98,
      geometry_similarity: 97,
      attribute_consistency: 96,
      gnss_verification: 98,
      source_quality: 97
    },
    last_harmonized_at: '2026-09-27 10:54:10',
    review_status: 'Auto-Approved',
    coordinates: generateBox(1, 1),
    source_polygons: [
      { source: 'Cadastral (SY-143/2)', color: '#ef4444', coordinates: generateBox(1, 1), area: 185.0 },
      { source: 'Municipal GIS', color: '#3b82f6', coordinates: generateBox(1, 1), area: 185.0 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'Cadastral + Municipal Harmonized', confidence: 98, rawValues: {} }
    ]
  },
  {
    parcel_id: 'P-0108',
    survey_number: 'SY-143/3',
    municipal_property_id: 'MUC-8848-H',
    revenue_khata_no: 'KHT-70140',
    area_sqm: 172.5,
    boundary_perimeter_m: 52.8,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 85.0,
    utility_links: ['Water-M14-08'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Pending Review',
    confidence_score: 89.5,
    confidence_breakdown: {
      spatial_alignment: 88,
      geometry_similarity: 91,
      attribute_consistency: 90,
      gnss_verification: 93,
      source_quality: 86
    },
    last_harmonized_at: '2026-09-27 10:55:00',
    review_status: 'Under Review',
    coordinates: generateBox(1, 2),
    source_polygons: [
      { source: 'Cadastral (SY-143/3)', color: '#ef4444', coordinates: generateBox(1, 2, 0, -0.00004), area: 171.6 },
      { source: 'Municipal GIS', color: '#3b82f6', coordinates: generateBox(1, 2), area: 172.5 }
    ],
    source_contributions: [
      { field: 'sliver_gap', source: 'Topology Gap Detector', confidence: 89, rawValues: { gap_area_sqm: 0.9, adjacent: 'P-0107' } }
    ]
  },
  {
    parcel_id: 'P-0109',
    survey_number: 'SY-143/4',
    municipal_property_id: 'MUC-8849-J',
    revenue_khata_no: 'KHT-70148',
    area_sqm: 230.0,
    boundary_perimeter_m: 61.2,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 180.0,
    utility_links: ['Water-M14-09', 'Power-UG-19', 'Gas-PNG-04'],
    gnss_verified: false,
    ground_truth_status: 'Disputed',
    change_status: 'Land Use Altered',
    validation_status: 'Flagged',
    confidence_score: 68.4,
    confidence_breakdown: {
      spatial_alignment: 72,
      geometry_similarity: 70,
      attribute_consistency: 61,
      gnss_verification: 60,
      source_quality: 75
    },
    last_harmonized_at: '2026-09-27 10:56:40',
    review_status: 'Under Review',
    coordinates: generateBox(1, 3),
    source_polygons: [
      { source: 'Cadastral (SY-143/4 - Res)', color: '#ef4444', coordinates: generateBox(1, 3, 0.00005, 0), area: 215.0 },
      { source: 'Municipal (Commercial - MUC-8849)', color: '#3b82f6', coordinates: generateBox(1, 3), area: 230.0 },
      { source: 'Drone Footprint', color: '#10b981', coordinates: generateBox(1, 3), area: 228.0 }
    ],
    source_contributions: [
      { field: 'land_use', source: 'Conflicting: Revenue (Res) vs Municipal (Comm)', confidence: 61, rawValues: { revenue: 'Residential', municipal: 'Commercial Complex' } }
    ]
  },
  {
    parcel_id: 'P-0110',
    survey_number: 'SY-143/5',
    municipal_property_id: 'MUC-8850-K',
    revenue_khata_no: 'KHT-70152',
    area_sqm: 204.0,
    boundary_perimeter_m: 57.8,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 105.0,
    utility_links: ['Water-M14-10', 'Power-UG-20'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 96.5,
    confidence_breakdown: {
      spatial_alignment: 97,
      geometry_similarity: 96,
      attribute_consistency: 97,
      gnss_verification: 97,
      source_quality: 95
    },
    last_harmonized_at: '2026-09-27 10:58:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(1, 4),
    source_polygons: [
      { source: 'Cadastral', color: '#ef4444', coordinates: generateBox(1, 4), area: 204.0 },
      { source: 'Municipal', color: '#3b82f6', coordinates: generateBox(1, 4), area: 204.0 }
    ],
    source_contributions: [
      { field: 'geometry', source: 'Multi-source Consensus', confidence: 97, rawValues: {} }
    ]
  },
  // Row 2 parcels
  {
    parcel_id: 'P-0111',
    survey_number: 'SY-144/1',
    municipal_property_id: 'MUC-8851-L',
    revenue_khata_no: 'KHT-70160',
    area_sqm: 190.0,
    boundary_perimeter_m: 55.6,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 95.0,
    utility_links: ['Water-M14-11'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 96.0,
    confidence_breakdown: { spatial_alignment: 97, geometry_similarity: 96, attribute_consistency: 95, gnss_verification: 96, source_quality: 96 },
    last_harmonized_at: '2026-09-27 11:00:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(2, 0)
  },
  {
    parcel_id: 'P-0112',
    survey_number: 'SY-144/2',
    municipal_property_id: 'MUC-8852-M',
    revenue_khata_no: 'KHT-70165',
    area_sqm: 188.0,
    boundary_perimeter_m: 55.0,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 90.0,
    utility_links: ['Water-M14-12'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 95.2,
    confidence_breakdown: { spatial_alignment: 96, geometry_similarity: 95, attribute_consistency: 94, gnss_verification: 96, source_quality: 95 },
    last_harmonized_at: '2026-09-27 11:01:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(2, 1)
  },
  {
    parcel_id: 'P-0113',
    survey_number: 'SY-144/3',
    municipal_property_id: 'MUC-8853-N',
    revenue_khata_no: 'KHT-70170',
    area_sqm: 192.5,
    boundary_perimeter_m: 56.0,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Institutional',
    building_count: 1,
    building_area_sqm: 140.0,
    utility_links: ['Water-M14-13', 'Power-UG-22'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 97.0,
    confidence_breakdown: { spatial_alignment: 98, geometry_similarity: 97, attribute_consistency: 96, gnss_verification: 97, source_quality: 97 },
    last_harmonized_at: '2026-09-27 11:02:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(2, 2)
  },
  {
    parcel_id: 'P-0114',
    survey_number: 'SY-144/4',
    municipal_property_id: 'MUC-8854-P',
    revenue_khata_no: 'KHT-70175',
    area_sqm: 215.0,
    boundary_perimeter_m: 59.2,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 115.0,
    utility_links: ['Water-M14-14'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 95.8,
    confidence_breakdown: { spatial_alignment: 96, geometry_similarity: 95, attribute_consistency: 96, gnss_verification: 96, source_quality: 96 },
    last_harmonized_at: '2026-09-27 11:03:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(2, 3)
  },
  {
    parcel_id: 'P-0115',
    survey_number: 'SY-144/5',
    municipal_property_id: 'MUC-8855-Q',
    revenue_khata_no: 'KHT-70180',
    area_sqm: 199.0,
    boundary_perimeter_m: 57.0,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 98.0,
    utility_links: ['Water-M14-15'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 96.3,
    confidence_breakdown: { spatial_alignment: 97, geometry_similarity: 96, attribute_consistency: 96, gnss_verification: 97, source_quality: 95 },
    last_harmonized_at: '2026-09-27 11:04:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(2, 4)
  },
  // Row 3 parcels
  {
    parcel_id: 'P-0116',
    survey_number: 'SY-145/1',
    municipal_property_id: 'MUC-8856-R',
    revenue_khata_no: 'KHT-70185',
    area_sqm: 184.0,
    boundary_perimeter_m: 54.4,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 86.0,
    utility_links: ['Water-M14-16'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 94.8,
    confidence_breakdown: { spatial_alignment: 95, geometry_similarity: 95, attribute_consistency: 94, gnss_verification: 96, source_quality: 94 },
    last_harmonized_at: '2026-09-27 11:05:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(3, 0)
  },
  {
    parcel_id: 'P-0117',
    survey_number: 'SY-145/2',
    municipal_property_id: 'MUC-8857-S',
    revenue_khata_no: 'KHT-70190',
    area_sqm: 181.5,
    boundary_perimeter_m: 53.8,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 84.0,
    utility_links: ['Water-M14-17'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 95.1,
    confidence_breakdown: { spatial_alignment: 95, geometry_similarity: 95, attribute_consistency: 95, gnss_verification: 96, source_quality: 95 },
    last_harmonized_at: '2026-09-27 11:06:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(3, 1)
  },
  {
    parcel_id: 'P-0118',
    survey_number: 'SY-145/3',
    municipal_property_id: 'MUC-8858-T',
    revenue_khata_no: 'KHT-70195',
    area_sqm: 245.0,
    boundary_perimeter_m: 64.0,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Public Utility',
    building_count: 1,
    building_area_sqm: 75.0,
    utility_links: ['Water-M14-18', 'Power-UG-25', 'Storm-Drain-01'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 97.5,
    confidence_breakdown: { spatial_alignment: 98, geometry_similarity: 97, attribute_consistency: 97, gnss_verification: 98, source_quality: 98 },
    last_harmonized_at: '2026-09-27 11:07:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(3, 2)
  },
  {
    parcel_id: 'P-0119',
    survey_number: 'SY-145/4',
    municipal_property_id: 'MUC-8859-U',
    revenue_khata_no: 'KHT-70200',
    area_sqm: 178.0,
    boundary_perimeter_m: 53.4,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 80.0,
    utility_links: ['Water-M14-19'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 96.0,
    confidence_breakdown: { spatial_alignment: 97, geometry_similarity: 96, attribute_consistency: 95, gnss_verification: 97, source_quality: 95 },
    last_harmonized_at: '2026-09-27 11:08:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(3, 3)
  },
  {
    parcel_id: 'P-0120',
    survey_number: 'SY-145/5',
    municipal_property_id: 'MUC-8860-V',
    revenue_khata_no: 'KHT-70205',
    area_sqm: 186.0,
    boundary_perimeter_m: 54.8,
    ward_id: 'Ward 14 - Kuvempunagar',
    zone_name: 'South Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 91.0,
    utility_links: ['Water-M14-20'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 95.7,
    confidence_breakdown: { spatial_alignment: 96, geometry_similarity: 96, attribute_consistency: 95, gnss_verification: 96, source_quality: 95 },
    last_harmonized_at: '2026-09-27 11:09:00',
    review_status: 'Auto-Approved',
    coordinates: generateBox(3, 4)
  }
];

// Preloaded 10 Multi-Source Datasets
export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'ds-cadastral',
    name: 'Cadastral Survey Map 2024',
    category: 'cadastral',
    department: 'Survey Settlement & Land Records (SSLR)',
    format: 'GeoJSON',
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    featureCount: 5482,
    uploadDate: '2026-09-20',
    fileSize: '14.2 MB',
    status: 'ready',
    validationStatus: 'has_issues',
    issuesCount: 17,
    geometryType: 'Polygon',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Historical revenue cadastral survey boundaries with survey numbers and Tippani measurements.',
    sourceTrustScore: 92,
    attributes: [
      { name: 'parcel_id', type: 'string', nullPercentage: 0, uniqueValues: 5482, sampleValues: ['P-0101', 'P-0102'], canonicalMapping: 'parcel_id', mappingConfidence: 99 },
      { name: 'survey_no', type: 'string', nullPercentage: 0.1, uniqueValues: 5310, sampleValues: ['SY-142/1', 'SY-142/2A'], canonicalMapping: 'survey_number', mappingConfidence: 98 },
      { name: 'area', type: 'float', nullPercentage: 0, uniqueValues: 2400, sampleValues: [195.8, 182.4], canonicalMapping: 'area_sqm', mappingConfidence: 97 },
      { name: 'land_use', type: 'string', nullPercentage: 1.2, uniqueValues: 5, sampleValues: ['Residential', 'Commercial'], canonicalMapping: 'land_use', mappingConfidence: 94 },
      { name: 'ward', type: 'string', nullPercentage: 0, uniqueValues: 65, sampleValues: ['Ward 14'], canonicalMapping: 'ward_id', mappingConfidence: 95 }
    ]
  },
  {
    id: 'ds-municipal',
    name: 'Municipal GIS Property Tax Layer',
    category: 'municipal',
    department: 'Mysuru City Corporation (MCC)',
    format: 'GeoJSON',
    crs: 'EPSG:32643',
    crsName: 'WGS 84 / UTM Zone 43N',
    featureCount: 6120,
    uploadDate: '2026-09-22',
    fileSize: '18.6 MB',
    status: 'ready',
    validationStatus: 'has_issues',
    issuesCount: 23,
    geometryType: 'Polygon',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'City municipal property registry, building tax assessments, and ward demarcations.',
    sourceTrustScore: 90,
    attributes: [
      { name: 'property_id', type: 'string', nullPercentage: 0, uniqueValues: 6120, sampleValues: ['MUC-8841-A', 'MUC-8842-B'], canonicalMapping: 'municipal_property_id', mappingConfidence: 96 },
      { name: 'plot_area', type: 'float', nullPercentage: 0.4, uniqueValues: 2850, sampleValues: [195.2, 184.1], canonicalMapping: 'area_sqm', mappingConfidence: 95 },
      { name: 'usage_type', type: 'string', nullPercentage: 0, uniqueValues: 6, sampleValues: ['A1-Res', 'B2-Comm'], canonicalMapping: 'land_use', mappingConfidence: 92 },
      { name: 'ward_code', type: 'string', nullPercentage: 0, uniqueValues: 65, sampleValues: ['W-14', 'W-15'], canonicalMapping: 'ward_id', mappingConfidence: 98 }
    ]
  },
  {
    id: 'ds-revenue',
    name: 'Bhoomi / Revenue Records Register',
    category: 'revenue',
    department: 'Revenue Department Karnataka',
    format: 'CSV / Tabular',
    crs: 'EPSG:4326',
    crsName: 'WGS 84 (Point Reference)',
    featureCount: 5200,
    uploadDate: '2026-09-18',
    fileSize: '8.4 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 4,
    geometryType: 'Point',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Official Bhoomi land khata records, mutation logs, and tenure classifications.',
    sourceTrustScore: 94,
    attributes: [
      { name: 'khata_number', type: 'string', nullPercentage: 0, uniqueValues: 5200, sampleValues: ['KHT-70112', 'KHT-70115'], canonicalMapping: 'revenue_khata_no', mappingConfidence: 99 },
      { name: 'survey_no', type: 'string', nullPercentage: 0, uniqueValues: 5120, sampleValues: ['SY-142/1', 'SY-142/2A'], canonicalMapping: 'survey_number', mappingConfidence: 98 },
      { name: 'owner_ref', type: 'string', nullPercentage: 0, uniqueValues: 4900, sampleValues: ['OWN-MY-001', 'OWN-MY-002'], canonicalMapping: 'owner_reference', mappingConfidence: 91 },
      { name: 'recorded_area_sqm', type: 'float', nullPercentage: 0.2, uniqueValues: 2200, sampleValues: [195.0, 182.0], canonicalMapping: 'area_sqm', mappingConfidence: 93 }
    ]
  },
  {
    id: 'ds-ori',
    name: 'Orthorectified Drone Imagery (ORI 2026)',
    category: 'ori',
    department: 'Karnataka Geospatial Data Centre (KGDC)',
    format: 'GeoTIFF / Raster',
    crs: 'EPSG:32643',
    crsName: 'WGS 84 / UTM Zone 43N',
    featureCount: 1,
    uploadDate: '2026-09-25',
    fileSize: '240.0 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 0,
    geometryType: 'Raster Grid',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'High-resolution 5cm GSD Ortho-mosaic drone imagery flown in Q1 2026.',
    sourceTrustScore: 96,
    attributes: [
      { name: 'band_count', type: 'number', nullPercentage: 0, uniqueValues: 1, sampleValues: [4] },
      { name: 'resolution_m', type: 'float', nullPercentage: 0, uniqueValues: 1, sampleValues: [0.05] }
    ]
  },
  {
    id: 'ds-dsm',
    name: 'DSM / DTM Elevation Surface Grid',
    category: 'dsm_dtm',
    department: 'Survey of India (SoI)',
    format: 'GeoTIFF / Raster',
    crs: 'EPSG:32643',
    crsName: 'WGS 84 / UTM Zone 43N',
    featureCount: 1,
    uploadDate: '2026-09-24',
    fileSize: '185.0 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 0,
    geometryType: 'Raster Grid',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Digital Surface & Terrain Model from LiDAR/Photogrammetry for 3D elevation profiling.',
    sourceTrustScore: 95,
    attributes: [
      { name: 'elevation_min_m', type: 'float', nullPercentage: 0, uniqueValues: 1, sampleValues: [752.4] },
      { name: 'elevation_max_m', type: 'float', nullPercentage: 0, uniqueValues: 1, sampleValues: [788.1] }
    ]
  },
  {
    id: 'ds-buildings',
    name: 'Building Footprints Vector Layer',
    category: 'building_footprints',
    department: 'Urban Development Authority (MUDA)',
    format: 'GeoJSON',
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    featureCount: 4210,
    uploadDate: '2026-09-23',
    fileSize: '11.8 MB',
    status: 'ready',
    validationStatus: 'has_issues',
    issuesCount: 11,
    geometryType: 'Polygon',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Digitized roof footprints and setback structures with height and construction year.',
    sourceTrustScore: 91,
    attributes: [
      { name: 'bldg_id', type: 'string', nullPercentage: 0, uniqueValues: 4210, sampleValues: ['B-0091', 'B-0094'], canonicalMapping: 'building_id', mappingConfidence: 99 },
      { name: 'footprint_area', type: 'float', nullPercentage: 0, uniqueValues: 2100, sampleValues: [110.2, 162.0], canonicalMapping: 'building_area_sqm', mappingConfidence: 98 },
      { name: 'floors', type: 'number', nullPercentage: 1.5, uniqueValues: 4, sampleValues: [2, 3] },
      { name: 'built_year', type: 'number', nullPercentage: 2.0, uniqueValues: 25, sampleValues: [2018, 2026] }
    ]
  },
  {
    id: 'ds-utilities',
    name: 'Underground Utilities Network',
    category: 'utilities',
    department: 'Mysuru Water & Sewerage Board (KUWSDB)',
    format: 'GeoJSON',
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    featureCount: 890,
    uploadDate: '2026-09-21',
    fileSize: '5.2 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 2,
    geometryType: 'LineString',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Potable water pipelines, underground storm drains, and HT electric cable corridors.',
    sourceTrustScore: 89,
    attributes: [
      { name: 'utility_id', type: 'string', nullPercentage: 0, uniqueValues: 890, sampleValues: ['Water-M14-01'], canonicalMapping: 'utility_id', mappingConfidence: 97 },
      { name: 'type', type: 'string', nullPercentage: 0, uniqueValues: 4, sampleValues: ['Water Supply', 'UG Cable'] }
    ]
  },
  {
    id: 'ds-gnss',
    name: 'CORS / High-Precision GNSS Benchmarks',
    category: 'gnss_cors',
    department: 'National Geodetic Survey Network',
    format: 'CSV / Tabular',
    crs: 'EPSG:32643',
    crsName: 'WGS 84 / UTM Zone 43N',
    featureCount: 340,
    uploadDate: '2026-09-26',
    fileSize: '1.2 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 0,
    geometryType: 'Point',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Sub-centimeter RTK GNSS field reference points calibrated against Survey of India CORS.',
    sourceTrustScore: 99,
    attributes: [
      { name: 'station_id', type: 'string', nullPercentage: 0, uniqueValues: 340, sampleValues: ['GNSS-MY-101'], canonicalMapping: 'gnss_point_id', mappingConfidence: 99 },
      { name: 'easting', type: 'float', nullPercentage: 0, uniqueValues: 340, sampleValues: [678450.21] },
      { name: 'northing', type: 'float', nullPercentage: 0, uniqueValues: 340, sampleValues: [1361220.44] },
      { name: 'h_accuracy_m', type: 'float', nullPercentage: 0, uniqueValues: 10, sampleValues: [0.008] }
    ]
  },
  {
    id: 'ds-groundtruth',
    name: 'Field Ground Truthing & Inspection Logs',
    category: 'ground_truth',
    department: 'Revenue & Municipal Joint Taskforce',
    format: 'GeoJSON',
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    featureCount: 520,
    uploadDate: '2026-09-25',
    fileSize: '3.8 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 3,
    geometryType: 'Point',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'Geotagged site photos, boundary boundary-stone verification markers, and field remarks.',
    sourceTrustScore: 96,
    attributes: [
      { name: 'gt_id', type: 'string', nullPercentage: 0, uniqueValues: 520, sampleValues: ['GT-MY-044'] },
      { name: 'verification_status', type: 'string', nullPercentage: 0, uniqueValues: 3, sampleValues: ['Verified', 'Disputed'] }
    ]
  },
  {
    id: 'ds-drone-raw',
    name: 'Drone Survey Mission Raw Trajectory',
    category: 'drone',
    department: 'Karnataka Drones & Aerospace Mission',
    format: 'KML',
    crs: 'EPSG:4326',
    crsName: 'WGS 84',
    featureCount: 1420,
    uploadDate: '2026-09-25',
    fileSize: '9.4 MB',
    status: 'ready',
    validationStatus: 'valid',
    issuesCount: 1,
    geometryType: 'LineString',
    bbox: [76.640, 12.308, 76.660, 12.325],
    description: 'PPK-tagged drone flight paths, camera trigger coordinates, and shutter angle telemetry.',
    sourceTrustScore: 93,
    attributes: [
      { name: 'photo_id', type: 'string', nullPercentage: 0, uniqueValues: 1420, sampleValues: ['DJI_0442'] },
      { name: 'altitude_agl_m', type: 'float', nullPercentage: 0, uniqueValues: 120, sampleValues: [120.4] }
    ]
  }
];

// Spatial Matching Results (Cadastral vs Municipal vs Building vs GNSS)
export const INITIAL_MATCHES: SpatialMatchResult[] = [
  {
    id: 'MATCH-001',
    cadastralId: 'P-0101',
    municipalId: 'MUC-8841-A',
    buildingId: 'B-0091',
    gnssRefId: 'GNSS-MY-101',
    confidence: 98.4,
    status: 'accepted',
    factors: {
      overlap_iou: 98.2,
      centroid_distance_m: 0.4,
      shape_similarity: 98.5,
      area_similarity: 99.1,
      attribute_similarity: 97.4
    },
    details: 'Near-identical boundary geometry between Cadastral and Municipal tax parcel. Verified by GNSS point.'
  },
  {
    id: 'MATCH-002',
    cadastralId: 'P-0102',
    municipalId: 'MUC-8842-B',
    buildingId: 'B-0092',
    gnssRefId: 'GNSS-MY-102',
    confidence: 95.8,
    status: 'accepted',
    factors: {
      overlap_iou: 96.8,
      centroid_distance_m: 1.2,
      shape_similarity: 94.3,
      area_similarity: 98.1,
      attribute_similarity: 91.4
    },
    details: '1.2m centroid shift between Cadastral and Municipal dataset. Resolved using GNSS post-processed edge.'
  },
  {
    id: 'MATCH-003',
    cadastralId: 'P-0103',
    municipalId: 'MUC-8843-C',
    buildingId: 'B-0093',
    gnssRefId: 'GNSS-MY-103',
    confidence: 91.2,
    status: 'pending',
    factors: {
      overlap_iou: 89.4,
      centroid_distance_m: 1.9,
      shape_similarity: 91.0,
      area_similarity: 94.2,
      attribute_similarity: 88.5
    },
    details: 'Polygon overlap detected on eastern edge with adjacent parcel P-0104. Topology repair required before lock.'
  },
  {
    id: 'MATCH-005',
    cadastralId: 'P-0105',
    municipalId: 'MUC-8845-E',
    buildingId: 'B-0094',
    gnssRefId: 'GNSS-MY-105',
    confidence: 87.5,
    status: 'pending',
    factors: {
      overlap_iou: 86.1,
      centroid_distance_m: 2.1,
      shape_similarity: 87.2,
      area_similarity: 89.0,
      attribute_similarity: 87.0
    },
    details: 'Building footprint B-0094 encroaches 0.8m over the surveyed parcel perimeter into road setback.'
  },
  {
    id: 'MATCH-009',
    cadastralId: 'P-0109',
    municipalId: 'MUC-8849-J',
    buildingId: 'B-0099',
    gnssRefId: 'GNSS-MY-109',
    confidence: 68.4,
    status: 'pending',
    factors: {
      overlap_iou: 74.0,
      centroid_distance_m: 3.8,
      shape_similarity: 71.2,
      area_similarity: 75.0,
      attribute_similarity: 60.5
    },
    details: 'Contradictory land-use classification (Revenue: Residential vs Municipal: Commercial Complex) & 15m² area delta.'
  }
];

// Proposed Intelligent Attribute Mappings
export const INITIAL_ATTRIBUTE_MAPPINGS: AttributeMappingProposal[] = [
  { id: 'AM-01', sourceDataset: 'Cadastral Layer', sourceField: 'parcel_id', canonicalField: 'parcel_id', confidence: 99, sampleMatch: 'P-0102 → P-0102', status: 'approved' },
  { id: 'AM-02', sourceDataset: 'Cadastral Layer', sourceField: 'survey_no', canonicalField: 'survey_number', confidence: 98, sampleMatch: 'SY-142/2A → SY-142/2A', status: 'approved' },
  { id: 'AM-03', sourceDataset: 'Cadastral Layer', sourceField: 'area', canonicalField: 'area_sqm', confidence: 97, sampleMatch: '182.4 → 182.0 (harmonized)', status: 'approved' },
  { id: 'AM-04', sourceDataset: 'Cadastral Layer', sourceField: 'ward', canonicalField: 'ward_id', confidence: 96, sampleMatch: 'Ward 14 → Ward 14 - Kuvempunagar', status: 'approved' },
  { id: 'AM-05', sourceDataset: 'Municipal GIS', sourceField: 'property_id', canonicalField: 'municipal_property_id', confidence: 96, sampleMatch: 'MUC-8842-B → MUC-8842-B', status: 'approved' },
  { id: 'AM-06', sourceDataset: 'Municipal GIS', sourceField: 'plot_area', canonicalField: 'area_sqm', confidence: 95, sampleMatch: '184.1 → 182.0 (reconciled)', status: 'approved' },
  { id: 'AM-07', sourceDataset: 'Municipal GIS', sourceField: 'usage_type', canonicalField: 'land_use', confidence: 92, sampleMatch: 'A1-Res → Residential', status: 'approved' },
  { id: 'AM-08', sourceDataset: 'Revenue Register', sourceField: 'khata_number', canonicalField: 'revenue_khata_no', confidence: 99, sampleMatch: 'KHT-70115 → KHT-70115', status: 'approved' },
  { id: 'AM-09', sourceDataset: 'Building Layer', sourceField: 'footprint_area', canonicalField: 'building_area_sqm', confidence: 98, sampleMatch: '98.5 → 98.5', status: 'approved' }
];

// Topology Issues
export const INITIAL_TOPOLOGY_ISSUES: TopologyIssue[] = [
  {
    id: 'TP-0183',
    type: 'overlap',
    severity: 'high',
    affectedParcels: ['P-0103', 'P-0104'],
    area_sqm: 3.7,
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 2.85],
    description: 'Cadastral boundary overlap of 3.7 m² between Parcel P-0103 and P-0104 along eastern survey line.',
    suggestedCorrection: 'Snap boundary to mutual GNSS benchmark GNSS-MY-103 edge and partition overlap evenly.',
    confidence: 97.2,
    status: 'open'
  },
  {
    id: 'TP-0184',
    type: 'gap',
    severity: 'medium',
    affectedParcels: ['P-0107', 'P-0108'],
    area_sqm: 0.9,
    location: [BASE_LAT + LAT_OFFSET, BASE_LNG + LNG_OFFSET * 1.95],
    description: 'Unassigned sliver gap of 0.9 m² between Parcel P-0107 and P-0108 due to municipal digitizing discrepancy.',
    suggestedCorrection: 'Eliminate sliver gap by snapping vertices to high-resolution drone orthophoto road curb line.',
    confidence: 95.4,
    status: 'open'
  },
  {
    id: 'TP-0185',
    type: 'encroachment',
    severity: 'high',
    affectedParcels: ['P-0105'],
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 4],
    description: 'Building footprint B-0094 extends 0.8m over cadastral parcel boundary into municipal road easement.',
    suggestedCorrection: 'Retain surveyed cadastral parcel boundary and flag building footprint as an unapproved setback encroachment.',
    confidence: 94.0,
    status: 'open'
  },
  {
    id: 'TP-0186',
    type: 'duplicate',
    severity: 'low',
    affectedParcels: ['P-0112'],
    location: [BASE_LAT + LAT_OFFSET * 2, BASE_LNG + LNG_OFFSET],
    description: 'Two identical geometry records ingested from municipal legacy tax backup archive.',
    suggestedCorrection: 'Deduplicate by removing older record (Version 2023) and retaining verified 2026 record.',
    confidence: 99.1,
    status: 'corrected'
  }
];

// Temporal Change Detection (2025 baseline vs 2026 drone survey)
export const INITIAL_CHANGES: TemporalChange[] = [
  {
    id: 'CH-0012',
    parcel_id: 'P-0106',
    changeType: 'new_building',
    baselineYear: 2025,
    currentYear: 2026,
    confidence: 93.8,
    areaDiffSqm: 46.2,
    coordinates: [BASE_LAT + LAT_OFFSET, BASE_LNG],
    description: 'New two-story residential building footprint detected via 2026 Drone ORI. Plot was recorded vacant in 2025.',
    status: 'pending'
  },
  {
    id: 'CH-0013',
    parcel_id: 'P-0109',
    changeType: 'land_use_change',
    baselineYear: 2025,
    currentYear: 2026,
    confidence: 91.5,
    areaDiffSqm: 0,
    coordinates: [BASE_LAT + LAT_OFFSET, BASE_LNG + LNG_OFFSET * 3],
    description: 'Residential dwelling converted into commercial retail arcade (signboard, parking alterations detected).',
    status: 'pending'
  },
  {
    id: 'CH-0014',
    parcel_id: 'P-0118',
    changeType: 'utility_encroachment',
    baselineYear: 2025,
    currentYear: 2026,
    confidence: 96.0,
    areaDiffSqm: 12.0,
    coordinates: [BASE_LAT + LAT_OFFSET * 3, BASE_LNG + LNG_OFFSET * 2],
    description: 'New underground electrical substation cable corridor demarcated across north parcel perimeter.',
    status: 'confirmed'
  }
];

// Harmonization Conflict Center Queue
export const INITIAL_CONFLICTS: HarmonizationConflict[] = [
  {
    id: 'CF-1042',
    parcel_id: 'P-0102',
    title: 'Multi-Source Boundary Discrepancy (1.2m offset)',
    conflictType: 'boundary_discrepancy',
    severity: 'moderate',
    sources: [
      { source: 'Cadastral Survey (SY-142/2A)', value: '182.4 m²', weight: 0.3 },
      { source: 'Municipal GIS (MUC-8842-B)', value: '184.1 m²', weight: 0.25 },
      { source: 'Drone-derived Ortho Boundary', value: '181.8 m²', weight: 0.2 },
      { source: 'High-Precision GNSS Verification', value: '182.0 m²', weight: 0.25 }
    ],
    aiRecommendation: 'Adopt GNSS-verified ground benchmark geometry (182.0 m²) and align cadastral boundary to verified boundary-stone edge.',
    confidence: 96.4,
    status: 'resolved',
    resolvedAction: 'Accepted AI Recommendation (GNSS-verified 182.0 m²)',
    resolvedBy: 'K. Ramesh (GIS Analyst)',
    resolvedAt: '2026-09-27 10:48:30',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET]
  },
  {
    id: 'CF-1043',
    parcel_id: 'P-0103',
    title: 'Cadastral Overlap with P-0104 (3.7 m²)',
    conflictType: 'area_mismatch',
    severity: 'critical',
    sources: [
      { source: 'Cadastral Survey P-0103', value: '191.0 m²', weight: 0.4 },
      { source: 'Cadastral Survey P-0104', value: '178.5 m²', weight: 0.4 },
      { source: 'Municipal Tax Map P-0103', value: '188.5 m²', weight: 0.2 }
    ],
    aiRecommendation: 'Snap mutual edge to GNSS coordinate benchmark GNSS-MY-103 and adjust P-0103 canonical area to 188.5 m².',
    confidence: 93.1,
    status: 'under_review',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 2]
  },
  {
    id: 'CF-1044',
    parcel_id: 'P-0105',
    title: 'Structure Encroachment on Public Road Setback',
    conflictType: 'building_encroachment',
    severity: 'critical',
    sources: [
      { source: 'Cadastral Parcel SY-142/4', value: 'Boundary strictly 210.0 m²', weight: 0.4 },
      { source: 'Building Layer B-0094', value: 'Roof overhang extends 0.8m beyond boundary', weight: 0.35 },
      { source: 'Field Ground Truthing GT-MY-044', value: 'Confirmed physical balcony projection over street', weight: 0.25 }
    ],
    aiRecommendation: 'Preserve canonical parcel boundary as 210.0 m²; generate encroachment notice tag on Building B-0094 for municipal review.',
    confidence: 94.5,
    status: 'under_review',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 4]
  },
  {
    id: 'CF-1045',
    parcel_id: 'P-0109',
    title: 'Contradictory Land Use & Khata Mismatch',
    conflictType: 'land_use_mismatch',
    severity: 'critical',
    sources: [
      { source: 'Revenue Department Khata', value: 'Residential Tenure (Non-Converted)', weight: 0.4 },
      { source: 'Municipal Property Tax Assessment', value: 'Commercial Complex (Rate C)', weight: 0.35 },
      { source: 'Drone 2026 Inspection', value: 'Commercial Ground Floor Retail', weight: 0.25 }
    ],
    aiRecommendation: 'Flag for Joint Revenue-Municipal Officer hearing. Potential unpermitted agricultural/residential to commercial conversion.',
    confidence: 68.4,
    status: 'open',
    location: [BASE_LAT + LAT_OFFSET, BASE_LNG + LNG_OFFSET * 3]
  }
];

// Initial Audit Trail Entries
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-27 10:42:15',
    userRole: 'gis_analyst',
    userName: 'K. Ramesh',
    action: 'Dataset Ingestion & Registration',
    targetObject: 'Cadastral Survey Map 2024 (5,482 features)',
    status: 'Success',
    notes: 'Parsed GeoJSON, EPSG:4326 registered, 17 topology warnings flagged'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-27 10:43:40',
    userRole: 'gis_analyst',
    userName: 'K. Ramesh',
    action: 'CRS Transformation & Georeferencing',
    targetObject: 'All Source Layers → Target EPSG:32643 (UTM 43N)',
    status: 'Success',
    notes: 'Mean residual error 0.42m; maximum residual error 1.17m'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-27 10:44:18',
    userRole: 'admin',
    userName: 'System (AI Harmonizer)',
    action: 'Spatial Matching Batch Run',
    targetObject: '25 Urban Parcels in Mysuru Sector',
    status: 'Success',
    notes: '22 matches high confidence (>90%), 2 medium, 1 low confidence'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-27 10:45:12',
    userRole: 'admin',
    userName: 'System (AI Harmonizer)',
    action: 'Auto-Approval of High Confidence Parcel',
    targetObject: 'Parcel P-0101 (Confidence: 98.4%)',
    previousValue: 'Unprocessed sources',
    newValue: 'Harmonized Canonical Record P-0101 (195.4 m²)',
    status: 'Success'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-09-27 10:48:30',
    userRole: 'gis_analyst',
    userName: 'K. Ramesh',
    action: 'Conflict Resolution Override',
    targetObject: 'Conflict #CF-1042 on Parcel P-0102',
    previousValue: 'Cadastral: 182.4 m² vs Municipal: 184.1 m²',
    newValue: 'Adopted GNSS-verified edge (182.0 m²)',
    status: 'Manual Override',
    notes: 'Officer verified against CORS station benchmark GNSS-MY-102'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-09-27 10:52:15',
    userRole: 'municipal_officer',
    userName: 'Anand Kumar',
    action: 'Building Encroachment Flagged',
    targetObject: 'Building B-0094 on Parcel P-0105',
    newValue: 'Road setback violation tagged (0.8m over boundary)',
    status: 'Warning',
    notes: 'Notice queued for municipal town planning inspection'
  }
];
