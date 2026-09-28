// GeoHarmonizer AI - Data Exchange & Synchronization Service (SIH26013)
// Handles exporting harmonized datasets, validation reports, and downstream sync

import { HarmonizedParcel } from '../types/geospatial';

export interface SyncStatus {
  canonicalDatasetSynced: boolean;
  gisServerSynced: boolean;
  validationIndexUpdated: boolean;
  auditTrailSynced: boolean;
  lastSyncTimestamp: string;
}

export const syncService = {
  getInitialSyncStatus(): SyncStatus {
    return {
      canonicalDatasetSynced: true,
      gisServerSynced: true,
      validationIndexUpdated: true,
      auditTrailSynced: true,
      lastSyncTimestamp: new Date().toISOString()
    };
  },

  exportToGeoJson(parcels: HarmonizedParcel[]): string {
    const featureCollection = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:EPSG::4326' }
      },
      metadata: {
        generator: 'GeoHarmonizer AI v2.4 (SIH26013 Prototype)',
        harmonizedAt: new Date().toISOString(),
        totalParcels: parcels.length,
        authority: 'Bengaluru Urban Land Harmonization Demo (BBMP & SSLR)'
      },
      features: parcels.map(p => ({
        type: 'Feature',
        id: p.parcel_id,
        properties: {
          parcel_id: p.parcel_id,
          survey_number: p.survey_number,
          municipal_property_id: p.municipal_property_id,
          revenue_khata_no: p.revenue_khata_no,
          area_sqm: p.area_sqm,
          boundary_perimeter_m: p.boundary_perimeter_m,
          ward_id: p.ward_id,
          zone_name: p.zone_name,
          land_use: p.land_use,
          building_count: p.building_count,
          building_area_sqm: p.building_area_sqm,
          gnss_verified: p.gnss_verified,
          ground_truth_status: p.ground_truth_status,
          confidence_score: p.confidence_score,
          review_status: p.review_status
        },
        geometry: {
          type: 'Polygon',
          coordinates: [p.coordinates.map(([lat, lng]) => [lng, lat])]
        }
      }))
    };

    return JSON.stringify(featureCollection, null, 2);
  },

  exportToCsv(parcels: HarmonizedParcel[]): string {
    const headers = [
      'parcel_id',
      'survey_number',
      'municipal_property_id',
      'revenue_khata_no',
      'area_sqm',
      'perimeter_m',
      'ward_id',
      'zone_name',
      'land_use',
      'building_count',
      'building_area_sqm',
      'confidence_score',
      'review_status'
    ];

    const rows = parcels.map(p => [
      `"${p.parcel_id}"`,
      `"${p.survey_number}"`,
      `"${p.municipal_property_id}"`,
      `"${p.revenue_khata_no}"`,
      p.area_sqm,
      p.boundary_perimeter_m,
      `"${p.ward_id}"`,
      `"${p.zone_name}"`,
      `"${p.land_use}"`,
      p.building_count,
      p.building_area_sqm,
      p.confidence_score,
      `"${p.review_status}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  triggerDownload(filename: string, content: string, mimeType: string = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
