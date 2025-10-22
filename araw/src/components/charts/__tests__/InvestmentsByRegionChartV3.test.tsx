/**
 * ARAW V3.0 Dashboard - Investments by Region Chart Tests
 * 
 * Unit tests for InvestmentsByRegionChartV3 component
 */

import { render, screen } from '@testing-library/react';
import InvestmentsByRegionChartV3, { RegionalInvestmentData } from '../InvestmentsByRegionChartV3';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

const mockData: RegionalInvestmentData[] = [
  { region: 'BARMM', regionCode: 'BARMM', amount: 85.5, rank: 1 },
  { region: 'Region XIII', regionCode: 'Region XIII', amount: 78.2, rank: 2 },
  { region: 'Region I', regionCode: 'Region I', amount: 72.8, rank: 3 },
];

describe('InvestmentsByRegionChartV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      expect(screen.getByText('INVESTMENTS BY REGION')).toBeInTheDocument();
      expect(screen.getByText('BARMM, Region XIII, and Region I lead in allocations')).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <InvestmentsByRegionChartV3 
          data={mockData}
          title="Custom Regional Title"
          subtitle="Custom regional subtitle"
        />
      );
      
      expect(screen.getByText('Custom Regional Title')).toBeInTheDocument();
      expect(screen.getByText('Custom regional subtitle')).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });

    it('should render with empty data', () => {
      render(<InvestmentsByRegionChartV3 data={[]} />);
      
      expect(screen.getByText('INVESTMENTS BY REGION')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <InvestmentsByRegionChartV3 data={mockData} className="custom-class" />
      );
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('bg-white');
    });

    it('should have border and rounded corners', () => {
      const { container } = render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
    });
  });

  describe('Props', () => {
    it('should accept and use data prop', () => {
      const { rerender } = render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      const newData: RegionalInvestmentData[] = [
        { region: 'NCR', regionCode: 'NCR', amount: 58.3, rank: 7 },
      ];
      
      rerender(<InvestmentsByRegionChartV3 data={newData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Chart Elements', () => {
    it('should render all chart elements', () => {
      render(<InvestmentsByRegionChartV3 data={mockData} />);
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });
  });
});

