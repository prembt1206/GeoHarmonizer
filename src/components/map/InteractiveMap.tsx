// GeoRecon AI - Interactive Real GIS Parcel Map (SIH26013)
// Supported Real Basemaps: Esri High-Res Satellite, Hybrid, OpenStreetMap, CartoDB

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGeoRecon } from '../../context/GeoReconContext';
import {
  Layers,
  Crosshair,
  Search,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Globe,
  Satellite,
  Map as MapIcon,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  BookOpen,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { MapLegend } from './MapLegend';

export interface BengaluruLandmark {
  id: string;
  name: string;
  category: string;
  coords: [number, number];
  zoom: number;
  icon: string;
  description: string;
}

export const BENGALURU_LANDMARKS: BengaluruLandmark[] = [
  {
    id: 'indiranagar',
    name: 'Indiranagar (100ft Rd)',
    category: 'Active Testbed',
    coords: [12.9719, 77.6412],
    zoom: 17,
    icon: '📍',
    description: 'Active SIH26013 testbed with harmonized parcels & cadastral conflicts'
  },
  {
    id: 'vidhana-soudha',
    name: 'Vidhana Soudha (SSLR HQ)',
    category: 'Government HQ',
    coords: [12.9797, 77.5907],
    zoom: 17,
    icon: '🏛️',
    description: 'Karnataka State Capitol & Department of Survey Settlement and Land Records'
  },
  {
    id: 'koramangala',
    name: 'Koramangala (80ft Rd)',
    category: 'Startup Corridor',
    coords: [12.9352, 77.6245],
    zoom: 17,
    icon: '🏢',
    description: 'Dense commercial conversion corridor with rapid land use changes'
  },
  {
    id: 'mg-road',
    name: 'MG Road / CBD',
    category: 'Central Business',
    coords: [12.9756, 77.6066],
    zoom: 17,
    icon: '🛍️',
    description: 'High-value urban core with municipal property tax layers'
  },
  {
    id: 'ulsoor-lake',
    name: 'Ulsoor Lake Buffer Zone',
    category: 'Eco Buffer Zone',
    coords: [12.9830, 77.6210],
    zoom: 16,
    icon: '🌊',
    description: 'Critical wetland buffer demarcation & stormwater catchment boundaries'
  },
  {
    id: 'whitefield',
    name: 'Whitefield (ITPL)',
    category: 'Tech SEZ Corridor',
    coords: [12.9863, 77.7340],
    zoom: 16,
    icon: '💻',
    description: 'IT hub with complex revenue village conversion & sub-divisions'
  },
  {
    id: 'cubbon-park',
    name: 'Cubbon Park Green Belt',
    category: 'Heritage Zone',
    coords: [12.9763, 77.5929],
    zoom: 16,
    icon: '🌳',
    description: 'Protected urban green lung with strict no-development buffer'
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar (4th Block)',
    category: 'Planned Layout',
    coords: [12.9299, 77.5838],
    zoom: 16,
    icon: '🏘️',
    description: 'Asia’s model residential layout with rectilinear revenue survey grids'
  }
];

export interface MapCaseStudy {
  id: string;
  title: string;
  category: 'encroachment' | 'boundary' | 'khata' | 'infrastructure';
  categoryLabel: string;
  parcelId: string;
  sectorName: string;
  coords: [number, number];
  zoom: number;
  severity: 'critical' | 'moderate' | 'minor';
  shortDesc: string;
  icon: string;
}

export const MAP_CASE_STUDIES: MapCaseStudy[] = [
  {
    id: 'CF-1046',
    title: 'Raja Kaluve 25m Buffer Breach',
    category: 'encroachment',
    categoryLabel: 'Drain Buffer',
    parcelId: 'P-0114',
    sectorName: 'Indiranagar (Ward 112)',
    coords: [12.9734, 77.6437],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Compound wall encroaches 2.38m into statutory 25m stormwater drain buffer',
    icon: '🌊'
  },
  {
    id: 'CF-1052',
    title: 'Ulsoor Lake 75m Eco-Buffer Violation',
    category: 'encroachment',
    categoryLabel: 'Lake Buffer',
    parcelId: 'P-0202',
    sectorName: 'Halasuru (Ward 90)',
    coords: [12.9818, 77.6252],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Commercial lakeside café decking extends 6.2m into NGT 75m lake buffer zone',
    icon: '🦆'
  },
  {
    id: 'CF-1047',
    title: '100ft Road Widening (TDR Strip)',
    category: 'infrastructure',
    categoryLabel: 'Road Widening',
    parcelId: 'P-0116',
    sectorName: 'Indiranagar 100ft Rd',
    coords: [12.9741, 77.6412],
    zoom: 19,
    severity: 'moderate',
    shortDesc: '3.2m frontage strip surrendered for road widening under TDR scheme',
    icon: '🚗'
  },
  {
    id: 'CF-1054',
    title: 'BDA Allotment vs Revenue Survey Sy-14',
    category: 'boundary',
    categoryLabel: 'Layout Shift',
    parcelId: 'P-0301',
    sectorName: 'Koramangala 80ft Rd',
    coords: [12.9350, 77.6240],
    zoom: 19,
    severity: 'moderate',
    shortDesc: '4.2m angular offset between 1982 BDA allotment grid and ancestral survey stones',
    icon: '🏢'
  },
  {
    id: 'CF-1056',
    title: 'BMRCL Metro Viaduct Pier Easement',
    category: 'infrastructure',
    categoryLabel: 'Metro Easement',
    parcelId: 'P-0401',
    sectorName: 'Whitefield (ITPL Corridor)',
    coords: [12.9860, 77.7335],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Proposed basement within 2.3m of Purple Line metro pier foundation',
    icon: '🚇'
  },
  {
    id: 'CF-1049',
    title: 'BESCOM HT Power Line Corridor',
    category: 'infrastructure',
    categoryLabel: 'Utility Setback',
    parcelId: 'P-0122',
    sectorName: 'Indiranagar Sector',
    coords: [12.9749, 77.6420],
    zoom: 19,
    severity: 'critical',
    shortDesc: '1.8m underground 66kV transmission safety corridor restriction',
    icon: '⚡'
  },
  {
    id: 'CF-1048',
    title: 'Dual Khata Bifurcation Split',
    category: 'khata',
    categoryLabel: 'Khata Split',
    parcelId: 'P-0120',
    sectorName: 'Indiranagar Sector',
    coords: [12.9741, 77.6446],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Single Bhoomi Khata split into dual unapproved B-Khata municipal sub-units',
    icon: '📜'
  },
  {
    id: 'CF-1055',
    title: 'Agricultural Bhoomi vs Tech Hub (B-Khata)',
    category: 'khata',
    categoryLabel: 'Tenure Discrepancy',
    parcelId: 'P-0303',
    sectorName: 'Koramangala Sector',
    coords: [12.9358, 77.6240],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Dry agricultural revenue tenure vs 4-storey commercial startup complex',
    icon: '💼'
  },
  {
    id: 'CF-1058',
    title: 'Vidhana Soudha Heritage Prohibited Zone',
    category: 'infrastructure',
    categoryLabel: 'Heritage Buffer',
    parcelId: 'P-0501',
    sectorName: 'Vidhana Soudha (CBD)',
    coords: [12.9792, 77.5910],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'AMASR Act 100m strict prohibited conservation envelope near State Capitol',
    icon: '🏛️'
  },
  {
    id: 'CF-1043',
    title: 'Cadastral Sliver Overlap (3.7 m²)',
    category: 'boundary',
    categoryLabel: 'Survey Sliver',
    parcelId: 'P-0103',
    sectorName: 'Indiranagar Sector',
    coords: [12.9719, 77.6429],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Adjoining revenue survey edges overlap by 3.7 m² due to manual chain errors',
    icon: '📐'
  },
  {
    id: 'CF-1044',
    title: 'Road Setback Balcony Projection',
    category: 'encroachment',
    categoryLabel: 'Road Encroachment',
    parcelId: 'P-0105',
    sectorName: 'Indiranagar Sector',
    coords: [12.9719, 77.6446],
    zoom: 19,
    severity: 'critical',
    shortDesc: 'Upper floor cantilever balcony extends 0.8m over public right-of-way',
    icon: '🏗️'
  },
  {
    id: 'CF-1057',
    title: 'KIADB Industrial vs Gramatana Enclave',
    category: 'boundary',
    categoryLabel: 'Gazette Overlap',
    parcelId: 'P-0403',
    sectorName: 'Whitefield Corridor',
    coords: [12.9868, 77.7335],
    zoom: 19,
    severity: 'moderate',
    shortDesc: 'Industrial development boundary overlaps ancestral village habitation deed',
    icon: '🏭'
  }
];


// Basemap definitions
export type BasemapType = 'hybrid' | 'satellite' | 'osm' | 'voyager' | 'dark' | 'light';

interface BasemapConfig {
  id: BasemapType;
  name: string;
  icon: string;
  layers: { url: string; options: L.TileLayerOptions }[];
}

const BASEMAPS: Record<BasemapType, BasemapConfig> = {
  hybrid: {
    id: 'hybrid',
    name: 'Satellite Hybrid',
    icon: '🏙️',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 20, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics' }
      },
      {
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 20, attribution: 'Esri Boundaries' }
      }
    ]
  },
  satellite: {
    id: 'satellite',
    name: 'Real Satellite',
    icon: '🛰️',
    layers: [
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: { maxZoom: 20, attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics' }
      }
    ]
  },
  osm: {
    id: 'osm',
    name: 'Street Map (OSM)',
    icon: '🗺️',
    layers: [
      {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
      }
    ]
  },
  voyager: {
    id: 'voyager',
    name: 'Carto Voyager',
    icon: '🧭',
    layers: [
      {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        options: { maxZoom: 20, maxNativeZoom: 19, subdomains: 'abcd', attribution: '&copy; CARTO' }
      }
    ]
  },
  dark: {
    id: 'dark',
    name: 'GIS Dark',
    icon: '🌙',
    layers: [
      {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        options: {
          maxZoom: 20,
          maxNativeZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
      }
    ]
  },
  light: {
    id: 'light',
    name: 'Positron Light',
    icon: '☀️',
    layers: [
      {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        options: { maxZoom: 20, maxNativeZoom: 19, subdomains: 'abcd', attribution: '&copy; CARTO' }
      }
    ]
  }
};

