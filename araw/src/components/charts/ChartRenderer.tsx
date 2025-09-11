// Dynamic chart renderer based on chart configuration
"use client";

import { ChartConfig } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, BarChart, Bar, LineChart, Line } from 'recharts';
import { CHART_COLORS } from '@/lib/constants';

interface ChartRendererProps {
  config: ChartConfig;
  loading?: boolean;
}

export function ChartRenderer({ config, loading = false }: ChartRendererProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  const commonProps = {
    data: config.data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const axisProps = {
    axisLine: false,
    tickLine: false,
    tick: { fill: '#666', fontSize: 12 }
  };

  switch (config.type) {
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} label={{ value: 'P000 M', angle: -90, position: 'insideLeft' }} />
            <Legend />
            <Area
              type="monotone"
              dataKey="adaptation"
              stackId="1"
              stroke={CHART_COLORS.adaptation}
              fill={CHART_COLORS.adaptation}
              fillOpacity={0.8}
              name="Adaptation"
            />
            <Area
              type="monotone"
              dataKey="mitigation"
              stackId="1"
              stroke={CHART_COLORS.mitigation}
              fill={CHART_COLORS.mitigation}
              fillOpacity={0.8}
              name="Mitigation"
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} label={{ value: 'GT CO₂e', angle: -90, position: 'insideLeft' }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="level"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              name="Current Level"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke={CHART_COLORS.secondary}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="sector" 
              {...axisProps}
              tick={{ fill: '#666', fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis {...axisProps} label={{ value: 'P000 M', angle: -90, position: 'insideLeft' }} />
            <Legend />
            <Bar
              dataKey="adaptation"
              stackId="a"
              fill={CHART_COLORS.adaptation}
              name="Adaptation"
            />
            <Bar
              dataKey="mitigation"
              stackId="a"
              fill={CHART_COLORS.mitigation}
              name="Mitigation"
            />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Chart type &quot;{config.type}&quot; not implemented yet</p>
        </div>
      );
  }
}
