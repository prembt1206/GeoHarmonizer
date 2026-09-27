-- ==============================================================================
-- GeoRecon AI: Multi-Source Geospatial Harmonization for Urban Land Records
-- Smart India Hackathon 2026 (SIH26013) - Supabase Cloud PostgreSQL Schema
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. DROP TABLES IF EXIST (Order respects foreign key dependencies)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS harmonization_conflicts CASCADE;
DROP TABLE IF EXISTS temporal_changes CASCADE;
DROP TABLE IF EXISTS topology_issues CASCADE;
DROP TABLE IF EXISTS attribute_mappings CASCADE;
DROP TABLE IF EXISTS spatial_matches CASCADE;
DROP TABLE IF EXISTS harmonized_parcels CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- ==============================================================================
-- 3. TABLE DEFINITIONS
-- ==============================================================================

-- Table: system_settings
CREATE TABLE system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    project_crs TEXT NOT NULL DEFAULT 'EPSG:32643',
    target_crs_name TEXT NOT NULL DEFAULT 'WGS 84 / UTM Zone 43N',
    auto_approval_threshold NUMERIC(5,2) NOT NULL DEFAULT 90.00,
    manual_review_threshold NUMERIC(5,2) NOT NULL DEFAULT 75.00,
    topology_tolerance_meters NUMERIC(6,3) NOT NULL DEFAULT 0.050,
    spatial_match_min_iou NUMERIC(5,2) NOT NULL DEFAULT 80.00,
    weights JSONB NOT NULL DEFAULT '{
        "spatialAlignment": 0.35,
        "geometrySimilarity": 0.20,
        "attributeConsistency": 0.20,
        "gnssVerification": 0.15,
        "sourceQuality": 0.10
    }'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: datasets
CREATE TABLE datasets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'drone', 'ori', 'dsm_dtm', 'cadastral', 'revenue', 
        'municipal', 'utilities', 'ground_truth', 'gnss_cors', 'building_footprints'
    )),
    department TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN (
        'GeoJSON', 'Shapefile', 'CSV / Tabular', 'GeoTIFF / Raster', 'KML'
    )),
    crs TEXT NOT NULL DEFAULT 'EPSG:4326',
    crs_name TEXT,
    feature_count INTEGER NOT NULL DEFAULT 0,
    upload_date DATE DEFAULT CURRENT_DATE,
    file_size TEXT,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready', 'profiling', 'harmonized', 'error')),
    validation_status TEXT NOT NULL DEFAULT 'valid' CHECK (validation_status IN ('valid', 'has_issues', 'unvalidated')),
    issues_count INTEGER NOT NULL DEFAULT 0,
    geometry_type TEXT NOT NULL DEFAULT 'Polygon',
    bbox JSONB NOT NULL DEFAULT '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    attributes JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT,
    source_trust_score NUMERIC(5,2) NOT NULL DEFAULT 90.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: harmonized_parcels (Master Canonical Land Register)
CREATE TABLE harmonized_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id TEXT NOT NULL UNIQUE,
    survey_number TEXT NOT NULL,
    municipal_property_id TEXT NOT NULL,
    revenue_khata_no TEXT NOT NULL,
    area_sqm NUMERIC(10,2) NOT NULL,
    boundary_perimeter_m NUMERIC(10,2) NOT NULL,
    ward_id TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    land_use TEXT NOT NULL DEFAULT 'Residential' CHECK (land_use IN (
        'Residential', 'Commercial', 'Mixed Use', 'Institutional', 'Public Utility'
    )),
    building_count INTEGER NOT NULL DEFAULT 1,
    building_area_sqm NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    utility_links TEXT[] NOT NULL DEFAULT '{}',
    gnss_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ground_truth_status TEXT NOT NULL DEFAULT 'Verified' CHECK (ground_truth_status IN (
        'Verified', 'Pending Field Visit', 'Disputed'
    )),
    change_status TEXT NOT NULL DEFAULT 'Unchanged' CHECK (change_status IN (
        'Unchanged', 'New Structure Detected', 'Boundary Shifted', 'Land Use Altered'
    )),
    validation_status TEXT NOT NULL DEFAULT 'Validated' CHECK (validation_status IN (
        'Validated', 'Pending Review', 'Flagged'
    )),
    confidence_score NUMERIC(5,2) NOT NULL DEFAULT 90.0,
    confidence_breakdown JSONB NOT NULL DEFAULT '{
        "spatial_alignment": 95,
        "geometry_similarity": 95,
        "attribute_consistency": 95,
        "gnss_verification": 95,
        "source_quality": 95
    }'::jsonb,
    source_contributions JSONB NOT NULL DEFAULT '[]'::jsonb,
    source_polygons JSONB NOT NULL DEFAULT '[]'::jsonb,
    coordinates JSONB NOT NULL, -- Outer ring [[lat, lng], ...]
    geom GEOMETRY(Polygon, 4326), -- PostGIS WGS 84 geometry
    geom_utm GEOMETRY(Polygon, 32643), -- PostGIS UTM Zone 43N metric geometry
    review_status TEXT NOT NULL DEFAULT 'Auto-Approved' CHECK (review_status IN (
        'Auto-Approved', 'Approved by Officer', 'Under Review', 'Rejected'
    )),
    reviewed_by TEXT,
    last_harmonized_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: spatial_matches
CREATE TABLE spatial_matches (
    id TEXT PRIMARY KEY,
    cadastral_id TEXT NOT NULL REFERENCES harmonized_parcels(parcel_id) ON DELETE CASCADE,
    municipal_id TEXT NOT NULL,
    building_id TEXT,
    gnss_ref_id TEXT,
    confidence NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'rejected', 'pending')),
    factors JSONB NOT NULL DEFAULT '{
        "overlap_iou": 90.0,
        "centroid_distance_m": 0.5,
        "shape_similarity": 95.0,
        "area_similarity": 95.0,
        "attribute_similarity": 90.0
    }'::jsonb,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: attribute_mappings
