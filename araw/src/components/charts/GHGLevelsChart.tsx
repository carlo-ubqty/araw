"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Data approximating the mockup: single declining purple line
const data = [
  { year: '2019', ghg: 45 },
  { year: '2020', ghg: 41 },
  { year: '2021', ghg: 39 },
  { year: '2022', ghg: 36 },
  { year: '2023', ghg: 33 },
  { year: '2024', ghg: 29 },
  { year: '2025', ghg: 27 },
];

export function GHGLevelsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" vertical={false} />
        <XAxis
          dataKey="year"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          label={{ value: 'GT', angle: -90, position: 'insideLeft', offset: 10 }}
        />
        <Tooltip
          cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          formatter={(value: number) => [`${value} GT`, 'GHG']}
          contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }}
        />
        <Line
          type="monotone"
          dataKey="ghg"
          stroke="#7c3aed"
          strokeWidth={3}
          dot={{ r: 4, fill: '#7c3aed' }}
          name="GHG"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
