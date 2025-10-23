/**
 * ARAW V3.0 Dashboard - KPI Metrics API Route
 * Server-side endpoint for fetching KPI data from MySQL
 */

import { NextResponse } from 'next/server';
import * as DataService from '@/services/dashboardDataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query params
    const filters = {
      selectedYears: searchParams.get('years')?.split(',').map(Number).filter(Boolean),
      dataView: searchParams.get('dataView') as 'NAP' | 'NDCIP' | undefined,
      selectedSectors: searchParams.get('sectors')?.split(',').filter(Boolean),
      projectStatus: searchParams.get('projectStatus') as 'planned' | 'ongoing' | 'completed' | undefined,
    };
    
    // Fetch KPIs from database
    const [
      totalInvestment,
      adaptationInvestment,
      mitigationInvestment,
      totalProjects
    ] = await Promise.all([
      DataService.getTotalInvestment(filters),
      DataService.getAdaptationInvestment(filters),
      DataService.getMitigationInvestment(filters),
      DataService.getTotalProjects(filters)
    ]);
    
    // Format response
    const response = {
      totalInvestment: formatCurrency(totalInvestment),
      ghgReduction: '56%', // TODO: Calculate from GHG data
      ghgReductionSubtitle: 'vs 2020 baseline',
      adaptationInvestment: formatCurrency(adaptationInvestment),
      mitigationInvestment: formatCurrency(mitigationInvestment),
      totalProjects: `${(totalProjects || 0).toLocaleString()}`,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API /dashboard/kpis] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPI data' },
      { status: 500 }
    );
  }
}

/**
 * Format currency to Billion/Million with proper notation
 * Handles null/undefined values gracefully
 */
function formatCurrency(value: number | null | undefined, currencySymbol: string = '₱'): string {
  // Safety check: Handle null, undefined, or NaN values
  if (!value || isNaN(value)) {
    return `${currencySymbol} 0.00 M`;
  }
  
  // Convert to absolute number for formatting
  const numValue = Number(value);
  
  if (numValue === 0) {
    return `${currencySymbol} 0.00 M`;
  }
  
  if (numValue >= 1_000_000_000) {
    return `${currencySymbol} ${(numValue / 1_000_000_000).toFixed(2)} B`;
  }
  
  if (numValue >= 1_000_000) {
    return `${currencySymbol} ${(numValue / 1_000_000).toFixed(2)} M`;
  }
  
  if (numValue >= 1_000) {
    return `${currencySymbol} ${(numValue / 1_000).toFixed(2)} K`;
  }
  
  return `${currencySymbol} ${numValue.toFixed(2)}`;
}
