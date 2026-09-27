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
  Sun
} from 'lucide-react';
import { MapLegend } from './MapLegend';

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
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; CARTO' }
      }
    ]
  },
  dark: {
    id: 'dark',
    name: 'GIS Dark',
    icon: '🌙',
    layers: [
      {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; CARTO' }
      }
    ]
  },
  light: {
    id: 'light',
    name: 'Positron Light',
    icon: '☀️',
    layers: [
      {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; CARTO' }
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
    activeTileLayersRef.current.forEach(layer => map.removeLayer(layer));
    activeTileLayersRef.current = [];

    const config = BASEMAPS[type];
    if (!config) return;

    config.layers.forEach(item => {
      const tile = L.tileLayer(item.url, item.options).addTo(map);
      activeTileLayersRef.current.push(tile);
    });
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Mysuru Urban Sector (Kuvempunagar / Vijayanagar)
    const map = L.map(mapContainerRef.current, {
      center: [12.3135, 76.6450],
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
      // Approximation for UTM Zone 43N metric coordinates around Mysuru (central meridian 75°E)
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
    if (layersVisibility.gnssPoints && markerLayersRef.current) {
      parcels.slice(0, 8).forEach((p, idx) => {
        const pt = p.coordinates[0];
        const gnssMarker = L.circleMarker(pt, {
          radius: 5,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.95,
          weight: 2
        });
        gnssMarker.bindTooltip(`<strong>GNSS CORS-MY-0${idx + 1}</strong><br/>Survey of India RTK benchmark<br/>Accuracy: ±0.008m`);
        markerLayersRef.current?.addLayer(gnssMarker);
      });
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
          conflictMarker.bindTooltip(`<strong>Discrepancy: ${c.title}</strong><br/>Parcel: ${c.parcel_id}<br/>Severity: ${c.severity.toUpperCase()}<br/>Click to inspect`);
          conflictMarker.on('click', () => {
            setSelectedParcelId(c.parcel_id);
            map.flyTo(c.location, 19, { duration: 0.8 });
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
      mapInstanceRef.current?.flyTo([12.3135, 76.6450], 17, { duration: 1.0 });
    }
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
          searchQuery.includes('India') || searchQuery.includes('Mysuru') || searchQuery.includes('Karnataka')
            ? searchQuery
            : `${searchQuery}, Mysuru, Karnataka, India`
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
        alert(`Location "${searchQuery}" not found. Try searching a Mysuru landmark (e.g. Kuvempunagar, Vijayanagar, Mysuru Palace).`);
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
              placeholder="Search Mysuru place, street, or GPS..."
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
            onClick={flyToProjectSector}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold text-sky-400 hover:bg-sky-950/60 transition-colors"
            title="Fit to 25 Mysuru Land Parcels"
          >
            <MapPin className="w-3 h-3" />
            <span>Project Sector</span>
          </button>

          <span className="text-slate-600">|</span>

          <button
            onClick={flyToGPSLocation}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-emerald-400 hover:bg-emerald-950/60 transition-colors"
            title="Fly to your device GPS location"
          >
            <Navigation className="w-3 h-3" />
            <span>My GPS</span>
          </button>

          <span className="text-slate-600">|</span>

          <button
            onClick={() => mapInstanceRef.current?.flyTo([12.3051, 76.6551], 17, { duration: 1.0 })}
            className="px-2 py-0.5 rounded text-[11px] text-amber-400 hover:bg-amber-950/60 transition-colors"
            title="Fly to Mysuru Palace Landmark"
          >
            Palace
          </button>
        </div>
      </div>

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
                onClick={() => setActiveBasemap(type)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch to ${b.name}`}
              >
                <span>{b.icon}</span>
                <span className="hidden md:inline">{b.name}</span>
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
          title="Recenter Mysuru Parcels"
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
