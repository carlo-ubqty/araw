/**
 * ARAW V3.0 Dashboard - Service Layer Tests
 * 
 * Unit tests for dashboardServiceV3 (API-based architecture)
 */

import { DashboardServiceV3 } from '../dashboardServiceV3';

// Mock fetch globally for all tests
global.fetch = jest.fn();

describe('DashboardServiceV3', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getKPIMetrics', () => {
    it('should fetch and return KPI data from API', async () => {
      const mockResponse = {
        totalInvestment: '₱ 1400.76 B',
        ghgReduction: '56%',
        ghgReductionSubtitle: 'vs 2020 baseline',
        adaptationInvestment: '₱ 1347.55 B',
        mitigationInvestment: '₱ 53.20 B',
        totalProjects: '32,405',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await DashboardServiceV3.getKPIMetrics();
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard/kpis'));
    });

    it('should include filter params in API call', async () => {
      const mockResponse = {
        totalInvestment: '₱ 500.00 B',
        ghgReduction: '56%',
        ghgReductionSubtitle: 'vs 2020 baseline',
        adaptationInvestment: '₱ 450.00 B',
        mitigationInvestment: '₱ 50.00 B',
        totalProjects: '5,000',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await DashboardServiceV3.getKPIMetrics({
        selectedYears: [2025],
        dataView: 'NAP',
      });
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('years=2025')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('dataView=NAP')
      );
    });

    it('should return empty data on API failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const result = await DashboardServiceV3.getKPIMetrics();
      
      expect(result).toEqual({
        totalInvestment: '₱ 0.00 M',
        ghgReduction: 'No data',
        ghgReductionSubtitle: '',
        adaptationInvestment: '₱ 0.00 M',
        mitigationInvestment: '₱ 0.00 M',
        totalProjects: '0',
      });
    });

    it('should return empty data on non-ok response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await DashboardServiceV3.getKPIMetrics();
      
      expect(result).toEqual({
        totalInvestment: '₱ 0.00 M',
        ghgReduction: 'No data',
        ghgReductionSubtitle: '',
        adaptationInvestment: '₱ 0.00 M',
        mitigationInvestment: '₱ 0.00 M',
        totalProjects: '0',
      });
    });
  });

  describe('getAllChartsData', () => {
    it('should fetch and return all chart data from API', async () => {
      const mockResponse = {
        fundsMobilized: [
          { year: '2020', adaptation: 450, mitigation: 80 },
          { year: '2021', adaptation: 620, mitigation: 120 },
        ],
        ghgHistorical: [
          { year: 2015, total_ghg: 180 },
          { year: 2020, total_ghg: 195 },
        ],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await DashboardServiceV3.getAllChartsData();
      
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/dashboard/charts'));
    });

    it('should return empty chart data on API failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const result = await DashboardServiceV3.getAllChartsData();
      
      expect(result).toEqual({
        fundsMobilized: [],
        ghgHistorical: [],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      });
    });
  });

  describe('getFundsMobilizedData', () => {
    it('should return funds mobilized data from API', async () => {
      const mockChartData = {
        fundsMobilized: [
          { year: '2020', adaptation: 450, mitigation: 80 },
          { year: '2021', adaptation: 620, mitigation: 120 },
        ],
        ghgHistorical: [],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData,
      });

      const result = await DashboardServiceV3.getFundsMobilizedData();
      
      expect(result).toEqual(mockChartData.fundsMobilized);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('year');
      expect(result[0]).toHaveProperty('adaptation');
      expect(result[0]).toHaveProperty('mitigation');
    });

    it('should return empty array on API failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      const result = await DashboardServiceV3.getFundsMobilizedData();
      
      expect(result).toEqual([]);
    });
  });

  describe('getGHGLevelsData', () => {
    it('should return GHG levels data with historical and target', async () => {
      const mockChartData = {
        fundsMobilized: [],
        ghgHistorical: [
          { year: 2015, total_ghg: 180 },
          { year: 2020, total_ghg: 195 },
        ],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData,
      });

      const result = await DashboardServiceV3.getGHGLevelsData();
      
      expect(result).toHaveProperty('historicalData');
      expect(result).toHaveProperty('targetData');
      expect(Array.isArray(result.historicalData)).toBe(true);
      expect(result.targetData).toHaveProperty('year');
      expect(result.targetData).toHaveProperty('target');
      expect(result.targetData).toHaveProperty('breakdown');
    });

    it('should include gas breakdown in target data', async () => {
      const mockChartData = {
        fundsMobilized: [],
        ghgHistorical: [],
        investmentBySector: [],
        fundSourceBreakdown: { mainSource: null, subSources: [] },
        ghgBySector: [],
        regionalInvestments: [],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockChartData,
      });

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
      // Input is in actual PHP (1.5 billion = 1,500,000,000)
      const result = DashboardServiceV3.formatCurrency(1_500_000_000);
      expect(result).toBe('₱ 1.50 B');
    });

    it('should format values in millions', () => {
      // Input is in actual PHP (500 million = 500,000,000)
      const result = DashboardServiceV3.formatCurrency(500_000_000);
      expect(result).toBe('₱ 500.00 M');
    });

    it('should handle custom currency symbols', () => {
      // Input is in actual PHP (1 billion = 1,000,000,000)
      const result = DashboardServiceV3.formatCurrency(1_000_000_000, '$');
      expect(result).toBe('$ 1.00 B');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate positive percentage change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(150, 100);
      expect(result).toBe('+50.0%');
    });

    it('should calculate negative percentage change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(75, 100);
      expect(result).toBe('-25.0%');
    });

    it('should handle zero change', () => {
      const result = DashboardServiceV3.calculatePercentageChange(100, 100);
      expect(result).toBe('+0.0%');
    });
  });
});
