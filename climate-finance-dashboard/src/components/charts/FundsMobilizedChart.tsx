"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

// Sample data based on the mockup
const data = [
  { year: '2019', adaptation: 20, mitigation: 15 },
  { year: '2020', adaptation: 35, mitigation: 25 },
  { year: '2021', adaptation: 45, mitigation: 30 },
  { year: '2022', adaptation: 55, mitigation: 40 },
  { year: '2023', adaptation: 65, mitigation: 45 },
  { year: '2024', adaptation: 75, mitigation: 50 },
  { year: '2025', adaptation: 80, mitigation: 55 },
];

export function FundsMobilizedChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="year" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          label={{ value: 'P000 M', angle: -90, position: 'insideLeft' }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="adaptation"
          stackId="1"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.8}
          name="Adaptation"
        />
        <Area
          type="monotone"
          dataKey="mitigation"
          stackId="1"
          stroke="#06b6d4"
          fill="#06b6d4"
          fillOpacity={0.8}
          name="Mitigation"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
