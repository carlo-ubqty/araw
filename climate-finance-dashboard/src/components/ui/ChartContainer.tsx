"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  height?: string;
  className?: string;
}

export function ChartContainer({ 
  title, 
  children, 
  subtitle, 
  trend, 
  height = "h-80",
  className = ""
}: ChartContainerProps) {
  return (
    <Card className={`border border-gray-200 shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value}</span>
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
