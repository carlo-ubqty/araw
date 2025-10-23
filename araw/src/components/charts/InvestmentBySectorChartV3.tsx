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

// Sector names are already shortened from the data service
// This function is kept for potential future customization
function shortenSectorName(sector: string): string {
  return sector;
}

export default function InvestmentBySectorChartV3({
  data = [],
  title = 'INVESTMENT BY SECTOR',
  subtitle = 'Total climate investments have grown 161% since 2014, with ₱427.8B allocated in 2014.',
  showContainer = true,
  className = ''
}: InvestmentBySectorChartV3Props) {
  // Transform data to use shortened names
  const chartData = data.map(item => ({
    ...item,
    displaySector: shortenSectorName(item.sector),
    fullSector: item.sector
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data.govBudget + data.grant + data.loan + data.private;
      
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '200px' }}>
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="font-semibold text-gray-900" style={{ fontSize: '11px' }}>
              {data.fullSector || label}
            </p>
            <p className="text-gray-600 mt-0.5" style={{ fontSize: '10px' }}>
              Total: ₱{total.toFixed(1)}M
            </p>
          </div>

          {/* Breakdown */}
          <div className="p-2">
            <table className="w-full" style={{ fontSize: '10px' }}>
              <tbody>
                {data.govBudget > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-1 text-gray-600">
                      <span 
                        className="inline-block w-2 h-2 rounded-sm mr-1" 
                        style={{ backgroundColor: FUNDING_COLORS.govBudget }}
                      ></span>
                      Gov Budget
                    </td>
                    <td className="py-1 text-right font-medium text-gray-900">
                      ₱{data.govBudget.toFixed(1)}M
                    </td>
                  </tr>
                )}
                {data.grant > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-1 text-gray-600">
                      <span 
                        className="inline-block w-2 h-2 rounded-sm mr-1" 
                        style={{ backgroundColor: FUNDING_COLORS.grant }}
                      ></span>
                      Grant
                    </td>
                    <td className="py-1 text-right font-medium text-gray-900">
                      ₱{data.grant.toFixed(1)}M
                    </td>
                  </tr>
                )}
                {data.loan > 0 && (
                  <tr className="border-b border-gray-100">
                    <td className="py-1 text-gray-600">
                      <span 
                        className="inline-block w-2 h-2 rounded-sm mr-1" 
                        style={{ backgroundColor: FUNDING_COLORS.loan }}
                      ></span>
                      Loan
                    </td>
                    <td className="py-1 text-right font-medium text-gray-900">
                      ₱{data.loan.toFixed(1)}M
                    </td>
                  </tr>
                )}
                {data.private > 0 && (
                  <tr>
                    <td className="py-1 text-gray-600">
                      <span 
                        className="inline-block w-2 h-2 rounded-sm mr-1" 
                        style={{ backgroundColor: FUNDING_COLORS.private }}
                      ></span>
                      Private
                    </td>
                    <td className="py-1 text-right font-medium text-gray-900">
                      ₱{data.private.toFixed(1)}M
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return null;
  };

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
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis 
            dataKey="displaySector" 
            tick={{ fill: '#666666', fontSize: 9 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            height={20}
          />
          <YAxis 
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            tickFormatter={(value) => `₱${value}M`}
          />
          <Tooltip content={<CustomTooltip />} />
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


