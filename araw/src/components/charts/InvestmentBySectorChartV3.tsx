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
  showContainer?: boolean;
  className?: string;
}

// Color scheme for funding types (matching mockup)
const FUNDING_COLORS = {
  govBudget: '#0A5F4E',    // Dark green (Government Budget)
  grant: '#63CD00',        // Bright green (Grant)
  loan: '#00AE9A',         // Teal (Loan)
  private: '#A6C012',      // Yellow-green (Private)
};

export default function InvestmentBySectorChartV3({
  data = [],
  title = 'INVESTMENT BY SECTOR',
  subtitle = 'Total climate investments have grown 161% since 2014, with ₱427.8B allocated in 2014.',
  showContainer = true,
  className = ''
}: InvestmentBySectorChartV3Props) {
  const chartContent = (
    <>
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2" style={{ fontSize: '14px' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="3" height="8" fill="currentColor"/>
            <rect x="6.5" y="3" width="3" height="11" fill="currentColor"/>
            <rect x="11" y="8" width="3" height="6" fill="currentColor"/>
          </svg>
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-600 mt-1" style={{ fontSize: '11px' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 80 }}>
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
            tickFormatter={(value) => `₱${value}M`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e0e0e0', 
              borderRadius: '6px',
              fontSize: '11px'
            }}
            formatter={(value: number) => [`₱${value}M`, '']}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="square"
            iconSize={10}
          />
          <Bar 
            dataKey="govBudget" 
            stackId="a" 
            fill={FUNDING_COLORS.govBudget}
            name="Government Budget"
          />
          <Bar 
            dataKey="grant" 
            stackId="a" 
            fill={FUNDING_COLORS.grant}
            name="Grant"
          />
          <Bar 
            dataKey="loan" 
            stackId="a" 
            fill={FUNDING_COLORS.loan}
            name="Loan"
          />
          <Bar 
            dataKey="private" 
            stackId="a" 
            fill={FUNDING_COLORS.private}
            name="Private"
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


