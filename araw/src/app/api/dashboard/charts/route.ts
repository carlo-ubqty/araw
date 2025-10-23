/**
 * ARAW V3.0 Dashboard - Charts Data API Route
 * Server-side endpoint for fetching all chart data from MySQL
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
      projectStatus: searchParams.get('projectStatus') as 'planned' | 'ongoing' | 'completed' | undefined,
    };
    
    // Fetch all chart data in parallel
    const [
      fundsMobilized,
      ghgHistorical,
      investmentBySector,
      fundSourceBreakdown,
      ghgBySector,
      regionalInvestments
    ] = await Promise.all([
      DataService.getFundsMobilizedData(filters),
      DataService.getGHGHistoricalData(filters),
      DataService.getInvestmentBySectorData(filters),
      DataService.getFundSourceBreakdownData(filters),
      DataService.getGHGBySectorData(filters),
      DataService.getInvestmentsByRegionData(filters)
    ]);
    
    return NextResponse.json({
      fundsMobilized,
      ghgHistorical,
      investmentBySector,
      fundSourceBreakdown,
      ghgBySector,
      regionalInvestments,
    });
  } catch (error) {
    console.error('[API /dashboard/charts] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
