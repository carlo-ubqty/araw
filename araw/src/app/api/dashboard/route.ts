// API Route: GET /api/dashboard - Complete dashboard data
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

    const dashboardData = await DashboardService.getDashboardData(filters);

    const response: APIResponse = {
      success: true,
      data: dashboardData,
      message: 'Dashboard data retrieved successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    const errorResponse: APIResponse = {
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
