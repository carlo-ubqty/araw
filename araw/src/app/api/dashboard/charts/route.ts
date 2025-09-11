// API Route: GET /api/dashboard/charts
import { NextRequest, NextResponse } from 'next/server';
import { DashboardService } from '@/services/dashboardService';
import { APIResponse, DashboardFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filter parameters
    const filters: DashboardFilters = {
      dateRange: {
        start: searchParams.get('start') || '2019-01-01',
        end: searchParams.get('end') || '2024-12-31',
      },
      sector: searchParams.get('sector') || undefined,
      region: searchParams.get('region') || undefined,
      fundingSource: searchParams.get('fundingSource') || undefined,
      projectStatus: searchParams.get('projectStatus') || undefined,
    };

    // Optional: Get specific chart by ID
    const chartId = searchParams.get('id');
    
    const charts = await DashboardService.getChartConfigs(filters);
    
    // Filter by specific chart if requested
    const data = chartId ? charts.find(chart => chart.id === chartId) : charts;
    
    if (chartId && !data) {
      const errorResponse: APIResponse = {
        success: false,
        error: 'Chart not found',
        message: `No chart found with ID: ${chartId}`,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const response: APIResponse = {
      success: true,
      data,
      message: chartId ? 'Chart data retrieved successfully' : 'Chart configurations retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    
    const errorResponse: APIResponse = {
      success: false,
      error: 'Failed to fetch chart data',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