CREATE TABLE attribute_mappings (
    id TEXT PRIMARY KEY,
    source_dataset TEXT NOT NULL,
    source_field TEXT NOT NULL,
    canonical_field TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    sample_match TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'rejected', 'customized')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: topology_issues
CREATE TABLE topology_issues (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN (
        'overlap', 'gap', 'sliver', 'self_intersection', 'duplicate', 'encroachment'
    )),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('high', 'medium', 'low')),
    affected_parcels TEXT[] NOT NULL,
    area_sqm NUMERIC(10,2),
    length_m NUMERIC(10,2),
    location JSONB NOT NULL, -- [lat, lng]
    geom GEOMETRY(Point, 4326),
    description TEXT NOT NULL,
    suggested_correction TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'corrected', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: temporal_changes
CREATE TABLE temporal_changes (
    id TEXT PRIMARY KEY,
    parcel_id TEXT NOT NULL REFERENCES harmonized_parcels(parcel_id) ON DELETE CASCADE,
    change_type TEXT NOT NULL CHECK (change_type IN (
        'new_building', 'demolished_building', 'boundary_shift', 'land_use_change', 'utility_encroachment'
    )),
    baseline_year INTEGER NOT NULL DEFAULT 2025,
    current_year INTEGER NOT NULL DEFAULT 2026,
    confidence NUMERIC(5,2) NOT NULL,
    area_diff_sqm NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    coordinates JSONB NOT NULL,
    geom GEOMETRY(Point, 4326),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: harmonization_conflicts
CREATE TABLE harmonization_conflicts (
    id TEXT PRIMARY KEY,
    parcel_id TEXT NOT NULL REFERENCES harmonized_parcels(parcel_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    conflict_type TEXT NOT NULL CHECK (conflict_type IN (
        'boundary_discrepancy', 'area_mismatch', 'land_use_mismatch', 
        'ownership_mismatch', 'building_encroachment', 'duplicate_record', 'missing_data'
    )),
    severity TEXT NOT NULL DEFAULT 'moderate' CHECK (severity IN ('critical', 'moderate', 'minor')),
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_recommendation TEXT NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved')),
    resolved_action TEXT,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    location JSONB NOT NULL,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: audit_logs (Immutable Statutory Audit Trail)
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_role TEXT NOT NULL CHECK (user_role IN (
        'admin', 'gis_analyst', 'revenue_officer', 'municipal_officer', 'field_surveyor', 'reviewer'
    )),
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    target_object TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    status TEXT NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Warning', 'Manual Override')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. SPATIAL & PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_parcels_geom ON harmonized_parcels USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_parcels_geom_utm ON harmonized_parcels USING GIST(geom_utm);
CREATE INDEX IF NOT EXISTS idx_parcels_parcel_id ON harmonized_parcels (parcel_id);
CREATE INDEX IF NOT EXISTS idx_parcels_survey_no ON harmonized_parcels (survey_number);
CREATE INDEX IF NOT EXISTS idx_parcels_mun_pid ON harmonized_parcels (municipal_property_id);
CREATE INDEX IF NOT EXISTS idx_parcels_confidence ON harmonized_parcels (confidence_score);
CREATE INDEX IF NOT EXISTS idx_parcels_review_status ON harmonized_parcels (review_status);
CREATE INDEX IF NOT EXISTS idx_parcels_land_use ON harmonized_parcels (land_use);

CREATE INDEX IF NOT EXISTS idx_datasets_category ON datasets (category);
CREATE INDEX IF NOT EXISTS idx_conflicts_status ON harmonization_conflicts (status);
CREATE INDEX IF NOT EXISTS idx_conflicts_geom ON harmonization_conflicts USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_topology_status ON topology_issues (status);
CREATE INDEX IF NOT EXISTS idx_topology_geom ON topology_issues USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_changes_status ON temporal_changes (status);
CREATE INDEX IF NOT EXISTS idx_changes_geom ON temporal_changes USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs (timestamp DESC);

-- ==============================================================================
-- 5. AUTOMATED POSTGIS GEOMETRY SYNCHRONIZATION FUNCTION & TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION sync_parcel_postgis_geometries()
RETURNS TRIGGER AS $$
DECLARE
    pt_array text[];
    wkt text;
    i integer;
    num_pts integer;
    lat float8;
    lng float8;
BEGIN
    -- Only parse if coordinates JSONB is populated
    IF NEW.coordinates IS NOT NULL AND jsonb_array_length(NEW.coordinates) >= 3 THEN
        num_pts := jsonb_array_length(NEW.coordinates);
        pt_array := ARRAY[]::text[];
        
        FOR i IN 0..(num_pts - 1) LOOP
            lat := (NEW.coordinates->i->0)::text::float8;
            lng := (NEW.coordinates->i->1)::text::float8;
            -- WKT requires Longitude (X) followed by Latitude (Y)
            pt_array := array_append(pt_array, lng || ' ' || lat);
        END LOOP;
        
        -- Close polygon if first and last vertex don't match exactly
        IF (NEW.coordinates->0) != (NEW.coordinates->(num_pts - 1)) THEN
            lat := (NEW.coordinates->0->0)::text::float8;
            lng := (NEW.coordinates->0->1)::text::float8;
            pt_array := array_append(pt_array, lng || ' ' || lat);
        END IF;

        wkt := 'POLYGON((' || array_to_string(pt_array, ', ') || '))';
        NEW.geom := ST_SetSRID(ST_GeomFromText(wkt), 4326);
        NEW.geom_utm := ST_Transform(NEW.geom, 32643);
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_parcel_geom ON harmonized_parcels;
CREATE TRIGGER trg_sync_parcel_geom
BEFORE INSERT OR UPDATE ON harmonized_parcels
FOR EACH ROW EXECUTE FUNCTION sync_parcel_postgis_geometries();

-- Point synchronization for conflict, topology, and change tables
CREATE OR REPLACE FUNCTION sync_point_geom()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.location IS NOT NULL AND jsonb_array_length(NEW.location) = 2 THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(
            (NEW.location->1)::text::float8, -- Longitude (X)
            (NEW.location->0)::text::float8  -- Latitude (Y)
        ), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_conflict_point ON harmonization_conflicts;
CREATE TRIGGER trg_sync_conflict_point
BEFORE INSERT OR UPDATE ON harmonization_conflicts
FOR EACH ROW EXECUTE FUNCTION sync_point_geom();

DROP TRIGGER IF EXISTS trg_sync_topology_point ON topology_issues;
CREATE TRIGGER trg_sync_topology_point
BEFORE INSERT OR UPDATE ON topology_issues
FOR EACH ROW EXECUTE FUNCTION sync_point_geom();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE harmonized_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE spatial_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE topology_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE temporal_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE harmonization_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 Policy: Allow Service Role full access (Bypasses or allows all operations)
CREATE POLICY "service_role_all_system_settings" ON system_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_datasets" ON datasets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_harmonized_parcels" ON harmonized_parcels FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_spatial_matches" ON spatial_matches FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_attribute_mappings" ON attribute_mappings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_topology_issues" ON topology_issues FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_temporal_changes" ON temporal_changes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_harmonization_conflicts" ON harmonization_conflicts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_audit_logs" ON audit_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 6.2 Policy: Allow Public Read Access (Anon and Authenticated for demo dashboard & inspection)
CREATE POLICY "public_read_system_settings" ON system_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_datasets" ON datasets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_harmonized_parcels" ON harmonized_parcels FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_spatial_matches" ON spatial_matches FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_attribute_mappings" ON attribute_mappings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_topology_issues" ON topology_issues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_temporal_changes" ON temporal_changes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_harmonization_conflicts" ON harmonization_conflicts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_audit_logs" ON audit_logs FOR SELECT TO anon, authenticated USING (true);

-- 6.3 Policy: Allow Authenticated Users with Municipal/Revenue Roles to insert and update records
CREATE POLICY "auth_update_harmonized_parcels" ON harmonized_parcels FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_insert_harmonized_parcels" ON harmonized_parcels FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_conflicts" ON harmonization_conflicts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_insert_conflicts" ON harmonization_conflicts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_topology" ON topology_issues FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_insert_topology" ON topology_issues FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_changes" ON temporal_changes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_insert_changes" ON temporal_changes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_insert_audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "auth_update_datasets" ON datasets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_update_settings" ON system_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. SEED DATA: BENGALURU URBAN LAND HARMONIZATION DEMO (SIH26013)
-- ==============================================================================

-- 7.1 Seed: system_settings
INSERT INTO system_settings (id, project_crs, target_crs_name, auto_approval_threshold, manual_review_threshold, topology_tolerance_meters, spatial_match_min_iou)
VALUES (
    'default',
    'EPSG:32643',
    'WGS 84 / UTM Zone 43N',
    90.00,
    75.00,
    0.050,
    80.00
) ON CONFLICT (id) DO UPDATE SET
    project_crs = EXCLUDED.project_crs,
    target_crs_name = EXCLUDED.target_crs_name;

-- 7.2 Seed: 10 Multi-Source Datasets
INSERT INTO datasets (id, name, category, department, format, crs, crs_name, feature_count, upload_date, file_size, status, validation_status, issues_count, geometry_type, bbox, attributes, description, source_trust_score)
VALUES
(
    'ds-cadastral',
    'Cadastral Survey Map 2024',
    'cadastral',
    'Survey Settlement & Land Records (SSLR)',
    'GeoJSON',
    'EPSG:4326',
    'WGS 84',
    5482,
    '2026-09-20',
    '14.2 MB',
    'ready',
    'has_issues',
    17,
    'Polygon',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[
        {"name": "parcel_id", "type": "string", "nullPercentage": 0, "uniqueValues": 5482, "sampleValues": ["P-0101", "P-0102"], "canonicalMapping": "parcel_id", "mappingConfidence": 99},
        {"name": "survey_no", "type": "string", "nullPercentage": 0.1, "uniqueValues": 5310, "sampleValues": ["SY-84/1", "SY-84/2A"], "canonicalMapping": "survey_number", "mappingConfidence": 98},
        {"name": "area", "type": "float", "nullPercentage": 0, "uniqueValues": 2400, "sampleValues": [195.8, 182.4], "canonicalMapping": "area_sqm", "mappingConfidence": 97},
        {"name": "land_use", "type": "string", "nullPercentage": 1.2, "uniqueValues": 5, "sampleValues": ["Residential", "Commercial"], "canonicalMapping": "land_use", "mappingConfidence": 94},
        {"name": "ward", "type": "string", "nullPercentage": 0, "uniqueValues": 65, "sampleValues": ["Ward 14"], "canonicalMapping": "ward_id", "mappingConfidence": 95}
    ]'::jsonb,
    'Historical revenue cadastral survey boundaries with survey numbers and Tippani measurements.',
    92.0
),
(
    'ds-municipal',
    'Municipal GIS Property Tax Layer',
    'municipal',
    'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    'GeoJSON',
    'EPSG:32643',
    'WGS 84 / UTM Zone 43N',
    6120,
    '2026-09-22',
    '18.6 MB',
    'ready',
    'has_issues',
    23,
    'Polygon',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[
        {"name": "property_id", "type": "string", "nullPercentage": 0, "uniqueValues": 6120, "sampleValues": ["BBMP-8841-A", "BBMP-8842-B"], "canonicalMapping": "municipal_property_id", "mappingConfidence": 96},
        {"name": "plot_area", "type": "float", "nullPercentage": 0.4, "uniqueValues": 2850, "sampleValues": [195.2, 184.1], "canonicalMapping": "area_sqm", "mappingConfidence": 95},
        {"name": "usage_type", "type": "string", "nullPercentage": 0, "uniqueValues": 6, "sampleValues": ["A1-Res", "B2-Comm"], "canonicalMapping": "land_use", "mappingConfidence": 92},
        {"name": "ward_code", "type": "string", "nullPercentage": 0, "uniqueValues": 65, "sampleValues": ["W-14", "W-15"], "canonicalMapping": "ward_id", "mappingConfidence": 98}
    ]'::jsonb,
    'City municipal property registry, building tax assessments, and ward demarcations.',
    90.0
),
(
    'ds-revenue',
    'Bhoomi / Revenue Records Register',
    'revenue',
    'Revenue Department Karnataka',
    'CSV / Tabular',
    'EPSG:4326',
    'WGS 84 (Point Reference)',
    5200,
    '2026-09-18',
    '8.4 MB',
    'ready',
    'valid',
    4,
    'Point',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[
        {"name": "khata_number", "type": "string", "nullPercentage": 0, "uniqueValues": 5200, "sampleValues": ["KHT-BLR-70112", "KHT-BLR-70115"], "canonicalMapping": "revenue_khata_no", "mappingConfidence": 99},
        {"name": "survey_no", "type": "string", "nullPercentage": 0, "uniqueValues": 5120, "sampleValues": ["SY-84/1", "SY-84/2A"], "canonicalMapping": "survey_number", "mappingConfidence": 98},
        {"name": "owner_ref", "type": "string", "nullPercentage": 0, "uniqueValues": 4900, "sampleValues": ["OWN-BLR-001", "OWN-BLR-002"], "canonicalMapping": "owner_reference", "mappingConfidence": 91}
    ]'::jsonb,
    'Official Bhoomi land khata records, mutation logs, and tenure classifications.',
    94.0
),
(
    'ds-ori',
    'Orthorectified Drone Imagery (ORI 2026)',
    'ori',
    'Karnataka Geospatial Data Centre (KGDC)',
    'GeoTIFF / Raster',
    'EPSG:32643',
    'WGS 84 / UTM Zone 43N',
    1,
    '2026-09-25',
    '240.0 MB',
    'ready',
    'valid',
    0,
    'Raster Grid',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "band_count", "type": "number", "nullPercentage": 0, "uniqueValues": 1, "sampleValues": [4]}]'::jsonb,
    'High-resolution 5cm GSD Ortho-mosaic drone imagery flown in Q1 2026.',
    96.0
),
(
    'ds-dsm',
    'DSM / DTM Elevation Surface Grid',
    'dsm_dtm',
    'Survey of India (SoI)',
    'GeoTIFF / Raster',
    'EPSG:32643',
    'WGS 84 / UTM Zone 43N',
    1,
    '2026-09-24',
    '185.0 MB',
    'ready',
    'valid',
    0,
    'Raster Grid',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "elevation_min_m", "type": "float", "nullPercentage": 0, "uniqueValues": 1, "sampleValues": [752.4]}]'::jsonb,
    'Digital Surface & Terrain Model from LiDAR/Photogrammetry for 3D elevation profiling.',
    95.0
),
(
    'ds-buildings',
    'Building Footprints Vector Layer',
    'building_footprints',
    'Urban Development Authority (MUDA)',
    'GeoJSON',
    'EPSG:4326',
    'WGS 84',
    4210,
    '2026-09-23',
    '11.8 MB',
    'ready',
    'has_issues',
    11,
    'Polygon',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "bldg_id", "type": "string", "nullPercentage": 0, "uniqueValues": 4210, "sampleValues": ["B-0091", "B-0094"]}]'::jsonb,
    'Digitized roof footprints and setback structures with height and construction year.',
    91.0
),
(
    'ds-utilities',
    'Underground Utilities Network',
    'utilities',
    'Bangalore Water Supply & Sewerage Board (BWSSB)',
    'GeoJSON',
    'EPSG:4326',
    'WGS 84',
    890,
    '2026-09-21',
    '5.2 MB',
    'ready',
    'valid',
    2,
    'LineString',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "utility_id", "type": "string", "nullPercentage": 0, "uniqueValues": 890, "sampleValues": ["BWSSB-INDIRA-01"]}]'::jsonb,
    'Potable water pipelines, underground storm drains, and HT electric cable corridors.',
    89.0
),
(
    'ds-gnss',
    'CORS / High-Precision GNSS Benchmarks',
    'gnss_cors',
    'National Geodetic Survey Network',
    'CSV / Tabular',
    'EPSG:32643',
    'WGS 84 / UTM Zone 43N',
    340,
    '2026-09-26',
    '1.2 MB',
    'ready',
    'valid',
    0,
    'Point',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "station_id", "type": "string", "nullPercentage": 0, "uniqueValues": 340, "sampleValues": ["GNSS-BLR-101"]}]'::jsonb,
    'Sub-centimeter RTK GNSS field reference points calibrated against Survey of India CORS.',
    99.0
),
(
    'ds-groundtruth',
    'Field Ground Truthing & Inspection Logs',
    'ground_truth',
    'Revenue & Municipal Joint Taskforce',
    'GeoJSON',
    'EPSG:4326',
    'WGS 84',
    520,
    '2026-09-25',
    '3.8 MB',
    'ready',
    'valid',
    3,
    'Point',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "gt_id", "type": "string", "nullPercentage": 0, "uniqueValues": 520, "sampleValues": ["GT-BLR-044"]}]'::jsonb,
    'Geotagged site photos, boundary stone verification markers, and field remarks.',
    96.0
),
(
    'ds-drone-raw',
    'Drone Survey Mission Raw Trajectory',
    'drone',
    'Karnataka Drones & Aerospace Mission',
    'KML',
    'EPSG:4326',
    'WGS 84',
    1420,
    '2026-09-25',
    '9.4 MB',
    'ready',
    'valid',
    1,
    'LineString',
    '[77.630, 12.965, 77.655, 12.985]'::jsonb,
    '[{"name": "photo_id", "type": "string", "nullPercentage": 0, "uniqueValues": 1420, "sampleValues": ["DJI_0442"]}]'::jsonb,
    'PPK-tagged drone flight paths, camera trigger coordinates, and shutter angle telemetry.',
    93.0
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    feature_count = EXCLUDED.feature_count,
    validation_status = EXCLUDED.validation_status;

-- 7.3 Seed: Canonical Harmonized Parcels (Bengaluru Sector)
INSERT INTO harmonized_parcels (
    parcel_id, survey_number, municipal_property_id, revenue_khata_no, area_sqm, 
    boundary_perimeter_m, ward_id, zone_name, land_use, building_count, 
    building_area_sqm, utility_links, gnss_verified, ground_truth_status, 
    change_status, validation_status, confidence_score, confidence_breakdown, 
    source_contributions, source_polygons, coordinates, review_status, reviewed_by
) VALUES
(
    'P-0101',
    'SY-84/1',
    'BBMP-8841-A',
    'KHT-BLR-70112',
    195.40,
    56.20,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    110.20,
    ARRAY['BWSSB-INDIRA-01', 'BESCOM-UG-11'],
    TRUE,
    'Verified',
    'Unchanged',
    'Validated',
    98.40,
    '{"spatial_alignment": 99, "geometry_similarity": 98, "attribute_consistency": 99, "gnss_verification": 98, "source_quality": 97}'::jsonb,
    '[
        {"field": "geometry", "source": "GNSS + Cadastral", "confidence": 99, "rawValues": {"survey": "SY-84/1"}},
        {"field": "area_sqm", "source": "GNSS Post-Processed", "confidence": 98, "rawValues": {"gnss": 195.4, "municipal": 195.2}}
    ]'::jsonb,
    '[
        {"source": "Cadastral (SY-84/1)", "color": "#ef4444", "coordinates": [[12.97191, 77.64121], [12.97191, 77.64195], [12.97257, 77.64195], [12.97257, 77.64121], [12.97191, 77.64121]], "area": 195.8},
        {"source": "Municipal GIS", "color": "#3b82f6", "coordinates": [[12.97189, 77.64121], [12.97189, 77.64195], [12.97255, 77.64195], [12.97255, 77.64121], [12.97189, 77.64121]], "area": 195.2}
    ]'::jsonb,
    '[[12.97190, 77.64120], [12.97190, 77.64195], [12.97256, 77.64195], [12.97256, 77.64120], [12.97190, 77.64120]]'::jsonb,
    'Auto-Approved',
    NULL
),
(
    'P-0102',
    'SY-84/2A',
    'BBMP-8842-B',
    'KHT-BLR-70115',
    182.00,
    54.00,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    98.50,
    ARRAY['BWSSB-INDIRA-02', 'BESCOM-UG-12'],
    TRUE,
    'Verified',
    'Boundary Shifted',
    'Validated',
    95.80,
    '{"spatial_alignment": 96, "geometry_similarity": 95, "attribute_consistency": 94, "gnss_verification": 98, "source_quality": 94}'::jsonb,
    '[
        {"field": "geometry", "source": "GNSS Alignment", "confidence": 96, "rawValues": {"discrepancy_m": 1.2, "resolved": "GNSS Edge"}},
        {"field": "area_sqm", "source": "GNSS Verification (182.0 m²)", "confidence": 98, "rawValues": {"cadastral": 182.4, "municipal": 184.1, "drone": 181.8}}
    ]'::jsonb,
    '[
        {"source": "Cadastral (SY-84/2A)", "color": "#ef4444", "coordinates": [[12.97194, 77.64203], [12.97194, 77.64278], [12.97260, 77.64278], [12.97260, 77.64203], [12.97194, 77.64203]], "area": 182.4},
        {"source": "Municipal GIS (BBMP-8842)", "color": "#3b82f6", "coordinates": [[12.97187, 77.64208], [12.97187, 77.64283], [12.97253, 77.64283], [12.97253, 77.64208], [12.97187, 77.64208]], "area": 184.1}
    ]'::jsonb,
    '[[12.97190, 77.64205], [12.97190, 77.64280], [12.97256, 77.64280], [12.97256, 77.64205], [12.97190, 77.64205]]'::jsonb,
    'Approved by Officer',
    'K. Ramesh (GIS Analyst)'
),
(
    'P-0103',
    'SY-84/2B',
    'BBMP-8843-C',
    'KHT-BLR-70118',
    188.50,
    55.40,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Commercial',
    1,
    135.00,
    ARRAY['BWSSB-INDIRA-03', 'BESCOM-UG-13'],
    TRUE,
    'Verified',
    'Unchanged',
    'Pending Review',
    91.20,
    '{"spatial_alignment": 89, "geometry_similarity": 92, "attribute_consistency": 90, "gnss_verification": 95, "source_quality": 90}'::jsonb,
    '[{"field": "geometry", "source": "Pending Snap to P-0104", "confidence": 89, "rawValues": {"overlap_area_sqm": 3.7}}]'::jsonb,
    '[{"source": "Cadastral (SY-84/2B)", "color": "#ef4444", "coordinates": [[12.97190, 77.64295], [12.97190, 77.64370], [12.97256, 77.64370], [12.97256, 77.64295], [12.97190, 77.64295]], "area": 191.0}]'::jsonb,
    '[[12.97190, 77.64290], [12.97190, 77.64365], [12.97256, 77.64365], [12.97256, 77.64290], [12.97190, 77.64290]]'::jsonb,
    'Under Review',
    NULL
),
(
    'P-0104',
    'SY-84/3',
    'BBMP-8844-D',
    'KHT-BLR-70120',
    176.20,
    53.20,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    88.00,
    ARRAY['BWSSB-INDIRA-04'],
    TRUE,
    'Verified',
    'Unchanged',
    'Pending Review',
    92.00,
    '{"spatial_alignment": 90, "geometry_similarity": 93, "attribute_consistency": 92, "gnss_verification": 94, "source_quality": 91}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[[12.97190, 77.64375], [12.97190, 77.64450], [12.97256, 77.64450], [12.97256, 77.64375], [12.97190, 77.64375]]'::jsonb,
    'Under Review',
    NULL
),
(
    'P-0105',
    'SY-84/4',
    'BBMP-8845-E',
    'KHT-BLR-70125',
    210.00,
    58.50,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Mixed Use',
    1,
    162.00,
    ARRAY['BWSSB-INDIRA-05', 'BESCOM-UG-15'],
    TRUE,
    'Pending Field Visit',
    'Boundary Shifted',
    'Flagged',
    87.50,
    '{"spatial_alignment": 85, "geometry_similarity": 88, "attribute_consistency": 91, "gnss_verification": 92, "source_quality": 89}'::jsonb,
    '[{"field": "building_encroachment", "source": "Building Footprint B-0094", "confidence": 88, "rawValues": {"offset_m": 0.8}}]'::jsonb,
    '[]'::jsonb,
    '[[12.97190, 77.64460], [12.97190, 77.64535], [12.97256, 77.64535], [12.97256, 77.64460], [12.97190, 77.64460]]'::jsonb,
    'Under Review',
    NULL
),
(
    'P-0106',
    'SY-85/1',
    'BBMP-8846-F',
    'KHT-BLR-70130',
    198.00,
    56.80,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    2,
    142.20,
    ARRAY['BWSSB-INDIRA-06', 'BESCOM-UG-16'],
    TRUE,
    'Verified',
    'New Structure Detected',
    'Validated',
    93.80,
    '{"spatial_alignment": 95, "geometry_similarity": 94, "attribute_consistency": 92, "gnss_verification": 95, "source_quality": 93}'::jsonb,
    '[{"field": "change_detection", "source": "2025 vs 2026 Drone ORI", "confidence": 94, "rawValues": {"new_building_area_sqm": 46.2}}]'::jsonb,
    '[]'::jsonb,
    '[[12.97265, 77.64120], [12.97265, 77.64195], [12.97331, 77.64195], [12.97331, 77.64120], [12.97265, 77.64120]]'::jsonb,
    'Approved by Officer',
    'S. Nanjappa (Revenue Officer)'
),
(
    'P-0107',
    'SY-85/2',
    'BBMP-8847-G',
    'KHT-BLR-70135',
    185.00,
    54.60,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    92.00,
    ARRAY['BWSSB-INDIRA-07'],
    TRUE,
    'Verified',
    'Unchanged',
    'Validated',
    97.20,
    '{"spatial_alignment": 98, "geometry_similarity": 97, "attribute_consistency": 96, "gnss_verification": 98, "source_quality": 97}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[[12.97265, 77.64205], [12.97265, 77.64280], [12.97331, 77.64280], [12.97331, 77.64205], [12.97265, 77.64205]]'::jsonb,
    'Auto-Approved',
    NULL
),
(
    'P-0108',
    'SY-85/3',
    'BBMP-8848-H',
    'KHT-BLR-70140',
    172.50,
    52.80,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    85.00,
    ARRAY['BWSSB-INDIRA-08'],
    TRUE,
    'Verified',
    'Unchanged',
    'Pending Review',
    89.50,
    '{"spatial_alignment": 88, "geometry_similarity": 91, "attribute_consistency": 90, "gnss_verification": 93, "source_quality": 86}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[[12.97265, 77.64290], [12.97265, 77.64365], [12.97331, 77.64365], [12.97331, 77.64290], [12.97265, 77.64290]]'::jsonb,
    'Under Review',
    NULL
),
(
    'P-0109',
    'SY-85/4',
    'BBMP-8849-J',
    'KHT-BLR-70148',
    230.00,
    61.20,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Commercial',
    1,
    180.00,
    ARRAY['BWSSB-INDIRA-09', 'BESCOM-UG-19'],
    FALSE,
    'Disputed',
    'Land Use Altered',
    'Flagged',
    68.40,
    '{"spatial_alignment": 72, "geometry_similarity": 70, "attribute_consistency": 61, "gnss_verification": 60, "source_quality": 75}'::jsonb,
    '[{"field": "land_use", "source": "Disputed: Revenue (Res) vs Municipal (Comm)", "confidence": 61, "rawValues": {}}]'::jsonb,
    '[]'::jsonb,
    '[[12.97265, 77.64375], [12.97265, 77.64450], [12.97331, 77.64450], [12.97331, 77.64375], [12.97265, 77.64375]]'::jsonb,
    'Under Review',
    NULL
),
(
    'P-0110',
    'SY-85/5',
    'BBMP-8850-K',
    'KHT-BLR-70152',
    204.00,
    57.80,
    'Ward 112 - Domlur / Indiranagar',
    'BBMP East Zone',
    'Residential',
    1,
    105.00,
    ARRAY['BWSSB-INDIRA-10', 'BESCOM-UG-20'],
    TRUE,
    'Verified',
    'Unchanged',
    'Validated',
    96.50,
    '{"spatial_alignment": 97, "geometry_similarity": 96, "attribute_consistency": 97, "gnss_verification": 97, "source_quality": 95}'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[[12.97265, 77.64460], [12.97265, 77.64535], [12.97331, 77.64535], [12.97331, 77.64460], [12.97265, 77.64460]]'::jsonb,
    'Auto-Approved',
    NULL
) ON CONFLICT (parcel_id) DO UPDATE SET
    area_sqm = EXCLUDED.area_sqm,
    confidence_score = EXCLUDED.confidence_score,
    validation_status = EXCLUDED.validation_status,
    review_status = EXCLUDED.review_status;

