"use client";

import { useState } from "react";

export type DatasetType = "nap" | "ndcip" | "budget" | "projects";

interface DatasetOption {
  id: DatasetType;
  label: string;
  description: string;
  pillars?: string[];
}

interface DatasetNavigationProps {
  activeDataset: DatasetType;
  onDatasetChange: (dataset: DatasetType) => void;
}

const DATASETS: DatasetOption[] = [
  {
    id: "nap",
    label: "NAP",
    description: "National Adaptation Plan",
  },
  {
    id: "ndcip", 
    label: "NDCIP",
    description: "NDC Implementation Plan"
  },
  {
    id: "budget", 
    label: "BUDGET",
    description: "Climate Finance Budget"
  },
  {
    id: "projects", 
    label: "PROJECTS",
    description: "Climate Projects Pipeline"
  }
];

const getActiveStyles = (datasetId: DatasetType) => {
  switch (datasetId) {
    case "nap":
      return "text-green-800 border-green-500 bg-green-50";
    case "ndcip":
      return "text-blue-800 border-blue-500 bg-blue-50";
    case "budget":
      return "text-purple-800 border-purple-500 bg-purple-50";
    case "projects":
      return "text-orange-800 border-orange-500 bg-orange-50";
    default:
      return "text-gray-800 border-gray-500 bg-gray-50";
  }
};

export function DatasetNavigation({ activeDataset, onDatasetChange }: DatasetNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 shadow-sm">
      <div className="flex border-b border-gray-100">
        {DATASETS.map((dataset) => (
            <button
              key={dataset.id}
              onClick={() => onDatasetChange(dataset.id)}
              className={`
                px-6 py-3 text-sm font-semibold transition-all duration-200
                border-b-3 relative
                ${
                  activeDataset === dataset.id
                    ? getActiveStyles(dataset.id)
                    : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-800"
                }
              `}
            >
              {dataset.label}
            </button>
          ))}
      </div>
    </div>
  );
}

export { DATASETS };
