"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Data shaped to roughly follow the mockup trend
const data = [
  { year: '2019', adaptation: 30, mitigation: 25 },
  { year: '2020', adaptation: 35, mitigation: 30 },
  { year: '2021', adaptation: 40, mitigation: 32 },
  { year: '2022', adaptation: 50, mitigation: 36 },
  { year: '2023', adaptation: 55, mitigation: 40 },
  { year: '2024', adaptation: 60, mitigation: 45 },
  { year: '2025', adaptation: 62, mitigation: 48 },
];

export function FundsMobilizedChart() {
  const latest = data[data.length - 1];
  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" />
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
          tickFormatter={(v: number) => `P${v}`}
          domain={[0, 120]}
          ticks={[0, 30, 60, 90, 120]}
          label={{ value: 'P000 M', angle: -90, position: 'insideLeft', offset: 10 }}
        />
        <Tooltip
          cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#7c3aed', display: 'inline-block' }} />
                    <span>Adaptation</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{`₱${payload.find(p => p.dataKey === 'adaptation')?.value} M`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 9999, background: '#eabf63', display: 'inline-block' }} />
                    <span>Mitigation</span>
                    <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{`₱${payload.find(p => p.dataKey === 'mitigation')?.value} M`}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
          wrapperStyle={{ outline: 'none' }}
        />
        <Legend
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          content={() => (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 12, fontSize: 13, color: '#374151' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#7c3aed', display: 'inline-block' }} />
                Adaptation
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 9999, background: '#eabf63', display: 'inline-block' }} />
                Mitigation
              </span>
            </div>
          )}
        />
        {/* Bottom layer - Mitigation (sand) */}
        <Area
          type="monotone"
          dataKey="mitigation"
          stackId="1"
          stroke="#eabf63"
          fill="#f5e6b3"
          fillOpacity={1}
          name="Mitigation"
        />
        {/* Top layer - Adaptation (purple) */}
        <Area
          type="monotone"
          dataKey="adaptation"
          stackId="1"
          stroke="#7c3aed"
          fill="#c4b5fd"
          fillOpacity={1}
          name="Adaptation"
        />
        </AreaChart>
      </ResponsiveContainer>
      <div className="absolute top-3 right-3 bg-white border border-gray-200 rounded-md px-3 py-2 text-[12px] text-gray-700">
        <div className="font-semibold mb-1">{latest.year}</div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-600" />
          <span>Adaptation</span>
          <span className="ml-auto font-semibold">{`₱${latest.adaptation} M`}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{background:'#eabf63'}} />
          <span>Mitigation</span>
          <span className="ml-auto font-semibold">{`₱${latest.mitigation} M`}</span>
        </div>
      </div>
    </div>
  );
}
