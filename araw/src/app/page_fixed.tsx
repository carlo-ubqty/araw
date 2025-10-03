"use client";

import { TrendingUp, Cloud, Layers, Boxes, Banknote, Coins } from "lucide-react";
import { FundsMobilizedChart } from "@/components/charts/FundsMobilizedChart";
import { GHGLevelsChart } from "@/components/charts/GHGLevelsChart";
import { GHGBySectorChart } from "@/components/charts/GHGBySectorChart";
import { InvestmentBySectorChart } from "@/components/charts/InvestmentBySectorChart";
import { InvestmentsByIncomeClassChart } from "@/components/charts/InvestmentsByIncomeClassChart";
import { FundSourceChart } from "@/components/charts/FundSourceChart";
import { DashboardLayout } from "@/templates/DashboardLayout";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import dynamic from "next/dynamic";
const PhilippinesChoropleth = dynamic(() => import("@/components/map/PhilippinesChoropleth"), { ssr: false });
import InvestmentsByRegionHorizontal from "@/components/charts/InvestmentsByRegionHorizontal";

export default function ClimateFinanceDashboard() {
  return (
    <DashboardLayout headerProps={{ logoSrc: "/Department_of_Finance_(DOF).svg" }} showFilterBar={false}>
      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto flex">
          {/* Left Sidebar */}
          <LeftSidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 overflow-x-hidden">
            <div className="px-4 md:px-6 py-4 md:py-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Dashboard</h2>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                {/* All KPI cards here */}
                <div className="bg-gradient-to-r from-[#2f8964] to-[#54d06c] text-white p-3 md:p-5 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px] font-semibold tracking-wide">TOTAL INVESTMENT</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-2xl md:text-4xl font-extrabold leading-none">₱ 980 M</div>
                  </div>
                  <div className="text-xs opacity-90">Last Year: ₱760 M</div>
                </div>
                {/* Add other KPI cards */}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ChartContainer title="FUNDS MOBILIZED" heightClass="h-80">
                  <FundsMobilizedChart />
                </ChartContainer>
                <ChartContainer title="GHG LEVELS" heightClass="h-80">
                  <GHGLevelsChart />
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}



