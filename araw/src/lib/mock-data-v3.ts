/**
 * ARAW V3.0 Dashboard - Mock Data Generators
 * 
 * Realistic mock data for all dashboard sections
 * This data will be replaced with real data in Phase 2
 */

import type {
  KeyMetrics,
  FundsMobilizedSeries,
  GHGLevelsSeries,
  InvestmentBySectorData,
  FundSourceBreakdown,
  GHGBaselineData,
  InvestmentsByRegionData,
  ChoroplethMapData,
  FilterOptions,
  Funder,
  Agency
} from './types-v3';

// ============================================================================
// KEY METRICS MOCK DATA
// ============================================================================

export const mockKeyMetrics: KeyMetrics = {
  totalInvestment: {
    value: 1160000000, // 1.16 billion
    displayValue: '₱ 1.16 B',
    currency: 'PHP',
    lastYear: {
      value: 760000000,
      displayValue: '₱ 760 M'
    }
  },
  ghgReduction: {
    percentage: 56,
    baselineYear: 2020,
    targetPercentage: 60
  },
  adaptationInvestment: {
    value: 1120000000, // 1.12 billion
    displayValue: '₱ 1.12 B',
    currency: 'PHP',
    lastYear: {
      value: 600000000,
      displayValue: '₱ 600 M'
    }
  },
  mitigationInvestment: {
    value: 32640000, // 32.64 million
    displayValue: '₱ 32.64 M',
    currency: 'PHP',
    lastYear: {
      value: 50000000,
      displayValue: '₱ 50 M'
    }
  },
  totalProjects: {
    count: 579,
    displayValue: '579 Projects',
    lastYear: {
      count: 400,
      displayValue: '400 Projects'
    }
  }
};

// ============================================================================
// FUNDS MOBILIZED CHART MOCK DATA
// ============================================================================

export const mockFundsMobilized: FundsMobilizedSeries = [
  {
    year: 2020,
    adaptation: 200000000,
    mitigation: 150000000,
    dataType: 'Actual'
  },
  {
    year: 2021,
    adaptation: 250000000,
    mitigation: 180000000,
    dataType: 'Actual'
  },
  {
    year: 2022,
    adaptation: 350000000,
    mitigation: 200000000,
    dataType: 'Actual'
  },
  {
    year: 2023,
    adaptation: 500000000,
    mitigation: 250000000,
    dataType: 'Actual'
  },
  {
    year: 2024,
    adaptation: 700000000,
    mitigation: 300000000,
    dataType: 'GAA'
  },
  {
    year: 2025,
    adaptation: 123498351000,
    mitigation: 12612534000,
    dataType: 'GAA',
    notes: 'Both funds are GAA allocations for 2025 and do not represent actual disbursements'
  }
];

// ============================================================================
// GHG LEVELS CHART MOCK DATA
// ============================================================================

export const mockGHGLevels: GHGLevelsSeries = [
  {
    year: 1994,
    totalGHG: 100,
    breakdown: { co2: 60, ch4: 25, n2o: 10, hfc: 5 },
    isProjection: false
  },
  {
    year: 2000,
    totalGHG: 120,
    breakdown: { co2: 72, ch4: 30, n2o: 12, hfc: 6 },
    isProjection: false
  },
  {
    year: 2010,
    totalGHG: 160,
    breakdown: { co2: 96, ch4: 40, n2o: 16, hfc: 8 },
    isProjection: false
  },
  {
    year: 2015,
    totalGHG: 180,
    breakdown: { co2: 108, ch4: 45, n2o: 18, hfc: 9 },
    isProjection: false
  },
  {
    year: 2020,
    totalGHG: 200,
    breakdown: { co2: 120, ch4: 50, n2o: 20, hfc: 10 },
    isProjection: false
  },
  {
    year: 2024,
    totalGHG: -230.580,
    breakdown: {
      co2: 139.194,
      ch4: 70.155,
      n2o: 17.233,
      hfc: 3.978
    },
    isProjection: true,
    targetValue: -230.580
  }
];

