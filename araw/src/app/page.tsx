"use client";

/**
 * ARAW Climate Finance Dashboard - V3.0 Implementation
 * Fresh implementation based on v3_Climate_Finance_Dashboard_09162025.pdf mockups
 * 
 * Implementation Strategy:
 * - Section-by-section build using user-provided screenshots
 * - Container spacing standards from mockup specifications
 * - Modern, clean design with systematic spacing
 * 
 * JIRA Progress:
 * ✅ ARAW-310: Foundation & Setup (types, design system, utils, mock data)
 * ✅ ARAW-311: Header Component
 * ✅ ARAW-312: Subheader Component
 * ✅ ARAW-313: Side Panel (Filter Dropdowns)
 * ✅ ARAW-314: Key Metric Cards (5 KPI cards with gradients)
 * ✅ ARAW-315: Funds & Emissions Charts (2 charts)
 * 🚧 ARAW-316: Climate Investment Charts (Next)
 */

import HeaderV3 from '@/components/layout/HeaderV3';
import SubheaderV3 from '@/components/layout/SubheaderV3';
import SidePanelV3 from '@/components/layout/SidePanelV3';
import KPICardsRowV3 from '@/components/dashboard/KPICardsRowV3';
import FundsMobilizedChartV3 from '@/components/charts/FundsMobilizedChartV3';
import GHGLevelsChartV3 from '@/components/charts/GHGLevelsChartV3';

export default function DashboardV3() {
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
              {/* KPI Cards Row - ARAW-314 ✅ */}
              <KPICardsRowV3 className="mb-6" />
              
              {/* Funds & Emissions Charts - ARAW-315 ✅ */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <FundsMobilizedChartV3 />
                <GHGLevelsChartV3 />
              </div>
              
              {/* Development Progress Indicator */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              V3.0 Dashboard Implementation
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Building section by section...
            </p>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>Current Status:</strong> Foundation, header, subheader, side panel, KPI cards, and Funds/GHG charts complete. Ready for additional charts.
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
                  <li>✅ ARAW-314: Key Metric Cards (KPICardV3 + KPICardsRowV3)</li>
                  <li>✅ ARAW-315: Funds & GHG Charts (FundsMobilizedChartV3 + GHGLevelsChartV3)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">🚧 Next Up</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>🚧 ARAW-316: Climate Investment Charts (3 bar/pie charts)</li>
                  <li>⏳ ARAW-317: GHG by Sector Chart</li>
                  <li>⏳ ARAW-318: Regional Investments & Map</li>
                  <li>⏳ ARAW-319: Footer Component</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">📊 Progress</h3>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">42%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    5 of 12 stories completed
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
