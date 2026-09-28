// GeoHarmonizer AI - Explainable Geospatial Confidence Engine (SIH26013)
// Calculates transparent, multi-factor confidence scores for harmonized records

export interface ConfidenceFactors {
  spatial_alignment: number; // 0-100
  geometry_similarity: number; // 0-100
  attribute_consistency: number; // 0-100
  gnss_verification: number; // 0-100
  source_quality: number; // 0-100
}

export interface ConfidenceWeights {
  spatialAlignment: number; // default 0.35
  geometrySimilarity: number; // default 0.20
  attributeConsistency: number; // default 0.20
  gnssVerification: number; // default 0.15
  sourceQuality: number; // default 0.10
}

export const DEFAULT_CONFIDENCE_WEIGHTS: ConfidenceWeights = {
  spatialAlignment: 0.35,
  geometrySimilarity: 0.20,
  attributeConsistency: 0.20,
  gnssVerification: 0.15,
  sourceQuality: 0.10
};

export const confidenceService = {
  calculateCompositeScore(factors: ConfidenceFactors, weights: ConfidenceWeights = DEFAULT_CONFIDENCE_WEIGHTS): number {
    const rawScore =
      factors.spatial_alignment * weights.spatialAlignment +
      factors.geometry_similarity * weights.geometrySimilarity +
      factors.attribute_consistency * weights.attributeConsistency +
      factors.gnss_verification * weights.gnssVerification +
      factors.source_quality * weights.sourceQuality;

    return Math.round(rawScore * 10) / 10;
  },

  categorizeConfidence(score: number, autoApprovalThreshold: number = 90, manualReviewThreshold: number = 75): {
    tier: 'High Confidence' | 'Review Recommended' | 'Manual Verification Required';
    color: string;
    badgeClass: string;
    description: string;
  } {
    if (score >= autoApprovalThreshold) {
      return {
        tier: 'High Confidence',
        color: '#10b981',
        badgeClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
        description: 'Multi-source geometry and attributes agree within tolerance thresholds.'
      };
    }
    if (score >= manualReviewThreshold) {
      return {
        tier: 'Review Recommended',
        color: '#f59e0b',
        badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
        description: 'Minor boundary or attribute variances detected; recommended for officer sign-off.'
      };
    }
    return {
      tier: 'Manual Verification Required',
      color: '#ef4444',
      badgeClass: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
      description: 'Significant multi-source discrepancy or missing ground verification.'
    };
  }
};
