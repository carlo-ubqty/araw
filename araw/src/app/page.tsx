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
 * 🚧 ARAW-313: Side Panel (Next)
 */

import HeaderV3 from '@/components/layout/HeaderV3';
import SubheaderV3 from '@/components/layout/SubheaderV3';

export default function DashboardV3() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - ARAW-311 ✅ - Full 1920px width */}
      <HeaderV3 />
      
      {/* Main Layout: Sidebar (295px) + Content Area (1625px) = 1920px */}
      <div className="flex max-w-[1920px] mx-auto w-full" style={{ backgroundColor: '#D8EEE8' }}>
        {/* Sidebar - 295px - ARAW-313 (placeholder) */}
        <aside className="w-[295px] bg-white border-r border-gray-200">
          <div className="p-5">
            <p className="text-sm text-gray-500">Sidebar placeholder (295px)</p>
          </div>
        </aside>
        
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
                <strong>Current Status:</strong> Foundation, header, and subheader complete. Ready for side panel implementation.
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">✅ Completed Components</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>✅ ARAW-310.1: TypeScript Interfaces (types-v3.ts)</li>
                  <li>✅ ARAW-310.2: Design System (design-system-v3.ts)</li>
                  <li>✅ ARAW-310.3: Mock Data (mock-data-v3.ts)</li>
                  <li>✅ ARAW-310.4: Utilities (utils-v3.ts)</li>
                  <li>✅ ARAW-311.1: Header Component (HeaderV3.tsx)</li>
                  <li>✅ ARAW-311.2: Header Tests (HeaderV3.test.tsx)</li>
                  <li>✅ ARAW-312.1: Subheader Component (SubheaderV3.tsx)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">🚧 Next Up</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>🚧 ARAW-313: Side Panel (Filter Dropdowns)</li>
                  <li>⏳ ARAW-314: Key Metric Cards (5 KPIs)</li>
                  <li>⏳ ARAW-315: Funds & Emissions Charts</li>
                  <li>⏳ ARAW-316: Climate Investment Charts</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">📊 Progress</h3>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div className="bg-green-600 h-4 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">25%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    3 of 12 stories completed
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
