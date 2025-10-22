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

  /**
   * Fetch GHG by sector data
   * TODO: Replace with actual API call
   */
  static async getGHGBySectorData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data - 8 sectors with 3 components each
    return [
      { sector: 'Agriculture', actual: 12.5, conditional: 8.2, unconditional: 2.3 },
      { sector: 'Water', actual: 1.2, conditional: 1.17, unconditional: 0.03 },
      { sector: 'Forestry', actual: 15.8, conditional: 10.5, unconditional: 3.2 },
      { sector: 'Health', actual: 0.5, conditional: 0.4, unconditional: 0.1 },
      { sector: 'Coastal', actual: 3.2, conditional: 2.5, unconditional: 0.5 },
      { sector: 'Settlements', actual: 8.5, conditional: 6.2, unconditional: 1.8 },
      { sector: 'DRRM', actual: 2.1, conditional: 1.5, unconditional: 0.4 },
      { sector: 'Energy', actual: 18.3, conditional: 12.8, unconditional: 4.2 },
    ];
  }

  /**
   * Fetch investments by region data (17 Philippine regions)
   * TODO: Replace with actual API call
   */
  static async getInvestmentsByRegionData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data - 17 regions sorted by amount
    return [
      { region: 'BARMM', regionCode: 'BARMM', amount: 85.5, rank: 1 },
      { region: 'Region XIII', regionCode: 'Region XIII', amount: 78.2, rank: 2 },
      { region: 'Region I', regionCode: 'Region I', amount: 72.8, rank: 3 },
      { region: 'Region II', regionCode: 'Region II', amount: 68.4, rank: 4 },
      { region: 'Region X', regionCode: 'Region X', amount: 65.1, rank: 5 },
      { region: 'Region IX', regionCode: 'Region IX', amount: 61.7, rank: 6 },
      { region: 'NCR', regionCode: 'NCR', amount: 58.3, rank: 7 },
      { region: 'Region VIII', regionCode: 'Region VIII', amount: 54.9, rank: 8 },
      { region: 'Region III', regionCode: 'Region III', amount: 51.5, rank: 9 },
      { region: 'Region XI', regionCode: 'Region XI', amount: 48.2, rank: 10 },
      { region: 'Region XII', regionCode: 'Region XII', amount: 44.8, rank: 11 },
      { region: 'Region IV-A', regionCode: 'Region IV-A', amount: 41.4, rank: 12 },
      { region: 'Region IV-B', regionCode: 'Region IV-B', amount: 38.1, rank: 13 },
      { region: 'Region VI', regionCode: 'Region VI', amount: 34.7, rank: 14 },
      { region: 'Region V', regionCode: 'Region V', amount: 31.3, rank: 15 },
      { region: 'Region VII', regionCode: 'Region VII', amount: 27.9, rank: 16 },
      { region: 'CAR', regionCode: 'CAR', amount: 24.5, rank: 17 },
    ];
  }

  /**
   * Fetch map location data with income classes
   * TODO: Replace with actual API call
   */
  static async getMapLocationData(filters?: Partial<FilterState>) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data - Sample locations with coordinates
    return {
      locations: [
        { locationId: '1', locationName: 'Manila', regionName: 'NCR', latitude: 14.5995, longitude: 120.9842, investmentAmount: 1200, incomeClass: 5 as const },
        { locationId: '2', locationName: 'Davao City', regionName: 'Region XI', latitude: 7.1907, longitude: 125.4553, investmentAmount: 850, incomeClass: 4 as const },
        { locationId: '3', locationName: 'Cebu City', regionName: 'Region VII', latitude: 10.3157, longitude: 123.8854, investmentAmount: 720, incomeClass: 4 as const },
        { locationId: '4', locationName: 'Zamboanga', regionName: 'Region IX', latitude: 6.9214, longitude: 122.0790, investmentAmount: 450, incomeClass: 3 as const },
        { locationId: '5', locationName: 'Cagayan de Oro', regionName: 'Region X', latitude: 8.4542, longitude: 124.6319, investmentAmount: 380, incomeClass: 3 as const },
        { locationId: '6', locationName: 'Iloilo City', regionName: 'Region VI', latitude: 10.7202, longitude: 122.5621, investmentAmount: 340, incomeClass: 3 as const },
        { locationId: '7', locationName: 'Baguio City', regionName: 'CAR', latitude: 16.4023, longitude: 120.5960, investmentAmount: 290, incomeClass: 2 as const },
        { locationId: '8', locationName: 'Laoag City', regionName: 'Region I', latitude: 18.1987, longitude: 120.5937, investmentAmount: 250, incomeClass: 2 as const },
        { locationId: '9', locationName: 'Tacloban', regionName: 'Region VIII', latitude: 11.2428, longitude: 125.0039, investmentAmount: 210, incomeClass: 1 as const },
        { locationId: '10', locationName: 'Cotabato City', regionName: 'BARMM', latitude: 7.2231, longitude: 124.2452, investmentAmount: 180, incomeClass: 1 as const },
      ],
      totalInvestment: '₱15.2 B'
    };
  }
}

