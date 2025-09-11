"use client";

import { MapContainer, GeoJSON, useMap, ZoomControl } from 'react-leaflet';
import L, { GeoJSONOptions, Layer, TooltipOptions } from 'leaflet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type FeatureProperties = { [key: string]: unknown } & { adm1_en?: string; geo_level?: string };
type Feature = { type: 'Feature'; geometry: unknown; properties: FeatureProperties };
type FeatureCollection = { type: 'FeatureCollection'; features: Feature[] };

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

export default function PhilippinesChoropleth() {
  const [boundaries, setBoundaries] = useState<FeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const urls = [
      'https://cdn.jsdelivr.net/gh/wmgeolab/geoBoundaries@main/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/gh-pages/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      'https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/PHL/ADM1/geoBoundaries-PHL-ADM1.geojson',
      // Country-only fallback (ensures something renders if ADM1 fails)
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
            // continue to next url
          }
        }
        if (!fc) throw new Error('all remote sources failed');
        // Filter for PH regions only similar to prior app
        const features = (fc.features || []).filter((f: Feature) => {
          const props = (f.properties || {}) as FeatureProperties;
          // If ADM1 present, keep only ADM1; else keep country polygon
          if (Object.prototype.hasOwnProperty.call(props, 'adm1_en')) {
            if (!props.adm1_en) return false;
          }
          const name = String(props.adm1_en).toLowerCase();
          const blacklist = ['water','sea','ocean','island','reef','atoll','bank','shoal','malaysia','brunei','indonesia','china','vietnam','taiwan'];
          if (blacklist.some(b => name.includes(b))) return false;
          const valid = [
            'national capital region','region i','region ii','region iii','region iv-a','mimaropa region','region v','region vi','region vii','region viii','region ix','region x','region xi','region xii','region xiii','cordillera administrative region','bangsamoro autonomous region'
          ];
          // If ADM1 property exists use valid list; otherwise allow country polygon
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

  // 5-class palette (Very Low -> Very High) based on mockup (pale to deep maroon)
  const PALETTE = ['#FFF6DD', '#FBE7AE', '#F4CF70', '#E59A3A', '#5E0F08'];
  const getColor = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(PALETTE.length - 1, idx));
    return PALETTE[clamped];
  }, []);

  // Mock vulnerability and investment values (stable per region)
  function stringHash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }
  const computeVulnIndex = useCallback((regionName?: string): number => {
    if (!regionName) return 2;
    const h = stringHash(regionName.toLowerCase());
    return h % 5; // 0..4
  }, []);
  const computeInvestment = useCallback((regionName?: string): number => {
    if (!regionName) return 50;
    const h = stringHash(regionName);
    return 20 + (h % 90); // ₱20–₱110 M
  }, []);
  const style: GeoJSONOptions['style'] = useMemo(() => {
    return (feature?: { properties?: { adm1_en?: string } }) => ({
      fillColor: getColor(computeVulnIndex(feature?.properties?.adm1_en)),
      weight: 0.8,
      opacity: 1,
      color: '#f1efe9',
      fillOpacity: 1,
    });
  }, [getColor, computeVulnIndex]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onEachFeature: GeoJSONOptions['onEachFeature'] = (feature: any, layer: Layer) => {
    const name: string = feature?.properties?.adm1_en || feature?.properties?.name || 'Region';
    const idx = computeVulnIndex(name);
    const vulnLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    const inv = computeInvestment(name);
    const html = `<div style="font-size:12px">
      <div style="font-weight:600; margin-bottom:4px">${name}</div>
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${getColor(idx)};margin-right:6px"></span>
      Vulnerability: <strong>${vulnLabels[idx]}</strong></div>
      <div style="margin-top:4px">Investment: <strong>₱${inv} M</strong></div>
    </div>`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (layer as any).bindTooltip(html, { sticky: true } as TooltipOptions);
  };

  return (
    <div className="w-full h-full relative">
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
        {boundaries && (
          <GeoJSON
            data={boundaries as unknown as GeoJSON.GeoJsonObject}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
        <FitBounds geojson={boundaries} />
      </MapContainer>
      {/* Static legend (mock) */}
      <div className="absolute top-2 left-2 bg-white/95 border border-gray-200 rounded px-2 py-1 text-[11px] text-gray-700">
        <div className="font-semibold mb-1">Vulnerability Index</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:PALETTE[4]}}/>Very High</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:PALETTE[3]}}/>High</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:PALETTE[2]}}/>Moderate</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:PALETTE[1]}}/>Low</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded" style={{background:PALETTE[0]}}/>Very Low</div>
        </div>
      </div>
      {loadError && (
        <div className="absolute bottom-2 left-2 bg-white/90 border border-gray-200 rounded px-2 py-1 text-[11px] text-red-600">{loadError}</div>
      )}
    </div>
  );
}


