"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  icon?: ReactNode;
  trendText?: string;
  heightClass?: string;
  children: ReactNode;
}

export function ChartContainer({ title, icon, trendText = "", heightClass = "h-80", children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-start gap-2">
          {icon && <div className="mt-0.5 text-purple-600">{icon}</div>}
          <div>
            <h3 className="text-[13px] font-semibold text-gray-800 tracking-wide">{title}</h3>
            {trendText && (
              <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-1">
                <span>{trendText}</span>
                <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-green-500" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`px-4 pb-4 ${heightClass}`}>
        {children}
      </div>
    </div>
  );
}
