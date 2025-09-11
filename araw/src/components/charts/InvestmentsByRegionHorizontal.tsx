"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LabelList } from 'recharts';

const data = [
  { region: 'Region I', value: 70 },
  { region: 'Region II', value: 55 },
  { region: 'Region III', value: 92 },
  { region: 'NCR', value: 80 },
  { region: 'CAR', value: 48 },
  { region: 'Region IV-A', value: 88 },
  { region: 'MIMAROPA', value: 52 },
  { region: 'Region V', value: 60 },
  { region: 'Region VI', value: 64 },
  { region: 'Region VII', value: 68 },
  { region: 'Region VIII', value: 58 },
  { region: 'Region IX', value: 62 },
  { region: 'Region X', value: 66 },
  { region: 'Region XI', value: 61 },
  { region: 'Region XII', value: 57 },
  { region: 'Region XIII', value: 90 },
  { region: 'BARMM', value: 72 },
];

export function InvestmentsByRegionHorizontal() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 24, left: 24, bottom: 10 }}
        barSize={32}
        barCategoryGap="28%"
        barGap={8}
      >
        <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" vertical={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(v: number) => `₱${v} M`}
        />
        <YAxis
          type="category"
          dataKey="region"
          axisLine={false}
          tickLine={false}
          tick={false}
          width={0}
        />
        <Tooltip wrapperStyle={{ outline: 'none' }} formatter={(v: number) => [`₱${v} M`, 'Investment']} />
        <Bar dataKey="value" radius={[2, 2, 2, 2]} fill="#7c3aed">
          <LabelList dataKey="region" position="insideLeft" fill="#ffffff" style={{ fontSize: 11, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default InvestmentsByRegionHorizontal;