-- 7.4 Seed: Spatial Matching Inference Results
INSERT INTO spatial_matches (id, cadastral_id, municipal_id, building_id, gnss_ref_id, confidence, status, factors, details)
VALUES
(
    'MATCH-001',
    'P-0101',
    'BBMP-8841-A',
    'B-0091',
    'GNSS-BLR-101',
    98.40,
    'accepted',
    '{"overlap_iou": 98.2, "centroid_distance_m": 0.4, "shape_similarity": 98.5, "area_similarity": 99.1, "attribute_similarity": 97.4}'::jsonb,
    'Near-identical boundary geometry between Cadastral and Municipal tax parcel. Verified by GNSS benchmark.'
),
(
    'MATCH-002',
    'P-0102',
    'BBMP-8842-B',
    'B-0092',
    'GNSS-BLR-102',
    95.80,
    'accepted',
    '{"overlap_iou": 96.8, "centroid_distance_m": 1.2, "shape_similarity": 94.3, "area_similarity": 98.1, "attribute_similarity": 91.4}'::jsonb,
    '1.2m centroid shift between Cadastral and Municipal dataset. Resolved using GNSS post-processed edge.'
),
(
    'MATCH-003',
    'P-0103',
    'BBMP-8843-C',
    'B-0093',
    'GNSS-BLR-103',
    91.20,
    'pending',
    '{"overlap_iou": 89.4, "centroid_distance_m": 1.9, "shape_similarity": 91.0, "area_similarity": 94.2, "attribute_similarity": 88.5}'::jsonb,
    'Polygon overlap detected on eastern edge with adjacent parcel P-0104. Topology repair required before lock.'
),
(
    'MATCH-005',
    'P-0105',
    'BBMP-8845-E',
    'B-0094',
    'GNSS-BLR-105',
    87.50,
    'pending',
    '{"overlap_iou": 86.1, "centroid_distance_m": 2.1, "shape_similarity": 87.2, "area_similarity": 89.0, "attribute_similarity": 87.0}'::jsonb,
    'Building footprint B-0094 encroaches 0.8m over the surveyed parcel perimeter into road setback.'
),
(
    'MATCH-009',
    'P-0109',
    'BBMP-8849-J',
    'B-0099',
    'GNSS-BLR-109',
    68.40,
    'pending',
    '{"overlap_iou": 74.0, "centroid_distance_m": 3.8, "shape_similarity": 71.2, "area_similarity": 75.0, "attribute_similarity": 60.5}'::jsonb,
    'Contradictory land-use classification (Revenue: Residential vs Municipal: Commercial Complex) & 15m² area delta.'
) ON CONFLICT (id) DO NOTHING;

