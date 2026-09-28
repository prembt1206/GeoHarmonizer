// GeoHarmonizer AI - Temporal Change Detection Service (SIH26013)
// Compares baseline year (2025) vs current survey (2026) to detect real-world physical changes

import { TemporalChange } from '../types/geospatial';

export interface ChangeDetectionStats {
  totalChangesDetected: number;
  newBuildingsCount: number;
  demolitionsCount: number;
  boundaryShiftsCount: number;
  landUseChangesCount: number;
  unconfirmedCount: number;
  confirmedCount: number;
}

export const changeDetectionService = {
  calculateStats(changes: TemporalChange[]): ChangeDetectionStats {
    return {
      totalChangesDetected: changes.length,
      newBuildingsCount: changes.filter(c => c.changeType === 'new_building').length,
      demolitionsCount: changes.filter(c => c.changeType === 'demolished_building').length,
      boundaryShiftsCount: changes.filter(c => c.changeType === 'boundary_shift').length,
      landUseChangesCount: changes.filter(c => c.changeType === 'land_use_change').length,
      unconfirmedCount: changes.filter(c => c.status === 'pending').length,
      confirmedCount: changes.filter(c => c.status === 'confirmed').length
    };
  },

  updateChangeStatus(change: TemporalChange, newStatus: 'confirmed' | 'rejected'): TemporalChange {
    return {
      ...change,
      status: newStatus
    };
  }
};
