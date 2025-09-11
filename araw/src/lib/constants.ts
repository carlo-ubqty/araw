// Constants for Climate Finance Dashboard

export const CHART_COLORS = {
  adaptation: '#8b5cf6',
  mitigation: '#f59e0b', 
  primary: '#06b6d4',
  secondary: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
} as const;

export const KPI_COLORS = {
  green: 'bg-green-500',
  gray: 'bg-gray-600', 
  cyan: 'bg-cyan-500',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
} as const;

export const SECTORS = [
  'Agriculture',
  'Water',
  'Forestry', 
  'Health',
  'Coastal & Marine',
  'Human Settlements',
  'DRRM',
  'Energy',
  'Transport',
  'Industry',
  'Tourism',
  'Education',
] as const;

export const REGIONS = [
  'NCR',
  'CAR',
  'Region I',
  'Region II', 
  'Region III',
  'Region IV-A',
  'Region IV-B',
  'Region V',
  'Region VI',
  'Region VII',
  'Region VIII',
  'Region IX',
  'Region X',
  'Region XI',
  'Region XII',
  'Region XIII',
  'BARMM',
] as const;

export const FUNDING_SOURCES = [
  'Government',
  'ODA',
  'Private',
  'MDBs',
  'Climate Funds',
] as const;

export const PROJECT_STATUS = [
  'Planning',
  'Ongoing', 
  'Completed',
  'Cancelled',
] as const;

export const VULNERABILITY_LEVELS = [
  'Very High',
  'High', 
  'Medium',
  'Low',
] as const;

export const INCOME_CLASSES = [
  '1st Class',
  '2nd Class',
  '3rd Class', 
  '4th Class',
  '5th Class',
  '6th Class',
] as const;
