// Charts section component - Client Component for interactivity
"use client";

import { useState, useEffect } from 'react';
import { ChartConfig, DashboardFilters } from '@/lib/types';
import { ChartTemplate } from '@/templates/ChartTemplate';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { useChartData } from '@/hooks/useDashboard';

interface DashboardChartsProps {
  initialData: ChartConfig[];
  chartIds?: string[];
  filters?: DashboardFilters;
}

export function DashboardCharts({ initialData, chartIds, filters }: DashboardChartsProps) {
  const [charts, setCharts] = useState<ChartConfig[]>(initialData);
  const { charts: fetchedCharts, loading, error } = useChartData(filters);

  // Update charts when new data is fetched
  useEffect(() => {
    if (fetchedCharts.length > 0) {
      setCharts(fetchedCharts);
    }
  }, [fetchedCharts]);

  // Filter charts by IDs if specified
  const displayCharts = chartIds 
    ? charts.filter(chart => chartIds.includes(chart.id))
    : charts;

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-medium">Error loading chart data</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <>
      {displayCharts.map((chart) => (
        <ChartTemplate
          key={chart.id}
          title={chart.title}
          subtitle={chart.subtitle}
          trend={chart.trend}
          height={chart.height || "h-80"}
          loading={loading}
          error={error || undefined}
        >
          <ChartRenderer config={chart} loading={loading} />
        </ChartTemplate>
      ))}
    </>
  );
}