// ============================================================================
// INVESTMENT BY SECTOR MOCK DATA
// ============================================================================

export const mockInvestmentBySector: InvestmentBySectorData = [
  {
    sector: 'Agriculture',
    governmentBudget: 150000000,
    grant: 50000000,
    loan: 30000000,
    private: 20000000,
    total: 250000000
  },
  {
    sector: 'Water',
    governmentBudget: 250000000,
    grant: 52000000,
    loan: 52000000,
    private: 100000000,
    total: 454000000
  },
  {
    sector: 'Forestry',
    governmentBudget: 180000000,
    grant: 40000000,
    loan: 35000000,
    private: 15000000,
    total: 270000000
  },
  {
    sector: 'Health',
    governmentBudget: 200000000,
    grant: 45000000,
    loan: 40000000,
    private: 25000000,
    total: 310000000
  },
  {
    sector: 'Coastal & Marine',
    governmentBudget: 120000000,
    grant: 30000000,
    loan: 25000000,
    private: 10000000,
    total: 185000000
  },
  {
    sector: 'Human Settlements',
    governmentBudget: 280000000,
    grant: 60000000,
    loan: 55000000,
    private: 30000000,
    total: 425000000
  },
  {
    sector: 'DRRM',
    governmentBudget: 220000000,
    grant: 48000000,
    loan: 42000000,
    private: 20000000,
    total: 330000000
  },
  {
    sector: 'Energy',
    governmentBudget: 300000000,
    grant: 70000000,
    loan: 60000000,
    private: 50000000,
    total: 480000000
  }
];

// ============================================================================
// FUND SOURCE BREAKDOWN MOCK DATA
// ============================================================================

export const mockFundSource: FundSourceBreakdown = [
  {
    sourceType: 'Government Budget',
    amount: 980000000,
    percentage: 40,
    insights: 'Largest funding source, contributing nearly half of total climate funds.',
    details: {
      subCategories: ['National Budget', 'LGU Budgets', "People's Survival Fund"],
      majorContributors: ['Department of Budget and Management', 'Climate Change Commission']
    }
  },
  {
    sourceType: 'Grant',
    amount: 310000000,
    percentage: 32,
    insights: 'Significant international support through various grant mechanisms.',
    details: {
      subCategories: ['GCF Grants', 'Bilateral Grants', 'GEF'],
      majorContributors: ['Green Climate Fund', 'Germany', 'Japan']
    }
  },
  {
    sourceType: 'Loan',
    amount: 175000000,
    percentage: 18,
    insights: 'Concessional loans for large infrastructure projects.',
    details: {
      subCategories: ['ADB Loans', 'World Bank', 'Bilateral Loans'],
      majorContributors: ['Asian Development Bank', 'World Bank']
    }
  },
  {
    sourceType: 'Private',
    amount: 95000000,
    percentage: 10,
    insights: 'Growing private sector engagement in climate finance.',
    details: {
      subCategories: ['PPPs', 'Green Bonds', 'ESG Investments'],
      majorContributors: ['Private Banks', 'Corporations', 'Impact Investors']
    }
  }
];

// ============================================================================
// GHG BASELINE BY SECTOR MOCK DATA
// ============================================================================

