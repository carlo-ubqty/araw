"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Colors adjusted to match mockup: lighter for Conditional, darker for Unconditional
const COLOR_CONDITIONAL = '#3ec0ff';
const COLOR_UNCONDITIONAL = '#1f7ae0';

const data = [
  { sector: 'Agriculture', conditional: 14, unconditional: 12 },
  { sector: 'Water', conditional: 21, unconditional: 20 },
  { sector: 'Forestry', conditional: 28, unconditional: 32 },
  { sector: 'Health', conditional: 18, unconditional: 15 },
  { sector: 'Coastal & Marine', conditional: 20, unconditional: 14 },
  { sector: 'Human Settlements', conditional: 24, unconditional: 16 },
  { sector: 'DRRM', conditional: 20, unconditional: 13 },
  { sector: 'Energy', conditional: 30, unconditional: 23 },
  { sector: 'Transport', conditional: 21, unconditional: 14 },
  { sector: 'Industry', conditional: 16, unconditional: 12 },
  { sector: 'Tourism', conditional: 20, unconditional: 15 },
  { sector: 'Education', conditional: 14, unconditional: 13 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTick(props: any) {
  const { x, y, payload } = props;
  const parts = String(payload.value).includes(' & ')
    ? String(payload.value).split(' & ')
    : [String(payload.value)];
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={10} textAnchor="middle" fill="#6b7280" fontSize={10}>
        {parts.map((line: string, idx: number) => (
          <tspan key={idx} x={0} dy={idx === 0 ? 0 : 12}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

export function GHGBySectorChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 10 }} barCategoryGap="8%" barGap={4} barSize={28}>
        <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" vertical={false} />
        <XAxis dataKey="sector" axisLine={false} tickLine={false} interval={0} height={50} tick={<CustomTick />} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 45]} ticks={[0, 10, 20, 30, 40]}
          tickFormatter={(v: number) => (v === 0 ? '0 GT' : `${v} GT`)}
        />
        <Tooltip wrapperStyle={{ outline: 'none' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Legend align="center" verticalAlign="bottom" iconType="circle"
          content={() => (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 12, fontSize: 13, color: '#374151' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: COLOR_CONDITIONAL, display: 'inline-block' }} />
                Conditional Target
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: COLOR_UNCONDITIONAL, display: 'inline-block' }} />
                Unconditional Target
              </span>
            </div>
          )}
        />
        <Bar dataKey="conditional" name="Conditional" radius={[2, 2, 0, 0]} fill={COLOR_CONDITIONAL} />
        <Bar dataKey="unconditional" name="Unconditional" radius={[2, 2, 0, 0]} fill={COLOR_UNCONDITIONAL} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GHGBySectorChart;


