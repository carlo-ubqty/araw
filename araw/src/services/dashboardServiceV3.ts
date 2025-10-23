/**
 * ARAW V3.0 Dashboard - Service Layer
 * 
 * Business logic and data fetching for V3.0 dashboard components
 * Follows MVC architecture: Service layer handles data, components handle view
 * 
 * CLIENT-SIDE SERVICE: Calls server-side API routes to fetch database data
 * NO MOCK DATA FALLBACKS - Returns empty state if database unavailable
 */

import { FilterState } from '@/lib/types-v3';

// ============================================================================
// KPI DATA
// ============================================================================

export interface KPIData {
  totalInvestment: string;
  ghgReduction: string;
  ghgReductionSubtitle: string;
  adaptationInvestment: string;
  mitigationInvestment: string;
  totalProjects: string;
}

export class DashboardServiceV3 {
  /**
   * Fetch KPI metrics from API (server-side database query)
   */
  static async getKPIMetrics(filters?: Partial<FilterState>): Promise<KPIData> {
    try {
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters?.selectedYears && filters.selectedYears.length > 0) {
        params.set('years', filters.selectedYears.join(','));
      }
      if (filters?.dataView) {
        params.set('dataView', filters.dataView);
      }
      if (filters?.projectStatus) {
        params.set('projectStatus', filters.projectStatus);
      }
      
      // Call API route (server-side)
      const response = await fetch(`/api/dashboard/kpis?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[DashboardService] Failed to fetch KPIs:', error);
      
      // Return empty/no data state (NO MOCK DATA FALLBACK)
      return {
        totalInvestment: '₱ 0.00 M',
        ghgReduction: 'No data',
        ghgReductionSubtitle: '',
        adaptationInvestment: '₱ 0.00 M',
        mitigationInvestment: '₱ 0.00 M',
        totalProjects: '0',
      };
    }
  }

  /**
   * Fetch all chart data from API (server-side database query)
   */
  static async getAllChartsData(filters?: Partial<FilterState>) {
    try {
      // Build query params from filters
      const params = new URLSearchParams();
      if (filters?.selectedYears && filters.selectedYears.length > 0) {
        params.set('years', filters.selectedYears.join(','));
      }
      if (filters?.dataView) {
        params.set('dataView', filters.dataView);
      }
      if (filters?.projectStatus) {
        params.set('projectStatus', filters.projectStatus);
      }
      
      // Call API route (server-side)
      const response = await fetch(`/api/dashboard/charts?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[DashboardService] Failed to fetch charts:', error);
      
      // Return empty data state (NO MOCK DATA FALLBACK)
      return {
        fundsMobilized: [],
        ghgHistorical: [],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      };
    }
  }

  /**
   * Fetch funds mobilized chart data
   */
  static async getFundsMobilizedData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return data.fundsMobilized || [];
  }

  /**
   * Fetch GHG levels chart data
   */
  static async getGHGLevelsData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return {
      historicalData: data.ghgHistorical || [],
      targetData: {
        year: '2024',
        target: 165, // Target line in Gg (below 2024 projected value of 170)
        breakdown: [
          { gas: 'Carbon Dioxide (CO₂)', value: '99.0' },
          { gas: 'Methane (CH₄)', value: '42.0' },
          { gas: 'Nitrous Oxide (N₂O)', value: '18.5' },
          { gas: 'Hydrofluorocarbon (HFC)', value: '5.5' },
        ],
      },
    };
  }

  /**
   * Fetch investment by sector data
   */
  static async getInvestmentBySectorData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return data.investmentBySector || [];
  }

  /**
   * Fetch fund source breakdown data
   */
  static async getFundSourceBreakdownData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return data.fundSourceBreakdown || { mainSource: null, subSources: [] };
  }

  /**
   * Fetch GHG by sector data
   */
  static async getGHGBySectorData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return data.ghgBySector || [];
  }

  /**
   * Fetch investments by region data (17 Philippine regions)
   */
  static async getInvestmentsByRegionData(filters?: Partial<FilterState>) {
    const data = await this.getAllChartsData(filters);
    return data.regionalInvestments || [];
  }

  /**
   * Format currency values
   */
  static formatCurrency(value: number, currency = '₱'): string {
    // Value is in PHP, convert to millions or billions
    const millions = value / 1000000;
    
    if (millions >= 1000) {
      return `${currency} ${(millions / 1000).toFixed(2)} B`;
    }
    return `${currency} ${millions.toFixed(2)} M`;
  }

  /**
   * Calculate percentage change
   */
  static calculatePercentageChange(current: number, previous: number): string {
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  }
}
