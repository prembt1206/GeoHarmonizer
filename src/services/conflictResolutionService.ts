// GeoRecon AI - Spatial Conflict Resolution Service (SIH26013)
// Resolves boundary, area, land-use and attribute discrepancies across departments

import { HarmonizationConflict } from '../types/geospatial';

export interface ConflictStats {
  total: number;
  open: number;
  underReview: number;
  resolved: number;
  criticalSeverity: number;
  moderateSeverity: number;
}

export const conflictResolutionService = {
  calculateStats(conflicts: HarmonizationConflict[]): ConflictStats {
    return {
      total: conflicts.length,
      open: conflicts.filter(c => c.status === 'open').length,
      underReview: conflicts.filter(c => c.status === 'under_review').length,
      resolved: conflicts.filter(c => c.status === 'resolved').length,
      criticalSeverity: conflicts.filter(c => c.severity === 'critical').length,
      moderateSeverity: conflicts.filter(c => c.severity === 'moderate').length
    };
  },

  resolveConflict(
    conflict: HarmonizationConflict,
    action: string,
    resolvedBy: string
  ): HarmonizationConflict {
    return {
      ...conflict,
      status: 'resolved',
      resolvedAction: action,
      resolvedBy,
      resolvedAt: new Date().toISOString()
    };
  },

  sendToReview(conflict: HarmonizationConflict): HarmonizationConflict {
    return {
      ...conflict,
      status: 'under_review'
    };
  }
};
