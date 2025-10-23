/**
 * ARAW V3.0 Dashboard - GHG Emissions Summary Section
 * 
 * Container for GHG by Sector chart (2015 vs 2020)
 * JIRA: ARAW-317
 */

'use client';

import GHGBySectorChartV3, { type GHGBySectorData } from '@/components/charts/GHGBySectorChartV3';

export interface GHGEmissionsSummaryV3Props {
  data: GHGBySectorData[];
  sectionTitle?: string;
  className?: string;
}

export default function GHGEmissionsSummaryV3({
  data,
  sectionTitle = 'Summary of the 2015 and 2020 Philippine National GHG',
  className = ''
}: GHGEmissionsSummaryV3Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Section Title - Teal/Green color inside the white container */}
      <h2 
        className="text-lg font-semibold mb-6" 
        style={{ color: '#049688' }}
      >
        {sectionTitle}
      </h2>

      {/* Full-width GHG by Sector Chart */}
      <div className="border border-gray-200 rounded-lg p-4">
        <GHGBySectorChartV3 
          data={data}
          showContainer={false}
        />
      </div>
    </div>
  );
}

