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

  /**
   * Fetch investment by sector data
   * TODO: Replace with actual API call
   */
  static async getInvestmentBySectorData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data - sectors vary based on NAP/NDCIP filter
    const napSectors = [
      { sector: 'Agriculture', govBudget: 120, grant: 80, loan: 40, private: 20 },
      { sector: 'Water', govBudget: 100, grant: 60, loan: 30, private: 15 },
      { sector: 'Forestry', govBudget: 90, grant: 50, loan: 25, private: 10 },
      { sector: 'Health', govBudget: 80, grant: 40, loan: 20, private: 8 },
      { sector: 'Coastal', govBudget: 70, grant: 35, loan: 15, private: 5 },
      { sector: 'Settlements', govBudget: 60, grant: 30, loan: 12, private: 4 },
      { sector: 'DRRM', govBudget: 50, grant: 25, loan: 10, private: 3 },
      { sector: 'Energy', govBudget: 110, grant: 70, loan: 35, private: 18 },
    ];

    const ndcipSectors = [
      { sector: 'Agriculture', govBudget: 130, grant: 85, loan: 45, private: 22 },
      { sector: 'Waste', govBudget: 95, grant: 55, loan: 28, private: 12 },
      { sector: 'Industry', govBudget: 115, grant: 75, loan: 38, private: 19 },
      { sector: 'Transport', govBudget: 105, grant: 65, loan: 32, private: 16 },
      { sector: 'Energy', govBudget: 125, grant: 80, loan: 40, private: 20 },
    ];

    return filters?.dataView === 'NDCIP' ? ndcipSectors : napSectors;
  }

  /**
   * Fetch fund source breakdown data
   * TODO: Replace with actual API call
   */
  static async getFundSourceBreakdownData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      mainSource: {
        label: 'GOVERNMENT BUDGET',
        amount: '₱ 980 M',
        percentage: '40%',
        color: '#049688'
      },
      subSources: [
        { label: 'GRANT', amount: '₱ 310 M', percentage: '32%', color: '#63CD00' },
        { label: 'LOAN', amount: '₱ 175 M', percentage: '18%', color: '#00AE9A' },
        { label: 'PRIVATE', amount: '₱ 95 M', percentage: '10%', color: '#A6C012' }
      ]
    };
  }
}

