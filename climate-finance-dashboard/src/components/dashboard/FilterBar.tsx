"use client";

import { Select, SelectItem, Button, Chip } from "@heroui/react";
import { CalendarDays, Download } from "lucide-react";

export function FilterBar() {
  const filterOptions = [
    { key: "main_filters", label: "Main Filters", options: ["All", "NAP Core", "MOCOP Data"] },
    { key: "projects", label: "Projects", options: ["All Projects", "Active", "Completed", "Planned"] },
    { key: "status", label: "Status", options: ["All Status", "In Progress", "Completed", "Delayed"] },
    { key: "data_filters", label: "Data Filters", options: ["All Data", "Government", "Private", "International"] },
    { key: "sector", label: "Sector", options: ["All Sectors", "Agriculture", "Energy", "Transport", "Health"] },
    { key: "point_source", label: "Point Source", options: ["All Sources", "DOF", "CCC", "DBM", "DENR"] },
    { key: "point_type", label: "Point Type", options: ["All Types", "Grants", "Loans", "Bonds", "CSR"] },
    { key: "funder", label: "Funder", options: ["All Funders", "Government", "ODA", "Private", "MDBs"] },
    { key: "implementor", label: "Implementor", options: ["All Implementors", "NGAs", "LGUs", "Private"] },
    { key: "vulnerability", label: "Vulnerability Index", options: ["All Levels", "Very High", "High", "Medium", "Low"] },
    { key: "income", label: "Income Class", options: ["All Classes", "1st Class", "2nd Class", "3rd Class", "4th Class"] },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        {filterOptions.map((filter) => (
          <Select
            key={filter.key}
            size="sm"
            placeholder={filter.label}
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
            Jan 01, 2019 - Dec 31, 2024
          </Chip>
          
          <Button
            size="sm"
            startContent={<Download className="w-4 h-4" />}
            className="bg-green-600 text-white"
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
}
