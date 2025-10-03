"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ClimateInvestment, ClimateProject } from '@/types/DataSources';

// Dynamically import mapping libraries
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then(mod => mod.GeoJSON), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const LayersControl = dynamic(() => import('react-leaflet').then(mod => mod.LayersControl), { ssr: false });

interface MapLayer {
  id: string;
  name: string;
  type: 'choropleth' | 'bubble' | 'heatmap' | 'cluster';
  visible: boolean;
  data?: any;
}

interface EnhancedPhilippinesMapProps {
  investments: ClimateInvestment[];
  projects: ClimateProject[];
  overlayData?: {
    hazardMaps?: any;
    vulnerabilityData?: any;
    riskExposure?: any;
  };
  activeLayer?: string;
  onLayerChange?: (layerId: string) => void;
  onRegionClick?: (regionData: any) => void;
  className?: string;
}

export function EnhancedPhilippinesMap({
  investments,
  projects,
  overlayData,
  activeLayer = 'investments',
  onLayerChange,
  onRegionClick,
  className = ""
}: EnhancedPhilippinesMapProps) {
  const [mapData, setMapData] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [availableLayers, setAvailableLayers] = useState<MapLayer[]>([
    { id: 'investments', name: 'Climate Investments', type: 'bubble', visible: true },
    { id: 'vulnerability', name: 'Vulnerability Index', type: 'choropleth', visible: false },
    { id: 'hazards', name: 'Climate Hazards', type: 'heatmap', visible: false },
    { id: 'projects', name: 'Project Locations', type: 'cluster', visible: false }
  ]);

  // Load Philippines GeoJSON data
  useEffect(() => {
    const loadMapData = async () => {
      try {
        // In production, this would load from actual GeoJSON files
        const response = await fetch('/geo_country/lowres/country.0.001.json');
        if (response.ok) {
          const geoData = await response.json();
          setMapData(geoData);
        }
      } catch (error) {
        console.error('Failed to load map data:', error);
        // Fallback to mock data structure
        setMapData({
          type: "FeatureCollection",
          features: []
        });
      }
    };

    loadMapData();
  }, []);

  // Process investment data for map visualization
  const investmentMarkers = useMemo(() => {
    return investments
      .filter(inv => inv.location?.coordinates)
      .map(investment => ({
        id: investment.id,
        position: investment.location.coordinates,
        amount: investment.amount,
        category: investment.category,
        title: investment.title,
        region: investment.region,
        status: investment.status
      }));
  }, [investments]);

  // Process project data for clustering
  const projectMarkers = useMemo(() => {
    return projects
      .filter(proj => proj.location.coordinates)
      .map(project => ({
        id: project.id,
        position: project.location.coordinates,
        totalAmount: project.investments.reduce((sum, inv) => sum + inv.amount, 0),
        name: project.name,
        region: project.location.region,
        beneficiaries: project.outcomes.beneficiaries
      }));
  }, [projects]);

  // Calculate choropleth data for vulnerability mapping
  const choroplethData = useMemo(() => {
    if (!mapData) return {};

    const regionData: Record<string, any> = {};
    
    // Aggregate investment data by region
    investments.forEach(investment => {
      if (!regionData[investment.region]) {
        regionData[investment.region] = {
          totalInvestment: 0,
          projectCount: 0,
          vulnerabilityIndex: 0,
          adaptationProjects: 0,
          mitigationProjects: 0
        };
      }
      
      regionData[investment.region].totalInvestment += investment.amount;
      regionData[investment.region].projectCount += 1;
      
      if (investment.category === 'adaptation') {
        regionData[investment.region].adaptationProjects += 1;
      } else if (investment.category === 'mitigation') {
        regionData[investment.region].mitigationProjects += 1;
      }
    });

    return regionData;
  }, [investments, mapData]);

  // Get color for region based on data
  const getRegionColor = (regionName: string): string => {
    const data = choroplethData[regionName];
    if (!data) return '#f0f0f0';

    switch (activeLayer) {
      case 'investments':
        const maxInvestment = Math.max(...Object.values(choroplethData).map((d: any) => d.totalInvestment));
        const intensity = data.totalInvestment / maxInvestment;
        return `rgba(47, 137, 100, ${0.2 + intensity * 0.8})`;
      
      case 'vulnerability':
        // Would use actual vulnerability data
        const vulnerabilityLevel = Math.random(); // Placeholder
        return `rgba(220, 38, 127, ${0.2 + vulnerabilityLevel * 0.8})`;
      
      default:
        return '#f0f0f0';
    }
  };

  // Handle region click
  const handleRegionClick = (feature: any) => {
    const regionName = feature.properties.name || feature.properties.region;
    setSelectedRegion(regionName);
    onRegionClick?.(choroplethData[regionName]);
  };

  // Handle layer toggle
  const handleLayerToggle = (layerId: string) => {
    setAvailableLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ));
    onLayerChange?.(layerId);
  };

  // Get marker size based on investment amount
  const getMarkerSize = (amount: number): number => {
    const maxAmount = Math.max(...investments.map(inv => inv.amount));
    return Math.max(5, (amount / maxAmount) * 30);
  };

  // Get marker color based on category
  const getMarkerColor = (category: string): string => {
    switch (category) {
      case 'adaptation': return '#10B981';
      case 'mitigation': return '#3B82F6';
      case 'biodiversity': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  if (!mapData) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading map data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Map Layers</div>
        <div className="space-y-2">
          {availableLayers.map(layer => (
            <label key={layer.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => handleLayerToggle(layer.id)}
                className="rounded text-[#2f8964] focus:ring-[#2f8964]"
              />
              <span className="text-xs text-gray-700">{layer.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Adaptation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Mitigation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Biodiversity</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[12.8797, 121.7740]} // Philippines center
        zoom={6}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Region Choropleth Layer */}
        {availableLayers.find(l => l.id === 'investments')?.visible && mapData.features && (
          <GeoJSON
            data={mapData}
            style={(feature) => ({
              fillColor: getRegionColor(feature?.properties?.name || ''),
              weight: 1,
              opacity: 0.8,
              color: '#2f8964',
              fillOpacity: 0.6
            })}
            onEachFeature={(feature, layer) => {
              layer.on('click', () => handleRegionClick(feature));
              layer.bindPopup(`
                <div>
                  <h4 class="font-semibold">${feature.properties?.name || 'Unknown Region'}</h4>
                  <p>Total Investment: ₱${choroplethData[feature.properties?.name]?.totalInvestment?.toLocaleString() || '0'}</p>
                  <p>Projects: ${choroplethData[feature.properties?.name]?.projectCount || 0}</p>
                </div>
              `);
            }}
          />
        )}

        {/* Investment Bubble Markers */}
        {availableLayers.find(l => l.id === 'investments')?.visible && investmentMarkers.map(marker => (
          <CircleMarker
            key={marker.id}
            center={marker.position as [number, number]}
            radius={getMarkerSize(marker.amount)}
            fillColor={getMarkerColor(marker.category)}
            color="#fff"
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-sm">{marker.title}</h4>
                <p className="text-xs text-gray-600">Amount: ₱{marker.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Category: {marker.category}</p>
                <p className="text-xs text-gray-600">Region: {marker.region}</p>
                <p className="text-xs text-gray-600">Status: {marker.status}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Project Cluster Markers */}
        {availableLayers.find(l => l.id === 'projects')?.visible && projectMarkers.map(marker => (
          <CircleMarker
            key={`project-${marker.id}`}
            center={marker.position as [number, number]}
            radius={Math.max(8, Math.log(marker.totalAmount) * 2)}
            fillColor="#8B5CF6"
            color="#fff"
            weight={2}
            opacity={0.8}
            fillOpacity={0.7}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-sm">{marker.name}</h4>
                <p className="text-xs text-gray-600">Total Investment: ₱{marker.totalAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Region: {marker.region}</p>
                <p className="text-xs text-gray-600">Beneficiaries: {marker.beneficiaries.toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Selected Region Info Panel */}
      {selectedRegion && (
        <div className="absolute top-16 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-semibold text-gray-800 mb-2">{selectedRegion}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div>Investment: ₱{choroplethData[selectedRegion]?.totalInvestment?.toLocaleString() || '0'}</div>
            <div>Projects: {choroplethData[selectedRegion]?.projectCount || 0}</div>
            <div>Adaptation: {choroplethData[selectedRegion]?.adaptationProjects || 0}</div>
            <div>Mitigation: {choroplethData[selectedRegion]?.mitigationProjects || 0}</div>
          </div>
          <button
            onClick={() => setSelectedRegion(null)}
            className="mt-2 text-xs text-[#2f8964] hover:underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}



