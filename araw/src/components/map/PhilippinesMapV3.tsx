/**
 * ARAW V3.0 Dashboard - Philippines Map Component
 * 
 * Interactive choropleth map with bubble overlays showing investments by income class
 * Follows MVC: Component receives data via props
 * JIRA: ARAW-318
 */

'use client';

import { MapContainer, GeoJSON, CircleMarker, Tooltip, useMap, ZoomControl } from 'react-leaflet';
import L, { GeoJSONOptions, Layer } from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type FeatureProperties = { [key: string]: unknown } & { adm1_en?: string };
type Feature = { type: 'Feature'; geometry: unknown; properties: FeatureProperties };
type FeatureCollection = { type: 'FeatureCollection'; features: Feature[] };

export interface MapLocationData {
  locationId: string;
  locationName: string;
  regionName: string;
  latitude: number;
  longitude: number;
  investmentAmount: number;
  incomeClass: 1 | 2 | 3 | 4 | 5;
}

export interface PhilippinesMapV3Props {
  locations?: MapLocationData[];
  totalInvestment?: string;
  title?: string;
  subtitle?: string;
  showContainer?: boolean;
  className?: string;
}

// Income class colors (green shades)
const INCOME_CLASS_COLORS: Record<number, string> = {
  5: '#216F82',  // ₱1B+ (dark green)
  4: '#65C595',  // ₱600M+ (bright green)
  3: '#83DE9E',  // ₱300M+ (green)
  2: '#ABE47D',  // ₱300M+ (apple green)
  1: '#C8E6C9',  // <₱300M (light green)
};

// Helper to fit map bounds
function FitBounds({ geojson }: { geojson: FeatureCollection | null }) {
  const map = useMap();
  useEffect(() => {
    if (!geojson) return;
    const layer = L.geoJSON(geojson as unknown as GeoJSON.GeoJsonObject);
    try {
      const b = layer.getBounds();
      if (b.isValid()) map.fitBounds(b, { padding: [10, 10], maxZoom: 7 });
    } catch {}
  }, [geojson, map]);
  return null;
}

export default function PhilippinesMapV3({
  locations = [],
  totalInvestment = '₱15.2 B',
  title = 'CLIMATE IMPACT DRIVERS/INCOME CLASS VS INVESTMENTS',
  subtitle = 'Mapping investments against CIDs and income class.',
  showContainer = true,
  className = ''
}: PhilippinesMapV3Props) {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Philippines GeoJSON
  useEffect(() => {
    const urls = [
      'https://cdn.jsdelivr.net/gh/wmgeolab/geoBoundaries@main/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/gh-pages/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/PHL.geo.json'
    ];

    const load = async () => {
      try {
        let fc: FeatureCollection | null = null;
        for (const u of urls) {
          try {
            const resp = await fetch(u, { cache: 'no-store', mode: 'cors' });
            if (resp.ok) {
              fc = (await resp.json()) as FeatureCollection;
              break;
            }
          } catch {
            continue;
          }
        }
        if (!fc) throw new Error('all remote sources failed');
        
        // Filter for PH regions only
        const features = (fc.features || []).filter((f: Feature) => {
          const props = (f.properties || {}) as FeatureProperties;
          if (Object.prototype.hasOwnProperty.call(props, 'adm1_en')) {
            if (!props.adm1_en) return false;
          }
          const name = String(props.adm1_en).toLowerCase();
          const blacklist = ['water','sea','ocean','island','reef','atoll','bank','shoal','malaysia','brunei','indonesia','china','vietnam','taiwan'];
          if (blacklist.some(b => name.includes(b))) return false;
          const valid = [
            'national capital region','region i','region ii','region iii','region iv-a','mimaropa region','region v','region vi','region vii','region viii','region ix','region x','region xi','region xii','region xiii','cordillera administrative region','bangsamoro autonomous region'
          ];
          return Object.prototype.hasOwnProperty.call(props, 'adm1_en') ? valid.some(v => name.includes(v)) : true;
        });
        
        setBoundaries({ type: 'FeatureCollection', features });
        setLoadError(null);
      } catch {
        setBoundaries(null);
        setLoadError('Map data failed to load');
      }
    };

    load();
  }, []);

  // Base map style (light gray)
  const style: GeoJSONOptions['style'] = useMemo(() => {
    return () => ({
      fillColor: '#f5f5f5',
      weight: 1,
      opacity: 1,
      color: '#ddd',
      fillOpacity: 0.7,
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature: any, layer: Layer) => {
    const name: string = feature?.properties?.adm1_en || feature?.properties?.name || 'Region';
    const html = `<div style="font-size:12px; font-weight:600">${name}</div>`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as any).bindTooltip(html, { sticky: true });
  };

  // Calculate bubble size based on investment amount
  const getBubbleRadius = (amount: number) => {
    if (amount >= 1000) return 20;      // ₱1B+
    if (amount >= 600) return 15;       // ₱600M+
    if (amount >= 300) return 10;       // ₱300M
    return 5;                            // < ₱300M
  };

  const mapContent = (
    <>
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Map Container */}
      <div className="w-full h-[500px] relative">
        <MapContainer
          center={[12.8797, 121.774]}
          zoom={6}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          zoomControl={false}
          className="w-full h-full rounded-lg"
          attributionControl={false}
          style={{ background: '#ffffff' }}
        >
          <ZoomControl position="topright" />
          
          {/* Base map */}
          {boundaries && (
            <GeoJSON
              data={boundaries as unknown as GeoJSON.GeoJsonObject}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
          
          {/* Bubble overlays */}
          {locations.map((location) => (
            <CircleMarker
              key={location.locationId}
              center={[location.latitude, location.longitude]}
              radius={getBubbleRadius(location.investmentAmount)}
              fillColor={INCOME_CLASS_COLORS[location.incomeClass]}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.7}
            >
              <Tooltip sticky>
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{location.locationName}</div>
                  <div>Region: {location.regionName}</div>
                  <div>Investment: ₱{location.investmentAmount} M</div>
                  <div>Income Class: {location.incomeClass}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
          
          <FitBounds geojson={boundaries} />
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-2 left-2 bg-white/95 border border-gray-200 rounded px-3 py-2 text-[11px] text-gray-700 z-[1000]">
          <div className="font-semibold mb-2">Total PH Mainland: {totalInvestment}</div>
          
          <div className="mb-3">
            <div className="font-semibold mb-1">Income Class</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{background: INCOME_CLASS_COLORS[5]}}/>
                Class 5: ₱1B+
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{background: INCOME_CLASS_COLORS[4]}}/>
                Class 4: ₱600M+
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{background: INCOME_CLASS_COLORS[3]}}/>
                Class 3: ₱300M+
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{background: INCOME_CLASS_COLORS[2]}}/>
                Class 2: ₱300M+
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{background: INCOME_CLASS_COLORS[1]}}/>
                Class 1: &lt;₱300M
              </div>
            </div>
          </div>
          
          <div>
            <div className="font-semibold mb-1">Bubble Scale</div>
            <div className="space-y-1">
              <div>● ₱1B+</div>
              <div style={{ fontSize: '10px' }}>● ₱600M+</div>
              <div style={{ fontSize: '8px' }}>● ₱300M</div>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="absolute bottom-2 left-2 bg-white/90 border border-gray-200 rounded px-2 py-1 text-[11px] text-red-600 z-[1000]">
            {loadError}
          </div>
        )}
      </div>
    </>
  );

  if (!showContainer) {
    return mapContent;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {mapContent}
    </div>
  );
}
