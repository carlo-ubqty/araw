/**
 * ARAW V3.0 Dashboard - Climate Investment Overview Section
 * 
 * Container for Investment by Sector, GHG by Sector, and Fund Source charts
 * JIRA: ARAW-316 + ARAW-317
 */

'use client';

import InvestmentBySectorChartV3, { type SectorInvestmentData } from '@/components/charts/InvestmentBySectorChartV3';
import GHGBySectorChartV3, { type GHGBySectorData } from '@/components/charts/GHGBySectorChartV3';
import FundSourceBreakdownV3, { type FundSourceItem } from '@/components/charts/FundSourceBreakdownV3';

export interface ClimateInvestmentOverviewV3Props {
  investmentData: SectorInvestmentData[];
  ghgBySectorData: GHGBySectorData[];
  fundSourceMain: FundSourceItem | null;
  fundSourceSub: FundSourceItem[];
  sectionTitle?: string;
  className?: string;
}

export default function ClimateInvestmentOverviewV3({
  investmentData,
  ghgBySectorData,
  fundSourceMain,
  fundSourceSub,
  sectionTitle = 'Climate Investment Overview',
  className = ''
}: ClimateInvestmentOverviewV3Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Section Title - Teal/Green color inside the white container */}
      <h2 
        className="text-lg font-semibold mb-6" 
        style={{ color: '#049688' }}
      >
        {sectionTitle}
      </h2>

      {/* 2 Column Layout - 60/40 split */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1.5fr 1fr', minHeight: '800px' }}>
        {/* Left Column: Investment by Sector (top) and GHG by Sector (bottom) stacked */}
        <div className="flex flex-col gap-6">
          {/* Investment by Sector */}
          <div className="border border-gray-200 rounded-lg p-4">
            <InvestmentBySectorChartV3 
              data={investmentData}
              showContainer={false}
            />
          </div>

          {/* GHG by Sector */}
          <div className="border border-gray-200 rounded-lg p-4">
            <GHGBySectorChartV3 
              data={ghgBySectorData}
              showContainer={false}
            />
          </div>
        </div>

        {/* Right Column: Fund Source Breakdown - Full Height */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
          {fundSourceMain && (
            <FundSourceBreakdownV3 
              mainSource={fundSourceMain}
              subSources={fundSourceSub}
              showContainer={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}

