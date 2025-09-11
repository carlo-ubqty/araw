"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data based on the mockup showing declining GHG levels
const data = [
  { year: '2019', actual: 45, target: 40 },
  { year: '2020', actual: 42, target: 38 },
  { year: '2021', actual: 40, target: 36 },
  { year: '2022', actual: 37, target: 34 },
  { year: '2023', actual: 35, target: 32 },
  { year: '2024', actual: 33, target: 30 },
  { year: '2025', actual: 30, target: 28 },
];

export function GHGLevelsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          label={{ value: 'GT', angle: -90, position: 'insideLeft' }}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          name="Actual"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#06b6d4"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
          name="Target"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
