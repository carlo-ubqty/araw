/**
 * ARAW V3.0 Dashboard - Funds Mobilized Chart Component
 * 
 * Stacked area chart showing Adaptation and Mitigation funding trends
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-315
 */

'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FUNDS_CHART_COLORS } from '@/lib/design-system-v3';

export interface FundsData {
  year: string;
  adaptation: number;
  mitigation: number;
}

export interface FundsMobilizedChartV3Props {
  data?: FundsData[];
  title?: string;
  subtitle?: string;
  noteText?: string;
  showContainer?: boolean;
  className?: string;
}

export default function FundsMobilizedChartV3({
  data = [],
  title = 'FUNDS MOBILIZED FOR CLIMATE ACTION',
  subtitle = 'Trending up by 5.2% this year 📈',
  noteText,
  showContainer = true,
  className = ''
}: FundsMobilizedChartV3Props) {
  // Format currency for display
  const formatCurrency = (value: number): string => {
    return `₱${value.toLocaleString('en-PH')}`;
  };

  // Format Y-axis tick values
  const formatYAxis = (value: number): string => {
    if (value >= 1000) {
      return `₱${(value / 1000).toFixed(1)} B`;
    }
    return `₱${value} M`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const adaptationValue = payload.find((p: any) => p.dataKey === 'adaptation')?.value || 0;
      const mitigationValue = payload.find((p: any) => p.dataKey === 'mitigation')?.value || 0;

      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg" style={{ width: '180px' }}>
          {/* Header */}
          <div className="px-2 py-1 border-b border-gray-200">
            <p className="font-semibold text-gray-900" style={{ fontSize: '11px' }}>
              {label} Funds
            </p>
          </div>

          {/* Table */}
          <div className="p-2">
            <table className="w-full" style={{ fontSize: '10px' }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-1 font-medium text-gray-700" style={{ fontSize: '9px' }}></th>
                  <th className="text-right pb-1 font-medium text-gray-700" style={{ fontSize: '9px' }}>Actual</th>
                  <th className="text-right pb-1 font-medium text-gray-700 pl-1" style={{ fontSize: '9px' }}>GAA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1 text-gray-600">
                    <span 
                      className="inline-block w-2 h-2 rounded-sm mr-1" 
                      style={{ backgroundColor: FUNDS_CHART_COLORS.adaptation }}
                    ></span>
                    Adapt.
                  </td>
                  <td className="py-1 text-right font-medium text-gray-900">
                    {formatCurrency(adaptationValue)}
                  </td>
                  <td className="py-1 text-right text-gray-500 pl-1">-</td>
                </tr>
                <tr>
                  <td className="py-1 text-gray-600">
                    <span 
                      className="inline-block w-2 h-2 rounded-sm mr-1" 
                      style={{ backgroundColor: FUNDS_CHART_COLORS.mitigation }}
                    ></span>
                    Mitig.
                  </td>
                  <td className="py-1 text-right font-medium text-gray-900">
                    {formatCurrency(mitigationValue)}
                  </td>
                  <td className="py-1 text-right text-gray-500 pl-1">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="px-2 pb-2 pt-1 border-t border-gray-100">
            <p className="font-semibold text-gray-700 mb-0.5" style={{ fontSize: '9px' }}>
              Notes:
            </p>
            <p className="text-gray-600 leading-tight" style={{ fontSize: '9px' }}>
              Only GAA allocations reported for {label}. Actual disbursements not yet available.
            </p>
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
            <path d="M2 14V8M8 14V2M14 14V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {title}
        </h3>
        <p className="text-gray-600 mt-1" style={{ fontSize: '11px' }}>
          {subtitle}
        </p>
      </div>

      {/* Full-width Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAdaptation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FUNDS_CHART_COLORS.adaptation} stopOpacity={0.5}/>
              <stop offset="95%" stopColor={FUNDS_CHART_COLORS.adaptation} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMitigation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FUNDS_CHART_COLORS.mitigation} stopOpacity={0.5}/>
              <stop offset="95%" stopColor={FUNDS_CHART_COLORS.mitigation} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#666666', fontSize: 12 }}
            axisLine={{ stroke: '#e5e5e5' }}
            tickLine={false}
            tickFormatter={formatYAxis}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            iconType="square"
            iconSize={10}
          />
          <Area 
            type="monotone" 
            dataKey="adaptation" 
            stackId="1"
            stroke={FUNDS_CHART_COLORS.adaptation}
            strokeWidth={2}
            fill="url(#colorAdaptation)"
            name="Adaptation"
          />
          <Area 
            type="monotone" 
            dataKey="mitigation" 
            stackId="1"
            stroke={FUNDS_CHART_COLORS.mitigation}
            strokeWidth={2}
            fill="url(#colorMitigation)"
            name="Mitigation"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Note callout (only if noteText is provided) */}
      {noteText && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-gray-700">
            {noteText}
          </p>
        </div>
      )}
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
