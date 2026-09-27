// GeoRecon AI - Supabase Cloud Client Integration (SIH26013)

import { createClient } from '@supabase/supabase-js';
import { Dataset, HarmonizedParcel, HarmonizationConflict } from '../types/geospatial';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database helper functions for live sync with Supabase Cloud
export const supabaseDb = {
  async checkConnection(): Promise<{ connected: boolean; tablesCreated: boolean; message: string }> {
    if (!supabase) {
      return { connected: false, tablesCreated: false, message: 'Supabase credentials not configured' };
    }
    try {
      const { data, error } = await supabase.from('datasets').select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.message?.includes('schema cache')) {
          return { connected: true, tablesCreated: false, message: 'Connected to Supabase Cloud, but SQL migration not yet executed' };
        }
        return { connected: true, tablesCreated: false, message: error.message };
      }
      return { connected: true, tablesCreated: true, message: 'Connected & synchronized with Supabase Cloud PostgreSQL' };
    } catch (err: any) {
      return { connected: false, tablesCreated: false, message: err.message || 'Network error' };
    }
  },

  async fetchParcels(): Promise<HarmonizedParcel[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('harmonized_parcels')
      .select('*')
      .order('parcel_id', { ascending: true });
    if (error) {
      console.warn('[Supabase] fetchParcels error:', error.message);
      return null;
    }
    return data as unknown as HarmonizedParcel[];
  },

  async fetchDatasets(): Promise<Dataset[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('upload_date', { ascending: false });
    if (error) {
      console.warn('[Supabase] fetchDatasets error:', error.message);
      return null;
    }
    // Map snake_case DB columns to camelCase TS interface if needed
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      department: d.department,
      format: d.format,
      crs: d.crs,
      crsName: d.crs_name || d.crsName,
      featureCount: d.feature_count ?? d.featureCount ?? 0,
      uploadDate: d.upload_date ?? d.uploadDate ?? new Date().toISOString().split('T')[0],
      fileSize: d.file_size ?? d.fileSize ?? '1.0 MB',
      status: d.status,
      validationStatus: d.validation_status ?? d.validationStatus ?? 'valid',
      issuesCount: d.issues_count ?? d.issuesCount ?? 0,
      geometryType: d.geometry_type ?? d.geometryType ?? 'Polygon',
      bbox: d.bbox,
      attributes: d.attributes || [],
      description: d.description || '',
      sourceTrustScore: d.source_trust_score ?? d.sourceTrustScore ?? 90
    })) as Dataset[];
  },

  async fetchConflicts(): Promise<HarmonizationConflict[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('harmonization_conflicts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('[Supabase] fetchConflicts error:', error.message);
      return null;
    }
    return data as unknown as HarmonizationConflict[];
  },

  async updateConflictStatus(conflictId: string, status: string, resolvedAction?: string, resolvedBy?: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('harmonization_conflicts')
      .update({
        status,
        resolved_action: resolvedAction,
        resolved_by: resolvedBy,
        resolved_at: new Date().toISOString()
      })
      .eq('id', conflictId);
    return { data, error };
  },

  async insertAuditLog(log: {
    id: string;
    timestamp: string;
    user_role: string;
    user_name: string;
    action: string;
    target_object: string;
    previous_value?: string;
    new_value?: string;
    status: string;
    notes?: string;
  }) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([log]);
    return { data, error };
  }
};