-- 7.5 Seed: Intelligent Attribute Mappings
INSERT INTO attribute_mappings (id, source_dataset, source_field, canonical_field, confidence, sample_match, status)
VALUES
('AM-01', 'Cadastral Layer', 'parcel_id', 'parcel_id', 99.0, 'P-0102 → parcel_id', 'approved'),
('AM-02', 'Cadastral Layer', 'survey_no', 'survey_number', 98.0, 'SY-84/2A → survey_number', 'approved'),
('AM-03', 'Cadastral Layer', 'area', 'area_sqm', 97.0, '182.4 → area_sqm', 'approved'),
('AM-04', 'Cadastral Layer', 'ward', 'ward_id', 96.0, 'Ward 14 → ward_id', 'approved'),
('AM-05', 'Municipal GIS', 'property_id', 'municipal_property_id', 96.0, 'BBMP-8842-B → municipal_property_id', 'approved'),
('AM-06', 'Municipal GIS', 'plot_area', 'area_sqm', 95.0, '184.1 → area_sqm', 'approved'),
('AM-07', 'Municipal GIS', 'usage_type', 'land_use', 92.0, 'A1-Res → land_use', 'approved'),
('AM-08', 'Revenue Register', 'khata_number', 'revenue_khata_no', 99.0, 'KHT-BLR-70115 → revenue_khata_no', 'approved'),
('AM-09', 'Building Layer', 'footprint_area', 'building_area_sqm', 98.0, '98.5 → building_area_sqm', 'approved')
ON CONFLICT (id) DO NOTHING;

