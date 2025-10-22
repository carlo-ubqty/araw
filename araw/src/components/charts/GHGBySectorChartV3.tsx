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
  className = ''
}: GHGBySectorChartV3Props) {
  const displaySubtitle = subtitle || `${progressPercentage}% of 2030 reduction target achieved 🔺`;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
          {title}
        </h3>
        {displaySubtitle && (
          <p className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="sector" 
            tick={{ fill: '#6E6E6E', fontSize: 12, fontWeight: 500 }}
            axisLine={{ stroke: '#E0E0E0' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fill: '#6E6E6E', fontSize: 14, fontWeight: 500 }}
            axisLine={{ stroke: '#E0E0E0' }}
            tickFormatter={(value) => `${value} GT`}
            domain={[0, 40]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E0E0E0', 
              borderRadius: '8px',
              fontSize: '13px'
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                actual: 'Actual',
                conditional: 'Conditional',
                unconditional: 'Unconditional'
              };
              return [`${value} GT`, labels[name] || name];
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
            iconType="rect"
            formatter={(value) => {
              const labels: Record<string, string> = {
                actual: '■ Actual',
                conditional: '■ Conditional',
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
          
          {/* Target Lines (if needed) */}
          {/* These would be implemented with ReferenceLine for specific targets */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

