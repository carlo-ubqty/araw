"use client";

/**
 * ARAW Climate Finance Dashboard - V3.0 Implementation
 * Fresh implementation based on v3_Climate_Finance_Dashboard_09162025.pdf mockups
 * 
 * Implementation Strategy:
 * - Section-by-section build using user-provided screenshots
 * - Container spacing standards from mockup specifications
 * - Modern, clean design with systematic spacing
 * - MVC Architecture: Components receive data from service layer
 * 
 * JIRA Progress:
 * ✅ ARAW-310: Foundation & Setup (types, design system, utils, mock data)
 * ✅ ARAW-311: Header Component
 * ✅ ARAW-312: Subheader Component
 * ✅ ARAW-313: Side Panel (Filter Dropdowns)
 * ✅ ARAW-314: Key Metric Cards (5 KPI cards) - WITH SERVICE LAYER
 * ✅ ARAW-315: Funds & Emissions Charts (2 charts) - WITH SERVICE LAYER
 * ✅ ARAW-316: Climate Investment Overview - WITH SERVICE LAYER
 * ✅ ARAW-317: GHG by Sector Chart - WITH SERVICE LAYER
 * ✅ ARAW-318: Regional Investments & Map - WITH SERVICE LAYER
 * 🚧 ARAW-319: Footer Component (Next)
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import HeaderV3 from '@/components/layout/HeaderV3';
import SubheaderV3 from '@/components/layout/SubheaderV3';
import SidePanelV3 from '@/components/layout/SidePanelV3';
import FooterV3 from '@/components/layout/FooterV3';
import KeyMetricsSectionV3 from '@/components/sections/KeyMetricsSectionV3';
import FinancingEmissionsTrendsV3 from '@/components/sections/FinancingEmissionsTrendsV3';
import ClimateInvestmentOverviewV3 from '@/components/sections/ClimateInvestmentOverviewV3';
import type { SectorInvestmentData } from '@/components/charts/InvestmentBySectorChartV3';
import type { FundSourceItem } from '@/components/charts/FundSourceBreakdownV3';
import type { GHGBySectorData } from '@/components/charts/GHGBySectorChartV3';
import type { RegionalInvestmentData } from '@/components/charts/InvestmentsByRegionChartV3';
import type { MapLocationData } from '@/components/map/PhilippinesMapV3';
import { DashboardServiceV3, type KPIData } from '@/services/dashboardServiceV3';
import type { FundsData, GHGHistoricalData, GHGTargetData } from '@/components/sections/FinancingEmissionsTrendsV3';

// Dynamic import for RegionalInvestmentsMapV3 to avoid SSR issues with Leaflet map
const RegionalInvestmentsMapV3 = dynamic(() => import('@/components/sections/RegionalInvestmentsMapV3'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-6" style={{ color: '#049688' }}>
        Regional Investments & Climate Impact Drivers
      </h2>
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="border border-gray-200 rounded-lg p-4 h-[550px] flex items-center justify-center">
          <p className="text-gray-500">Loading regional data...</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 h-[550px] flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    </div>
  ),
});

export default function DashboardV3() {
  // Filter State - Centralized
  const [dataView, setDataView] = useState<'NAP' | 'NDCIP'>('NAP');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'amount' | 'projects'>('amount');
  const [projectStatus, setProjectStatus] = useState<'ongoing' | 'completed'>('completed');
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  
  // State for KPI and chart data
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [fundsData, setFundsData] = useState<FundsData[]>([]);
  const [ghgHistoricalData, setGhgHistoricalData] = useState<GHGHistoricalData[]>([]);
  const [ghgTargetData, setGhgTargetData] = useState<GHGTargetData | undefined>();
  const [investmentBySectorData, setInvestmentBySectorData] = useState<SectorInvestmentData[]>([]);
  const [fundSourceMain, setFundSourceMain] = useState<FundSourceItem | null>(null);
  const [fundSourceSub, setFundSourceSub] = useState<FundSourceItem[]>([]);
  const [ghgBySectorData, setGhgBySectorData] = useState<GHGBySectorData[]>([]);
  const [regionalData, setRegionalData] = useState<RegionalInvestmentData[]>([]);
  const [mapLocations, setMapLocations] = useState<MapLocationData[]>([]);
  const [mapTotalInvestment, setMapTotalInvestment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from service layer - refetch when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Build filter object
        const filters = {
          dataView,
          selectedSectors,
          displayMode,
          projectStatus,
          selectedYears
        };
        
        // Fetch all data in parallel from service layer with filters (MVC pattern)
        const [kpis, funds, ghgData, investmentData, fundSourceData, ghgBySector, regional] = await Promise.all([
          DashboardServiceV3.getKPIMetrics(filters),
          DashboardServiceV3.getFundsMobilizedData(filters),
          DashboardServiceV3.getGHGLevelsData(filters),
          DashboardServiceV3.getInvestmentBySectorData(filters),
          DashboardServiceV3.getFundSourceBreakdownData(filters),
          DashboardServiceV3.getGHGBySectorData(filters),
          DashboardServiceV3.getInvestmentsByRegionData(filters),
        ]);
        
        // Set KPI data
        setKpiData(kpis);
        
        // Set funds data
        setFundsData(funds);
        
        // Set GHG data (already separated by service layer)
        setGhgHistoricalData(ghgData.historicalData);
        setGhgTargetData(ghgData.targetData);
        
        // Set investment data
        setInvestmentBySectorData(investmentData);
        setFundSourceMain(fundSourceData.mainSource);
        setFundSourceSub(fundSourceData.subSources);
        
        // Set GHG by sector data
        setGhgBySectorData(ghgBySector);
        
        // Set regional data
        setRegionalData(regional);
        // Map data: TODO - implement when needed
        setMapLocations([]);
        setMapTotalInvestment('₱ 0.00 M');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dataView, selectedSectors, displayMode, projectStatus, selectedYears]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - ARAW-311 ✅ - Full 1920px width */}
      <HeaderV3 />
      
      {/* Main Layout: Sidebar (295px) + Content Area (1625px) = 1920px */}
      <div className="flex max-w-[1920px] mx-auto w-full" style={{ backgroundColor: '#D8EEE8' }}>
        {/* Sidebar - 295px - ARAW-313 ✅ - WITH FILTER CALLBACKS */}
        <SidePanelV3 
          onFilterChange={(filters) => {
            if (filters.selectedYears !== undefined) {
              setSelectedYears(filters.selectedYears);
            }
            // Add more filter handlers as needed
          }}
        />
        
        {/* Content Area - 1625px */}
        <div className="flex-1 flex flex-col">
          {/* Subheader - ARAW-312 ✅ - WITH FILTER CALLBACKS */}
          <SubheaderV3 
            onDataViewChange={(view) => {
              setDataView(view);
              setSelectedSectors([]); // Reset sectors when switching views
            }}
            onSectorsChange={(sectors) => setSelectedSectors(sectors)}
            onDisplayModeChange={(mode) => setDisplayMode(mode)}
            onStatusChange={(status) => setProjectStatus(status)}
          />
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="p-5">
              {/* Key Metrics Section - ARAW-314 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div 
                        key={i}
                        className="bg-gray-200 rounded-lg animate-pulse"
                        style={{ minHeight: '130px' }}
                      >
                        <div className="p-4 flex flex-col h-full justify-between">
                          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : kpiData ? (
                <KeyMetricsSectionV3 
                  totalInvestment={kpiData.totalInvestment}
                  ghgReduction={kpiData.ghgReduction}
                  ghgReductionSubtitle={kpiData.ghgReductionSubtitle}
                  adaptationInvestment={kpiData.adaptationInvestment}
                  mitigationInvestment={kpiData.mitigationInvestment}
                  totalProjects={kpiData.totalProjects}
                  displayMode={displayMode}
                  className="mb-6"
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">Failed to load KPI data. Please refresh the page.</p>
                </div>
              )}
              
              {/* Financing & Emissions Trends Section - ARAW-315 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-6" style={{ color: '#049688' }}>
                    Financing and Emissions Trends
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 h-[400px] flex items-center justify-center">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 h-[400px] flex items-center justify-center">
                      <p className="text-gray-500">Loading chart data...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <FinancingEmissionsTrendsV3 
                  fundsData={fundsData}
                  ghgHistoricalData={ghgHistoricalData}
                  ghgTargetData={ghgTargetData}
                  className="mb-6"
                />
              )}
              
              {/* Climate Investment Overview - ARAW-316 + ARAW-317 ✅ - WITH SERVICE LAYER */}
              {/* 2-Column: Left (Investment by Sector + GHG by Sector stacked), Right (Fund Source) */}
              {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 h-[900px] flex items-center justify-center mb-6">
                  <p className="text-gray-500">Loading climate investment data...</p>
                </div>
              ) : (
                fundSourceMain && (
                  <ClimateInvestmentOverviewV3
                    investmentData={investmentBySectorData}
                    ghgBySectorData={ghgBySectorData}
                    fundSourceMain={fundSourceMain}
                    fundSourceSub={fundSourceSub}
                    className="mb-6"
                  />
                )
              )}
              
              {/* Regional Investments & Map - ARAW-318 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-6" style={{ color: '#049688' }}>
                    Regional Investments & Climate Impact Drivers
                  </h2>
                  <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
                    <div className="border border-gray-200 rounded-lg p-4 h-[550px] flex items-center justify-center">
                      <p className="text-gray-500">Loading regional data...</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 h-[550px] flex items-center justify-center">
                      <p className="text-gray-500">Loading map data...</p>
                    </div>
                  </div>
                </div>
              ) : (
                <RegionalInvestmentsMapV3
                  regionalData={regionalData}
                  mapLocations={mapLocations}
                  mapTotalInvestment={mapTotalInvestment}
                  className="mb-6"
                />
              )}
            </div>
          </main>
        </div>
      </div>
      
      {/* Footer - ARAW-319 ✅ */}
      <FooterV3 />
    </div>
  );
}
