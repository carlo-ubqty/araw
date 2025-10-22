/**
 * ARAW V3.0 Dashboard - Investment by Sector Chart Component
 * 
 * Stacked vertical bar chart showing investment breakdown by sector and funding type
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-316
 */

'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface SectorInvestmentData {
  sector: string;
  govBudget: number;
  grant: number;
  loan: number;
  private: number;
}

export interface InvestmentBySectorChartV3Props {
  data?: SectorInvestmentData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// Color scheme for funding types (green shades)
const FUNDING_COLORS = {
  govBudget: '#129900',    // Dark green
  grant: '#63CD00',        // Bright green
  loan: '#00AE9A',         // Teal
  private: '#A6C012',      // Yellow-green
};

export default function InvestmentBySectorChartV3({
  data = [],
  title = 'INVESTMENT BY SECTOR',
  subtitle = 'Breakdown by funding type',
  className = ''
}: InvestmentBySectorChartV3Props) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            tickFormatter={(value) => `₱${value}M`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E0E0E0', 
              borderRadius: '8px',
              fontSize: '13px'
            }}
            formatter={(value: number) => [`₱${value}M`, '']}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }}
            iconType="square"
          />
          <Bar 
            dataKey="govBudget" 
            stackId="a" 
            fill={FUNDING_COLORS.govBudget}
            name="🟢 Government Budget"
          />
          <Bar 
            dataKey="grant" 
            stackId="a" 
            fill={FUNDING_COLORS.grant}
            name="🟢 Grant"
          />
          <Bar 
            dataKey="loan" 
            stackId="a" 
            fill={FUNDING_COLORS.loan}
            name="🟦 Loan"
          />
          <Bar 
            dataKey="private" 
            stackId="a" 
            fill={FUNDING_COLORS.private}
            name="🟡 Private"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

