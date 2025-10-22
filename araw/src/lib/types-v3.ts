/**
 * ARAW V3.0 Dashboard - TypeScript Type Definitions
 * 
 * All type definitions for the V3.0 Climate Finance Dashboard
 * Based on specifications from v3_data_requirements.txt
 */

// ============================================================================
// FILTER TYPES
// ============================================================================

export type DataView = 'NAP' | 'NDCIP';
export type DisplayMode = 'amount' | 'projects';
export type ProjectStatus = 'ongoing' | 'completed';
export type FundType = 'Public' | 'Private' | 'Mixed';
export type IncomeClass = 1 | 2 | 3 | 4 | 5;

export interface FilterState {
  dataView: DataView;
  selectedSectors: string[];
  displayMode: DisplayMode;
  projectStatus: ProjectStatus;
  selectedYears: number[];
  selectedFundSources: string[];
  selectedFundTypes: FundType[];
  selectedFunders: string[];
  selectedAgencies: string[];
  selectedCIDs: string[];
  selectedIncomeClasses: IncomeClass[];
}

export interface FilterOptions {
  years: number[];
  napSectors: string[];
  ndcipSectors: string[];
  fundSources: string[];
  fundTypes: FundType[];
  funders: Funder[];
  implementingAgencies: Agency[];
  climateImpactDrivers: string[];
  incomeClasses: IncomeClass[];
}

// ============================================================================
// ORGANIZATION TYPES
// ============================================================================

export interface Funder {
  id: string;
  name: string;
  type: 'multilateral' | 'bilateral' | 'private';
}

export interface Agency {
  id: string;
  name: string;
  abbreviation: string;
  sector: string[];
}

// ============================================================================
// KEY METRICS TYPES
// ============================================================================

export interface KeyMetrics {
  totalInvestment: MetricValue;
  ghgReduction: GHGMetric;
  adaptationInvestment: MetricValue;
  mitigationInvestment: MetricValue;
  totalProjects: ProjectMetric;
}

export interface MetricValue {
  value: number;
  displayValue: string;
  currency: 'PHP';
  lastYear?: {
    value: number;
    displayValue: string;
  };
}

export interface GHGMetric {
  percentage: number;
  baselineYear: number;
  targetPercentage?: number;
}

