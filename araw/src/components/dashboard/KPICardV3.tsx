/**
 * ARAW V3.0 Dashboard - KPI Card Component
 * 
 * Gradient card for displaying key metrics
 * JIRA: ARAW-314
 */

'use client';

import { ReactNode } from 'react';

export interface KPICardV3Props {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export default function KPICardV3({
  icon,
  label,
  value,
  subtitle,
  gradientFrom,
  gradientTo,
  className = ''
}: KPICardV3Props) {
  return (
    <div
      className={`rounded-lg p-4 shadow-md flex flex-col justify-between ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        minHeight: '130px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Icon + Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-shrink-0 text-white opacity-90">
          {icon}
        </div>
        <span 
          className="text-white font-medium leading-tight"
          style={{ fontSize: '16px' }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex flex-col">
        <span 
          className="text-white font-bold leading-none"
          style={{ fontSize: '48px' }}
        >
          {value}
        </span>
        {subtitle && (
          <span 
            className="text-white opacity-80 mt-1"
            style={{ fontSize: '13px' }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

