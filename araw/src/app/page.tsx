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
 * 🚧 ARAW-317: GHG by Sector Chart (Next)
 */

import { useState, useEffect } from 'react';
import HeaderV3 from '@/components/layout/HeaderV3';
import SubheaderV3 from '@/components/layout/SubheaderV3';
import SidePanelV3 from '@/components/layout/SidePanelV3';
import KPICardsRowV3 from '@/components/dashboard/KPICardsRowV3';
import FundsMobilizedChartV3 from '@/components/charts/FundsMobilizedChartV3';
import GHGLevelsChartV3 from '@/components/charts/GHGLevelsChartV3';
import InvestmentBySectorChartV3, { type SectorInvestmentData } from '@/components/charts/InvestmentBySectorChartV3';
import FundSourceBreakdownV3, { type FundSourceItem } from '@/components/charts/FundSourceBreakdownV3';
import { DashboardServiceV3, type KPIData } from '@/services/dashboardServiceV3';
import type { FundsData } from '@/components/charts/FundsMobilizedChartV3';
import type { GHGHistoricalData, GHGTargetData } from '@/components/charts/GHGLevelsChartV3';

export default function DashboardV3() {
  // State for KPI and chart data
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [fundsData, setFundsData] = useState<FundsData[]>([]);
  const [ghgHistoricalData, setGhgHistoricalData] = useState<GHGHistoricalData[]>([]);
  const [ghgTargetData, setGhgTargetData] = useState<GHGTargetData | undefined>();
  const [investmentBySectorData, setInvestmentBySectorData] = useState<SectorInvestmentData[]>([]);
  const [fundSourceMain, setFundSourceMain] = useState<FundSourceItem | null>(null);
  const [fundSourceSub, setFundSourceSub] = useState<FundSourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from service layer on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all data in parallel from service layer (MVC pattern)
        const [kpis, funds, ghgData, investmentData, fundSourceData] = await Promise.all([
          DashboardServiceV3.getKPIMetrics(),
          DashboardServiceV3.getFundsMobilizedData(),
          DashboardServiceV3.getGHGLevelsData(),
          DashboardServiceV3.getInvestmentBySectorData(),
          DashboardServiceV3.getFundSourceBreakdownData()
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
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - ARAW-311 ✅ - Full 1920px width */}
      <HeaderV3 />
      
      {/* Main Layout: Sidebar (295px) + Content Area (1625px) = 1920px */}
      <div className="flex max-w-[1920px] mx-auto w-full" style={{ backgroundColor: '#D8EEE8' }}>
        {/* Sidebar - 295px - ARAW-313 ✅ */}
        <SidePanelV3 />
        
        {/* Content Area - 1625px */}
        <div className="flex-1 flex flex-col">
          {/* Subheader - ARAW-312 ✅ */}
          <SubheaderV3 />
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="p-5">
              {/* KPI Cards Row - ARAW-314 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="grid grid-cols-5 gap-3 mb-6">
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
              ) : kpiData ? (
                <KPICardsRowV3 
                  totalInvestment={kpiData.totalInvestment}
                  ghgReduction={kpiData.ghgReduction}
                  ghgReductionSubtitle={kpiData.ghgReductionSubtitle}
                  adaptationInvestment={kpiData.adaptationInvestment}
                  mitigationInvestment={kpiData.mitigationInvestment}
                  totalProjects={kpiData.totalProjects}
                  className="mb-6"
                />
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">Failed to load KPI data. Please refresh the page.</p>
                </div>
              )}
              
              {/* Funds & Emissions Charts - ARAW-315 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-[400px] flex items-center justify-center">
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-[400px] flex items-center justify-center">
                    <p className="text-gray-500">Loading chart data...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <FundsMobilizedChartV3 data={fundsData} />
                  <GHGLevelsChartV3 
                    historicalData={ghgHistoricalData}
                    targetData={ghgTargetData}
                  />
                </div>
              )}
              
              {/* Climate Investment Overview - ARAW-316 ✅ - WITH SERVICE LAYER */}
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-[450px] flex items-center justify-center">
                    <p className="text-gray-500">Loading investment data...</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-[450px] flex items-center justify-center">
                    <p className="text-gray-500">Loading fund source data...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <InvestmentBySectorChartV3 data={investmentBySectorData} />
                  {fundSourceMain && (
                    <FundSourceBreakdownV3 
                      mainSource={fundSourceMain}
                      subSources={fundSourceSub}
                    />
                  )}
                </div>
              )}
              
              {/* Development Progress Indicator */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              V3.0 Dashboard Implementation
            </h2>
                    <p className="text-lg text-gray-600 mb-2">
                      Building section by section with MVC architecture...
                    </p>
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        <strong>Current Status:</strong> Foundation, header, subheader, side panel, KPI cards (with service layer), and Funds/GHG charts (with service layer) complete. MVC architecture fully implemented!
                      </p>
                    </div>
            
            <div className="mt-8 space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">✅ Completed Components</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>✅ ARAW-310: Foundation & Setup (types, design system, utils, mock data)</li>
                  <li>✅ ARAW-311: Header Component (HeaderV3.tsx + tests)</li>
                  <li>✅ ARAW-312: Subheader Component (SubheaderV3.tsx)</li>
                  <li>✅ ARAW-313: Side Panel (SidePanelV3.tsx with collapsible filters)</li>
                  <li>✅ ARAW-314: Key Metric Cards (KPICardV3 + KPICardsRowV3 + service layer + tests)</li>
                  <li>✅ ARAW-315: Funds & GHG Charts (FundsMobilizedChartV3 + GHGLevelsChartV3 + service layer + tests)</li>
                  <li>✅ ARAW-316: Climate Investment Overview (InvestmentBySectorChartV3 + FundSourceBreakdownV3 + service layer + tests)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">🚧 Next Up</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>🚧 ARAW-317: GHG by Sector Chart</li>
                  <li>⏳ ARAW-318: Regional Investments & Map</li>
                  <li>⏳ ARAW-319: Footer Component</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">📊 Progress</h3>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">58%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    7 of 12 stories completed
                  </p>
                </div>
              </div>
            </div>
          </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
