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
 * 🚧 ARAW-314: Key Metric Cards (Next)
 */

import HeaderV3 from '@/components/layout/HeaderV3';
import SubheaderV3 from '@/components/layout/SubheaderV3';
import SidePanelV3 from '@/components/layout/SidePanelV3';

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
            <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              V3.0 Dashboard Implementation
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Building section by section...
            </p>
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>Current Status:</strong> Foundation, header, subheader, and side panel complete. Ready for KPI cards implementation.
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
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">🚧 Next Up</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>🚧 ARAW-314: Key Metric Cards (5 KPI cards with gradients)</li>
                  <li>⏳ ARAW-315: Funds & Emissions Charts</li>
                  <li>⏳ ARAW-316: Climate Investment Charts</li>
                  <li>⏳ ARAW-317: Regional Investments & Map</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">📊 Progress</h3>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">33%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    4 of 12 stories completed
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
