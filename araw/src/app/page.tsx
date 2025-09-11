"use client";

import { TrendingUp, Cloud, Layers, Boxes, Banknote, Coins } from "lucide-react";
import { FundsMobilizedChart } from "@/components/charts/FundsMobilizedChart";
import { GHGLevelsChart } from "@/components/charts/GHGLevelsChart";
import { GHGBySectorChart } from "@/components/charts/GHGBySectorChart";
import { InvestmentBySectorChart } from "@/components/charts/InvestmentBySectorChart";
import { DashboardLayout } from "@/templates/DashboardLayout";
import { ChartContainer } from "@/components/ui/ChartContainer";
import dynamic from "next/dynamic";
const PhilippinesChoropleth = dynamic(() => import("@/components/map/PhilippinesChoropleth"), { ssr: false });
import InvestmentsByRegionHorizontal from "@/components/charts/InvestmentsByRegionHorizontal";

export default function ClimateFinanceDashboard() {
  return (
    <DashboardLayout headerProps={{ logoSrc: "/Department_of_Finance_(DOF).svg" }}>

      {/* Dashboard Title */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          {/* KPI Cards - Exact Mockup Styling */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {/* Total Investment */}
            <div className="bg-gradient-to-r from-[#2f8964] to-[#54d06c] text-white p-5 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Banknote className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide">TOTAL INVESTMENT</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-4xl font-extrabold leading-none">₱ 980 M</div>
                <span
                  className="inline-block w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[9px] border-b-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="text-xs opacity-90">Last Year: ₱760 M</div>
            </div>
            
            {/* Total Projects */}
            <div className="bg-gradient-to-r from-[#476b85] to-[#5aa37a] text-white p-5 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.26 1.3.73 1.77.47.47 1.11.73 1.77.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
                </svg>
                <span className="text-[11px] font-semibold tracking-wide">TOTAL PROJECTS</span>
              </div>
              <div>
                <div className="text-4xl font-extrabold leading-none mb-1">579</div>
                <div className="text-xs opacity-90">Last Year: 400 Projects</div>
              </div>
            </div>
            
            {/* GHG Progress */}
            <div className="relative bg-gradient-to-r from-[#3f7fbe] to-[#24b9d6] text-white p-5 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide">GHG PROGRESS</span>
              </div>
              <div className="text-4xl font-extrabold leading-none mb-1">56%</div>
              <div className="text-xs opacity-90">actual vs 2020 baseline (60%)</div>
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-block w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-red-500"
                aria-hidden="true"
              />
            </div>
            
            {/* Adaptation Investment */}
            <div className="bg-gradient-to-r from-[#e85c9d] to-[#fdb38b] text-white p-5 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide">ADAPTATION INVESTMENT</span>
              </div>
              <div>
                <div className="text-4xl font-extrabold leading-none mb-1">₱ 700 M</div>
                <div className="text-xs opacity-90">Last Year: ₱600 M</div>
              </div>
            </div>
            
            {/* Mitigation Investment */}
            <div className="bg-gradient-to-r from-[#ec6faf] to-[#fdb58e] text-white p-5 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Boxes className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wide">MITIGATION INVESTMENT</span>
              </div>
              <div>
                <div className="text-4xl font-extrabold leading-none mb-1">₱ 280 M</div>
                <div className="text-xs opacity-90">Last Year: ₱50 M</div>
              </div>
            </div>
        </div>

          {/* Charts Grid - Reimplemented from scratch with ChartContainer */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ChartContainer 
              title="FUNDS MOBILIZED FOR CLIMATE ACTION"
              icon={<Coins className="w-4 h-4 text-purple-600" />}
              trendText="Trending up by 8.2% this year"
              heightClass="h-80"
            >
              <FundsMobilizedChart />
            </ChartContainer>

            <ChartContainer 
              title="GHG LEVELS"
              icon={<Cloud className="w-4 h-4 text-purple-600" />}
              trendText="Trending up by 4.3% this year"
              heightClass="h-80"
            >
              <GHGLevelsChart />
            </ChartContainer>
          </div>

          
          {/* Investment by Sector - full width */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <ChartContainer
              title="INVESTMENT BY SECTOR"
              icon={<Coins className="w-4 h-4 text-purple-600" />}
              trendText="Trending up by 5.2% this year"
              heightClass="h-96"
            >
              <InvestmentBySectorChart />
            </ChartContainer>
          </div>

          {/* GHG Reduction by Sector - full width */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <ChartContainer
              title="GHG REDUCTION ACTUAL VS 2020 BASELINE BY SECTOR"
              icon={<Cloud className="w-4 h-4 text-purple-600" />}
              trendText="Trending up by 5.2% this year"
              heightClass="h-96"
            >
              <GHGBySectorChart />
            </ChartContainer>
          </div>

          {/* Region Investments & Choropleth (newest sections placed last) */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <ChartContainer
                title="INVESTMENTS BY REGION"
                icon={<Coins className="w-4 h-4 text-purple-600" />}
                trendText="Trending up by 5.2% this year"
                heightClass="h-[520px]"
              >
                <InvestmentsByRegionHorizontal />
              </ChartContainer>
            </div>
            <div className="col-span-2">
              <ChartContainer
                title="VULNERABILITY/INCOME CLASS VS INVESTMENTS"
                icon={<Cloud className="w-4 h-4 text-purple-600" />}
                trendText="Trending up by 5.2% this year"
                heightClass="h-[520px]"
              >
                <div className="h-[460px]">
                  <PhilippinesChoropleth />
                </div>
              </ChartContainer>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}