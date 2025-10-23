/**
 * ARAW V3.0 Dashboard - Investments by Region Chart Component
 * 
 * Horizontal bar chart showing investment amounts for 17 Philippine regions
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-318
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface RegionalInvestmentData {
  region: string;
  regionCode: string;
  amount: number;
  rank: number;
}

export interface InvestmentsByRegionChartV3Props {
  data?: RegionalInvestmentData[];
  title?: string;
  subtitle?: string;
  showContainer?: boolean;
  className?: string;
}

// Color gradient for bars (dark to light blue)
const getBarColor = (index: number, total: number) => {
  const colors = ['#173F75', '#007BFF', '#5093E0', '#8DB7EC'];
  // Distribute colors based on position
  const colorIndex = Math.floor((index / total) * colors.length);
  return colors[Math.min(colorIndex, colors.length - 1)];
};

export default function InvestmentsByRegionChartV3({
  data = [],
  title = 'INVESTMENTS BY REGION',
  subtitle = 'BARMM, Region XIII, and Region I lead in allocations',
  showContainer = true,
  className = ''
}: InvestmentsByRegionChartV3Props) {
  // Sort data by amount (descending) and add colors
  const sortedData = [...data]
    .sort((a, b) => b.amount - a.amount)
    .map((item, index) => ({
      ...item,
      displayName: item.regionCode || item.region,
      fill: getBarColor(index, data.length)
    }));

  const chartContent = (
    <>
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart 
          data={sortedData} 
          layout="horizontal"
          margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
          <XAxis 
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#6E6E6E', fontSize: 12 }}
            axisLine={{ stroke: '#E0E0E0' }}
            tickFormatter={(value) => `₱${value}M`}
          />
          <YAxis 
            type="category"
            dataKey="displayName"
            tick={{ fill: '#6E6E6E', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#E0E0E0' }}
            width={70}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E0E0E0', 
              borderRadius: '8px',
              fontSize: '13px'
            }}
            formatter={(value: number) => [
              `₱${typeof value === 'number' ? value.toFixed(2) : value} M`,
              ''
            ]}
            labelFormatter={() => ''}
          />
          <Bar 
            dataKey="amount" 
            fill="#007BFF"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );

  if (!showContainer) {
    return chartContent;
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {chartContent}
    </div>
  );
}
