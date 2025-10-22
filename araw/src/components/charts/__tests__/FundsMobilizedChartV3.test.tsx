/**
 * ARAW V3.0 Dashboard - Funds Mobilized Chart Tests
 * 
 * Unit tests for FundsMobilizedChartV3 component
 */

import { render, screen } from '@testing-library/react';
import FundsMobilizedChartV3, { FundsData } from '../FundsMobilizedChartV3';

// Mock Recharts components to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

const mockData: FundsData[] = [
  { year: '2020', adaptation: 200, mitigation: 50 },
  { year: '2021', adaptation: 400, mitigation: 80 },
  { year: '2022', adaptation: 600, mitigation: 120 },
];

describe('FundsMobilizedChartV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<FundsMobilizedChartV3 data={mockData} />);
      
      expect(screen.getByText('FUNDS MOBILIZED FOR CLIMATE ACTION')).toBeInTheDocument();
      expect(screen.getByText(/Trending up by 5.2%/)).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <FundsMobilizedChartV3 
          data={mockData}
          title="Custom Title"
          subtitle="Custom Subtitle"
        />
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<FundsMobilizedChartV3 data={mockData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('area')).toHaveLength(2); // adaptation + mitigation
    });

    it('should render with empty data', () => {
      render(<FundsMobilizedChartV3 data={[]} />);
      
      expect(screen.getByText('FUNDS MOBILIZED FOR CLIMATE ACTION')).toBeInTheDocument();
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });

  describe('Note Callout', () => {
    it('should render note text when provided', () => {
      const noteText = 'Test note text';
      render(<FundsMobilizedChartV3 data={mockData} noteText={noteText} />);
      
      expect(screen.getByText(noteText)).toBeInTheDocument();
    });

    it('should not render note section when noteText is empty', () => {
      render(<FundsMobilizedChartV3 data={mockData} noteText="" />);
      
      const noteSections = screen.queryByText(/GAA allocations/);
      expect(noteSections).not.toBeInTheDocument();
    });

    it('should render default note text', () => {
      render(<FundsMobilizedChartV3 data={mockData} />);
      
      expect(screen.getByText(/2025 \(GAA\)/)).toBeInTheDocument();
      expect(screen.getByText(/do not represent actual disbursements/)).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FundsMobilizedChartV3 data={mockData} className="custom-class" />
      );
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<FundsMobilizedChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('bg-white');
    });

    it('should have border and rounded corners', () => {
      const { container } = render(<FundsMobilizedChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
    });
  });

  describe('Props', () => {
    it('should accept and use data prop', () => {
      const { rerender } = render(<FundsMobilizedChartV3 data={mockData} />);
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      
      const newData: FundsData[] = [
        { year: '2023', adaptation: 800, mitigation: 150 },
      ];
      
      rerender(<FundsMobilizedChartV3 data={newData} />);
      
      expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    });
  });
});

