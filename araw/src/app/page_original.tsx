"use client";

import { TrendingUp, Cloud, Layers, Boxes, Banknote, Coins, Target, Activity, TreePine } from "lucide-react";
import { FundsMobilizedChart } from "@/components/charts/FundsMobilizedChart";
import { GHGLevelsChart } from "@/components/charts/GHGLevelsChart";
import { GHGBySectorChart } from "@/components/charts/GHGBySectorChart";
import { InvestmentBySectorChart } from "@/components/charts/InvestmentBySectorChart";
import { InvestmentsByIncomeClassChart } from "@/components/charts/InvestmentsByIncomeClassChart";
import { FundSourceChart } from "@/components/charts/FundSourceChart";
import { DashboardLayout } from "@/templates/DashboardLayout";
import { DatasetNavigation } from "@/components/layout/DatasetNavigation";
import { useDatasetController } from "@/controllers/useDatasetController";
import dynamic from "next/dynamic";
const PhilippinesChoropleth = dynamic(() => import("@/components/map/PhilippinesChoropleth"), { ssr: false });
import InvestmentsByRegionHorizontal from "@/components/charts/InvestmentsByRegionHorizontal";

export default function OriginalMockupDashboard() {
  const { activeDataset, handleDatasetChange } = useDatasetController("nap");
  
  return (
    <DashboardLayout headerProps={{ logoSrc: "/Department_of_Finance_(DOF).svg" }} showFilterBar={false}>
      {/* Main Layout: Full-height Sidebar + Content */}
      <div className="flex flex-1 h-full">
        {/* Full-Height Green Sidebar */}
        <div className="w-72 bg-[#2f8964] text-white flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 bg-[#1e5548]">
            <h2 className="text-lg font-bold mb-2">Climate Finance</h2>
            <p className="text-sm opacity-90">Dashboard</p>
          </div>
          
          {/* Navigation Sections */}
          <div className="flex-1 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-75">NAP</h3>
              <div className="space-y-2">
                <div className="bg-white/10 px-3 py-2 rounded text-sm cursor-pointer hover:bg-white/20">Overview</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">8 Pillars</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">Adaptation</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">Vulnerability</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-75">NDCIP</h3>
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">Mitigation</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">GHG Targets</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">Sectoral Plans</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-75">FILTERS</h3>
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">All Regions</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">All Sectors</div>
                <div className="px-3 py-2 text-sm cursor-pointer hover:bg-white/10 opacity-80">2020-2024</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Dataset Navigation */}
          <DatasetNavigation 
            activeDataset={activeDataset}
            onDatasetChange={handleDatasetChange}
          />
          
          {/* Content */}
          <div className="flex-1 p-6">
            {/* KPI Cards - 5 Multi-colored Cards */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              {/* Total Investment - Green */}
              <div className="bg-gradient-to-br from-[#2f8964] to-[#54d06c] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Total Investment</span>
                </div>
                <div className="text-3xl font-bold mb-1">980</div>
                <div className="text-sm opacity-90">Million PHP</div>
              </div>

              {/* Progress vs 2020 Baseline - Blue */}
              <div className="bg-gradient-to-br from-[#3B82F6] to-[#1E40AF] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Progress vs 2020</span>
                </div>
                <div className="text-3xl font-bold mb-1">56%</div>
                <div className="text-sm opacity-90">vs 2020 Baseline</div>
              </div>

              {/* Adaptation Fund - Orange */}
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TreePine className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Adaptation Fund</span>
                </div>
                <div className="text-3xl font-bold mb-1">700</div>
                <div className="text-sm opacity-90">Million PHP</div>
              </div>

              {/* Mitigation Fund - Yellow */}
              <div className="bg-gradient-to-br from-[#EAB308] to-[#CA8A04] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Mitigation Fund</span>
                </div>
                <div className="text-3xl font-bold mb-1">280</div>
                <div className="text-sm opacity-90">Million PHP</div>
              </div>

              {/* Total Projects - Purple */}
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Boxes className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide">Total Projects</span>
                </div>
                <div className="text-3xl font-bold mb-1">579</div>
                <div className="text-sm opacity-90">Projects</div>
              </div>
            </div>

            {/* Charts Grid - 3 Column Dense Layout */}
            <div className="grid grid-cols-3 gap-6">
              {/* Row 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">FUNDS MOBILIZED FOR CLIMATE ACTION</h3>
                  <div className="text-xs text-gray-500">PHP</div>
                </div>
                <div className="h-48">
                  <FundsMobilizedChart />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">GHG LEVELS</h3>
                  <div className="text-xs text-gray-500">tCO2e</div>
                </div>
                <div className="h-48">
                  <GHGLevelsChart />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">INVESTMENTS BY SECTOR</h3>
                  <div className="text-xs text-gray-500">PHP Millions</div>
                </div>
                <div className="h-48">
                  <InvestmentBySectorChart />
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">FUND SOURCES</h3>
                </div>
                <div className="h-48">
                  <FundSourceChart />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">GHG CO2 BASELINE BY SECTOR</h3>
                </div>
                <div className="h-48">
                  <GHGBySectorChart />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">INVESTMENTS BY REGION</h3>
                </div>
                <div className="h-48">
                  <InvestmentsByRegionHorizontal />
                </div>
              </div>

              {/* Row 3 */}
              <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">VULNERABILITY/CLIMATE RISK BY INVESTMENTS</h3>
                </div>
                <div className="h-64">
                  <PhilippinesChoropleth />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">INVESTMENT BY VULNERABILITY INDEX</h3>
                </div>
                <div className="h-64">
                  <InvestmentsByIncomeClassChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}



