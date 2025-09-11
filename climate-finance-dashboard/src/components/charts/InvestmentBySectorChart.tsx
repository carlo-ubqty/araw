"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

// Sample data based on the mockup sectors
const data = [
  { sector: 'Agriculture', adaptation: 15, mitigation: 8 },
  { sector: 'Water', adaptation: 12, mitigation: 6 },
  { sector: 'Forestry', adaptation: 20, mitigation: 25 },
  { sector: 'Health', adaptation: 18, mitigation: 4 },
  { sector: 'Coastal & Marine', adaptation: 22, mitigation: 8 },
  { sector: 'Human Settlements', adaptation: 14, mitigation: 12 },
  { sector: 'DRRM', adaptation: 16, mitigation: 5 },
  { sector: 'Energy', adaptation: 8, mitigation: 30 },
  { sector: 'Transport', adaptation: 10, mitigation: 18 },
  { sector: 'Industry', adaptation: 6, mitigation: 15 },
  { sector: 'Tourism', adaptation: 12, mitigation: 3 },
  { sector: 'Education', adaptation: 8, mitigation: 2 },
];

export function InvestmentBySectorChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="sector" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#666', fontSize: 12 }}
          label={{ value: 'P000 M', angle: -90, position: 'insideLeft' }}
        />
        <Legend />
        <Bar
          dataKey="adaptation"
          stackId="a"
          fill="#8b5cf6"
          name="Adaptation"
        />
        <Bar
          dataKey="mitigation"
          stackId="a"
          fill="#f59e0b"
          name="Mitigation"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
