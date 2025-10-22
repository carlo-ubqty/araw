/**
 * ARAW V3.0 Dashboard - Service Layer Tests
 * 
 * Unit tests for dashboardServiceV3
 */

import { DashboardServiceV3 } from '../dashboardServiceV3';

describe('DashboardServiceV3', () => {
  describe('getKPIMetrics', () => {
    it('should return KPI data with default values', async () => {
      const result = await DashboardServiceV3.getKPIMetrics();
      
      expect(result).toHaveProperty('totalInvestment');
      expect(result).toHaveProperty('ghgReduction');
      expect(result).toHaveProperty('adaptationInvestment');
      expect(result).toHaveProperty('mitigationInvestment');
      expect(result).toHaveProperty('totalProjects');
      
      expect(result.ghgReduction).toBe('56%');
      expect(result.ghgReductionSubtitle).toBe('vs 2020 baseline');
    });

    it('should adjust values based on year filters', async () => {
      const resultWithAllYears = await DashboardServiceV3.getKPIMetrics({
        selectedYears: [2021, 2022, 2023, 2024, 2025],
      });
      
      const resultWithOneYear = await DashboardServiceV3.getKPIMetrics({
        selectedYears: [2025],
      });
      
      // Values should differ based on filter
      expect(resultWithAllYears.totalInvestment).not.toBe(resultWithOneYear.totalInvestment);
    });
  });

  describe('getFundsMobilizedData', () => {
    it('should return historical funding data', async () => {
      const result = await DashboardServiceV3.getFundsMobilizedData();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      const firstEntry = result[0];
      expect(firstEntry).toHaveProperty('year');
      expect(firstEntry).toHaveProperty('adaptation');
      expect(firstEntry).toHaveProperty('mitigation');
    });

    it('should include data for years 2020-2025', async () => {
      const result = await DashboardServiceV3.getFundsMobilizedData();
      
      const years = result.map(entry => entry.year);
      expect(years).toContain('2020');
      expect(years).toContain('2025');
    });
  });

  describe('getGHGLevelsData', () => {
    it('should return historical and target data', async () => {
      const result = await DashboardServiceV3.getGHGLevelsData();
      
      expect(result).toHaveProperty('historicalData');
      expect(result).toHaveProperty('targetData');
      
      expect(Array.isArray(result.historicalData)).toBe(true);
      expect(result.targetData).toHaveProperty('year');
      expect(result.targetData).toHaveProperty('target');
      expect(result.targetData).toHaveProperty('breakdown');
    });

    it('should include gas breakdown in target data', async () => {
      const result = await DashboardServiceV3.getGHGLevelsData();
      
      const breakdown = result.targetData.breakdown;
      expect(breakdown.length).toBe(4);
      
      const gases = breakdown.map(item => item.gas);
      expect(gases).toContain('Carbon Dioxide (CO₂)');
      expect(gases).toContain('Methane (CH₄)');
      expect(gases).toContain('Nitrous Oxide (N₂O)');
      expect(gases).toContain('Hydrofluorocarbon (HFC)');
    });
  });

  describe('formatCurrency', () => {
    it('should format values in billions', () => {
      const result = DashboardServiceV3.formatCurrency(1500);
      expect(result).toBe('₱1.50 B');
    });

    it('should format values in millions', () => {
      const result = DashboardServiceV3.formatCurrency(500);
      expect(result).toBe('₱500.00 M');
    });

    it('should handle custom currency symbols', () => {
      const result = DashboardServiceV3.formatCurrency(1000, '$');
      expect(result).toBe('$1.00 B');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive percentage change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(120, 100);
      expect(result).toBe('+20.0%');
    });

    it('should calculate negative percentage change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(80, 100);
      expect(result).toBe('-20.0%');
    });

    it('should handle zero change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(100, 100);
      expect(result).toBe('+0.0%');
    });
  });
});

