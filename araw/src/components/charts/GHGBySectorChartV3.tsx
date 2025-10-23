/**
 * ARAW V3.0 Dashboard - GHG by Sector Chart Component
 * 
 * Full-width stacked bar chart showing GHG levels vs 2020 baseline by sector
 * with target lines for Conditional and Unconditional targets
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-317
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface GHGBySectorData {
  sector: string;
  inventory2015: number;    // 2015 inventory bar
  inventory2020: number;    // 2020 inventory bar
}

export interface GHGBySectorChartV3Props {
  data?: GHGBySectorData[];
  title?: string;
  subtitle?: string;
  progressPercentage?: number;
  showContainer?: boolean;
  className?: string;
}

// Color scheme for GHG inventory comparison (from mockup)
const GHG_COLORS = {
  inventory2015: '#28C0DB',    // 2015 Inventory - mockup color 01
  inventory2020: '#3490D6',    // 2020 Inventory - mockup color 02
};

export default function GHGBySectorChartV3({
  data = [],
  title = 'SUMMARY OF THE 2015 AND 2020 PHILIPPINE NATIONAL GHG',
  subtitle = 'Overview of greenhouse gas emissions in 2015 and 2020.',
  progressPercentage = 40,
  showContainer = true,
  className = ''
}: GHGBySectorChartV3Props) {
  const displaySubtitle = subtitle;

  const chartContent = (
    <>
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2" style={{ fontSize: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8h4M2 4h6M2 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          {title}
        </h3>
        {displaySubtitle && (
          <p className="text-gray-600 mt-1" style={{ fontSize: '11px' }}>
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis 
            dataKey="sector" 
            tick={{ fill: '#666666', fontSize: 9 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            height={20}
          />
          <YAxis 
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            tickFormatter={(value) => `${value} GT`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px',
              fontSize: '11px'
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                inventory2015: '2015 Inventory',
                inventory2020: '2020 Inventory'
              };
              return [`${value.toFixed(2)} GgCO₂e`, labels[name] || name];
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="rect"
            iconSize={10}
            formatter={(value) => {
              const labels: Record<string, string> = {
                inventory2015: '■ 2015 Inventory',
                inventory2020: '■ 2020 Inventory'
              };
              return labels[value] || value;
            }}
          />
          
          {/* Grouped Bars (not stacked) */}
          <Bar 
            dataKey="inventory2015" 
            fill={GHG_COLORS.inventory2015}
            name="inventory2015"
          />
          <Bar 
            dataKey="inventory2020" 
            fill={GHG_COLORS.inventory2020}
            name="inventory2020"
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