interface InteractiveMapProps {
  height?: string;
  showLayerToggles?: boolean;
  activeConflictLocation?: [number, number];
  highlightParcelId?: string | null;
  onParcelSelect?: (parcelId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  height = '540px',
  showLayerToggles = true,
  activeConflictLocation,
  highlightParcelId,
  onParcelSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const activeTileLayersRef = useRef<L.TileLayer[]>([]);
  const polygonLayersRef = useRef<{ [id: string]: L.Polygon }>({});
  const markerLayersRef = useRef<L.LayerGroup | null>(null);

  const {
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    conflicts,
    topologyIssues
  } = useGeoRecon();

  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('hybrid');
  const [colorMode, setColorMode] = useState<'confidence' | 'land_use' | 'status'>('confidence');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number; utmX: number; utmY: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(17);
  const [isLandmarkDropdownOpen, setIsLandmarkDropdownOpen] = useState(false);
  const [isExamplesDrawerOpen, setIsExamplesDrawerOpen] = useState(false);
  const [exampleFilter, setExampleFilter] = useState<'all' | 'encroachment' | 'boundary' | 'khata' | 'infrastructure'>('all');

  // Layer visibility toggles
  const [layersVisibility, setLayersVisibility] = useState({
    harmonizedParcels: true,
    cadastral: true,
    municipal: true,
    droneOri: true,
    gnssPoints: true,
    conflictMarkers: true
  });

  // Calculate project bounds from parcels
  const getProjectBounds = useCallback((): L.LatLngBounds | null => {
    if (!parcels || parcels.length === 0) return null;
    const allCoords: [number, number][] = parcels.flatMap(p => p.coordinates);
    if (allCoords.length === 0) return null;
    return L.latLngBounds(allCoords);
  }, [parcels]);

  // Function to switch basemap layers dynamically
  const applyBasemap = useCallback((map: L.Map, type: BasemapType) => {
    // Remove old tile layers
    activeTileLayersRef.current.forEach(layer => {
      try {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      } catch (err) {
        console.warn('Error removing tile layer:', err);
      }
    });
    activeTileLayersRef.current = [];

    const config = BASEMAPS[type];
    if (!config) return;

    config.layers.forEach(item => {
      const tile = L.tileLayer(item.url, item.options).addTo(map);
      tile.bringToBack();
      activeTileLayersRef.current.push(tile);
    });
  }, []);

  const handleBasemapSelect = (type: BasemapType) => {
    setActiveBasemap(type);
    if (mapInstanceRef.current) {
      applyBasemap(mapInstanceRef.current, type);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Bengaluru Urban Sector (Indiranagar / Domlur)
    const map = L.map(mapContainerRef.current, {
      center: [12.9719, 77.6412],
      zoom: 17,
      zoomControl: false, // Custom position
      attributionControl: true
    });

    // Add zoom control top-left
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Add metric scale bar bottom-left
    L.control.scale({ imperial: false, metric: true, position: 'bottomleft' }).addTo(map);

    // Apply initial real basemap (Satellite Hybrid)
    applyBasemap(map, 'hybrid');

    markerLayersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Track mouse coordinates & zoom
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      // Approximation for UTM Zone 43N metric coordinates around Bengaluru (central meridian 75°E)
      const utmX = Math.round(500000 + (lng - 75.0) * 111320 * Math.cos((lat * Math.PI) / 180));
      const utmY = Math.round(lat * 110574);
      setCursorCoords({ lat, lng, utmX, utmY });
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Fit bounds to real parcels once loaded
    const bounds = getProjectBounds();
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    }

    // Leaflet Container InvalidateSize Fix (Prevents gray tiles or coordinate misalignment)
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [applyBasemap, getProjectBounds]);

  // Handle basemap changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      applyBasemap(mapInstanceRef.current, activeBasemap);
    }
  }, [activeBasemap, applyBasemap]);

  // Render Parcels and Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old polygon layers
    Object.values(polygonLayersRef.current).forEach(layer => map.removeLayer(layer));
    polygonLayersRef.current = {};

    if (markerLayersRef.current) {
      markerLayersRef.current.clearLayers();
    }

    // 1. Render Harmonized Parcels
    if (layersVisibility.harmonizedParcels) {
      parcels.forEach(parcel => {
        let fillColor = '#10b981';
        let strokeColor = '#059669';

        if (colorMode === 'confidence') {
          if (parcel.confidence_score >= 90) {
            fillColor = '#10b981';
            strokeColor = '#059669';
          } else if (parcel.confidence_score >= 75) {
            fillColor = '#f59e0b';
            strokeColor = '#d97706';
          } else {
            fillColor = '#ef4444';
            strokeColor = '#dc2626';
          }
        } else if (colorMode === 'land_use') {
          fillColor =
            parcel.land_use === 'Commercial' ? '#3b82f6' :
            parcel.land_use === 'Mixed Use' ? '#8b5cf6' :
            parcel.land_use === 'Institutional' ? '#ec4899' :
            parcel.land_use === 'Public Utility' ? '#64748b' : '#10b981';
          strokeColor = fillColor;
        } else {
          fillColor = parcel.validation_status === 'Validated' ? '#10b981' : '#f59e0b';
          strokeColor = fillColor;
        }

        const isSelected = selectedParcelId === parcel.parcel_id || highlightParcelId === parcel.parcel_id;

        const polygon = L.polygon(parcel.coordinates, {
          color: isSelected ? '#38bdf8' : strokeColor,
          weight: isSelected ? 4 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.55 : 0.28
        }).addTo(map);

        polygon.bindTooltip(
          `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
            <div style="font-weight: 700; color: #0284c7; margin-bottom: 2px;">${parcel.parcel_id} (${parcel.survey_number})</div>
            <div><strong>Area:</strong> ${parcel.area_sqm} m²</div>
            <div><strong>Khata:</strong> ${parcel.revenue_khata_no}</div>
            <div><strong>PID:</strong> ${parcel.municipal_property_id}</div>
            <div><strong>Confidence:</strong> ${parcel.confidence_score}%</div>
            <div><strong>Status:</strong> ${parcel.review_status}</div>
           </div>`,
          { permanent: false, direction: 'top', className: 'gis-tooltip', sticky: true }
        );

        polygon.on('click', () => {
          setSelectedParcelId(parcel.parcel_id);
          if (onParcelSelect) onParcelSelect(parcel.parcel_id);
          map.flyToBounds(polygon.getBounds(), { maxZoom: 19, duration: 0.8 });
        });

        polygonLayersRef.current[parcel.parcel_id] = polygon;
      });
    }

    // 2. Render Multi-Source Ghost Outlines (Cadastral & Municipal Discrepancies)
    if (layersVisibility.cadastral || layersVisibility.municipal) {
      parcels.forEach(parcel => {
        if (parcel.source_polygons) {
          parcel.source_polygons.forEach(src => {
            if (src.source.includes('Cadastral') && layersVisibility.cadastral) {
              const cadPoly = L.polygon(src.coordinates, {
                color: '#ef4444',
                weight: 2,
                fill: false,
                dashArray: '4, 4'
              }).addTo(map);
              cadPoly.bindTooltip(`Cadastral Source: ${src.source} (${src.area} m²)`);
            }
            if (src.source.includes('Municipal') && layersVisibility.municipal) {
              const munPoly = L.polygon(src.coordinates, {
                color: '#3b82f6',
                weight: 2,
                fill: false,
                dashArray: '5, 5'
              }).addTo(map);
              munPoly.bindTooltip(`Municipal Source: ${src.source} (${src.area} m²)`);
            }
          });
        }
      });
    }

    // 3. Render GNSS Benchmark CORS Markers
    // 3. Render GNSS Benchmark CORS Markers across Bengaluru
    if (layersVisibility.gnssPoints && markerLayersRef.current) {
      const corsStations = [
        { id: 'GNSS-BLR-00', name: 'SSLR Zero-Datum Master Station', coords: [12.9797, 77.5907] as [number, number], desc: 'Karnataka SSLR Geodetic Master CORS Datum (±0.002m)' },
        { id: 'GNSS-BLR-01', name: 'Indiranagar CORS Benchmark', coords: [12.9719, 77.6412] as [number, number], desc: 'Survey of India RTK Continuous Station' },
        { id: 'GNSS-BLR-06', name: 'Ulsoor Lake Environmental Benchmark', coords: [12.9830, 77.6210] as [number, number], desc: 'KSRSAC Wetland Monitoring Station' },
        { id: 'GNSS-BLR-07', name: 'Koramangala BDA Reference Point', coords: [12.9352, 77.6245] as [number, number], desc: 'Urban Layout Affine Ground Datum' },
        { id: 'GNSS-BLR-08', name: 'Whitefield ITPL Geodetic Station', coords: [12.9863, 77.7340] as [number, number], desc: 'High-Tech Industrial Survey CORS Post' }
      ];

      corsStations.forEach(cs => {
        const csMarker = L.circleMarker(cs.coords, {
          radius: 7,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.95,
          weight: 2.5
        });
        csMarker.bindTooltip(`<strong>📍 ${cs.id}</strong><br/><strong>${cs.name}</strong><br/>${cs.desc}`);
        markerLayersRef.current?.addLayer(csMarker);
      });

      parcels.slice(0, 10).forEach((p, idx) => {
        const pt = p.coordinates[0];
        const gnssMarker = L.circleMarker(pt, {
          radius: 4,
          color: '#0ea5e9',
          fillColor: '#7dd3fc',
          fillOpacity: 0.85,
          weight: 1.5
        });
        gnssMarker.bindTooltip(`<strong>Field RTK Point #${idx + 1}</strong><br/>Parcel: ${p.parcel_id}<br/>Accuracy: ±0.008m`);
        markerLayersRef.current?.addLayer(gnssMarker);
      });
    }

    // Reference Infrastructure Overlays (Raja Kaluve, 100ft Road, Metro, Lake Buffer, BESCOM)
    if (layersVisibility.droneOri && markerLayersRef.current) {
      // Raja Kaluve Canal line
      const rajaKaluve = L.polyline(
        [
          [12.9750, 77.6395],
          [12.9745, 77.6418],
          [12.9740, 77.6438],
          [12.9735, 77.6462]
        ],
        { color: '#06b6d4', weight: 4, dashArray: '6, 6', opacity: 0.85 }
      );
      rajaKaluve.bindTooltip('<strong>Primary Raja Kaluve (Stormwater Drain)</strong><br/>25.0m Statutory NGT Buffer Corridor');
      markerLayersRef.current?.addLayer(rajaKaluve);

      // 100 Feet Road Right of Way
      const roadWay = L.polyline(
        [
          [12.9710, 77.6410],
          [12.9760, 77.6410]
        ],
        { color: '#f59e0b', weight: 3, dashArray: '8, 6', opacity: 0.75 }
      );
      roadWay.bindTooltip('<strong>Indiranagar 100 Feet Road Right-of-Way</strong><br/>BBMP Master Plan 2031 Demarcated Corridor (30m Width)');
      markerLayersRef.current?.addLayer(roadWay);

      // Ulsoor Lake Waterbody & 75m NGT Buffer Zone
      const lakeWaterbody = L.polygon(
        [
          [12.9860, 77.6200],
          [12.9870, 77.6230],
          [12.9845, 77.6255],
          [12.9810, 77.6240],
          [12.9805, 77.6215],
          [12.9825, 77.6185],
          [12.9860, 77.6200]
        ],
        { color: '#0284c7', fillColor: '#06b6d4', fillOpacity: 0.35, weight: 2 }
      );
      lakeWaterbody.bindTooltip('<strong>Ulsoor Lake (Halasuru)</strong><br/>BBMP Lakes Division Catchment Reservoir (125 Acres)');
      markerLayersRef.current?.addLayer(lakeWaterbody);

      const lakeBuffer = L.polygon(
        [
          [12.9875, 77.6185],
          [12.9888, 77.6245],
          [12.9855, 77.6275],
          [12.9795, 77.6255],
          [12.9790, 77.6200],
          [12.9815, 77.6170],
          [12.9875, 77.6185]
        ],
        { color: '#10b981', weight: 2, dashArray: '5, 5', fill: false, opacity: 0.8 }
      );
      lakeBuffer.bindTooltip('<strong>NGT Mandated 75m Lake Eco-Buffer Zone</strong><br/>Strict No-Construction Environmental Corridor');
      markerLayersRef.current?.addLayer(lakeBuffer);

      // BMRCL Purple Line Metro Viaduct Alignment
      const metroLine = L.polyline(
        [
          [12.9750, 77.6080],
          [12.9784, 77.6385],
          [12.9860, 77.6445],
          [12.9910, 77.6520],
          [12.9863, 77.7340]
        ],
        { color: '#9333ea', weight: 4, opacity: 0.85 }
      );
      metroLine.bindTooltip('<strong>BMRCL Namma Metro (Purple Line)</strong><br/>Elevated Viaduct Corridor & Subterranean Structural Easement');
      markerLayersRef.current?.addLayer(metroLine);

      // Metro Station Markers
      const metroStations = [
        { name: 'Indiranagar Metro Station', coords: [12.9784, 77.6385] as [number, number] },
        { name: 'Whitefield (ITPL) Metro Station', coords: [12.9863, 77.7340] as [number, number] }
      ];
      metroStations.forEach(st => {
        const stMarker = L.circleMarker(st.coords, {
          radius: 6,
          color: '#7e22ce',
          fillColor: '#c084fc',
          fillOpacity: 1,
          weight: 2
        });
        stMarker.bindTooltip(`<strong>🚇 ${st.name}</strong><br/>BMRCL Rapid Transit Interchange`);
        markerLayersRef.current?.addLayer(stMarker);
      });

      // BESCOM 66kV High-Tension Transmission Corridor
      const bescomHT = L.polyline(
        [
          [12.9705, 77.6425],
          [12.9765, 77.6425]
        ],
        { color: '#eab308', weight: 3, dashArray: '6, 6', opacity: 0.9 }
      );
      bescomHT.bindTooltip('<strong>BESCOM 66kV Transmission Corridor</strong><br/>Statutory 1.8m Underground Utility Easement Setback');
      markerLayersRef.current?.addLayer(bescomHT);

      // Vidhana Soudha AMASR 100m Prohibited Conservation Envelope
      const heritageZone = L.circle([12.9797, 77.5907], {
        radius: 120,
        color: '#f43f5e',
        weight: 2,
        dashArray: '4, 4',
        fillColor: '#fb7185',
        fillOpacity: 0.12
      });
      heritageZone.bindTooltip('<strong>AMASR Act 100m Prohibited Zone</strong><br/>Protected Heritage Monument Buffer around Vidhana Soudha');
      markerLayersRef.current?.addLayer(heritageZone);
    }


    // 4. Render Conflict & Topology Markers
    if (layersVisibility.conflictMarkers && markerLayersRef.current) {
      conflicts.forEach(c => {
        if (c.status !== 'resolved') {
          const conflictMarker = L.circleMarker(c.location, {
            radius: 8,
            color: '#b91c1c',
            fillColor: '#ef4444',
            fillOpacity: 0.9,
            weight: 2.5
          });
          conflictMarker.bindPopup(
            `<div style="font-family: sans-serif; font-size: 11px; max-width: 250px; padding: 2px;">
              <div style="font-size: 10px; font-weight: 700; color: #ef4444; text-transform: uppercase;">Discrepancy #${c.id}</div>
              <div style="font-weight: 700; font-size: 12px; margin-top: 2px; color: #0f172a;">${c.title}</div>
              <div style="margin-top: 4px; color: #475569;"><strong>Parcel:</strong> ${c.parcel_id} | <strong>Severity:</strong> ${c.severity.toUpperCase()}</div>
              <div style="margin-top: 4px; padding: 4px 6px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; font-size: 10px; color: #166534;">
                <strong>AI Recommendation:</strong> ${c.aiRecommendation}
              </div>
            </div>`
          );
          conflictMarker.bindTooltip(`<strong>Discrepancy: ${c.title}</strong><br/>Parcel: ${c.parcel_id}<br/>Severity: ${c.severity.toUpperCase()}<br/>Click to inspect`);
          conflictMarker.on('click', () => {
            setSelectedParcelId(c.parcel_id);
            map.flyTo(c.location, 19, { duration: 0.8 });
            conflictMarker.openPopup();
          });
          markerLayersRef.current?.addLayer(conflictMarker);
        }
      });

      topologyIssues.forEach(t => {
        if (t.status === 'open') {
          const topoMarker = L.circleMarker(t.location, {
            radius: 7,
            color: '#b45309',
            fillColor: '#f59e0b',
            fillOpacity: 0.9,
            weight: 2
          });
          topoMarker.bindTooltip(`<strong>Topology Issue: ${t.type.toUpperCase()}</strong><br/>${t.description}`);
          markerLayersRef.current?.addLayer(topoMarker);
        }
      });
    }
  }, [parcels, selectedParcelId, highlightParcelId, colorMode, layersVisibility, conflicts, topologyIssues, onParcelSelect, setSelectedParcelId]);

  // Center on conflict if passed
  useEffect(() => {
    if (activeConflictLocation && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(activeConflictLocation, 19, { duration: 1.0 });
    }
  }, [activeConflictLocation]);

  // Fly to selected parcel when selected externally
  useEffect(() => {
    if (selectedParcelId && polygonLayersRef.current[selectedParcelId] && mapInstanceRef.current) {
      const poly = polygonLayersRef.current[selectedParcelId];
      mapInstanceRef.current.flyToBounds(poly.getBounds(), { maxZoom: 19, duration: 0.8 });
    }
  }, [selectedParcelId]);

  // Quick navigation helpers
  const flyToProjectSector = () => {
    const bounds = getProjectBounds();
    if (bounds && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    } else {
      mapInstanceRef.current?.flyTo([12.9719, 77.6412], 17, { duration: 1.0 });
    }
  };

  const flyToLandmark = (landmark: BengaluruLandmark) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(landmark.coords, landmark.zoom, { duration: 1.2 });
    const mark = L.marker(landmark.coords).addTo(mapInstanceRef.current);
    mark.bindPopup(
      `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
        <div style="font-size: 13px; font-weight: 700; color: #0284c7;">${landmark.icon} ${landmark.name}</div>
        <div style="font-size: 10px; color: #64748b; font-weight: 600; margin-top: 2px;">${landmark.category}</div>
        <p style="margin-top: 4px; color: #334155; line-height: 1.4;">${landmark.description}</p>
       </div>`
    ).openPopup();
  };

  const flyToCaseStudy = (csOrConflictId: MapCaseStudy | string, parcelIdFallback?: string) => {
    let cs: MapCaseStudy | undefined;
    let targetParcelId: string;
    let targetCoords: [number, number];
    let targetZoom: number = 19;

    if (typeof csOrConflictId === 'object') {
      cs = csOrConflictId;
      targetParcelId = cs.parcelId;
      targetCoords = cs.coords;
      targetZoom = cs.zoom;
    } else {
      cs = MAP_CASE_STUDIES.find(item => item.id === csOrConflictId || item.parcelId === parcelIdFallback);
      targetParcelId = parcelIdFallback || cs?.parcelId || '';
      const conflict = conflicts.find(c => c.id === csOrConflictId);
      targetCoords = cs ? cs.coords : (conflict ? conflict.location : [12.9719, 77.6412]);
    }

    if (targetParcelId) {
      setSelectedParcelId(targetParcelId);
      if (onParcelSelect) onParcelSelect(targetParcelId);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo(targetCoords, targetZoom, { duration: 1.1 });

    setTimeout(() => {
      const conflict = conflicts.find(c => (cs && c.id === cs.id) || (targetParcelId && c.parcel_id === targetParcelId));
      const title = cs ? `${cs.icon} ${cs.title}` : (conflict ? conflict.title : `Parcel ${targetParcelId}`);
      const category = cs ? cs.categoryLabel : (conflict ? conflict.conflictType.replace('_', ' ').toUpperCase() : 'CASE STUDY');
      const desc = cs ? cs.shortDesc : (conflict ? conflict.aiRecommendation : 'Reconciled canonical parcel boundary');

      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 11px; max-width: 290px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; background: #fee2e2; color: #b91c1c; padding: 2px 6px; border-radius: 9999px;">
              ${category}
            </span>
            <span style="font-size: 9px; font-weight: 700; color: #64748b;">${conflict?.id || targetParcelId}</span>
          </div>
          <div style="font-weight: 700; font-size: 13px; color: #0f172a; line-height: 1.3;">${title}</div>
          <div style="font-size: 10px; color: #475569; margin-top: 3px;">
            <strong>Parcel:</strong> ${targetParcelId} ${cs ? `| <strong>Sector:</strong> ${cs.sectorName}` : ''}
          </div>
          <p style="margin-top: 5px; font-size: 11px; color: #334155; line-height: 1.4;">${desc}</p>
          ${conflict ? `
            <div style="margin-top: 6px; padding: 6px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 10px; color: #166534;">
              <strong>AI Recommendation:</strong> ${conflict.aiRecommendation}
            </div>
          ` : ''}
        </div>
      `;

      L.popup({ offset: [0, -10] })
        .setLatLng(targetCoords)
        .setContent(popupHtml)
        .openOn(map);
    }, 1150);
  };

  const flyToGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 17, { duration: 1.2 });
          const gpsMarker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
          gpsMarker.bindPopup('<strong>Your Current Location</strong>').openPopup();
        }
      },
      err => {
        alert(`Could not retrieve GPS location: ${err.message}`);
      }
    );
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery.includes('India') || searchQuery.includes('Bengaluru') || searchQuery.includes('Bangalore') || searchQuery.includes('Karnataka')
            ? searchQuery
            : `${searchQuery}, Bengaluru, Karnataka, India`
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        mapInstanceRef.current.flyTo([latitude, longitude], 17, { duration: 1.2 });

        const searchMarker = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
        searchMarker.bindPopup(`<strong>${display_name}</strong>`).openPopup();
      } else {
        alert(`Location "${searchQuery}" not found. Try searching a Bengaluru landmark (e.g. Indiranagar, Vidhana Soudha, Koramangala, MG Road).`);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Top Left: Search & Location Controls */}
      <div className="absolute top-3 left-14 z-10 flex flex-wrap items-center gap-2 max-w-[calc(100%-160px)]">
        {/* Search Bar */}
        <form onSubmit={handleLocationSearch} className="flex items-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Bengaluru place (e.g. Indiranagar, MG Road)..."
              className="w-56 sm:w-72 px-3 py-1.5 pl-8 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-md"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="ml-1.5 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            {isSearching ? '...' : 'Go'}
          </button>
        </form>

        {/* Quick Fly Buttons */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-1.5 py-1 rounded-lg border border-slate-700 shadow-md text-xs">
          <button
            type="button"
            onClick={flyToProjectSector}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold text-sky-400 hover:bg-sky-950/60 transition-colors"
            title={`Fit to ${parcels.length} Bengaluru Land Parcels (Indiranagar)`}
          >
            <MapPin className="w-3 h-3" />
            <span>Testbed Sector ({parcels.length})</span>
          </button>

          <span className="text-slate-600">|</span>

          <button
            type="button"
            onClick={flyToGPSLocation}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-400 hover:bg-emerald-950/60 transition-colors"
            title="Fly to your device GPS location"
          >
            <Navigation className="w-3 h-3" />
            <span>My GPS</span>
          </button>

          <span className="text-slate-600">|</span>

          {/* Landmarks Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLandmarkDropdownOpen(!isLandmarkDropdownOpen)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-amber-400 hover:bg-amber-950/60 transition-colors font-medium cursor-pointer"
              title="Jump to famous Bengaluru landmarks & sectors"
            >
              <span>🏛️ Landmarks</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLandmarkDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLandmarkDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-1.5 z-50 text-xs max-h-80 overflow-y-auto divide-y divide-slate-800">
                {BENGALURU_LANDMARKS.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      flyToLandmark(l);
                      setIsLandmarkDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 flex items-start gap-2.5 transition-colors group cursor-pointer"
                  >
                    <span className="text-base shrink-0 mt-0.5">{l.icon}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-white group-hover:text-sky-400 transition-colors flex items-center justify-between">
                        <span className="truncate">{l.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-400 border border-sky-800 font-normal">{l.category}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{l.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-600">|</span>

          {/* Featured Map Examples Drawer Button */}
          <button
            type="button"
            onClick={() => {
              setIsExamplesDrawerOpen(!isExamplesDrawerOpen);
              setIsLandmarkDropdownOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-all ${
              isExamplesDrawerOpen
                ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-300'
                : 'text-amber-400 hover:bg-amber-950/60'
            }`}
            title="Browse all 12 real-world Bengaluru land dispute examples"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Examples ({MAP_CASE_STUDIES.length})</span>
          </button>
        </div>
      </div>

      {/* Examples & Case Studies Drawer Modal */}
      {isExamplesDrawerOpen && (
        <div className="absolute top-14 left-14 z-30 w-96 max-w-[calc(100%-80px)] max-h-[82%] bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-4 flex flex-col text-white animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Featured Map Examples
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-600/40 font-mono">
                    {MAP_CASE_STUDIES.length} Cases
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Urban land disputes, buffer infringements & cadastral overlaps</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExamplesDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 mb-2 text-[10px]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'encroachment', label: 'Encroachments' },
                { id: 'boundary', label: 'Boundaries' },
                { id: 'infrastructure', label: 'Infrastructure' },
                { id: 'khata', label: 'Khata/Tenure' }
              ] as const
            ).map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setExampleFilter(f.id)}
                className={`px-2.5 py-0.5 rounded-full font-medium shrink-0 transition-colors cursor-pointer ${
                  exampleFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Examples List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-800/60 max-h-[420px]">
            {MAP_CASE_STUDIES.filter(cs => exampleFilter === 'all' || cs.category === exampleFilter).map(cs => (
              <div
                key={cs.id}
                onClick={() => {
                  flyToCaseStudy(cs);
                  setIsExamplesDrawerOpen(false);
                }}
                className="pt-2 first:pt-0 group cursor-pointer p-2 rounded-xl hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white group-hover:text-amber-400 transition-colors">
                    <span className="text-base shrink-0">{cs.icon}</span>
                    <span className="line-clamp-1">{cs.title}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      cs.severity === 'critical'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {cs.categoryLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="text-sky-400 font-medium">{cs.sectorName}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-300">{cs.parcelId}</span>
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2 mt-1 leading-snug">
                  {cs.shortDesc}
                </p>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Fly & Inspect Boundary →</span>
                  <span className="text-slate-500 font-mono text-[9px]">{cs.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Right: Basemap Selector, Style & Fullscreen */}
      <div className="absolute top-3 right-3 z-10 flex flex-wrap items-center gap-2">
        {/* Real Basemap Selector */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md flex items-center gap-1 text-xs">
          {(['hybrid', 'satellite', 'osm', 'dark'] as BasemapType[]).map(type => {
            const b = BASEMAPS[type];
            const isActive = activeBasemap === type;
            return (
              <button
                key={type}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBasemapSelect(type);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm ring-1 ring-white/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch to ${b.name}`}
              >
                <span>{b.icon}</span>
                <span className="hidden sm:inline">{b.name}</span>
              </button>
            );
          })}
        </div>

        {/* Parcel Color Style Selector */}
        <div className="bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700 shadow-md text-xs flex items-center gap-1.5 text-white">
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Theme:</span>
          <select
            value={colorMode}
            onChange={e => setColorMode(e.target.value as any)}
            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="confidence" className="bg-slate-900">Confidence</option>
            <option value="land_use" className="bg-slate-900">Land Use</option>
            <option value="status" className="bg-slate-900">Validation</option>
          </select>
        </div>

        {/* Recenter Project Sector */}
        <button
          onClick={flyToProjectSector}
          title="Recenter Bengaluru Parcels"
          className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 shadow-md text-slate-300 hover:text-sky-400 transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 shadow-md text-slate-300 hover:text-sky-400 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Layer Toggles Panel (Bottom Left) */}
      {showLayerToggles && (
        <div className="absolute bottom-8 left-3 z-10 bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 shadow-xl text-xs max-w-xs space-y-1.5 text-white">
          <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Layers className="w-3.5 h-3.5" />
              Active GIS Overlays
            </span>
            <span className="text-[9px] text-emerald-400 font-mono">EPSG:32643</span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-emerald-400">
              <input
                type="checkbox"
                checked={layersVisibility.harmonizedParcels}
                onChange={e => setLayersVisibility(prev => ({ ...prev, harmonizedParcels: e.target.checked }))}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span>Harmonized</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
              <input
                type="checkbox"
                checked={layersVisibility.cadastral}
                onChange={e => setLayersVisibility(prev => ({ ...prev, cadastral: e.target.checked }))}
                className="rounded text-rose-600 focus:ring-0"
              />
              <span>Cadastral (SY)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-blue-400">
              <input
                type="checkbox"
                checked={layersVisibility.municipal}
                onChange={e => setLayersVisibility(prev => ({ ...prev, municipal: e.target.checked }))}
                className="rounded text-blue-600 focus:ring-0"
              />
              <span>Municipal (PID)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-sky-400">
              <input
                type="checkbox"
                checked={layersVisibility.gnssPoints}
                onChange={e => setLayersVisibility(prev => ({ ...prev, gnssPoints: e.target.checked }))}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span>CORS GNSS</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
              <input
                type="checkbox"
                checked={layersVisibility.conflictMarkers}
                onChange={e => setLayersVisibility(prev => ({ ...prev, conflictMarkers: e.target.checked }))}
                className="rounded text-amber-600 focus:ring-0"
              />
              <span>Disputes/Slivers</span>
            </label>
          </div>
        </div>
      )}

      {/* Floating Quick Examples Chip Bar */}
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 max-w-[94%] overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-xl text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Map Examples:</span>
          </span>
          {MAP_CASE_STUDIES.map(cs => (
            <button
              key={cs.id}
              type="button"
              onClick={() => flyToCaseStudy(cs)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedParcelId === cs.parcelId
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md ring-2 ring-amber-300 scale-105'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}
              title={`${cs.title} (${cs.sectorName})`}
            >
              <span>{cs.icon}</span>
              <span>{cs.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Map Legend (Bottom Right) */}
      <MapLegend colorMode={colorMode} />

      {/* Bottom Status / Coordinates Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-1 bg-slate-950/85 backdrop-blur-md border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sky-400">
            <Compass className="w-3 h-3" />
            <span>CRS: WGS 84 / UTM Zone 43N</span>
          </span>
          {cursorCoords ? (
            <span>
              Lat: {cursorCoords.lat.toFixed(5)}° N | Lng: {cursorCoords.lng.toFixed(5)}° E | UTM: X {cursorCoords.utmX.toLocaleString()}m, Y {cursorCoords.utmY.toLocaleString()}m
            </span>
          ) : (
            <span>Move cursor over map to inspect coordinates</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>Zoom: {currentZoom} (GSD ~0.15m/px)</span>
          <span className="text-emerald-400">● Live Basemap: {BASEMAPS[activeBasemap].name}</span>
        </div>
      </div>
    </div>
  );
};
