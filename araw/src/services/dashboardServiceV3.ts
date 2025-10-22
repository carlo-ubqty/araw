/**
 * ARAW V3.0 Dashboard - Service Layer
 * 
 * Business logic and data fetching for V3.0 dashboard components
 * Follows MVC architecture: Service layer handles data, components handle view
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
   * Fetch KPI metrics based on filters
   * TODO: Replace with actual API call when backend is ready
   */
  static async getKPIMetrics(filters?: Partial<FilterState>): Promise<KPIData> {
    // Mock data - will be replaced with API call
    // In production: return await fetch('/api/dashboard/v3/kpis', { body: JSON.stringify(filters) })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock logic: Adjust values based on filters (simulating real behavior)
    const baseInvestment = 1160;
    const baseAdaptation = 1120;
    const baseMitigation = 32.64;
    const baseProjects = 579;
    
    // Apply filter logic (example)
    const multiplier = filters?.selectedYears?.length ? filters.selectedYears.length / 5 : 1;
    
    return {
      totalInvestment: `₱ ${(baseInvestment * multiplier).toFixed(2)} M`,
      ghgReduction: '56%',
      ghgReductionSubtitle: 'vs 2020 baseline',
      adaptationInvestment: `₱ ${(baseAdaptation * multiplier).toFixed(2)} M`,
      mitigationInvestment: `₱ ${(baseMitigation * multiplier).toFixed(2)} M`,
      totalProjects: `${Math.round(baseProjects * multiplier)}`,
    };
  }

  /**
   * Fetch funds mobilized chart data
   * TODO: Replace with actual API call
   */
  static async getFundsMobilizedData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data structure matching chart requirements
    return [
      { year: '2020', adaptation: 200, mitigation: 50 },
      { year: '2021', adaptation: 400, mitigation: 80 },
      { year: '2022', adaptation: 600, mitigation: 120 },
      { year: '2023', adaptation: 800, mitigation: 150 },
      { year: '2024', adaptation: 950, mitigation: 180 },
      { year: '2025', adaptation: 1120, mitigation: 264 },
    ];
  }

  /**
   * Fetch GHG levels chart data
   * TODO: Replace with actual API call
   */
  static async getGHGLevelsData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      historicalData: [
        { year: '1994', ghg: 180 },
        { year: '1998', ghg: 190 },
        { year: '2002', ghg: 200 },
        { year: '2006', ghg: 210 },
        { year: '2010', ghg: 220 },
        { year: '2014', ghg: 215 },
        { year: '2018', ghg: 205 },
        { year: '2020', ghg: 195 },
      ],
      targetData: {
        year: '2024',
        target: -230.580,
        breakdown: [
          { gas: 'Carbon Dioxide (CO₂)', value: '139.194' },
          { gas: 'Methane (CH₄)', value: '70.155' },
          { gas: 'Nitrous Oxide (N₂O)', value: '17.233' },
          { gas: 'Hydrofluorocarbon (HFC)', value: '3.978' },
        ],
      },
    };
  }

  /**
   * Format currency values
   */
  static formatCurrency(value: number, currency = '₱'): string {
    if (value >= 1000) {
      return `${currency}${(value / 1000).toFixed(2)} B`;
    }
    return `${currency}${value.toFixed(2)} M`;
  }

  /**
   * Calculate percentage change
   */
  static calculatePercentageChange(current: number, previous: number): string {
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  }
}

