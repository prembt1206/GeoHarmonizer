# GeoRecon AI: Multi-Source Geospatial Harmonization for Urban Land Records

> **Smart India Hackathon 2026 Prototype — Problem Statement SIH26013**  
> *"Automated Integration and Intelligent Harmonization of Multi-source Geospatial Data for Urban Land Record Management."*

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.3-336791?style=flat&logo=postgresql&logoColor=white)](https://postgis.net/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud%20PostgreSQL-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-4285F4?style=flat&logo=google&logoColor=white)](https://aistudio.google.com/)

---

## 🌟 Executive Overview

Urban land records in India suffer from severe institutional fragmentation. A single physical land parcel is often represented discordantly across multiple government departments:
1. **SSLR (Revenue / Survey Dept):** Historical cadastral survey sketches & Bhoomi RTC attributes.
2. **Municipal Corporation (MCC):** Property Tax GIS, building permits, and civic utility links.
3. **Survey of India / Drone Orthomosaic:** High-resolution sub-decimeter aerial drone photography.
4. **CORS Network:** Millimeter-precision GNSS ground control benchmarks.

**GeoRecon AI** delivers an end-to-end automated 10-stage reconciliation engine that eliminates boundary discrepancies, heals topological slivers, resolves ownership/tax conflicts, and publishes an authoritative **Canonical Harmonized Land Parcel Layer** backed by explainable 5-factor confidence scoring.

---

## 🚀 Key Architectural Modules

### 1. 🔄 10-Stage Automated Harmonization Pipeline
- **Multi-Source Ingestion:** Ingests Shapefiles, GeoJSON, CAD DXF, Drone GeoTIFF, and Tabular CSV.
- **Data Profiling & Schema Healing:** Auto-detects CRS headers, coordinate nulls, and geometry validity.
- **CRS Transformation:** Converts heterogeneous datums into a unified metric CRS (`EPSG:32643 - WGS 84 / UTM Zone 43N`).
- **AI Spatial Matching:** Polygon Intersection over Union (IoU $\ge 80\%$), Hausdorff boundary distance, and centroid offset.
- **Attribute Reconciler:** Resolves cross-departmental nomenclature (Survey No. $\leftrightarrow$ Property ID $\leftrightarrow$ Khata No.).
- **Topology Healing:** Automated PostGIS `ST_SnapToGrid` vertex absorption for sliver gaps and overlaps.
- **Temporal Change Detection:** Compares historical cadastral baselines with current drone orthomosaics.
- **Evidence-Weighted Conflict Resolution:** Weighting algorithm incorporating GNSS CORS ground truth.
- **5-Factor Explainable Confidence Engine:** Transparent score out of 100 with radar chart decomposition.
- **Canonical Master Sync:** Generates locked spatial boundaries and syncs with downstream municipal systems.

### 2. 🛰️ Real Geographic GIS Maps
- **High-Resolution Satellite Imagery:** Powered by Esri World Imagery.
- **Satellite Hybrid Basemap:** Aerial photography with municipal road and boundary overlays.
- **OpenStreetMap Standard:** Street-level GIS with local Indian landmarks.
- **Real-Time Coordinates Strip:** Cursor lat/long and projected UTM Zone 43N metric coordinates ($X, Y$ in meters).
- **Metric Scale Bar & Fullscreen Mode.**

### 3. 🤖 GeoRecon Copilot (Gemini 3.8 Flash AI)
- Conversational geospatial intelligence with live application context awareness.
- Capable of explaining boundary conflicts, IoU formulas, and PostGIS snapping routines.
- Includes **Interactive Action Chips**: AI can navigate the app and inspect specific parcels on command.
- Integrated voice input (Web Speech API).

### 4. 🗄️ Enterprise Supabase PostgreSQL + PostGIS Backend
- Automated DDL schema migration (`supabase/migrations/001_initial_schema.sql`).
- 9 relational tables with geometry columns (`geom` WGS 84 and `geom_utm` UTM 43N metric).
- Real-time synchronization triggers for automatic coordinate reprojection.
- Row-Level Security (RLS) policies for officers, analysts, and public citizens.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite 8 |
| **Styling** | Tailwind CSS + Lucide Icons + Glassmorphism |
| **Mapping Engine** | Leaflet 1.9 + Esri World Imagery + OpenStreetMap |
| **AI LLM Engine** | Google Gemini 3.8 Flash API |
| **Database** | PostgreSQL 15 + PostGIS 3.3 (Supabase Cloud) |
| **Data Synchronization** | Supabase JS Client + Direct Postgres Driver (`pg`) |

---

## ⚡ Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/prembt1206/GeoHarmonizer.git
cd GeoHarmonizer
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase PostgreSQL Cloud
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 3. Initialize Database Tables
Execute the SQL migration located in `supabase/migrations/001_initial_schema.sql` directly inside your **Supabase Dashboard SQL Editor**, or run:
```bash
npm run db:status
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 🎯 Target Testbed: Mysuru Urban Sector

The demonstration environment is pre-loaded with **25 synthetic urban land parcels** in **Mysuru, Karnataka (Kuvempunagar / Vijayanagar Sector)**:
- **Spatial Reference System:** `EPSG:32643` (WGS 84 / UTM Zone 43N)
- **Deliberate Test Cases:** Encroachment setbacks, boundary slivers (<0.05m), dual municipal claims, and unregistered building additions.
- **Average Pipeline Confidence:** 94.6%

---

## 📜 License & Acknowledgements

Developed for **Smart India Hackathon 2026** (Ministry of Housing and Urban Affairs / Survey of India).
