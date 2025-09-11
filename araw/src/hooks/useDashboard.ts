// Custom hooks for dashboard data fetching
"use client";

import { useState, useEffect } from 'react';
import { DashboardData, DashboardFilters, KPIMetric, ChartConfig } from '@/lib/types';

interface UseDashboardResult {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseKPIResult {
  kpis: KPIMetric[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseChartsResult {
  charts: ChartConfig[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching complete dashboard data
 */
export function useDashboard(filters?: DashboardFilters): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters) {
        if (filters.dateRange.start) params.append('start', filters.dateRange.start);
        if (filters.dateRange.end) params.append('end', filters.dateRange.end);
        if (filters.sector) params.append('sector', filters.sector);
        if (filters.region) params.append('region', filters.region);
        if (filters.fundingSource) params.append('fundingSource', filters.fundingSource);
        if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
      }

      const response = await fetch(`/api/dashboard?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  return { data, loading, error, refetch: fetchDashboard };
}

/**
 * Hook for fetching KPI data only
 */
export function useKPIData(filters?: DashboardFilters): UseKPIResult {
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters) {
        if (filters.dateRange.start) params.append('start', filters.dateRange.start);
        if (filters.dateRange.end) params.append('end', filters.dateRange.end);
        if (filters.sector) params.append('sector', filters.sector);
        if (filters.region) params.append('region', filters.region);
        if (filters.fundingSource) params.append('fundingSource', filters.fundingSource);
        if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
      }

      const response = await fetch(`/api/dashboard/kpis?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setKpis(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch KPI data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
  }, [filters]);

  return { kpis, loading, error, refetch: fetchKPIs };
}

/**
 * Hook for fetching chart data only
 */
export function useChartData(filters?: DashboardFilters): UseChartsResult {
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters) {
        if (filters.dateRange.start) params.append('start', filters.dateRange.start);
        if (filters.dateRange.end) params.append('end', filters.dateRange.end);
        if (filters.sector) params.append('sector', filters.sector);
        if (filters.region) params.append('region', filters.region);
        if (filters.fundingSource) params.append('fundingSource', filters.fundingSource);
        if (filters.projectStatus) params.append('projectStatus', filters.projectStatus);
      }

      const response = await fetch(`/api/dashboard/charts?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setCharts(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch chart data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, [filters]);

  return { charts, loading, error, refetch: fetchCharts };
}
