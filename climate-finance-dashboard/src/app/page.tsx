"use client";

import { TrendingUp, Target, DollarSign, MapPin, Leaf } from "lucide-react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPICard } from "@/components/ui/KPICard";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { FundsMobilizedChart } from "@/components/charts/FundsMobilizedChart";
import { GHGLevelsChart } from "@/components/charts/GHGLevelsChart";
import { InvestmentBySectorChart } from "@/components/charts/InvestmentBySectorChart";

export default function ClimateFinanceDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Climate Finance Dashboard</h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">All Data</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">NAP Core</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">MOCOP Data</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar />

      {/* Dashboard Title */}
      <div className="px-6 py-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          <KPICard
            title="TOTAL INVESTMENT"
            value="₱ 980 M"
            subtitle="Last Year: ₱854 M"
            icon={DollarSign}
            bgColor="bg-green-500"
          />
          <KPICard
            title="TOTAL PROJECTS"
            value="579"
            subtitle="Last Year: 445 Projects"
            icon={Target}
            bgColor="bg-gray-600"
          />
          <KPICard
            title="GHG PROGRESS"
            value="56%"
            subtitle="Vs 2020 baseline (44.6 GT)"
            icon={TrendingUp}
            bgColor="bg-cyan-500"
          />
          <KPICard
            title="ADAPTATION INVESTMENT"
            value="₱ 700 M"
            subtitle="Last Year: ₱584 M"
            icon={MapPin}
            bgColor="bg-pink-500"
          />
          <KPICard
            title="MITIGATION INVESTMENT"
            value="₱ 280 M"
            subtitle="Last Year: ₱270 M"
            icon={Leaf}
            bgColor="bg-orange-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Funds Mobilized Chart */}
          <ChartContainer
            title="FUNDS MOBILIZED FOR CLIMATE ACTION"
            subtitle="Trending up by 8.2% this year"
            trend={{ value: "8.2%", isPositive: true }}
          >
            <FundsMobilizedChart />
          </ChartContainer>

          {/* GHG Levels Chart */}
          <ChartContainer
            title="GHG LEVELS"
            subtitle="Trending up by 3.4% this year"
            trend={{ value: "3.4%", isPositive: true }}
          >
            <GHGLevelsChart />
          </ChartContainer>
        </div>

        {/* Investment by Sector Chart */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <ChartContainer
            title="INVESTMENT BY SECTOR"
            subtitle="Trending up by 5.7% this year"
            trend={{ value: "5.7%", isPositive: true }}
            height="h-96"
          >
            <InvestmentBySectorChart />
          </ChartContainer>
        </div>

        {/* Placeholder for additional charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ChartContainer
            title="INVESTMENTS BY REGION"
            subtitle="Trending up by 1.8% this year"
            trend={{ value: "1.8%", isPositive: true }}
          >
            <div className="flex items-center justify-center h-full text-gray-500">
              Regional Investment Chart
              <br />
              <span className="text-sm">(Horizontal Bar Chart)</span>
            </div>
          </ChartContainer>

          <ChartContainer
            title="VULNERABILITY/INCOME CLASS MAP"
            subtitle="Philippine map visualization"
          >
            <div className="flex items-center justify-center h-full text-gray-500">
              Philippine Map
              <br />
              <span className="text-sm">(Choropleth Map)</span>
            </div>
          </ChartContainer>

          <ChartContainer
            title="FUND SOURCE"
            subtitle="Distribution of funding sources"
          >
            <div className="flex items-center justify-center h-full text-gray-500">
              Fund Source Chart
              <br />
              <span className="text-sm">(Pie Chart)</span>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
