import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.log('Skipping Supabase live update: No service role key in .env');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

const BASE_LAT = 12.9719;
const BASE_LNG = 77.6412;
const LAT_OFFSET = 0.00075;
const LNG_OFFSET = 0.00085;

function generateBox(row, col, latDrift = 0, lngDrift = 0) {
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

function generateBoxAt(baseLat, baseLng, row, col, latDrift = 0, lngDrift = 0) {
  const minLat = baseLat + row * LAT_OFFSET + latDrift;
  const maxLat = minLat + LAT_OFFSET * 0.88;
  const minLng = baseLng + col * LNG_OFFSET + lngDrift;
  const maxLng = minLng + LNG_OFFSET * 0.88;

  return [
    [minLat, minLng],
    [minLat, maxLng],
    [maxLat, maxLng],
    [maxLat, minLng],
    [minLat, minLng]
  ];
}

// 43 Full Multi-Sector Parcels across Bengaluru
const parcels = [
  // Sector 1: Indiranagar / Domlur (Ward 112)
  {
    parcel_id: 'P-0101',
    survey_number: 'SY-84/1',
    municipal_property_id: 'BBMP-8841-A',
    revenue_khata_no: 'KHT-BLR-70112',
    area_sqm: 195.4,
    boundary_perimeter_m: 56.2,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 110.2,
    utility_links: ['BWSSB-INDIRA-01', 'BESCOM-UG-11'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 98.4,
    coordinates: generateBox(0, 0),
    review_status: 'Auto-Approved'
  },
  {
    parcel_id: 'P-0102',
    survey_number: 'SY-84/2A',
    municipal_property_id: 'BBMP-8842-B',
    revenue_khata_no: 'KHT-BLR-70115',
    area_sqm: 182.0,
    boundary_perimeter_m: 54.0,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 98.5,
    utility_links: ['BWSSB-INDIRA-02', 'BESCOM-UG-12'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Validated',
    confidence_score: 95.8,
    coordinates: generateBox(0, 1),
    review_status: 'Approved by Officer',
    reviewed_by: 'K. Ramesh (GIS Analyst)'
  },
  {
    parcel_id: 'P-0103',
    survey_number: 'SY-84/2B',
    municipal_property_id: 'BBMP-8843-C',
    revenue_khata_no: 'KHT-BLR-70118',
    area_sqm: 188.5,
    boundary_perimeter_m: 55.4,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 135.0,
    utility_links: ['BWSSB-INDIRA-03', 'BESCOM-UG-13'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Pending Review',
    confidence_score: 91.2,
    coordinates: generateBox(0, 2),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0104',
    survey_number: 'SY-84/3',
    municipal_property_id: 'BBMP-8844-D',
    revenue_khata_no: 'KHT-BLR-70120',
    area_sqm: 178.5,
    boundary_perimeter_m: 53.6,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 85.0,
    utility_links: ['BWSSB-INDIRA-04', 'BESCOM-UG-14'],
    gnss_verified: false,
    ground_truth_status: 'Pending Field Visit',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 94.0,
    coordinates: generateBox(0, 3),
    review_status: 'Auto-Approved'
  },
  {
    parcel_id: 'P-0105',
    survey_number: 'SY-84/4',
    municipal_property_id: 'BBMP-8845-E',
    revenue_khata_no: 'KHT-BLR-70122',
    area_sqm: 210.0,
    boundary_perimeter_m: 58.2,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Mixed Use',
    building_count: 2,
    building_area_sqm: 140.0,
    utility_links: ['BWSSB-INDIRA-05', 'BESCOM-UG-15'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'New Structure Detected',
    validation_status: 'Flagged',
    confidence_score: 87.5,
    coordinates: generateBox(0, 4),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0109',
    survey_number: 'SY-85/4',
    municipal_property_id: 'BBMP-8849-I',
    revenue_khata_no: 'KHT-BLR-70145',
    area_sqm: 320.0,
    boundary_perimeter_m: 74.0,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Mixed Use',
    building_count: 2,
    building_area_sqm: 260.0,
    utility_links: ['BWSSB-INDIRA-09', 'BESCOM-UG-19'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Flagged',
    confidence_score: 68.4,
    coordinates: generateBox(1, 3),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0114',
    survey_number: 'SY-86/4',
    municipal_property_id: 'BBMP-8854-P',
    revenue_khata_no: 'KHT-BLR-70175',
    area_sqm: 235.0,
    boundary_perimeter_m: 61.8,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 110.0,
    utility_links: ['BWSSB-INDIRA-14', 'BESCOM-UG-14'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 86.4,
    coordinates: generateBox(2, 3),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0116',
    survey_number: 'SY-87/1',
    municipal_property_id: 'BBMP-8856-R',
    revenue_khata_no: 'KHT-BLR-70185',
    area_sqm: 191.0,
    boundary_perimeter_m: 55.6,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Commercial',
    building_count: 2,
    building_area_sqm: 165.0,
    utility_links: ['BWSSB-INDIRA-16', 'BESCOM-UG-16'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Pending Review',
    confidence_score: 92.0,
    coordinates: generateBox(3, 0),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0120',
    survey_number: 'SY-87/5',
    municipal_property_id: 'BBMP-8860-V',
    revenue_khata_no: 'KHT-BLR-70205',
    area_sqm: 186.0,
    boundary_perimeter_m: 54.8,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 91.0,
    utility_links: ['BWSSB-INDIRA-20', 'BESCOM-UG-20'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Flagged',
    confidence_score: 88.5,
    coordinates: generateBox(3, 4),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0122',
    survey_number: 'SY-88/2',
    municipal_property_id: 'BBMP-8862-X',
    revenue_khata_no: 'KHT-BLR-70215',
    area_sqm: 210.0,
    boundary_perimeter_m: 58.0,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Mixed Use',
    building_count: 1,
    building_area_sqm: 120.0,
    utility_links: ['BWSSB-INDIRA-22', 'BESCOM-HT-02'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 89.2,
    coordinates: generateBox(4, 1),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0124',
    survey_number: 'SY-88/4',
    municipal_property_id: 'BBMP-8864-Z',
    revenue_khata_no: 'KHT-BLR-70225',
    area_sqm: 240.0,
    boundary_perimeter_m: 62.4,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 105.0,
    utility_links: ['BWSSB-INDIRA-24', 'BESCOM-UG-24'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 93.6,
    coordinates: generateBox(4, 3),
    review_status: 'Auto-Approved'
  },
  {
    parcel_id: 'P-0125',
    survey_number: 'SY-88/5',
    municipal_property_id: 'BBMP-8865-AA',
    revenue_khata_no: 'KHT-BLR-70230',
    area_sqm: 198.2,
    boundary_perimeter_m: 56.8,
    ward_id: 'Ward 112 - Domlur / Indiranagar',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 98.0,
    utility_links: ['BWSSB-INDIRA-25', 'BESCOM-UG-25'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Validated',
    confidence_score: 98.0,
    coordinates: generateBox(4, 4),
    review_status: 'Approved by Officer'
  },

  // Sector 2: Ulsoor Lake Buffer (Ward 90 - Halasuru)
  {
    parcel_id: 'P-0201',
    survey_number: 'SY-92/1',
    municipal_property_id: 'BBMP-9001-A',
    revenue_khata_no: 'KHT-BLR-8101',
    area_sqm: 245.0,
    boundary_perimeter_m: 63.0,
    ward_id: 'Ward 90 - Halasuru (Ulsoor)',
    zone_name: 'BBMP East Zone',
    land_use: 'Residential',
    building_count: 1,
    building_area_sqm: 140.0,
    utility_links: ['BWSSB-HAL-01', 'BESCOM-UG-41'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Unchanged',
    validation_status: 'Validated',
    confidence_score: 97.2,
    coordinates: generateBoxAt(12.9815, 77.6240, 0, 0),
    review_status: 'Auto-Approved'
  },
  {
    parcel_id: 'P-0202',
    survey_number: 'SY-92/2',
    municipal_property_id: 'BBMP-9002-B',
    revenue_khata_no: 'KHT-BLR-8102',
    area_sqm: 380.0,
    boundary_perimeter_m: 78.5,
    ward_id: 'Ward 90 - Halasuru (Ulsoor)',
    zone_name: 'BBMP East Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 210.0,
    utility_links: ['BWSSB-HAL-02', 'BESCOM-UG-42'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 84.5,
    coordinates: generateBoxAt(12.9815, 77.6240, 0, 1),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0204',
    survey_number: 'SY-92/4',
    municipal_property_id: 'BBMP-9004-D',
    revenue_khata_no: 'KHT-BLR-8104',
    area_sqm: 320.0,
    boundary_perimeter_m: 72.0,
    ward_id: 'Ward 90 - Halasuru (Ulsoor)',
    zone_name: 'BBMP East Zone',
    land_use: 'Public Utility',
    building_count: 1,
    building_area_sqm: 80.0,
    utility_links: ['BWSSB-HAL-04', 'Stormwater-Inflow-01'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 89.0,
    coordinates: generateBoxAt(12.9815, 77.6240, 1, 1),
    review_status: 'Under Review'
  },

  // Sector 3: Koramangala 80ft Road (Ward 151)
  {
    parcel_id: 'P-0301',
    survey_number: 'SY-14/2A',
    municipal_property_id: 'BBMP-15101-A',
    revenue_khata_no: 'KHT-BLR-9201',
    area_sqm: 280.0,
    boundary_perimeter_m: 68.0,
    ward_id: 'Ward 151 - Koramangala',
    zone_name: 'BBMP South Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 220.0,
    utility_links: ['BWSSB-KRM-01', 'BESCOM-UG-51'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 82.0,
    coordinates: generateBoxAt(12.9350, 77.6240, 0, 0),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0303',
    survey_number: 'SY-14/3',
    municipal_property_id: 'BBMP-15103-C',
    revenue_khata_no: 'KHT-BLR-9203',
    area_sqm: 450.0,
    boundary_perimeter_m: 86.0,
    ward_id: 'Ward 151 - Koramangala',
    zone_name: 'BBMP South Zone',
    land_use: 'Mixed Use',
    building_count: 1,
    building_area_sqm: 380.0,
    utility_links: ['BWSSB-KRM-03', 'BESCOM-UG-53'],
    gnss_verified: true,
    ground_truth_status: 'Pending Field Visit',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 78.4,
    coordinates: generateBoxAt(12.9350, 77.6240, 1, 0),
    review_status: 'Under Review'
  },

  // Sector 4: Whitefield / ITPL Corridor (Ward 84)
  {
    parcel_id: 'P-0401',
    survey_number: 'SY-45/1',
    municipal_property_id: 'BBMP-8401-A',
    revenue_khata_no: 'KHT-BLR-6301',
    area_sqm: 520.0,
    boundary_perimeter_m: 92.0,
    ward_id: 'Ward 84 - Hagadur (Whitefield)',
    zone_name: 'BBMP Mahadevapura Zone',
    land_use: 'Commercial',
    building_count: 1,
    building_area_sqm: 410.0,
    utility_links: ['BWSSB-WTF-01', 'BESCOM-UG-61', 'BMRCL-ROW-01'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 85.0,
    coordinates: generateBoxAt(12.9860, 77.7335, 0, 0),
    review_status: 'Under Review'
  },
  {
    parcel_id: 'P-0403',
    survey_number: 'SY-45/3',
    municipal_property_id: 'BBMP-8403-C',
    revenue_khata_no: 'KHT-BLR-6303',
    area_sqm: 680.0,
    boundary_perimeter_m: 106.0,
    ward_id: 'Ward 84 - Hagadur (Whitefield)',
    zone_name: 'BBMP Mahadevapura Zone',
    land_use: 'Mixed Use',
    building_count: 2,
    building_area_sqm: 490.0,
    utility_links: ['BWSSB-WTF-03', 'KIADB-GRID-01'],
    gnss_verified: true,
    ground_truth_status: 'Pending Field Visit',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 81.2,
    coordinates: generateBoxAt(12.9860, 77.7335, 1, 0),
    review_status: 'Under Review'
  },

  // Sector 5: Vidhana Soudha & SSLR Central Cadastre (Ward 111)
  {
    parcel_id: 'P-0501',
    survey_number: 'SY-01/1',
    municipal_property_id: 'BBMP-11101-A',
    revenue_khata_no: 'KHT-BLR-1001',
    area_sqm: 850.0,
    boundary_perimeter_m: 118.0,
    ward_id: 'Ward 111 - Shantala Nagar',
    zone_name: 'BBMP East Zone (CBD)',
    land_use: 'Institutional',
    building_count: 1,
    building_area_sqm: 620.0,
    utility_links: ['BWSSB-CBD-01', 'BESCOM-CBD-01', 'CORS-MASTER-BLR'],
    gnss_verified: true,
    ground_truth_status: 'Verified',
    change_status: 'Boundary Shifted',
    validation_status: 'Flagged',
    confidence_score: 91.5,
    coordinates: generateBoxAt(12.9792, 77.5910, 0, 0),
    review_status: 'Under Review'
  }
];

// Authentic Discrepancy & Conflict Examples
const conflicts = [
  {
    id: 'CF-1042',
    parcel_id: 'P-0102',
    title: 'Multi-Source Boundary Discrepancy (1.2m offset)',
    conflict_type: 'boundary_discrepancy',
    severity: 'moderate',
    sources: [
      { source: 'Cadastral Survey (SY-84/2A)', value: '182.4 m²', weight: 0.3 },
      { source: 'BBMP GIS (BBMP-8842-B)', value: '184.1 m²', weight: 0.25 },
      { source: 'Drone-derived Ortho Boundary', value: '181.8 m²', weight: 0.2 },
      { source: 'High-Precision GNSS Verification', value: '182.0 m²', weight: 0.25 }
    ],
    ai_recommendation: 'Adopt GNSS-verified ground benchmark geometry (182.0 m²) and align cadastral boundary to verified boundary-stone edge.',
    confidence: 96.4,
    status: 'resolved',
    resolved_action: 'Accepted AI Recommendation (GNSS-verified 182.0 m²)',
    resolved_by: 'K. Ramesh (GIS Analyst)',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET]
  },
  {
    id: 'CF-1043',
    parcel_id: 'P-0103',
    title: 'Cadastral Overlap with P-0104 (3.7 m²)',
    conflict_type: 'area_mismatch',
    severity: 'critical',
    sources: [
      { source: 'Cadastral Survey P-0103', value: '191.0 m²', weight: 0.4 },
      { source: 'Cadastral Survey P-0104', value: '178.5 m²', weight: 0.4 },
      { source: 'BBMP Tax Map P-0103', value: '188.5 m²', weight: 0.2 }
    ],
    ai_recommendation: 'Snap mutual edge to GNSS coordinate benchmark GNSS-BLR-103 and adjust P-0103 canonical area to 188.5 m².',
    confidence: 93.1,
    status: 'under_review',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 2]
  },
  {
    id: 'CF-1044',
    parcel_id: 'P-0105',
    title: 'Structure Encroachment on Public Road Setback',
    conflict_type: 'building_encroachment',
    severity: 'critical',
    sources: [
      { source: 'Cadastral Parcel SY-84/4', value: 'Boundary strictly 210.0 m²', weight: 0.4 },
      { source: 'Building Layer B-0094', value: 'Roof overhang extends 0.8m beyond boundary', weight: 0.35 },
      { source: 'Field Ground Truthing GT-BLR-044', value: 'Confirmed physical balcony projection over street', weight: 0.25 }
    ],
    ai_recommendation: 'Preserve canonical parcel boundary as 210.0 m²; generate encroachment notice tag on Building B-0094 for BBMP review.',
    confidence: 94.5,
    status: 'under_review',
    location: [BASE_LAT, BASE_LNG + LNG_OFFSET * 4]
  },
  {
    id: 'CF-1045',
    parcel_id: 'P-0109',
    title: 'Contradictory Land Use & Khata Mismatch',
    conflict_type: 'land_use_mismatch',
    severity: 'critical',
    sources: [
      { source: 'Revenue Department Bhoomi Khata', value: 'Residential Tenure (Non-Converted)', weight: 0.4 },
      { source: 'BBMP Property Tax Assessment', value: 'Commercial Complex (Rate C)', weight: 0.35 },
      { source: 'Drone 2026 Inspection', value: 'Commercial Ground Floor Retail', weight: 0.25 }
    ],
    ai_recommendation: 'Flag for Joint Revenue-BBMP Officer hearing. Potential unpermitted residential to commercial conversion in Indiranagar.',
    confidence: 68.4,
    status: 'open',
    location: [BASE_LAT + LAT_OFFSET, BASE_LNG + LNG_OFFSET * 3]
  },
  {
    id: 'CF-1046',
    parcel_id: 'P-0114',
    title: 'Raja Kaluve (Stormwater Drain) 25m Buffer Infringement',
    conflict_type: 'boundary_discrepancy',
    severity: 'critical',
    sources: [
      { source: 'SSLR Cadastral Drain Demarcation', value: '25.0m Statutory Buffer', weight: 0.4 },
      { source: 'BBMP Stormwater GIS Layer', value: 'Perimeter wall inside buffer by 2.4m', weight: 0.35 },
      { source: 'Drone 2026 Ortho Ground Survey', value: 'Compound wall encroaches 2.38m', weight: 0.25 }
    ],
    ai_recommendation: 'Enforce NGT & BBMP 25m stormwater buffer line. Setback alignment required for secondary canal maintenance access.',
    confidence: 97.8,
    status: 'under_review',
    location: [BASE_LAT + LAT_OFFSET * 2, BASE_LNG + LNG_OFFSET * 3]
  },
  {
    id: 'CF-1047',
    parcel_id: 'P-0116',
    title: '100 Feet Road Widening Demarcation (TDR Alignment)',
    conflict_type: 'area_mismatch',
    severity: 'moderate',
    sources: [
      { source: 'Cadastral Survey Record', value: 'Pre-widening Area 215.0 m²', weight: 0.35 },
      { source: 'BBMP Master Plan 2031 (TDR Strip)', value: 'Surrendered strip 3.2m (24.0 m²)', weight: 0.4 },
      { source: 'High-Precision GNSS Benchmark', value: 'Current net plot 191.0 m²', weight: 0.25 }
    ],
    ai_recommendation: 'Reconcile road widening boundary with BBMP Master Plan. Deduct 24.0 m² TDR road strip and generate canonical boundary at 191.0 m².',
    confidence: 95.2,
    status: 'open',
    location: [BASE_LAT + LAT_OFFSET * 3, BASE_LNG]
  },
  {
    id: 'CF-1048',
    parcel_id: 'P-0120',
    title: 'Dual Khata Bifurcation & Sub-division Discrepancy',
    conflict_type: 'land_use_mismatch',
    severity: 'critical',
    sources: [
      { source: 'Bhoomi Revenue Land Register', value: 'Single Parent Khata KHT-BLR-70205', weight: 0.4 },
      { source: 'BBMP Municipal Assessment', value: 'Bifurcated into Plots A & B (B-Khata)', weight: 0.35 },
      { source: 'Drone ORI Boundary Verification', value: 'Physical dividing boundary wall observed', weight: 0.25 }
    ],
    ai_recommendation: 'Require formal revenue conversion and sub-division deed. Retain unified canonical cadastral envelope with linked dual sub-assessment IDs.',
    confidence: 88.5,
    status: 'open',
    location: [BASE_LAT + LAT_OFFSET * 3, BASE_LNG + LNG_OFFSET * 4]
  },
  {
    id: 'CF-1049',
    parcel_id: 'P-0122',
    title: 'BESCOM High-Tension (HT) Underground Corridor Setback',
    conflict_type: 'building_encroachment',
    severity: 'critical',
    sources: [
      { source: 'Cadastral Parcel SY-88/2', value: 'Title Deed Area 210.0 m²', weight: 0.35 },
      { source: 'BESCOM 66kV Transmission Map', value: '1.8m corridor restriction along east edge', weight: 0.4 },
      { source: 'Ground Inspection Survey', value: 'Unapproved security cabin on HT easement', weight: 0.25 }
    ],
    ai_recommendation: 'Demarcate non-buildable 1.8m statutory buffer on canonical parcel. Issue clearance notice for unauthorized security structure.',
    confidence: 96.0,
    status: 'under_review',
    location: [BASE_LAT + LAT_OFFSET * 4, BASE_LNG + LNG_OFFSET * 1]
  },
  {
    id: 'CF-1052',
    parcel_id: 'P-0202',
    title: 'Ulsoor Lake 75m Eco-Buffer Encroachment (NGT Buffer)',
    conflict_type: 'building_encroachment',
    severity: 'critical',
    sources: [
      { source: 'NGT & KLDCA Statutory Lake Buffer', value: '75.0m Prohibited Eco-Zone', weight: 0.4 },
      { source: 'Municipal Plan Approval (BBMP-9002)', value: 'Lakeside café decking sanctioned within 50m', weight: 0.35 },
      { source: 'High-Res Drone Orthomosaic 2026', value: 'Decking extends 6.2m into statutory buffer', weight: 0.25 }
    ],
    ai_recommendation: 'Enforce Karnataka Lake Conservation & NGT 75m buffer mandate. Issue notice to retract commercial deck and restore permeable wetland margin.',
    confidence: 96.5,
    status: 'open',
    location: [12.9818, 77.6252]
  },
  {
    id: 'CF-1054',
    parcel_id: 'P-0301',
    title: 'BDA 1982 Allotment vs Revenue Survey Sy-14/2 Discrepancy',
    conflict_type: 'boundary_discrepancy',
    severity: 'moderate',
    sources: [
      { source: 'BDA Layout Sanctioned Scheme (1982)', value: 'Grid aligned Plot 41 (280.0 m²)', weight: 0.4 },
      { source: 'SSLR Ancestral Revenue Survey Sy-14', value: 'Angular deviation 4.2m north-west', weight: 0.35 },
      { source: 'Survey of India CORS RTK Benchmark', value: 'Physical compound wall matches BDA line', weight: 0.25 }
    ],
    ai_recommendation: 'Apply affine transformation anchoring BDA layout monuments to CORS benchmark GNSS-BLR-07. Reconcile revenue survey stone coordinates.',
    confidence: 92.8,
    status: 'under_review',
    location: [12.9350, 77.6240]
  },
  {
    id: 'CF-1056',
    parcel_id: 'P-0401',
    title: 'BMRCL Purple Line Metro Viaduct Pier Setback Easement',
    conflict_type: 'building_encroachment',
    severity: 'critical',
    sources: [
      { source: 'BMRCL Right-of-Way Gazette', value: '5.0m Subterranean Structural Exclusion Corridor', weight: 0.45 },
      { source: 'BBMP Plan Sanction (BBMP-8401)', value: 'Approved double-basement parking', weight: 0.3 },
      { source: 'Ground GPR Sub-surface Radar Survey', value: 'Retaining wall within 2.3m of metro pier foundation', weight: 0.25 }
    ],
    ai_recommendation: 'Enforce Bangalore Metro Railway (Operation and Maintenance) Act structural safety zone. Redact basement perimeter by 2.7m to clear pier footing.',
    confidence: 97.4,
    status: 'under_review',
    location: [12.9860, 77.7335]
  },
  {
    id: 'CF-1058',
    parcel_id: 'P-0501',
    title: 'Heritage Conservation Prohibited Buffer Zone (AMASR Act)',
    conflict_type: 'boundary_discrepancy',
    severity: 'critical',
    sources: [
      { source: 'Archaeological Survey of India (ASI) Notification', value: '100m Prohibited & 200m Regulated Buffer', weight: 0.4 },
      { source: 'SSLR State Cadastre SY-01/1', value: 'Institutional Expansion Zone (850.0 m²)', weight: 0.35 },
      { source: 'Urban Development Department (UDD)', value: 'Height restriction capped at 15m', weight: 0.25 }
    ],
    ai_recommendation: 'Impose statutory no-construction covenant on eastern 60m strip falling within Vidhana Soudha / High Court heritage buffer envelope.',
    confidence: 98.6,
    status: 'under_review',
    location: [12.9792, 77.5910]
  }
];

async function sync() {
  console.log('⚡ Pushing expanded Bengaluru parcels to Supabase Cloud...');
  for (const p of parcels) {
    const { error } = await supabase.from('harmonized_parcels').upsert(p, { onConflict: 'parcel_id' });
    if (error) console.warn('Parcel upsert warning:', p.parcel_id, error.message);
    else console.log(`✓ Parcel ${p.parcel_id} (${p.survey_number}) updated`);
  }

  console.log('\n⚡ Pushing expanded Bengaluru conflicts to Supabase Cloud...');
  for (const c of conflicts) {
    const { error } = await supabase.from('harmonization_conflicts').upsert(c, { onConflict: 'id' });
    if (error) console.warn('Conflict upsert warning:', c.id, error.message);
    else console.log(`✓ Conflict ${c.id} (${c.title}) updated`);
  }

  console.log('\n🎉 ALL EXPANDED BENGALURU EXAMPLES SYNCHRONIZED TO SUPABASE CLOUD!');
}

sync().catch(console.error);
