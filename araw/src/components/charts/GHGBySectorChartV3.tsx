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
  actual: number;           // Light blue bar
  conditional: number;      // Medium blue bar
  unconditional: number;    // Orange bar
  conditionalTarget?: number;    // Dark blue line
  unconditionalTarget?: number;  // Orange line
}

export interface GHGBySectorChartV3Props {
  data?: GHGBySectorData[];
  title?: string;
  subtitle?: string;
  progressPercentage?: number;
  showContainer?: boolean;
  className?: string;
}

// Color scheme for GHG components
const GHG_COLORS = {
  actual: '#AFE2FF',           // Light blue
  conditional: '#006FAF',      // Medium blue
  unconditional: '#F38A00',    // Orange
};

export default function GHGBySectorChartV3({
  data = [],
  title = 'GHG VS 2020 BASELINE BY SECTOR',
  subtitle,
  progressPercentage = 40,
  showContainer = true,
  className = ''
}: GHGBySectorChartV3Props) {
  const displaySubtitle = subtitle || `${progressPercentage}% of 2030 reduction target achieved 🔺`;

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
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis 
            dataKey="sector" 
            tick={{ fill: '#666666', fontSize: 10 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
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
                actual: 'Actual',
                conditional: '% Conditional',
                unconditional: '■ Unconditional'
              };
              return [`${value} GT`, labels[name] || name];
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="rect"
            iconSize={10}
            formatter={(value) => {
              const labels: Record<string, string> = {
                actual: '■ Actual',
                conditional: '■ % Conditional',
                unconditional: '■ Unconditional'
              };
              return labels[value] || value;
            }}
          />
          
          {/* Stacked Bars */}
          <Bar 
            dataKey="actual" 
            stackId="a" 
            fill={GHG_COLORS.actual}
            name="actual"
          />
          <Bar 
            dataKey="conditional" 
            stackId="a" 
            fill={GHG_COLORS.conditional}
            name="conditional"
          />
          <Bar 
            dataKey="unconditional" 
            stackId="a" 
            fill={GHG_COLORS.unconditional}
            name="unconditional"
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

