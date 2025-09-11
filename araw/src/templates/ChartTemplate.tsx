// Chart wrapper template for consistent chart layouts
import { ReactNode } from 'react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ChartTemplateProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  height?: string;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function ChartTemplate({ 
  title, 
  subtitle, 
  children, 
  trend, 
  height = "h-80",
  loading = false,
  error,
  className = ""
}: ChartTemplateProps) {
  if (error) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardBody className={`pt-0 ${height}`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p className="text-lg font-medium">Error loading chart</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`shadow-lg ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardBody className={`pt-0 ${height}`}>
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody className={`pt-0 ${height}`}>
        {children}
      </CardBody>
    </Card>
  );
}

interface KPIGridTemplateProps {
  children: ReactNode;
  columns?: 'auto' | 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function KPIGridTemplate({ 
  children, 
  columns = 'auto',
  className = ""
}: KPIGridTemplateProps) {
  const gridCols = columns === 'auto' 
    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-5'
    : `grid-cols-${columns}`;

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {children}
    </div>
  );
}

interface ChartGridTemplateProps {
  children: ReactNode;
  layout?: 'two-column' | 'three-column' | 'single-column' | 'mixed';
  className?: string;
}

export function ChartGridTemplate({ 
  children, 
  layout = 'two-column',
  className = ""
}: ChartGridTemplateProps) {
  const gridClass = {
    'two-column': 'grid-cols-1 xl:grid-cols-2',
    'three-column': 'grid-cols-1 xl:grid-cols-3',
    'single-column': 'grid-cols-1',
    'mixed': 'grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3'
  }[layout];

  return (
    <div className={`grid ${gridClass} gap-6 ${className}`}>
      {children}
    </div>
  );
}
