"use client";

import { useState, useCallback } from "react";
import type { DatasetType } from "@/components/layout/DatasetNavigation";

export function useDatasetController(initialDataset: DatasetType = "nap") {
  const [activeDataset, setActiveDataset] = useState<DatasetType>(initialDataset);
  
  const handleDatasetChange = useCallback((dataset: DatasetType) => {
    setActiveDataset(dataset);
    
    // Here you would typically:
    // - Update URL params
    // - Trigger data refetch
    // - Update analytics tracking
    console.log(`Dataset switched to: ${dataset}`);
  }, []);

  const getDatasetConfig = useCallback(() => {
    switch (activeDataset) {
      case "nap":
        return {
          title: "National Adaptation Plan",
          description: "Climate adaptation and vulnerability data",
          primaryColor: "#2f8964",
          focusAreas: ["Adaptation", "Vulnerability", "Resilience"]
        };
      case "ndcip":
        return {
          title: "NDC Implementation Plan", 
          description: "GHG reduction and mitigation projects",
          primaryColor: "#3C6866",
          focusAreas: ["Mitigation", "GHG Reduction", "Emissions"]
        };
      default:
        return {
          title: "Climate Finance Dashboard",
          description: "Comprehensive climate finance tracking",
          primaryColor: "#3C6866", 
          focusAreas: ["Finance", "Investment", "Projects"]
        };
    }
  }, [activeDataset]);

  return {
    activeDataset,
    handleDatasetChange,
    getDatasetConfig
  };
}



