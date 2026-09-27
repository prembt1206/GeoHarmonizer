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

const parcels = [
  {
    parcel_id: 'P-0101',
    survey_number: 'SY-84/1',
    municipal_property_id: 'BBMP-080-W0112-8841-A',
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
    municipal_property_id: 'BBMP-080-W0112-8842-B',
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
    municipal_property_id: 'BBMP-080-W0112-8843-C',
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
    municipal_property_id: 'BBMP-080-W0112-8844-D',
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
    municipal_property_id: 'BBMP-080-W0112-8845-E',
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
  }
];

const conflicts = [
  {
    id: 'CF-1042',
    parcel_id: 'P-0102',
    title: 'Multi-Source Boundary Discrepancy (1.2m offset)',
    conflict_type: 'boundary_discrepancy',
    severity: 'moderate',
    sources: [
      { source: 'Cadastral Survey (SY-84/2A)', value: '182.4 m²', weight: 0.3 },
      { source: 'BBMP GIS (BBMP-080-W0112-8842-B)', value: '184.1 m²', weight: 0.25 },
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
  }
];

async function sync() {
  console.log('⚡ Pushing Bengaluru parcels to Supabase Cloud...');
  for (const p of parcels) {
    const { error } = await supabase.from('harmonized_parcels').upsert(p, { onConflict: 'parcel_id' });
    if (error) console.warn('Parcel upsert warning:', p.parcel_id, error.message);
    else console.log(`✓ Parcel ${p.parcel_id} (${p.survey_number}) updated`);
  }

  console.log('⚡ Pushing Bengaluru conflicts to Supabase Cloud...');
  for (const c of conflicts) {
    const { error } = await supabase.from('harmonization_conflicts').upsert(c, { onConflict: 'id' });
    if (error) console.warn('Conflict upsert warning:', c.id, error.message);
    else console.log(`✓ Conflict ${c.id} updated`);
  }

  console.log('\n🎉 ALL BENGALURU RECORDS SYNCHRONIZED TO SUPABASE CLOUD POSTGRESQL!');
}

sync().catch(console.error);
