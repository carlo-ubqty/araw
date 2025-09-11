// Business Logic Layer for Dashboard Data

import { KPIMetric, ChartConfig, DashboardData, DashboardFilters } from '@/lib/types';
import { CHART_COLORS, KPI_COLORS } from '@/lib/constants';

export class DashboardService {
  /**
   * Get KPI metrics with calculations
   */
  static async getKPIMetrics(filters?: DashboardFilters): Promise<KPIMetric[]> {
    // TODO: Replace with actual database queries
    // For now, return mock data with business logic
    
    const baseKPIs: KPIMetric[] = [
      {
        id: 'total_investment',
        title: 'TOTAL INVESTMENT',
        value: 980000000, // 980M
        formattedValue: '₱ 980 M',
        subtitle: 'Last Year: ₱854 M',
        icon: 'DollarSign',
        bgColor: KPI_COLORS.green,
        trend: {
          value: '14.7%',
          isPositive: true,
          direction: 'up',
        },
      },
      {
        id: 'total_projects',
        title: 'TOTAL PROJECTS',
        value: 579,
        formattedValue: '579',
        subtitle: 'Last Year: 445 Projects',
        icon: 'Target',
        bgColor: KPI_COLORS.gray,
        trend: {
          value: '30.1%',
          isPositive: true,
          direction: 'up',
        },
      },
      {
        id: 'ghg_progress',
        title: 'GHG PROGRESS',
        value: 56,
        formattedValue: '56%',
        subtitle: 'Vs 2020 baseline (44.6 GT)',
        icon: 'TrendingUp',
        bgColor: KPI_COLORS.cyan,
        trend: {
          value: '8.2%',
          isPositive: true,
          direction: 'up',
        },
      },
      {
        id: 'adaptation_investment',
        title: 'ADAPTATION INVESTMENT',
        value: 700000000, // 700M
        formattedValue: '₱ 700 M',
        subtitle: 'Last Year: ₱584 M',
        icon: 'MapPin',
        bgColor: KPI_COLORS.pink,
        trend: {
          value: '19.9%',
          isPositive: true,
          direction: 'up',
        },
      },
      {
        id: 'mitigation_investment',
        title: 'MITIGATION INVESTMENT',
        value: 280000000, // 280M
        formattedValue: '₱ 280 M',
        subtitle: 'Last Year: ₱270 M',
        icon: 'Leaf',
        bgColor: KPI_COLORS.orange,
        trend: {
          value: '3.7%',
          isPositive: true,
          direction: 'up',
        },
      },
    ];

    // Apply filters if provided
    if (filters) {
      // TODO: Implement filtering logic
      return this.applyKPIFilters(baseKPIs, filters);
    }

    return baseKPIs;
  }

  /**
   * Get chart configurations with data
   */
  static async getChartConfigs(filters?: DashboardFilters): Promise<ChartConfig[]> {
    // TODO: Replace with actual database queries
    const charts: ChartConfig[] = [
      {
        id: 'funds_mobilized',
        title: 'FUNDS MOBILIZED FOR CLIMATE ACTION',
        subtitle: 'Trending up by 8.2% this year',
        type: 'area',
        data: [
          { year: '2019', adaptation: 20, mitigation: 15 },
          { year: '2020', adaptation: 35, mitigation: 25 },
          { year: '2021', adaptation: 45, mitigation: 30 },
          { year: '2022', adaptation: 55, mitigation: 40 },
          { year: '2023', adaptation: 65, mitigation: 45 },
          { year: '2024', adaptation: 75, mitigation: 50 },
          { year: '2025', adaptation: 80, mitigation: 55 },
        ],
        trend: { value: '8.2%', isPositive: true },
      },
      {
        id: 'ghg_levels',
        title: 'GHG LEVELS',
        subtitle: 'Trending up by 3.4% this year',
        type: 'line',
        data: [
          { year: '2019', level: 44.6, target: 40 },
          { year: '2020', level: 42.3, target: 38 },
          { year: '2021', level: 41.8, target: 36 },
          { year: '2022', level: 40.2, target: 34 },
          { year: '2023', level: 38.9, target: 32 },
          { year: '2024', level: 37.1, target: 30 },
          { year: '2025', level: 35.8, target: 28 },
        ],
        trend: { value: '3.4%', isPositive: true },
      },
      {
        id: 'investment_by_sector',
        title: 'INVESTMENT BY SECTOR',
        subtitle: 'Trending up by 5.7% this year',
        type: 'bar',
        data: [
          { sector: 'Agriculture', adaptation: 15, mitigation: 8 },
          { sector: 'Water', adaptation: 12, mitigation: 6 },
          { sector: 'Forestry', adaptation: 20, mitigation: 25 },
          { sector: 'Health', adaptation: 18, mitigation: 4 },
          { sector: 'Coastal & Marine', adaptation: 22, mitigation: 8 },
          { sector: 'Human Settlements', adaptation: 14, mitigation: 12 },
          { sector: 'DRRM', adaptation: 16, mitigation: 5 },
          { sector: 'Energy', adaptation: 8, mitigation: 30 },
          { sector: 'Transport', adaptation: 10, mitigation: 18 },
          { sector: 'Industry', adaptation: 6, mitigation: 15 },
          { sector: 'Tourism', adaptation: 12, mitigation: 3 },
          { sector: 'Education', adaptation: 8, mitigation: 2 },
        ],
        trend: { value: '5.7%', isPositive: true },
        height: 'h-96',
      },
    ];

    if (filters) {
      // TODO: Implement chart filtering logic
      return this.applyChartFilters(charts, filters);
    }

    return charts;
  }

  /**
   * Get complete dashboard data
   */
  static async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    const [kpis, charts] = await Promise.all([
      this.getKPIMetrics(filters),
      this.getChartConfigs(filters),
    ]);

    return {
      kpis,
      charts,
      filters: [], // TODO: Implement dynamic filters
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Apply filters to KPI data
   */
  private static applyKPIFilters(kpis: KPIMetric[], filters: DashboardFilters): KPIMetric[] {
    // TODO: Implement actual filtering logic based on date range, sector, etc.
    return kpis;
  }

  /**
   * Apply filters to chart data
   */
  private static applyChartFilters(charts: ChartConfig[], filters: DashboardFilters): ChartConfig[] {
    // TODO: Implement actual filtering logic
    return charts;
  }

  /**
   * Calculate percentage change
   */
  static calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Format currency values
   */
  static formatCurrency(amount: number): string {
    if (amount >= 1000000000) {
      return `₱ ${(amount / 1000000000).toFixed(1)} B`;
    } else if (amount >= 1000000) {
      return `₱ ${(amount / 1000000).toFixed(0)} M`;
    } else if (amount >= 1000) {
      return `₱ ${(amount / 1000).toFixed(0)} K`;
    }
    return `₱ ${amount.toFixed(0)}`;
  }
}
