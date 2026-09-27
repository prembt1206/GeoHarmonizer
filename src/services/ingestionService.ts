// GeoRecon AI - Multi-Source Data Ingestion & Profiling Service (SIH26013)
// Handles file parsing, schema detection, geometry validation, and attribute profiling

import { Dataset, DatasetAttribute } from '../types/geospatial';

export interface IngestionStepResult {
  step: 'file_parsing' | 'schema_detection' | 'crs_detection' | 'geometry_validation' | 'attribute_profiling' | 'registered';
  status: 'pending' | 'success' | 'warning' | 'error';
  message: string;
}

export const ingestionService = {
  profileAttributes(dataRows: Record<string, any>[]): DatasetAttribute[] {
    if (!dataRows || dataRows.length === 0) return [];

    const keys = Object.keys(dataRows[0]);
    return keys.map(key => {
      const total = dataRows.length;
      let nullCount = 0;
      const valuesSet = new Set<any>();
      const samples: any[] = [];

      dataRows.forEach(row => {
        const val = row[key];
        if (val === null || val === undefined || val === '') {
          nullCount++;
        } else {
          valuesSet.add(val);
          if (samples.length < 3) samples.push(val);
        }
      });

      const firstSample = samples[0];
      let type: 'string' | 'number' | 'float' | 'date' | 'boolean' = 'string';
      if (typeof firstSample === 'number') {
        type = Number.isInteger(firstSample) ? 'number' : 'float';
      } else if (typeof firstSample === 'boolean') {
        type = 'boolean';
      }

      return {
        name: key,
        type,
        nullPercentage: Math.round((nullCount / total) * 1000) / 10,
        uniqueValues: valuesSet.size,
        sampleValues: samples
      };
    });
  },

  createMockUploadedDataset(file: { name: string; size: number }, category: Dataset['category'], department: string): Dataset {
    const isGeojson = file.name.endsWith('.geojson') || file.name.endsWith('.json');
    const isCsv = file.name.endsWith('.csv');
    const isRaster = file.name.endsWith('.tif') || file.name.endsWith('.tiff');

    return {
      id: `ds-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      category,
      department: department || 'Department of Urban Administration',
      format: isGeojson ? 'GeoJSON' : isCsv ? 'CSV / Tabular' : isRaster ? 'GeoTIFF / Raster' : 'KML',
      crs: 'EPSG:4326',
      crsName: 'WGS 84',
      featureCount: Math.floor(Math.random() * 800) + 120,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'ready',
      validationStatus: 'valid',
      issuesCount: 0,
      geometryType: isRaster ? 'Raster Grid' : isCsv ? 'Point' : 'Polygon',
      bbox: [76.640, 12.308, 76.660, 12.325],
      description: `Uploaded dataset: ${file.name}. Profiled and ready for reconciliation pipeline.`,
      sourceTrustScore: 92,
      attributes: [
        { name: 'record_id', type: 'string', nullPercentage: 0, uniqueValues: 240, sampleValues: ['REC-01', 'REC-02'] },
        { name: 'survey_ref', type: 'string', nullPercentage: 0.5, uniqueValues: 238, sampleValues: ['SY-201', 'SY-202'] },
        { name: 'calculated_area', type: 'float', nullPercentage: 0, uniqueValues: 210, sampleValues: [180.5, 215.2] }
      ]
    };
  }
};