export const mockGHGBaseline: GHGBaselineData = {
  sectors: [
    {
      sector: 'Agriculture',
      actual: 15,
      conditionalTarget: 12.5,
      unconditionalTarget: 0.5,
      baseline2020: 18
    },
    {
      sector: 'Water',
      actual: 1.2,
      conditionalTarget: 1.17,
      unconditionalTarget: 0.03,
      baseline2020: 1.5
    },
    {
      sector: 'Forestry',
      actual: 20,
      conditionalTarget: 15,
      unconditionalTarget: 1,
      baseline2020: 25
    },
    {
      sector: 'Health',
      actual: 2,
      conditionalTarget: 1.8,
      unconditionalTarget: 0.2,
      baseline2020: 2.5
    },
    {
      sector: 'Coastal & Marine',
      actual: 3,
      conditionalTarget: 2.5,
      unconditionalTarget: 0.3,
      baseline2020: 3.5
    },
    {
      sector: 'Human Settlements',
      actual: 8,
      conditionalTarget: 6.5,
      unconditionalTarget: 0.5,
      baseline2020: 10
    },
    {
      sector: 'DRRM',
      actual: 1.5,
      conditionalTarget: 1.2,
      unconditionalTarget: 0.1,
      baseline2020: 2
    },
    {
      sector: 'Energy',
      actual: 28,
      conditionalTarget: 22,
      unconditionalTarget: 2,
      baseline2020: 35
    }
  ],
  overallProgress: {
    percentageAchieved: 40,
    targetYear: 2030,
    note: '40% of 2030 reduction target achieved'
  }
};

// ============================================================================
// REGIONAL INVESTMENTS MOCK DATA
// ============================================================================

export const mockRegionalInvestments: InvestmentsByRegionData = [
  { regionCode: 'BARMM', regionName: 'BARMM', investmentAmount: 85000000, rank: 1 },
  { regionCode: 'REGION_XIII', regionName: 'Region XIII (Caraga)', investmentAmount: 80000000, rank: 2 },
  { regionCode: 'REGION_I', regionName: 'Region I (Ilocos)', investmentAmount: 75000000, rank: 3 },
  { regionCode: 'REGION_II', regionName: 'Region II (Cagayan Valley)', investmentAmount: 70000000, rank: 4 },
  { regionCode: 'REGION_X', regionName: 'Region X (Northern Mindanao)', investmentAmount: 68000000, rank: 5 },
  { regionCode: 'REGION_IX', regionName: 'Region IX (Zamboanga)', investmentAmount: 65000000, rank: 6 },
  { regionCode: 'NCR', regionName: 'NCR', investmentAmount: 62000000, rank: 7 },
  { regionCode: 'REGION_VIII', regionName: 'Region VIII (Eastern Visayas)', investmentAmount: 60000000, rank: 8 },
  { regionCode: 'REGION_III', regionName: 'Region III (Central Luzon)', investmentAmount: 50000000, rank: 9 },
  { regionCode: 'REGION_XI', regionName: 'Region XI (Davao)', investmentAmount: 48000000, rank: 10 },
  { regionCode: 'REGION_XII', regionName: 'Region XII (SOCCSKSARGEN)', investmentAmount: 45000000, rank: 11 },
  { regionCode: 'REGION_IV_A', regionName: 'Region IV-A (CALABARZON)', investmentAmount: 42000000, rank: 12 },
  { regionCode: 'REGION_IV_B', regionName: 'Region IV-B (MIMAROPA)', investmentAmount: 40000000, rank: 13 },
  { regionCode: 'REGION_VI', regionName: 'Region VI (Western Visayas)', investmentAmount: 38000000, rank: 14 },
  { regionCode: 'REGION_V', regionName: 'Region V (Bicol)', investmentAmount: 35000000, rank: 15 },
  { regionCode: 'REGION_VII', regionName: 'Region VII (Central Visayas)', investmentAmount: 32000000, rank: 16 },
  { regionCode: 'CAR', regionName: 'CAR', investmentAmount: 30000000, rank: 17 }
];

// ============================================================================
// CHOROPLETH MAP MOCK DATA
// ============================================================================

export const mockMapData: ChoroplethMapData = {
  locations: [
    {
      locationId: 'NCR-1',
      locationName: 'Metro Manila',
      coordinates: { latitude: 14.5995, longitude: 120.9842 },
      investmentAmount: 1200000000,
      incomeClass: 5,
      climateImpactDrivers: ['Increased Temperature & Drought', 'Sea level rise and extreme sea levels'],
      fundBreakdown: {
        governmentBudget: 480000000,
        grant: 384000000,
        loan: 216000000,
        private: 120000000
      }
    },
    {
      locationId: 'REGION_III-1',
      locationName: 'Central Luzon',
      coordinates: { latitude: 15.4830, longitude: 120.7124 },
      investmentAmount: 650000000,
      incomeClass: 4,
      climateImpactDrivers: ['Increased Temperature & Drought', 'Extreme Precipitation'],
      fundBreakdown: {
        governmentBudget: 260000000,
        grant: 208000000,
        loan: 117000000,
        private: 65000000
      }
    },
    // Add more locations as needed
  ],
  totalMainlandInvestment: 15200000000, // 15.2 B
  geoJsonPath: '/geo_country/lowres/country.0.001.json'
};

