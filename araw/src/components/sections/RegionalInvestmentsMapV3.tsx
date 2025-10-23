/**
 * ARAW V3.0 Dashboard - Regional Investments & Climate Impact Drivers Section
 * 
 * Container component for Regional Investments chart and Philippines Map
 * Follows mockup: Single white container with title, 33/67 split layout
 * JIRA: ARAW-318
 */

'use client';

import InvestmentsByRegionChartV3, { type RegionalInvestmentData } from '@/components/charts/InvestmentsByRegionChartV3';
import PhilippinesMapV3, { type MapLocationData } from '@/components/map/PhilippinesMapV3';

export interface RegionalInvestmentsMapV3Props {
  regionalData: RegionalInvestmentData[];
  mapLocations: MapLocationData[];
  mapTotalInvestment: string;
  sectionTitle?: string;
  className?: string;
}

export default function RegionalInvestmentsMapV3({
  regionalData,
  mapLocations,
  mapTotalInvestment,
  sectionTitle = 'Regional Investments & Climate Impact Drivers',
  className = ''
}: RegionalInvestmentsMapV3Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Section Title */}
      <h2 
        className="text-lg font-semibold mb-6" 
        style={{ color: '#049688' }}
      >
        {sectionTitle}
      </h2>

      {/* Two-column layout: 33% Regional Chart, 67% Map */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left: Investments by Region Chart */}
        <div className="border border-gray-200 rounded-lg p-4">
          <InvestmentsByRegionChartV3 
            data={regionalData}
            showContainer={false}
          />
        </div>

        {/* Right: Philippines Map */}
        <div className="border border-gray-200 rounded-lg p-4">
          <PhilippinesMapV3 
            locations={mapLocations}
            totalInvestment={mapTotalInvestment}
            showContainer={false}
          />
        </div>
      </div>
    </div>
  );
}

