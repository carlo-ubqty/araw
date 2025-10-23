/**
 * ARAW V3.0 Dashboard - GHG Levels Chart Component
 * 
 * Line chart showing GHG emission trends with breakdown table
 * Follows MVC: Component receives data via props (no hardcoded data)
 * JIRA: ARAW-315
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export interface GHGHistoricalData {
  year: string;
  ghg: number;
}

export interface GHGBreakdownItem {
  gas: string;
  value: string;
}

export interface GHGTargetData {
  year: string;
  target: number;
  breakdown: GHGBreakdownItem[];
}

export interface GHGLevelsChartV3Props {
  historicalData?: GHGHistoricalData[];
  targetData?: GHGTargetData;
  title?: string;
  subtitle?: string;
  showContainer?: boolean;
  className?: string;
}

export default function GHGLevelsChartV3({
  historicalData = [],
  targetData,
  title = 'GHG LEVELS',
  subtitle = 'Includes CO₂, CH₄, N₂O, and HFCs (values in Gg, summed across gases)',
  showContainer = true,
  className = ''
}: GHGLevelsChartV3Props) {
  // Custom tooltip with target data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && targetData) {
      const ghgValue = payload[0].value;
      
      return (
        <div className="bg-white border border-gray-200 rounded-md shadow-lg" style={{ minWidth: '200px' }}>
          {/* Header */}
          <div className="px-2 py-1 border-b border-gray-200">
            <p className="font-semibold text-gray-900" style={{ fontSize: '11px' }}>
              {label}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-medium text-blue-600" style={{ fontSize: '10px' }}>🌍 GHG</span>
              <span className="font-bold text-gray-900" style={{ fontSize: '14px' }}>{ghgValue} Gg</span>
            </div>
          </div>

          {/* Target Section */}
          <div className="p-2">
            <p className="font-semibold text-gray-900 mb-1" style={{ fontSize: '10px' }}>
              {targetData.year} Target
            </p>
            <p className="font-bold text-blue-600 mb-2" style={{ fontSize: '16px' }}>{targetData.target} Gg</p>
            
            {targetData.breakdown.length > 0 && (
              <div className="space-y-0.5 pt-1.5 border-t border-gray-200">
                <p className="font-semibold text-gray-700 mb-1" style={{ fontSize: '9px' }}>Breakdown:</p>
                {targetData.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center" style={{ fontSize: '9px' }}>
                    <span className="text-gray-600">{item.gas}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
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
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 8L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="8" cy="10.5" r="0.5" fill="currentColor"/>
          </svg>
          {title}
        </h3>
        <p className="text-gray-600 mt-1" style={{ fontSize: '11px' }}>
          {subtitle}
        </p>
      </div>

      {/* Full-width Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={historicalData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
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
            tickFormatter={(value) => `${value} Gg`}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={targetData?.target || 170} 
            stroke="#EF4444" 
            strokeDasharray="5 5" 
            label={{ 
              value: `${targetData?.year || '2024'} Target`, 
              position: 'insideTopRight', 
              fill: '#EF4444', 
              fontSize: 11,
              offset: 10
            }}
          />
          <Line 
            type="monotone" 
            dataKey="ghg" 
            stroke="#0099FF"
            strokeWidth={2}
            dot={{ fill: '#0099FF', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
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
