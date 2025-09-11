// Main dashboard content component - Simplified version
import { TrendingUp, Target, DollarSign, MapPin, Leaf } from "lucide-react";
import { FilterBar } from "./FilterBar";
import { KPICard } from "@/components/ui/KPICard";
import { ChartContainer } from "@/components/ui/ChartContainer";
import { FundsMobilizedChart } from "@/components/charts/FundsMobilizedChart";
import { GHGLevelsChart } from "@/components/charts/GHGLevelsChart";
import { InvestmentBySectorChart } from "@/components/charts/InvestmentBySectorChart";

// Server Component with updated styling to match mockup
export default function DashboardContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - PURPLE BACKGROUND */}
      <header className="bg-purple-800 text-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-800 font-bold text-sm">CF</span>
                </div>
                <h1 className="text-lg font-semibold">Climate Finance Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <button className="px-4 py-1 bg-white bg-opacity-20 text-white text-sm rounded hover:bg-opacity-30">
                  All Data
                </button>
                <button className="px-4 py-1 text-white text-sm rounded hover:bg-white hover:bg-opacity-20">
                  NAP Data
                </button>
                <button className="px-4 py-1 text-white text-sm rounded hover:bg-white hover:bg-opacity-20">
                  MOCOP Data
                </button>
              </div>
              <div className="text-sm text-white opacity-90">
                09/10/2019 19:42:06 AM
              </div>
              <div className="flex gap-2">
                <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
                  </svg>
                </button>
                <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar />

      {/* Dashboard Content with Max Width Container */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
          
          {/* KPI Cards - Matching mockup exactly */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {/* Total Investment */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">TOTAL INVESTMENT</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">₱ 980 M</div>
                  <div className="text-xs opacity-80">Last Year: ₱554 M</div>
                </div>
                <div className="text-green-200">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            {/* Total Projects */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-xs font-medium">TOTAL PROJECTS</span>
              </div>
              <div>
                <div className="text-2xl font-bold">579</div>
                <div className="text-xs opacity-80">Last Year: 445 Projects</div>
              </div>
            </div>
            
            {/* GHG Progress */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">GHG PROGRESS</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                <div className="text-2xl font-bold">56%</div>
                <div className="text-xs opacity-80">Vs 2020 baseline (44.6 GT)</div>
                </div>
                <div className="text-red-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 15.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Adaptation Investment */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">ADAPTATION INVESTMENT</span>
              </div>
              <div>
                <div className="text-2xl font-bold">₱ 700 M</div>
                <div className="text-xs opacity-80">Last Year: ₱554 M</div>
              </div>
            </div>
            
            {/* Mitigation Investment */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-medium">MITIGATION INVESTMENT</span>
              </div>
              <div>
                <div className="text-2xl font-bold">₱ 280 M</div>
                <div className="text-xs opacity-80">Last Year: ₱270 M</div>
              </div>
            </div>
          </div>

          {/* Charts Grid - Two charts side by side */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Funds Mobilized Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-sm text-gray-800">FUNDS MOBILIZED FOR CLIMATE ACTION</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6">Trending up by 8.2% this year 📈</p>
              <div className="h-80">
                <FundsMobilizedChart />
              </div>
            </div>

            {/* GHG Levels Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold text-sm text-gray-800">GHG LEVELS</h3>
              </div>
              <p className="text-xs text-gray-500 mb-6">Trending up by 4.3% this year 📈</p>
              <div className="h-80">
                <GHGLevelsChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}