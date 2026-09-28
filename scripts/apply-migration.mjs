#!/usr/bin/env node
// ==============================================================================
// GeoHarmonizer AI: Multi-Source Geospatial Harmonization (SIH26013)
// Supabase Cloud PostgreSQL Migration Runner
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const migrationPath = path.join(projectRoot, 'supabase', 'migrations', '001_initial_schema.sql');

console.log('\n' + '='.repeat(70));
console.log('  GEOHARMONIZER AI — SUPABASE CLOUD MIGRATION RUNNER (SIH26013)');
console.log('='.repeat(70));

// Determine database connection string
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  const projectRef = process.env.SUPABASE_PROJECT_REF || (process.env.VITE_SUPABASE_URL ? new URL(process.env.VITE_SUPABASE_URL).hostname.split('.')[0] : null);
  const password = process.env.SUPABASE_DB_PASSWORD;

  if (projectRef && password) {
    // Construct default pooler connection string for Supabase
    connectionString = `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;
    console.log(`[INFO] Derived connection string from project ref: ${projectRef}`);
  }
}

if (!connectionString) {
  console.error('\n❌ ERROR: Missing PostgreSQL Connection Configuration!');
  console.error('\nTo run this migration against your Supabase Cloud PostgreSQL database,');
  console.error('please set one of the following in your .env file:\n');
  console.error('  1. DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"');
  console.error('     (Found in Supabase Dashboard -> Project Settings -> Database -> Connection string -> URI)\n');
  console.error('  2. OR set:');
  console.error('     VITE_SUPABASE_URL="https://[ref].supabase.co"');
  console.error('     SUPABASE_DB_PASSWORD="your-db-password"\n');
  console.error('Refer to .env.example for template.\n');
  process.exit(1);
}

// Verify migration file exists
if (!fs.existsSync(migrationPath)) {
  console.error(`\n❌ ERROR: Migration file not found at: ${migrationPath}\n`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
  console.log(`[INFO] Reading migration file: 001_initial_schema.sql (${(sqlContent.length / 1024).toFixed(1)} KB)`);
  console.log(`[INFO] Connecting to Supabase Cloud PostgreSQL...`);

  // Mask password for logging
  const maskedConn = connectionString.replace(/:([^:@]+)@/, ':****@');
  console.log(`[INFO] Target: ${maskedConn}`);

  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase Cloud connection poolers
    },
    connectionTimeoutMillis: 15000
  });

  try {
    await client.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL database.');

    console.log('[INFO] Executing schema creation, RLS policies, triggers, and seed data...');
    const startTime = Date.now();

    // Execute the full migration script
    await client.query(sqlContent);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✓ Migration executed successfully in ${duration}s!`);

    // Verify row counts across generated tables
    console.log('\n' + '-'.repeat(70));
    console.log('  VERIFYING TABLE SEED COUNTS IN SUPABASE');
    console.log('-'.repeat(70));

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
      try {
        const res = await client.query(`SELECT COUNT(*) AS count FROM ${table};`);
        const count = res.rows[0]?.count || 0;
        console.log(`  ✓ Table: ${table.padEnd(25)} Count: ${count.toString().padStart(4)} rows`);
      } catch (err) {
        console.log(`  ⚠ Table: ${table.padEnd(25)} Query failed: ${err.message}`);
      }
    }

    // Verify PostGIS extension is active
    try {
      const postgisVer = await client.query('SELECT PostGIS_Version();');
      console.log(`\n  ✓ PostGIS Extension Active: ${postgisVer.rows[0]?.postgis_version}`);
    } catch {
      console.log('\n  (PostGIS query skipped or not installed)');
    }

    console.log('\n' + '='.repeat(70));
    console.log('  🎉 SUCCESS: GeoHarmonizer AI Database is fully initialized on Supabase Cloud!');
    console.log('='.repeat(70) + '\n');
  } catch (err) {
    console.error('\n❌ MIGRATION FAILED:');
    console.error(err.message);
    if (err.position) {
      console.error(`Error position in SQL: ${err.position}`);
    }
    console.error('\nTips:');
    console.error('1. Check if the database password is correct.');
    console.error('2. Ensure your IP has access or use Supabase Connection Pooler (port 6543 / 5432).');
    console.error('3. You can also paste the contents of /supabase/migrations/001_initial_schema.sql');
    console.error('   directly into the Supabase Dashboard -> SQL Editor.\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
