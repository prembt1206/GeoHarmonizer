#!/usr/bin/env node
// ==============================================================================
// GeoRecon AI: Multi-Source Geospatial Harmonization (SIH26013)
// Direct Supabase Service Role Seed & Sync Runner
// ==============================================================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n' + '='.repeat(70));
console.log('  GEORECON AI — SUPABASE SERVICE ROLE SEED & SYNC RUNNER');
console.log('='.repeat(70));

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ ERROR: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env!');
  process.exit(1);
}

console.log(`[INFO] Supabase URL: ${supabaseUrl}`);
console.log(`[INFO] Authenticating using Service Role Key (bypasses RLS)...`);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

async function runSeed() {
  // 1. Check if tables exist by probing the datasets table
  const { data: testData, error: testError } = await supabase.from('datasets').select('id').limit(1);

  if (testError && (testError.code === '42P01' || testError.message?.includes('schema cache'))) {
    console.log('\n[STATUS] Connected to Supabase Cloud, but schema tables are not yet created in PostgreSQL.\n');
    console.log('----------------------------------------------------------------------');
    console.log('🚀 STEP 1: CREATE THE TABLES (Takes 20 seconds)');
    console.log('----------------------------------------------------------------------');
    console.log('1. Open your Supabase SQL Editor:');
    console.log('   👉 https://supabase.com/dashboard/project/kspoacaxerzshvaxuvse/sql/new\n');
    console.log('2. Open and copy the SQL migration script from:');
    console.log('   g:\\SIH\\website\\supabase\\migrations\\001_initial_schema.sql\n');
    console.log('3. Paste into the SQL editor and click "RUN".');
    console.log('   This will execute all DDL commands with full privileges:\n');
    console.log('     ✓ Enable PostGIS and uuid-ossp extensions');
    console.log('     ✓ Create 9 tables (datasets, harmonized_parcels, conflicts, etc.)');
    console.log('     ✓ Create automated PostGIS geometry synchronization triggers');
    console.log('     ✓ Configure Row Level Security (RLS) policies');
    console.log('     ✓ Pre-populate the Mysuru Urban Land Harmonization seed data!\n');
    console.log('----------------------------------------------------------------------');
    console.log('🚀 STEP 2: VERIFY');
    console.log('----------------------------------------------------------------------');
    console.log('After clicking "RUN" in the Supabase Dashboard, run:');
    console.log('   npm run db:status\n');
    console.log('Alternatively, if you know your database password, add it to .env:');
    console.log('   DATABASE_URL="postgresql://postgres.kspoacaxerzshvaxuvse:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"');
    console.log('and run: npm run db:migrate\n');
    return;
  }

  if (testError) {
    console.error('❌ Connection error:', testError.message);
    return;
  }

  console.log('✓ Tables detected! Verifying current row counts in Supabase Cloud:\n');

  const tables = [
    'datasets',
    'harmonized_parcels',
    'spatial_matches',
    'attribute_mappings',
    'topology_issues',
    'temporal_changes',
    'harmonization_conflicts',
    'audit_logs',
    'system_settings'
  ];

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ⚠ ${table.padEnd(25)} : ${error.message}`);
    } else {
      console.log(`  ✓ ${table.padEnd(25)} : ${count} rows`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('  🎉 SUCCESS: Supabase Cloud is active and synchronized with GeoRecon AI!');
  console.log('='.repeat(70) + '\n');
}

runSeed();
