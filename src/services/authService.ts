// GeoHarmonizer AI - Authentication Service (SIH26013)
// Supports Supabase Google OAuth 2.0, Departmental Single Sign-On & Hackathon Demo Access

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserRole } from '../types/geospatial';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  department: string;
  jurisdiction: string;
  clearanceLevel: string;
  provider: 'google' | 'mock-google' | 'department_sso' | 'demo';
  badgeNumber: string;
  loginTime: string;
}

export const ROLE_METADATA: Record<
  UserRole,
  {
    title: string;
    department: string;
    jurisdiction: string;
    clearance: string;
    badgePrefix: string;
    defaultName: string;
    defaultEmail: string;
  }
> = {
  gis_analyst: {
    title: 'Senior GIS Analyst',
    department: 'Department of Survey, Settlement and Land Records (SSLR)',
    jurisdiction: 'Bengaluru Urban District (Domlur / Indiranagar Sector)',
    clearance: 'Level 3 — Spatial Data Steward & Schema Profiler',
    badgePrefix: 'SSLR-KA',
    defaultName: 'Rajesh V. Rao',
    defaultEmail: 'r.rao@sslr.karnataka.gov.in'
  },
  municipal_officer: {
    title: 'Assistant Revenue Officer (ARO)',
    department: 'Bruhat Bengaluru Mahanagara Palike (BBMP)',
    jurisdiction: 'East Zone, Ward 112 (Domlur & HAL 2nd Stage)',
    clearance: 'Level 2 — Municipal Tax & Property Assessor',
    badgePrefix: 'BBMP-KA',
    defaultName: 'Dr. Priya Sundaram',
    defaultEmail: 'priya.s@bbmp.gov.in'
  },
  revenue_officer: {
    title: 'Tahsildar / Revenue Magistrate',
    department: 'Revenue Department (Bhoomi Land Records)',
    jurisdiction: 'Bengaluru East Taluk, K.R. Puram Sub-Division',
    clearance: 'Level 4 — Statutory Title & RTC Adjudication',
    badgePrefix: 'REV-BHOOMI',
    defaultName: 'Manjunath Gowda',
    defaultEmail: 'm.gowda@bhoomi.karnataka.gov.in'
  },
  field_surveyor: {
    title: 'CORS Geodetic Surveyor',
    department: 'Survey of India (Ministry of Science & Technology)',
    jurisdiction: 'Karnataka & Goa Geo-Spatial Directorate',
    clearance: 'Level 2 — GNSS RTK Ground Calibration & Drone Pilot',
    badgePrefix: 'SOI-CORS',
    defaultName: 'Vikramaditya Sharma',
    defaultEmail: 'v.sharma@surveyofindia.gov.in'
  },
  reviewer: {
    title: 'Statutory Appellate Authority',
    department: 'Urban Land Dispute Redressal Tribunal',
    jurisdiction: 'State Urban Cadastral Harmonization Panel',
    clearance: 'Level 5 — High-Court Land Registry Appeals Master',
    badgePrefix: 'TRIBUNAL-KA',
    defaultName: 'Justice H. N. Kulkarni',
    defaultEmail: 'hn.kulkarni@judiciary.gov.in'
  },
  admin: {
    title: 'National GeoPortal Administrator',
    department: 'Ministry of Housing and Urban Affairs (MoHUA)',
    jurisdiction: 'Pan-India SIH26013 Prototype Infrastructure',
    clearance: 'Level 5+ — Super Administrator & System Architect',
    badgePrefix: 'MOHUA-SYS',
    defaultName: 'Antigravity Super Admin',
    defaultEmail: 'admin@geoharmonizer.gov.in'
  }
};

const STORAGE_KEY = 'geoharmonizer_auth_user';

export const authService = {
  // Retrieve saved local user session
  getLocalUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  },

  // Save user session locally
  saveLocalUser(user: AuthUser | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  // Initialize and listen to Supabase Auth State
  async initSupabaseSession(): Promise<AuthUser | null> {
    if (!supabase || !isSupabaseConfigured) {
      return this.getLocalUser();
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[AuthService] getSession error:', error.message);
        return this.getLocalUser();
      }

      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        const email = u.email || 'user@gmail.com';
        const name = meta.full_name || meta.name || email.split('@')[0];
        const avatarUrl = meta.avatar_url || meta.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;

        const authUser: AuthUser = {
          id: u.id,
          email,
          name,
          avatarUrl,
          role: (meta.role as UserRole) || 'gis_analyst',
          department: meta.department || ROLE_METADATA.gis_analyst.department,
          jurisdiction: meta.jurisdiction || ROLE_METADATA.gis_analyst.jurisdiction,
          clearanceLevel: ROLE_METADATA.gis_analyst.clearance,
          provider: 'google',
          badgeNumber: `GOOGLE-OAUTH-${u.id.slice(0, 6).toUpperCase()}`,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.saveLocalUser(authUser);
        return authUser;
      }
    } catch (err) {
      console.warn('[AuthService] Session check failed:', err);
    }

    return this.getLocalUser();
  },

  // Sign in using Supabase Google OAuth
  async signInWithGoogle(): Promise<{ error?: string }> {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Supabase credentials are not configured in .env' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (err: any) {
      return { error: err.message || 'Failed to initiate Google OAuth' };
    }
  },

  // Sign in with Simulated / Mock Google Account (Guarantees testing works even if Google OAuth client ID is pending in Supabase Dashboard)
  signInWithGoogleMock(email?: string, name?: string, role: UserRole = 'gis_analyst'): AuthUser {
    const finalEmail = email || 'surveyor.geoharmonizer@gmail.com';
    const finalName = name || 'Er. Aarav V. Nambiar';
    const roleMeta = ROLE_METADATA[role];

    const user: AuthUser = {
      id: `google-${Date.now()}`,
      email: finalEmail,
      name: finalName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalEmail)}&backgroundColor=0284c7`,
      role,
      department: roleMeta.department,
      jurisdiction: roleMeta.jurisdiction,
      clearanceLevel: roleMeta.clearance,
      provider: 'mock-google',
      badgeNumber: `GGL-VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.saveLocalUser(user);
    return user;
  },

  // Sign in as Official Department Officer (Instant Hackathon Reviewer Access)
  signInWithDepartmentRole(role: UserRole, officerName?: string): AuthUser {
    const roleMeta = ROLE_METADATA[role];
    const name = officerName || roleMeta.defaultName;
    const email = roleMeta.defaultEmail;

    const user: AuthUser = {
      id: `dept-${role}-${Date.now()}`,
      email,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}&colors=sky,indigo,emerald`,
      role,
      department: roleMeta.department,
      jurisdiction: roleMeta.jurisdiction,
      clearanceLevel: roleMeta.clearance,
      provider: 'department_sso',
      badgeNumber: `${roleMeta.badgePrefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.saveLocalUser(user);
    return user;
  },

  // Sign out
  async signOut(): Promise<void> {
    this.saveLocalUser(null);
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[AuthService] Supabase signOut error:', err);
      }
    }
  }
};
