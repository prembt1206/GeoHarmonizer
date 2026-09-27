// GeoRecon AI - Intelligent Attribute Mapping Service (SIH26013)
// Reconciles heterogeneous departmental schemas to Canonical Land Record Model

import { AttributeMappingProposal } from '../types/geospatial';

export interface CanonicalFieldDefinition {
  field: string;
  label: string;
  type: 'string' | 'number' | 'float' | 'date';
  required: boolean;
  synonyms: string[];
  description: string;
}

export const CANONICAL_SCHEMA: CanonicalFieldDefinition[] = [
  { field: 'parcel_id', label: 'Parcel Identifier', type: 'string', required: true, synonyms: ['parcel_id', 'pid', 'plot_no', 'parcel_no', 'id'], description: 'Primary unique parcel identifier' },
  { field: 'survey_number', label: 'Cadastral Survey Number', type: 'string', required: true, synonyms: ['survey_no', 'survey_num', 'sy_no', 'sy_num', 'survey'], description: 'Historical revenue land survey number' },
  { field: 'municipal_property_id', label: 'Municipal Property ID', type: 'string', required: true, synonyms: ['property_id', 'prop_id', 'mcc_id', 'gis_pid', 'assessment_no'], description: 'City municipal corporation tax property ID' },
  { field: 'revenue_khata_no', label: 'Revenue Khata Number', type: 'string', required: true, synonyms: ['khata_no', 'khata_number', 'khateno', 'bhoomi_khata'], description: 'Bhoomi official revenue khata registration' },
  { field: 'area_sqm', label: 'Harmonized Parcel Area (m²)', type: 'float', required: true, synonyms: ['area', 'plot_area', 'parcel_area', 'total_area', 'extent_sqm'], description: 'Validated horizontal area in square meters' },
  { field: 'land_use', label: 'Zoned Land Use Classification', type: 'string', required: true, synonyms: ['land_use', 'usage_type', 'zone_use', 'tenure_use', 'zoning'], description: 'Master plan urban land use category' },
  { field: 'ward_id', label: 'Administrative Ward', type: 'string', required: true, synonyms: ['ward', 'ward_code', 'ward_no', 'division'], description: 'Municipal administrative ward boundary ID' },
  { field: 'building_area_sqm', label: 'Total Building Footprint Area', type: 'float', required: false, synonyms: ['bldg_area', 'footprint_area', 'builtup_area', 'structure_area'], description: 'Combined structural roof footprint area' }
];

export const attributeMappingService = {
  // Levenshtein similarity calculation
  computeSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;

    const matrix: number[][] = [];
    for (let i = 0; i <= s1.length; i++) matrix[i] = [i];
    for (let j = 0; j <= s2.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1.0;
    return Math.max(0, 1 - matrix[s1.length][s2.length] / maxLen);
  },

  proposeMapping(sourceDatasetName: string, sourceFieldName: string): AttributeMappingProposal {
    let bestCanonical = CANONICAL_SCHEMA[0];
    let highestScore = 0;

    for (const canonical of CANONICAL_SCHEMA) {
      for (const synonym of canonical.synonyms) {
        const score = this.computeSimilarity(sourceFieldName, synonym);
        if (score > highestScore) {
          highestScore = score;
          bestCanonical = canonical;
        }
      }
    }

    const confidence = Math.min(99, Math.max(65, Math.round(highestScore * 100)));

    return {
      id: `AM-${sourceDatasetName}-${sourceFieldName}`,
      sourceDataset: sourceDatasetName,
      sourceField: sourceFieldName,
      canonicalField: bestCanonical.field,
      confidence,
      sampleMatch: `${sourceFieldName} → ${bestCanonical.field}`,
      status: confidence >= 90 ? 'approved' : 'customized'
    };
  }
};
