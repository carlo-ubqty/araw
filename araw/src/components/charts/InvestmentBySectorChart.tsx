"use client";

import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Approximate values in millions (₱ M) to match visual proportions from the mockup
const data = [
  { sector: 'Agriculture', adaptation: 180, mitigation: 150 },
  { sector: 'Water', adaptation: 652, mitigation: 300 },
  { sector: 'Forestry', adaptation: 320, mitigation: 300 },
  { sector: 'Health', adaptation: 200, mitigation: 120 },
  { sector: 'Coastal & Marine', adaptation: 180, mitigation: 140 },
  { sector: 'Human Settlements', adaptation: 240, mitigation: 160 },
  { sector: 'DRRM', adaptation: 190, mitigation: 150 },
  { sector: 'Energy', adaptation: 160, mitigation: 140 },
  { sector: 'Transport', adaptation: 190, mitigation: 170 },
  { sector: 'Industry', adaptation: 150, mitigation: 120 },
  { sector: 'Tourism', adaptation: 200, mitigation: 150 },
  { sector: 'Education', adaptation: 170, mitigation: 140 },
];

// Custom X axis tick to allow two-line labels for long sector names
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomXAxisTick(props: any) {
  const { x, y, payload } = props;
  const parts: string[] = String(payload.value).includes(' & ')
    ? String(payload.value).split(' & ')
    : [String(payload.value)];
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={10} textAnchor="middle" fill="#6b7280" fontSize={10}>
        {parts.map((line, idx) => (
          <tspan key={idx} x={0} dy={idx === 0 ? 0 : 12}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

export function InvestmentBySectorChart() {
  const [activeSector, setActiveSector] = useState<string | null>(null);

  const activeData = useMemo(() => {
    const label = activeSector ?? 'Water';
    return data.find(d => d.sector === label) ?? data[0];
  }, [activeSector]);

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 10 }}
          barCategoryGap="20%"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onMouseMove={(state: any) => {
            if (state && state.activeLabel) {
              setActiveSector(state.activeLabel as string);
            }
          }}
          onMouseLeave={() => setActiveSector(null)}
        >
          <CartesianGrid strokeDasharray="2 6" stroke="#eeeeee" vertical={false} />
          <XAxis
            dataKey="sector"
            axisLine={false}
            tickLine={false}
            interval={0}
            height={50}
            tick={<CustomXAxisTick />}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 900]}
            ticks={[0, 300, 600, 900]}
            tickFormatter={(v: number) => (v === 0 ? 'P0' : `P${v} M`)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const adaptation = payload.find(p => p.dataKey === 'adaptation')?.value as number | undefined;
                const mitigation = payload.find(p => p.dataKey === 'mitigation')?.value as number | undefined;
                return (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 12, borderRadius: 2, background: '#7c3aed', display: 'inline-block' }} />
                      <span>Adaptation</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{adaptation !== undefined ? `₱${adaptation} M` : '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ width: 6, height: 12, borderRadius: 2, background: '#eabf63', display: 'inline-block' }} />
                      <span>Mitigation</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{mitigation !== undefined ? `₱${mitigation} M` : '-'}</span>
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
          <Bar
            dataKey="mitigation"
            stackId="a"
            stroke="#eabf63"
            fill="#eabf63"
            name="Mitigation"
          />
          {/* Top layer - Adaptation (purple) */}
          <Bar
            dataKey="adaptation"
            stackId="a"
            stroke="#7c3aed"
            fill="#7c3aed"
            radius={[2, 2, 0, 0]}
            name="Adaptation"
          />
        </BarChart>
      </ResponsiveContainer>
      {/* Summary panel (always visible, follows hover; defaults to Water) */}
      <div className="absolute top-3 right-3 bg-white border border-gray-200 rounded-md px-3 py-2 text-[12px] text-gray-700">
        <div className="font-semibold mb-1">{activeData.sector}</div>
        <div className="flex items-center gap-2">
          <span className="inline-block" style={{width:6,height:12,borderRadius:2,background:'#7c3aed'}} />
          <span>Adaptation</span>
          <span className="ml-auto font-semibold">{`₱${activeData.adaptation} M`}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block" style={{width:6,height:12,borderRadius:2,background:'#eabf63'}} />
          <span>Mitigation</span>
          <span className="ml-auto font-semibold">{`₱${activeData.mitigation} M`}</span>
        </div>
      </div>
    </div>
  );
}
