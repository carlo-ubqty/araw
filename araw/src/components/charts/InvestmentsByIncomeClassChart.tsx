"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts';

// Data matching the screenshot proportions - ordered from top to bottom to match mockup
const incomeClassData = [
  { category: 'Government Budget', amount: 400, color: '#14532d' },
  { category: 'Grant', amount: 300, color: '#16a34a' },
  { category: 'Loan', amount: 200, color: '#4ade80' },
  { category: 'Private', amount: 100, color: '#bbf7d0' }
];

export function InvestmentsByIncomeClassChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={incomeClassData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        barSize={35}
        barCategoryGap="1%"
        barGap={0}
      >
        <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" vertical={false} />
        <XAxis
          type="number"
          domain={[0, 500]}
          ticks={[0, 100, 200, 300, 400, 500]}
          tickFormatter={(value) => `₱${value}M`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="category"
          axisLine={false}
          tickLine={false}
          tick={false}
          width={0}
        />
        <Tooltip
          wrapperStyle={{ outline: 'none' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: number, name: string, props: any) => [
            `₱${value}M`,
            `${props.payload.category} Investment`
          ]}
        />
        <Bar dataKey="amount" radius={[2, 2, 2, 2]}>
          {incomeClassData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList 
            dataKey="category" 
            position="insideLeft" 
            style={{ fontSize: 11, fontWeight: 600 }} 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            content={(props: any) => {
              const { x, y, width, height, value } = props;
              const textColor = value === 'Government Budget' || value === 'Grant' ? '#ffffff' : '#000000';
              return (
                <text 
                  x={x + 8} 
                  y={y + height / 2} 
                  fill={textColor} 
                  fontSize="11" 
                  fontWeight="600"
                  dominantBaseline="middle"
                >
                  {value}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}