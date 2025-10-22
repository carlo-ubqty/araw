/**
 * ARAW V3.0 Dashboard - GHG Levels Chart Component
 * 
 * Line chart showing GHG emission trends with breakdown table
 * JIRA: ARAW-315
 */

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Mock data for the chart (historical GHG data)
const mockData = [
  { year: '1994', ghg: 180 },
  { year: '1998', ghg: 190 },
  { year: '2002', ghg: 200 },
  { year: '2006', ghg: 210 },
  { year: '2010', ghg: 220 },
  { year: '2014', ghg: 215 },
  { year: '2018', ghg: 205 },
  { year: '2020', ghg: 195 },
];

// 2024 target data
const ghgBreakdown = [
  { gas: 'Carbon Dioxide (CO₂)', value: '139.194' },
  { gas: 'Methane (CH₄)', value: '70.155' },
  { gas: 'Nitrous Oxide (N₂O)', value: '17.233' },
  { gas: 'Hydrofluorocarbon (HFC)', value: '3.978' },
];

export default function GHGLevelsChartV3() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Title and Subtitle */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900" style={{ fontSize: '20px' }}>
          GHG LEVELS
        </h3>
        <p className="text-gray-600 mt-1" style={{ fontSize: '13px' }}>
          Includes CO₂, CH₄, N₂O, and HFCs (values in Gg, summed across gases)
        </p>
      </div>

      <div className="flex gap-6">
        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#6E6E6E', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#E0E0E0' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: '#6E6E6E', fontSize: 14, fontWeight: 500 }}
                axisLine={{ stroke: '#E0E0E0' }}
                tickFormatter={(value) => `${value} Gg`}
                domain={[0, 240]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E0E0E0', 
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
                formatter={(value: number) => [`${value} Gg`, 'GHG Level']}
                labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
              />
              <ReferenceLine 
                y={170} 
                stroke="#EF4444" 
                strokeDasharray="5 5" 
                label={{ value: '2024 Target', position: 'right', fill: '#EF4444', fontSize: 12 }}
              />
              <Line 
                type="monotone" 
                dataKey="ghg" 
                stroke="#0099FF"
                strokeWidth={3}
                dot={{ fill: '#0099FF', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div className="w-64 flex-shrink-0">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900">2024 Target</p>
              <p className="text-2xl font-bold text-blue-600">-230.580 Gg</p>
            </div>
            
            <div className="space-y-2 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-2">Breakdown:</p>
              {ghgBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{item.gas}</span>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

