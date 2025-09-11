"use client";

import { Card, CardBody } from "@heroui/react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: LucideIcon;
  bgColor: string;
  textColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  bgColor, 
  textColor = "text-white",
  trend 
}: KPICardProps) {
  return (
    <Card className={`${bgColor} ${textColor} border-none shadow-lg`}>
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {Icon && <Icon className="w-5 h-5" />}
              <p className="text-sm font-medium opacity-90">{title}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">{value}</h3>
              <p className="text-sm opacity-80">{subtitle}</p>
            </div>
          </div>
          {trend && (
            <div className="text-right">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-200' : 'text-red-200'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
