/**
 * ARAW V3.0 Dashboard - Investment by Sector Chart Tests
 * 
 * Unit tests for InvestmentBySectorChartV3 component
 */

import { render, screen } from '@testing-library/react';
import InvestmentBySectorChartV3, { SectorInvestmentData } from '../InvestmentBySectorChartV3';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData: SectorInvestmentData[] = [
  { sector: 'Agriculture', govBudget: 120, grant: 80, loan: 40, private: 20 },
  { sector: 'Water', govBudget: 100, grant: 60, loan: 30, private: 15 },
  { sector: 'Energy', govBudget: 110, grant: 70, loan: 35, private: 18 },
];

describe('InvestmentBySectorChartV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<InvestmentBySectorChartV3 data={mockData} />);
      
      expect(screen.getByText('INVESTMENT BY SECTOR')).toBeInTheDocument();
      expect(screen.getByText('Breakdown by funding type')).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <InvestmentBySectorChartV3 
          data={mockData}
          title="Custom Title"
          subtitle="Custom Subtitle"
        />
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<InvestmentBySectorChartV3 data={mockData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('bar')).toHaveLength(4); // 4 funding types
    });

    it('should render with empty data', () => {
      render(<InvestmentBySectorChartV3 data={[]} />);
      
      expect(screen.getByText('INVESTMENT BY SECTOR')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      render(<InvestmentBySectorChartV3 data={mockData} subtitle="" />);
      
      expect(screen.queryByText('Breakdown by funding type')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <InvestmentBySectorChartV3 data={mockData} className="custom-class" />
      );
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<InvestmentBySectorChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('bg-white');
    });

    it('should have border and rounded corners', () => {
      const { container } = render(<InvestmentBySectorChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
    });
  });

  describe('Props', () => {
    it('should accept and use data prop', () => {
      const { rerender } = render(<InvestmentBySectorChartV3 data={mockData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      const newData: SectorInvestmentData[] = [
        { sector: 'Forestry', govBudget: 90, grant: 50, loan: 25, private: 10 },
      ];
      
      rerender(<InvestmentBySectorChartV3 data={newData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});


