/**
 * ARAW V3.0 Dashboard - MySQL Data Service Layer
 * 
 * Handles all database queries for dashboard data
 * Replaces mock data with real MySQL queries
 */

import { query, queryOne } from '@/lib/database';
import { FilterState } from '@/lib/types-v3';

// ============================================================================
// KPI METRICS
// ============================================================================

/**
 * Get total investment amount based on filters
 */
export async function getTotalInvestment(filters?: Partial<FilterState>): Promise<number> {
  let sql = `
    SELECT COALESCE(SUM(i.amount), 0) as total
    FROM investments i
    INNER JOIN projects p ON i.project_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];

  // Apply filters
  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')})`;
    params.push(...filters.selectedYears);
  }

  if (filters?.projectStatus) {
    sql += ` AND p.status = ?`;
    params.push(filters.projectStatus);
  }

  if (filters?.selectedFundSources && filters.selectedFundSources.length > 0) {
    sql += ` AND i.fund_source IN (${filters.selectedFundSources.map(() => '?').join(',')})`;
    params.push(...filters.selectedFundSources);
  }

  if (filters?.selectedFundTypes && filters.selectedFundTypes.length > 0) {
    sql += ` AND i.fund_type IN (${filters.selectedFundTypes.map(() => '?').join(',')})`;
    params.push(...filters.selectedFundTypes);
  }

  const result = await queryOne<{ total: number }>(sql, params);
  return result?.total || 0;
}

/**
 * Get adaptation investment amount
 */
export async function getAdaptationInvestment(filters?: Partial<FilterState>): Promise<number> {
  let sql = `
    SELECT COALESCE(SUM(i.amount), 0) as total
    FROM investments i
    INNER JOIN projects p ON i.project_id = p.id
    WHERE i.climate_type IN ('Adaptation', 'Both')
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')})`;
    params.push(...filters.selectedYears);
  }

  const result = await queryOne<{ total: number }>(sql, params);
  return result?.total || 0;
}

/**
 * Get mitigation investment amount
 */
export async function getMitigationInvestment(filters?: Partial<FilterState>): Promise<number> {
  let sql = `
    SELECT COALESCE(SUM(i.amount), 0) as total
    FROM investments i
    INNER JOIN projects p ON i.project_id = p.id
    WHERE i.climate_type IN ('Mitigation', 'Both')
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')})`;
    params.push(...filters.selectedYears);
  }

  const result = await queryOne<{ total: number }>(sql, params);
  return result?.total || 0;
}

/**
 * Get total project count
 */
export async function getTotalProjects(filters?: Partial<FilterState>): Promise<number> {
  let sql = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM projects p
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.projectStatus) {
    sql += ` AND p.status = ?`;
    params.push(filters.projectStatus);
  }

  const result = await queryOne<{ total: number }>(sql, params);
  return result?.total || 0;
}

// ============================================================================
// FUNDS MOBILIZED CHART
// ============================================================================

interface FundsMobilizedRow {
  year: number;
  adaptation: number;
  mitigation: number;
}