-- 7.6 Seed: Spatial Topology Issues
INSERT INTO topology_issues (id, type, severity, affected_parcels, area_sqm, location, description, suggested_correction, confidence, status)
VALUES
(
    'TP-0183',
    'overlap',
    'high',
    ARRAY['P-0103', 'P-0104'],
    3.70,
    '[12.97190, 77.64362]'::jsonb,
    'Cadastral boundary overlap of 3.7 m² between Parcel P-0103 and P-0104 along eastern survey line.',
    'Snap boundary to mutual GNSS benchmark GNSS-BLR-103 edge and partition overlap evenly.',
    97.20,
    'open'
),
(
    'TP-0184',
    'gap',
    'medium',
    ARRAY['P-0107', 'P-0108'],
    0.90,
    '[12.97265, 77.64285]'::jsonb,
    'Unassigned sliver gap of 0.9 m² between Parcel P-0107 and P-0108 due to municipal digitizing discrepancy.',
    'Eliminate sliver gap by snapping vertices to high-resolution drone orthophoto road curb line.',
    95.40,
    'open'
),
(
    'TP-0185',
    'encroachment',
    'high',
    ARRAY['P-0105'],
    1.40,
    '[12.97190, 77.64460]'::jsonb,
    'Building footprint B-0094 extends 0.8m over cadastral parcel boundary into municipal road easement.',
    'Retain surveyed cadastral parcel boundary and flag building footprint as an unapproved setback encroachment.',
    94.00,
    'open'
),
(
    'TP-0186',
    'duplicate',
    'low',
    ARRAY['P-0110'],
    0.00,
    '[12.97265, 77.64460]'::jsonb,
    'Two identical geometry records ingested from municipal legacy tax backup archive.',
    'Deduplicate by removing older record (Version 2023) and retaining verified 2026 record.',
    99.10,
    'corrected'
) ON CONFLICT (id) DO NOTHING;