// ============================================================================
// FILTER OPTIONS MOCK DATA
// ============================================================================

export const mockFunders: Funder[] = [
  { id: 'adb', name: 'Asian Development Bank', type: 'multilateral' },
  { id: 'undp', name: 'United Nations Development Programme (UNDP)', type: 'multilateral' },
  { id: 'wb', name: 'World Bank', type: 'multilateral' },
  { id: 'gcf', name: 'Green Climate Fund', type: 'multilateral' },
  { id: 'gef', name: 'Global Environment Facility', type: 'multilateral' },
  { id: 'germany', name: 'Germany (KfW, GIZ)', type: 'bilateral' },
  { id: 'japan', name: 'Japan (JICA)', type: 'bilateral' },
  { id: 'usa', name: 'United States (USAID)', type: 'bilateral' }
];

export const mockAgencies: Agency[] = [
  { id: 'da', name: 'Department of Agriculture', abbreviation: 'DA', sector: ['Agriculture'] },
  { id: 'doe', name: 'Department of Energy', abbreviation: 'DOE', sector: ['Energy'] },
  { id: 'dhsud', name: 'Department of Human Settlements and Urban Development', abbreviation: 'DHSUD', sector: ['Human Settlements'] },
  { id: 'dot', name: 'Department of Tourism', abbreviation: 'DOT', sector: ['Tourism'] },
  { id: 'denr', name: 'Department of Environment and Natural Resources', abbreviation: 'DENR', sector: ['Forestry', 'Water'] },
  { id: 'doh', name: 'Department of Health', abbreviation: 'DOH', sector: ['Health'] },
  { id: 'dotr', name: 'Department of Transportation', abbreviation: 'DOTr', sector: ['Transport'] }
];

export const mockFilterOptions: FilterOptions = {
  years: [2025, 2024, 2023, 2022, 2021],
  napSectors: [
    'Agriculture, Fisheries, and Food Security',
    'Water Resources',
    'Health',
    'Ecosystems and Biodiversity',
    'Cultural Heritage, Population Displacement, and Migration',
    'Land Use and Human Settlements',
    'Livelihoods and Industries',
    'Energy, Transport, and Communications'
  ],
  ndcipSectors: [
    'Agriculture',
    'Waste',
    'Industry',
    'Transport',
    'Energy'
  ],
  fundSources: [
    'Government Budget',
    "People's Survival Fund",
    'National Budget Allocations',
    'LGU Adaptation Budgets',
    'Loans',
    'Grants',
    'Private'
  ],
  fundTypes: ['Public', 'Private', 'Mixed'],
  funders: mockFunders,
  implementingAgencies: mockAgencies,
  climateImpactDrivers: [
    'Increased Temperature & Drought',
    'Sea level rise and extreme sea levels',
    'Extreme Precipitation',
    'Extreme wind and tropical cyclones'
  ],
  incomeClasses: [1, 2, 3, 4, 5]
};

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
  keyMetrics: mockKeyMetrics,
  fundsMobilized: mockFundsMobilized,
  ghgLevels: mockGHGLevels,
  investmentBySector: mockInvestmentBySector,
  fundSource: mockFundSource,
  ghgBaseline: mockGHGBaseline,
  regionalInvestments: mockRegionalInvestments,
  mapData: mockMapData,
  filterOptions: mockFilterOptions,
  funders: mockFunders,
  agencies: mockAgencies
} as const;

export default mockData;