export async function getFundsMobilizedData(
  filters?: Partial<FilterState>
): Promise<FundsMobilizedRow[]> {
  let sql = `
    SELECT 
      i.fiscal_year as year,
      COALESCE(SUM(CASE WHEN i.climate_type = 'Adaptation' THEN i.amount ELSE 0 END), 0) as adaptation,
      COALESCE(SUM(CASE WHEN i.climate_type = 'Mitigation' THEN i.amount ELSE 0 END), 0) as mitigation
    FROM investments i
    INNER JOIN projects p ON i.project_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  sql += ` GROUP BY i.fiscal_year ORDER BY i.fiscal_year`;

  const results = await query<FundsMobilizedRow>(sql, params);
  
  // Convert to millions for display
  return results.map(row => ({
    year: row.year,
    adaptation: Math.round(row.adaptation / 1000000),
    mitigation: Math.round(row.mitigation / 1000000),
  }));
}

// ============================================================================
// GHG EMISSIONS CHART
// ============================================================================

interface GHGEmissionRow {
  year: number;
  total_ghg: number;
  is_projection: boolean;
}

export async function getGHGHistoricalData() {
  const sql = `
    SELECT 
      year, 
      SUM(total_ghg) as total_ghg,
      MAX(is_projection) as is_projection
    FROM ghg_emissions
    GROUP BY year
    ORDER BY year
  `;
  
  const results = await query<GHGEmissionRow>(sql);
  
  // Map database results to chart format
  // Note: Database has inconsistent scales for 2015-2020 (unit conversion issue from Excel import)
  // Using only data with reasonable scale (< 1000 Gg) until corrected
  return results
    .filter(row => Math.abs(row.total_ghg) < 1000) // Filter out data with wrong scale
    .map(row => ({
      year: row.year.toString(),
      ghg: row.total_ghg,
    }));
}

export async function getGHGTargetData() {
  // TODO: Replace with actual data from BA's Excel sheets when available
  // For now, using mock data from mockup for display purposes only
  // This data is NOT in the database and should NOT be saved to the database
  // until verified official data is provided
  
  return {
    year: '2024',
    target: 165, // Target line in Gg (below 2024 projected value of 170)
    breakdown: [
      { gas: 'Carbon Dioxide (CO₂)', value: '99.0' },
      { gas: 'Methane (CH₄)', value: '42.0' },
      { gas: 'Nitrous Oxide (N₂O)', value: '18.5' },
      { gas: 'Hydrofluorocarbon (HFC)', value: '5.5' },
    ],
  };
}

// ============================================================================
// INVESTMENT BY SECTOR
// ============================================================================

interface InvestmentBySectorRow {
  sector: string;
  govBudget: number;
  grant: number;
  loan: number;
  private: number;
}

export async function getInvestmentBySectorData(
  filters?: Partial<FilterState>
): Promise<InvestmentBySectorRow[]> {
  let sql = `
    SELECT 
      s.name as sector,
      COALESCE(SUM(CASE WHEN i.fund_source = 'Government Budget' THEN i.amount ELSE 0 END), 0) as govBudget,
      COALESCE(SUM(CASE WHEN i.fund_source = 'Grant' THEN i.amount ELSE 0 END), 0) as \`grant\`,
      COALESCE(SUM(CASE WHEN i.fund_source = 'Loan' THEN i.amount ELSE 0 END), 0) as loan,
      COALESCE(SUM(CASE WHEN i.fund_source = 'Private' THEN i.amount ELSE 0 END), 0) as \`private\`
    FROM sectors s
    LEFT JOIN projects p ON s.id = p.sector_id
    LEFT JOIN investments i ON p.id = i.project_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND s.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')})`;
    params.push(...filters.selectedYears);
  }

  sql += ` GROUP BY s.id, s.name ORDER BY s.display_order`;

  const results = await query<InvestmentBySectorRow>(sql, params);
  
  // Convert to millions
  return results.map(row => ({
    sector: row.sector,
    govBudget: Math.round(row.govBudget / 1000000),
    grant: Math.round(row.grant / 1000000),
    loan: Math.round(row.loan / 1000000),
    private: Math.round(row.private / 1000000),
  }));
}

// ============================================================================
// FUND SOURCE BREAKDOWN
// ============================================================================

export async function getFundSourceBreakdownData(
  filters?: Partial<FilterState>
) {
  let sql = `
    SELECT 
      i.fund_source,
      SUM(i.amount) as total
    FROM investments i
    INNER JOIN projects p ON i.project_id = p.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND p.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')})`;
    params.push(...filters.selectedYears);
  }

  sql += ` GROUP BY i.fund_source`;

  const results = await query<{ fund_source: string; total: number }>(sql, params);
  
  // Calculate total and percentages
  const grandTotal = results.reduce((sum, row) => sum + row.total, 0);
  
  // Find government budget (main source)
  const govBudget = results.find(r => r.fund_source === 'Government Budget');
  const others = results.filter(r => r.fund_source !== 'Government Budget');

  return {
    mainSource: {
      label: 'GOVERNMENT BUDGET',
      amount: `₱ ${Math.round((govBudget?.total || 0) / 1000000)} M`,
      percentage: `${Math.round(((govBudget?.total || 0) / grandTotal) * 100)}%`,
      color: '#049688'
    },
    subSources: others.map(row => ({
      label: row.fund_source.toUpperCase(),
      amount: `₱ ${Math.round(row.total / 1000000)} M`,
      percentage: `${Math.round((row.total / grandTotal) * 100)}%`,
      color: getColorForFundSource(row.fund_source)
    }))
  };
}

