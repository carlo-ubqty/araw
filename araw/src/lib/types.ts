// Centralized TypeScript definitions for Climate Finance Dashboard

export interface KPIMetric {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  textColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    direction: 'up' | 'down';
  };
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartConfig {
  id: string;
  title: string;
  subtitle: string;
  type: 'area' | 'bar' | 'line' | 'pie' | 'map';
  data: ChartDataPoint[];
  trend?: {
    value: string;
    isPositive: boolean;
  };
  height?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  options: string[];
  selected?: string;
}

export interface DashboardData {
  kpis: KPIMetric[];
  charts: ChartConfig[];
  filters: FilterOption[];
  lastUpdated: string;
}

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  sector?: string;
  region?: string;
  fundingSource?: string;
  projectStatus?: string;
}

// Chart-specific types
export interface FundsChartData {
  year: string;
  adaptation: number;
  mitigation: number;
}

export interface GHGChartData {
  year: string;
  level: number;
  target: number;
}

export interface SectorChartData {
  sector: string;
  adaptation: number;
  mitigation: number;
}

export interface RegionalChartData {
  region: string;
  investment: number;
  projects: number;
}

// API Response types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Database/Service types
export interface ClimateProject {
  id: string;
  title: string;
  sector: string;
  region: string;
  implementor: string;
  funder: string;
  amount: number;
  status: 'planning' | 'ongoing' | 'completed' | 'cancelled';
  type: 'adaptation' | 'mitigation';
  startDate: string;
  endDate?: string;
  vulnerabilityIndex: 'very_high' | 'high' | 'medium' | 'low';
  incomeClass: '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th';
}

export interface ChartSettings {
  colors: {
    adaptation: string;
    mitigation: string;
    primary: string;
    secondary: string;
  };
  gridLines: boolean;
  legends: boolean;
  animations: boolean;
}
