/**
 * ARAW V3.0 Dashboard - Financing & Emissions Trends Section
 * 
 * Single section containing both FUNDS MOBILIZED and GHG LEVELS charts
 * Follows Figma mockup: Section O4
 * JIRA: ARAW-315
 */

'use client';

import FundsMobilizedChartV3, { type FundsData } from '@/components/charts/FundsMobilizedChartV3';
import GHGLevelsChartV3, { type GHGHistoricalData, type GHGTargetData } from '@/components/charts/GHGLevelsChartV3';

// Re-export types for convenience
export type { FundsData, GHGHistoricalData, GHGTargetData };

export interface FinancingEmissionsTrendsV3Props {
  fundsData: FundsData[];
  ghgHistoricalData: GHGHistoricalData[];
  ghgTargetData?: GHGTargetData;
  sectionTitle?: string;
  className?: string;
}

export default function FinancingEmissionsTrendsV3({
  fundsData,
  ghgHistoricalData,
  ghgTargetData,
  sectionTitle = 'Financing and Emissions Trends',
  className = ''
}: FinancingEmissionsTrendsV3Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Section Title - Teal/Green color inside the white container */}
      <h2 
        className="text-lg font-semibold mb-6" 
        style={{ color: '#049688' }}
      >
        {sectionTitle}
      </h2>

      {/* Two Charts Side by Side - Each in their own outlined box (not full white cards) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: Funds Mobilized Chart - outlined box only */}
        <div className="border border-gray-200 rounded-lg p-4">
          <FundsMobilizedChartV3 
            data={fundsData}
            showContainer={false}
          />
        </div>

        {/* Right: GHG Levels Chart - outlined box only */}
        <div className="border border-gray-200 rounded-lg p-4">
          <GHGLevelsChartV3 
            historicalData={ghgHistoricalData}
            targetData={ghgTargetData}
            showContainer={false}
          />
        </div>
      </div>
    </div>
  );
}

