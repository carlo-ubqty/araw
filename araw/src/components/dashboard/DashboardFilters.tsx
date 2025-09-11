// Filter bar component - Client Component for interactivity
"use client";

import { useState } from 'react';
import { Select, SelectItem, Button, Chip } from "@heroui/react";
import { CalendarDays, Download } from "lucide-react";
import { DashboardFilters as FilterType } from '@/lib/types';
import { SECTORS, REGIONS, FUNDING_SOURCES, PROJECT_STATUS } from '@/lib/constants';

interface DashboardFiltersProps {
  onFiltersChange?: (filters: FilterType) => void;
  initialFilters?: FilterType;
}

export function DashboardFilters({ onFiltersChange, initialFilters }: DashboardFiltersProps) {
  const [filters, setFilters] = useState<FilterType>(initialFilters || {
    dateRange: {
      start: '2019-01-01',
      end: '2024-12-31'
    }
  });

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const filterOptions = [
    { 
      key: "main_filters", 
      label: "Main Filters", 
      options: ["All", "NAP Core", "MOCOP Data"],
      value: "All"
    },
    { 
      key: "projects", 
      label: "Projects", 
      options: ["All Projects", "Active", "Completed", "Planned"],
      value: "All Projects"
    },
    { 
      key: "status", 
      label: "Status", 
      options: PROJECT_STATUS.map(s => s),
      value: filters.projectStatus || "All Status"
    },
    { 
      key: "sector", 
      label: "Sector", 
      options: ["All Sectors", ...SECTORS],
      value: filters.sector || "All Sectors"
    },
    { 
      key: "region", 
      label: "Region", 
      options: ["All Regions", ...REGIONS],
      value: filters.region || "All Regions"
    },
    { 
      key: "funder", 
      label: "Funder", 
      options: ["All Funders", ...FUNDING_SOURCES],
      value: filters.fundingSource || "All Funders"
    },
  ];

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        {filterOptions.map((filter) => (
          <Select
            key={filter.key}
            size="sm"
            placeholder={filter.label}
            selectedKeys={[filter.value]}
            onSelectionChange={(selection) => {
              const value = Array.from(selection)[0] as string;
              if (filter.key === 'sector' && value !== 'All Sectors') {
                handleFilterChange('sector', value);
              } else if (filter.key === 'region' && value !== 'All Regions') {
                handleFilterChange('region', value);
              } else if (filter.key === 'funder' && value !== 'All Funders') {
                handleFilterChange('fundingSource', value);
              } else if (filter.key === 'status' && value !== 'All Status') {
                handleFilterChange('projectStatus', value);
              }
            }}
            className="min-w-32"
            classNames={{
              trigger: "h-8 min-h-8 bg-gray-50 border-gray-200",
              value: "text-xs",
            }}
          >
            {filter.options.map((option) => (
              <SelectItem key={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        ))}
        
        <div className="flex items-center gap-2 ml-auto">
          <Chip
            startContent={<CalendarDays className="w-3 h-3" />}
            size="sm"
            variant="flat"
            className="bg-blue-50 text-blue-700"
          >
            {formatDateRange(filters.dateRange.start, filters.dateRange.end)}
          </Chip>
          
          <Button
            size="sm"
            startContent={<Download className="w-4 h-4" />}
            className="bg-green-600 text-white"
            onPress={() => {
              // TODO: Implement export functionality
              console.log('Export data with filters:', filters);
            }}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}
