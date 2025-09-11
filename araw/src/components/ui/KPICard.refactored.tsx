// Refactored KPI Card with proper architecture
"use client";

import { Card, CardBody } from "@heroui/react";
import { KPIMetric } from '@/lib/types';
import { DollarSign, Target, TrendingUp, MapPin, Leaf } from "lucide-react";

interface KPICardProps {
  metric: KPIMetric;
  loading?: boolean;
}

// Icon mapping for type safety
const iconMap = {
  DollarSign,
  Target, 
  TrendingUp,
  MapPin,
  Leaf,
} as const;

export function KPICard({ metric, loading = false }: KPICardProps) {
  if (loading) {
    return (
      <Card className="shadow-lg animate-pulse">
        <CardBody className="p-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  const Icon = iconMap[metric.icon as keyof typeof iconMap];

  return (
    <Card className={`${metric.bgColor} ${metric.textColor || 'text-white'} border-none shadow-lg`}>
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {Icon && <Icon className="w-5 h-5" />}
              <p className="text-sm font-medium opacity-90">{metric.title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">{metric.formattedValue}</h3>
              <p className="text-sm opacity-80">{metric.subtitle}</p>
            </div>
          </div>
          {metric.trend && (
            <div className="text-right">
              <span className={`text-sm font-medium ${
                metric.trend.isPositive ? 'text-green-200' : 'text-red-200'
              }`}>
                {metric.trend.isPositive ? '+' : ''}{metric.trend.value}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
