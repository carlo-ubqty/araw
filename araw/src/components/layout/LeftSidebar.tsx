"use client";

import { useSidebarController } from "@/controllers/useSidebarController";
import { useFilterController } from "@/controllers/useFilterController";

export function LeftSidebar() {
  const { isCollapsed } = useSidebarController();
  const { filterState, handleFilterChange } = useFilterController();

  return (
    <aside className="bg-gradient-to-b from-[#2f8964] to-[#1e5548] w-80 p-6 shadow-xl border-r border-[#54d06c]/20">
      <div className="space-y-8">
        {/* Sidebar Header */}
        <div className="pb-4 border-b border-white/20">
          <h2 className="text-white text-lg font-semibold mb-2">Filters & Analysis</h2>
          <p className="text-white/70 text-sm">Customize your data view</p>
        </div>

        {/* Search */}
        <div>
          <label className="text-white text-sm font-medium mb-3 block">Quick Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search filters, regions, sectors..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#54d06c] focus:bg-white/15 transition-all duration-200"
            />
            <div className="absolute right-3 top-3 text-white/50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="space-y-6">
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#54d06c] rounded-full"></div>
              Regions
            </h3>
            <div className="space-y-3 pl-4">
              {filterState.regions.map((region, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={region.selected}
                    onChange={(e) => handleFilterChange('regions', index, e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 text-[#54d06c] focus:ring-[#54d06c] focus:ring-2 bg-white/10"
                  />
                  <span className="text-white/90 text-sm group-hover:text-white transition-colors duration-200">
                    {region.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#54d06c] rounded-full"></div>
              Sectors
            </h3>
            <div className="space-y-3 pl-4">
              {filterState.sectors.map((sector, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={sector.selected}
                    onChange={(e) => handleFilterChange('sectors', index, e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 text-[#54d06c] focus:ring-[#54d06c] focus:ring-2 bg-white/10"
                  />
                  <span className="text-white/90 text-sm group-hover:text-white transition-colors duration-200">
                    {sector.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#54d06c] rounded-full"></div>
              Time Range
            </h3>
            <div className="space-y-4 pl-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">From Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#54d06c] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">To Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-[#54d06c] transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6 border-t border-white/20">
          <button className="w-full px-4 py-3 bg-[#54d06c] text-white font-medium rounded-lg hover:bg-[#54d06c]/90 transition-all duration-200 shadow-lg hover:shadow-xl">
            Apply Filters
          </button>
          <button className="w-full px-4 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/15 transition-all duration-200 border border-white/20">
            Reset All
          </button>
        </div>
      </div>
    </aside>
  );
}