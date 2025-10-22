/**
 * ARAW V3.0 Dashboard - Funds Mobilized Chart Component
 * 
 * Stacked area chart showing Adaptation and Mitigation funding trends
 * JIRA: ARAW-315
 */

'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FUNDS_CHART_COLORS } from '@/lib/design-system-v3';

// Mock data for the chart
const mockData = [
  { year: '2020', adaptation: 200, mitigation: 50 },
  { year: '2021', adaptation: 400, mitigation: 80 },
  { year: '2022', adaptation: 600, mitigation: 120 },
  { year: '2023', adaptation: 800, mitigation: 150 },
  { year: '2024', adaptation: 950, mitigation: 180 },
  { year: '2025', adaptation: 1120, mitigation: 264 },
];

export default function FundsMobilizedChartV3() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
          FUNDS MOBILIZED FOR CLIMATE ACTION
        </h3>
        <p className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>
          Trending up by 5.2% this year 📈
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAdaptation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FUNDS_CHART_COLORS.adaptation} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={FUNDS_CHART_COLORS.adaptation} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMitigation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FUNDS_CHART_COLORS.mitigation} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={FUNDS_CHART_COLORS.mitigation} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="year" 
            tick={{ fill: '#6E6E6E', fontSize: 14, fontWeight: 500 }}
            axisLine={{ stroke: '#E0E0E0' }}
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
          <Area 
            type="monotone" 
            dataKey="adaptation" 
            stackId="1"
            stroke={FUNDS_CHART_COLORS.adaptation}
            strokeWidth={2}
            fill="url(#colorAdaptation)"
            name="🟧 Adaptation"
          />
          <Area 
            type="monotone" 
            dataKey="mitigation" 
            stackId="1"
            stroke={FUNDS_CHART_COLORS.mitigation}
            strokeWidth={2}
            fill="url(#colorMitigation)"
            name="🟨 Mitigation"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Note callout */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-gray-700">
          <strong>2025 (GAA)</strong>
          <br />
          🟧 Adaptation: ₱1,120 M | 🟨 Mitigation: ₱264 M
          <br />
          <span className="text-gray-600">
            • Both funds are GAA allocations for 2025 and do not represent actual disbursements
          </span>
        </p>
      </div>
    </div>
  );
}

