"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import { useState } from "react";

export function FilterBar() {
  const [selectedDate] = useState("Jan 01, 2024 - Dec 31, 2024");

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Main Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Main Filters:</span>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Projects
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Status
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Data Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-600">Data Filters:</span>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Sector
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Fund Source
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Fund Type
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Funder
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Implementor
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Vulnerability Index
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
                  Income Class
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Date range pill */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 bg-white text-xs text-gray-700 self-start md:self-center">
              <CalendarDays className="w-3 h-3 text-gray-500" />
              <span>{selectedDate}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