function getColorForFundSource(source: string): string {
  const colors: Record<string, string> = {
    'Grant': '#63CD00',
    'Loan': '#00AE9A',
    'Private': '#A6C012',
    'PSF': '#FFB800',
    'Mixed': '#8B5CF6'
  };
  return colors[source] || '#6B7280';
}

// ============================================================================
// GHG BY SECTOR
// ============================================================================

interface GHGBySectorRow {
  sector: string;
  actual: number;
  conditional: number;
  unconditional: number;
}

export async function getGHGBySectorData(
  filters?: Partial<FilterState>
): Promise<GHGBySectorRow[]> {
  let sql = `
    SELECT 
      s.name as sector,
      COALESCE(e.total_ghg, 0) as actual,
      COALESCE(t_cond.target_value, 0) as conditional,
      COALESCE(t_uncond.target_value, 0) as unconditional
    FROM sectors s
    LEFT JOIN ghg_emissions e ON s.id = e.sector_id AND e.year = 2020
    LEFT JOIN ghg_targets t_cond ON s.id = t_cond.sector_id AND t_cond.target_type = 'Conditional' AND t_cond.year = 2030
    LEFT JOIN ghg_targets t_uncond ON s.id = t_uncond.sector_id AND t_uncond.target_type = 'Unconditional' AND t_uncond.year = 2030
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND s.data_view IN (?, 'BOTH')`;
    params.push(filters.dataView);
  }

  sql += ` ORDER BY s.display_order`;

  return await query<GHGBySectorRow>(sql, params);
}

// ============================================================================
// INVESTMENTS BY REGION
// ============================================================================

interface InvestmentByRegionRow {
  region: string;
  regionCode: string;
  amount: number;
  rank: number;
}

export async function getInvestmentsByRegionData(
  filters?: Partial<FilterState>
): Promise<InvestmentByRegionRow[]> {
  let sql = `
    SELECT 
      r.name as region,
      r.code as regionCode,
      COALESCE(SUM(i.amount), 0) as amount
    FROM regions r
    LEFT JOIN projects p ON r.id = p.region_id
    LEFT JOIN investments i ON p.id = i.project_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND (p.data_view IN (?, 'BOTH') OR p.data_view IS NULL)`;
    params.push(filters.dataView);
  }

  if (filters?.selectedYears && filters.selectedYears.length > 0) {
    sql += ` AND (i.fiscal_year IN (${filters.selectedYears.map(() => '?').join(',')}) OR i.fiscal_year IS NULL)`;
    params.push(...filters.selectedYears);
  }

  sql += ` GROUP BY r.id, r.name, r.code ORDER BY amount DESC`;

  const results = await query<{ region: string; regionCode: string; amount: number }>(sql, params);
  
  // Add rank and convert to millions
  return results.map((row, index) => ({
    region: row.region,
    regionCode: row.regionCode,
    amount: Math.round(row.amount / 1000000),
    rank: index + 1
  }));
}

// ============================================================================
// MAP LOCATION DATA
// ============================================================================

export async function getMapLocationData(filters?: Partial<FilterState>) {
  let sql = `
    SELECT 
      r.id as locationId,
      r.name as locationName,
      r.name as regionName,
      r.coordinates_lat as latitude,
      r.coordinates_lon as longitude,
      COALESCE(SUM(i.amount), 0) as investmentAmount,
      r.income_class as incomeClass
    FROM regions r
    LEFT JOIN projects p ON r.id = p.region_id
    LEFT JOIN investments i ON p.id = i.project_id
    WHERE r.coordinates_lat IS NOT NULL AND r.coordinates_lon IS NOT NULL
  `;
  const params: any[] = [];

  if (filters?.dataView) {
    sql += ` AND (p.data_view IN (?, 'BOTH') OR p.data_view IS NULL)`;
    params.push(filters.dataView);
  }

  sql += ` GROUP BY r.id, r.name, r.coordinates_lat, r.coordinates_lon, r.income_class`;

  const locations = await query<any>(sql, params);
  
  // Calculate total
  const totalInvestment = locations.reduce((sum: number, loc: any) => sum + loc.investmentAmount, 0);

  return {
    locations: locations.map((loc: any) => ({
      locationId: String(loc.locationId),
      locationName: loc.locationName,
      regionName: loc.regionName,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
      investmentAmount: Math.round(loc.investmentAmount / 1000000),
      incomeClass: parseInt(loc.incomeClass) || 1
    })),
    totalInvestment: `₱${(totalInvestment / 1000000000).toFixed(1)} B`
  };
}

