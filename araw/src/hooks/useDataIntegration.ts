"use client";

import { useState, useEffect, useCallback } from 'react';
import { DataIntegrationService } from '@/services/DataIntegrationService';
import { DataIntegrationStatus, ClimateInvestment, DataSource } from '@/types/DataSources';

export function useDataIntegration() {
  const [integrationStatus, setIntegrationStatus] = useState<DataIntegrationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dataService = DataIntegrationService.getInstance();

  // Initialize data integration
  useEffect(() => {
    const initializeIntegration = async () => {
      try {
        setIsLoading(true);
        await dataService.initializeDataSources();
        const status = dataService.getIntegrationStatus();
        setIntegrationStatus(status);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize data integration');
      } finally {
        setIsLoading(false);
      }
    };

    initializeIntegration();
  }, []);

  // Refresh integration status
  const refreshStatus = useCallback(() => {
    const status = dataService.getIntegrationStatus();
    setIntegrationStatus(status);
  }, []);

  // Get aggregated investment data
  const getInvestments = useCallback(async (filters?: any): Promise<ClimateInvestment[]> => {
    try {
      return await dataService.getAggregatedInvestments(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch investments');
      return [];
    }
  }, []);

  // Get data source information
  const getDataSources = useCallback((): DataSource[] => {
    return dataService.getAllDataSources();
  }, []);

  // Get sources by agency
  const getSourcesByAgency = useCallback((agency: string): DataSource[] => {
    return dataService.getSourcesByAgency(agency);
  }, []);

  // Clear cache and refresh
  const refreshData = useCallback(() => {
    dataService.clearCache();
    refreshStatus();
  }, [refreshStatus]);

  return {
    integrationStatus,
    isLoading,
    error,
    refreshStatus,
    getInvestments,
    getDataSources,
    getSourcesByAgency,
    refreshData
  };
}