export interface ProjectMetric {
  count: number;
  displayValue: string;
  lastYear?: {
    count: number;
    displayValue: string;
  };
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

// Funds Mobilized Chart
export interface FundsMobilizedData {
  year: number;
  adaptation: number;
  mitigation: number;
  dataType: 'GAA' | 'Actual' | 'NEP';
  notes?: string;
}

export type FundsMobilizedSeries = FundsMobilizedData[];

// GHG Levels Chart
export interface GHGLevelsData {
  year: number;
  totalGHG: number;
  breakdown: {
    co2: number;
    ch4: number;
    n2o: number;
    hfc: number;
  };
  isProjection: boolean;
  targetValue?: number;
}

export type GHGLevelsSeries = GHGLevelsData[];

// Investment by Sector Chart
export interface InvestmentBySector {
  sector: string;
  governmentBudget: number;
  grant: number;
  loan: number;
  private: number;
  total: number;
}

export type InvestmentBySectorData = InvestmentBySector[];

// Fund Source Data
export interface FundSourceData {
  sourceType: 'Government Budget' | 'Grant' | 'Loan' | 'Private';
  amount: number;
  percentage: number;
  insights: string;
  details?: {
    subCategories?: string[];
    majorContributors?: string[];
  };
}

export type FundSourceBreakdown = FundSourceData[];

// GHG Baseline by Sector
export interface GHGBaselineBySector {
  sector: string;
  actual: number;
  conditionalTarget: number;
  unconditionalTarget: number;
  baseline2020: number;
}

export interface GHGBaselineData {
  sectors: GHGBaselineBySector[];
  overallProgress: {
    percentageAchieved: number;
    targetYear: number;
    note: string;
  };
}

// Regional Investments
export interface InvestmentByRegion {
  regionCode: string;
  regionName: string;
  investmentAmount: number;
  rank: number;
}

export type InvestmentsByRegionData = InvestmentByRegion[];

// ============================================================================
// MAP DATA TYPES
// ============================================================================

export interface MapLocationData {
  locationId: string;
  locationName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  investmentAmount: number;
  incomeClass: IncomeClass;
  climateImpactDrivers: string[];
  fundBreakdown: {
    governmentBudget: number;
    grant: number;
    loan: number;
    private: number;
  };
}

export interface ChoroplethMapData {
  locations: MapLocationData[];
  totalMainlandInvestment: number;
  geoJsonPath: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

// Header Component
export interface HeaderProps {
  title?: string;
  logoSrc?: string;
  showDateTime?: boolean;
  className?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  active?: boolean;
}

// KPI Card Component
export interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

// Chart Card Component
export interface ChartCardProps {
  title: string;
  subtitle?: string;
  trendText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  heightClass?: string;
  className?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  code?: string;
  timestamp: string;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// ============================================================================
// DESIGN SYSTEM TYPES
// ============================================================================

export interface GradientColors {
  from: string;
  to: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  [key: string]: string;
}

export interface TypographyScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  [key: string]: string;
}

// ============================================================================
// SECTOR DATA
// ============================================================================

export const NAP_SECTORS = [
  'Agriculture, Fisheries, and Food Security',
  'Water Resources',
  'Health',
  'Ecosystems and Biodiversity',
  'Cultural Heritage, Population Displacement, and Migration',
  'Land Use and Human Settlements',
  'Livelihoods and Industries',
  'Energy, Transport, and Communications'
] as const;

export const NDCIP_SECTORS = [
  'Agriculture',
  'Waste',
  'Industry',
  'Transport',
  'Energy'
] as const;

export type NAPSector = typeof NAP_SECTORS[number];
export type NDCIPSector = typeof NDCIP_SECTORS[number];

// ============================================================================
// CLIMATE IMPACT DRIVERS
// ============================================================================

export const CLIMATE_IMPACT_DRIVERS = [
  'Increased Temperature & Drought',
  'Sea level rise and extreme sea levels',
  'Extreme Precipitation',
  'Extreme wind and tropical cyclones'
] as const;

export type ClimateImpactDriver = typeof CLIMATE_IMPACT_DRIVERS[number];

// ============================================================================
// PHILIPPINE REGIONS
// ============================================================================

export const PHILIPPINE_REGIONS = [
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' },
  { code: 'CAR', name: 'Cordillera Administrative Region' },
  { code: 'NCR', name: 'National Capital Region' },
  { code: 'REGION_I', name: 'Region I (Ilocos Region)' },
  { code: 'REGION_II', name: 'Region II (Cagayan Valley)' },
  { code: 'REGION_III', name: 'Region III (Central Luzon)' },
  { code: 'REGION_IV_A', name: 'Region IV-A (CALABARZON)' },
  { code: 'REGION_IV_B', name: 'Region IV-B (MIMAROPA)' },
  { code: 'REGION_V', name: 'Region V (Bicol Region)' },
  { code: 'REGION_VI', name: 'Region VI (Western Visayas)' },
  { code: 'REGION_VII', name: 'Region VII (Central Visayas)' },
  { code: 'REGION_VIII', name: 'Region VIII (Eastern Visayas)' },
  { code: 'REGION_IX', name: 'Region IX (Zamboanga Peninsula)' },
  { code: 'REGION_X', name: 'Region X (Northern Mindanao)' },
  { code: 'REGION_XI', name: 'Region XI (Davao Region)' },
  { code: 'REGION_XII', name: 'Region XII (SOCCSKSARGEN)' },
  { code: 'REGION_XIII', name: 'Region XIII (Caraga)' }
] as const;

export type PhilippineRegionCode = typeof PHILIPPINE_REGIONS[number]['code'];