-- 7.7 Seed: Temporal Change Detection
INSERT INTO temporal_changes (id, parcel_id, change_type, baseline_year, current_year, confidence, area_diff_sqm, coordinates, description, status)
VALUES
(
    'CH-0012',
    'P-0106',
    'new_building',
    2025,
    2026,
    93.80,
    46.20,
    '[12.97265, 77.64120]'::jsonb,
    'New two-story residential building footprint detected via 2026 Drone ORI. Plot was recorded vacant in 2025.',
    'pending'
),
(
    'CH-0013',
    'P-0109',
    'land_use_change',
    2025,
    2026,
    91.50,
    0.00,
    '[12.97265, 77.64375]'::jsonb,
    'Residential dwelling converted into commercial retail arcade (signboard, parking alterations detected).',
    'pending'
) ON CONFLICT (id) DO NOTHING;

-- 7.8 Seed: Harmonization Conflict Queue
INSERT INTO harmonization_conflicts (id, parcel_id, title, conflict_type, severity, sources, ai_recommendation, confidence, status, resolved_action, resolved_by, resolved_at, location)
VALUES
(
    'CF-1042',
    'P-0102',
    'Multi-Source Boundary Discrepancy (1.2m offset)',
    'boundary_discrepancy',
    'moderate',
    '[
        {"source": "Cadastral Survey (SY-84/2A)", "value": "182.4 m²", "weight": 0.3},
        {"source": "Municipal GIS (BBMP-8842-B)", "value": "184.1 m²", "weight": 0.25},
        {"source": "Drone-derived Ortho Boundary", "value": "181.8 m²", "weight": 0.2},
        {"source": "High-Precision GNSS Verification", "value": "182.0 m²", "weight": 0.25}
    ]'::jsonb,
    'Adopt GNSS-verified ground benchmark geometry (182.0 m²) and align cadastral boundary to verified boundary-stone edge.',
    96.40,
    'resolved',
    'Accepted AI Recommendation (GNSS-verified 182.0 m²)',
    'K. Ramesh (GIS Analyst)',
    NOW(),
    '[12.97190, 77.64205]'::jsonb
),
(
    'CF-1043',
    'P-0103',
    'Cadastral Overlap with P-0104 (3.7 m²)',
    'area_mismatch',
    'critical',
    '[
        {"source": "Cadastral Survey P-0103", "value": "191.0 m²", "weight": 0.4},
        {"source": "Cadastral Survey P-0104", "value": "178.5 m²", "weight": 0.4},
        {"source": "Municipal Tax Map P-0103", "value": "188.5 m²", "weight": 0.2}
    ]'::jsonb,
    'Snap mutual edge to GNSS coordinate benchmark GNSS-BLR-103 and adjust P-0103 canonical area to 188.5 m².',
    93.10,
    'under_review',
    NULL,
    NULL,
    NULL,
    '[12.97190, 77.64290]'::jsonb
),
(
    'CF-1044',
    'P-0105',
    'Structure Encroachment on Public Road Setback',
    'building_encroachment',
    'critical',
    '[
        {"source": "Cadastral Parcel SY-84/4", "value": "Boundary strictly 210.0 m²", "weight": 0.4},
        {"source": "Building Layer B-0094", "value": "Roof overhang extends 0.8m beyond boundary", "weight": 0.35},
        {"source": "Field Ground Truthing GT-BLR-044", "value": "Confirmed physical balcony projection over street", "weight": 0.25}
    ]'::jsonb,
    'Preserve canonical parcel boundary as 210.0 m²; generate encroachment notice tag on Building B-0094 for municipal review.',
    94.50,
    'under_review',
    NULL,
    NULL,
    NULL,
    '[12.97190, 77.64460]'::jsonb
),
(
    'CF-1045',
    'P-0109',
    'Contradictory Land Use & Khata Mismatch',
    'land_use_mismatch',
    'critical',
    '[
        {"source": "Revenue Department Khata", "value": "Residential Tenure (Non-Converted)", "weight": 0.4},
        {"source": "Municipal Property Tax Assessment", "value": "Commercial Complex (Rate C)", "weight": 0.35},
        {"source": "Drone 2026 Inspection", "value": "Commercial Ground Floor Retail", "weight": 0.25}
    ]'::jsonb,
    'Flag for Joint Revenue-Municipal Officer hearing. Potential unpermitted agricultural/residential to commercial conversion.',
    68.40,
    'open',
    NULL,
    NULL,
    NULL,
    '[12.97265, 77.64375]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 7.9 Seed: Statutory Audit Log
