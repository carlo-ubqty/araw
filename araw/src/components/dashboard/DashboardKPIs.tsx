// KPI section component - Client Component for interactivity
"use client";

import { useState, useEffect } from 'react';
import { KPIMetric, DashboardFilters } from '@/lib/types';
import { KPICard } from '@/components/ui/KPICard.refactored';
import { useKPIData } from '@/hooks/useDashboard';

interface DashboardKPIsProps {
  initialData: KPIMetric[];
  filters?: DashboardFilters;
}

export function DashboardKPIs({ initialData, filters }: DashboardKPIsProps) {
  const [kpis, setKpis] = useState<KPIMetric[]>(initialData);
  const { kpis: fetchedKpis, loading, error } = useKPIData(filters);

  // Update KPIs when new data is fetched
  useEffect(() => {
    if (fetchedKpis.length > 0) {
      setKpis(fetchedKpis);
    }
  }, [fetchedKpis]);

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 font-medium">Error loading KPI data</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {kpis.map((metric) => (
        <KPICard 
          key={metric.id} 
          metric={metric} 
          loading={loading}
        />
      ))}
    </>
  );
}
