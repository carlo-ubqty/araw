"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Data matching the screenshot percentages and amounts
const fundSourceData = [
  { name: 'Gov\'t Budget', value: 40, amount: 400, color: '#22543d' },
  { name: 'Grant', value: 32, amount: 320, color: '#38a169' },
  { name: 'Loan', value: 18, amount: 176, color: '#68d391' },
  { name: 'Private', value: 10, amount: 98, color: '#c6f6d5' }
];

const RADIAN = Math.PI / 180;

// Custom label function for outside positioning
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderOutsideLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name } = props;
  const radius = outerRadius + 25; // Position outside the pie
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#374151" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={11}
      fontWeight="500"
    >
      {name}
    </text>
  );
};

// Custom label function for percentage inside pie
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderInsideLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor="middle" 
      dominantBaseline="central"
      fontSize={13}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function FundSourceChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={fundSourceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderInsideLabel}
            outerRadius={80}
            innerRadius={0}
            fill="#8884d8"
            dataKey="value"
          >
            {fundSourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Pie
            data={fundSourceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderOutsideLabel}
            outerRadius={80}
            innerRadius={0}
            fill="transparent"
            dataKey="value"
            stroke="none"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
                    <div className="font-semibold text-gray-900">
                      {data.name === 'Gov\'t Budget' ? 'Government Budget' : data.name}
                    </div>
                    <div className="text-sm text-gray-600">{data.value}% (₱{data.amount}M)</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}