INSERT INTO audit_logs (id, timestamp, user_role, user_name, action, target_object, previous_value, new_value, status, notes)
VALUES
('AUD-001', '2026-09-27 10:42:15+05:30', 'gis_analyst', 'K. Ramesh', 'Dataset Ingestion & Registration', 'Cadastral Survey Map 2024 (5,482 features)', NULL, 'Registered in Data Hub', 'Success', 'Parsed GeoJSON, EPSG:4326 registered, 17 topology warnings flagged'),
('AUD-002', '2026-09-27 10:43:40+05:30', 'gis_analyst', 'K. Ramesh', 'CRS Transformation & Georeferencing', 'All Source Layers → Target EPSG:32643 (UTM 43N)', 'EPSG:4326', 'EPSG:32643', 'Success', 'Mean residual error 0.38m; maximum residual error 1.05m'),
('AUD-003', '2026-09-27 10:44:18+05:30', 'admin', 'System (AI Harmonizer)', 'Spatial Matching Batch Run', '25 Urban Parcels in Bengaluru Sector', 'Unmatched', '22 High Confidence Matches', 'Success', '22 matches high confidence (>90%), 2 medium, 1 low confidence'),
('AUD-004', '2026-09-27 10:45:12+05:30', 'admin', 'System (AI Harmonizer)', 'Auto-Approval of High Confidence Parcel', 'Parcel P-0101 (Confidence: 98.4%)', 'Unprocessed sources', 'Harmonized Canonical Record P-0101 (195.4 m²)', 'Success', 'Auto-locked to canonical table'),
('AUD-005', '2026-09-27 10:48:30+05:30', 'gis_analyst', 'K. Ramesh', 'Conflict Resolution Override', 'Conflict #CF-1042 on Parcel P-0102', 'Cadastral: 182.4 m² vs Municipal: 184.1 m²', 'Adopted GNSS-verified edge (182.0 m²)', 'Manual Override', 'Officer verified against CORS station benchmark GNSS-BLR-102')
ON CONFLICT (id) DO NOTHING;

-- Verification Query to test table initialization
SELECT 'Database schema successfully initialized' AS status,
       (SELECT COUNT(*) FROM datasets) AS datasets_count,
       (SELECT COUNT(*) FROM harmonized_parcels) AS parcels_count,
       (SELECT COUNT(*) FROM harmonization_conflicts) AS conflicts_count;
