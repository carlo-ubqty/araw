/**
 * ARAW V3.0 Dashboard - GHG by Sector Chart Tests
 * 
 * Unit tests for GHGBySectorChartV3 component
 */

import { render, screen } from '@testing-library/react';
import GHGBySectorChartV3, { GHGBySectorData } from '../GHGBySectorChartV3';

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
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

const mockData: GHGBySectorData[] = [
  { sector: 'Agriculture', actual: 12.5, conditional: 8.2, unconditional: 2.3 },
  { sector: 'Water', actual: 1.2, conditional: 1.17, unconditional: 0.03 },
  { sector: 'Energy', actual: 18.3, conditional: 12.8, unconditional: 4.2 },
];

describe('GHGBySectorChartV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<GHGBySectorChartV3 data={mockData} />);
      
      expect(screen.getByText('GHG VS 2020 BASELINE BY SECTOR')).toBeInTheDocument();
      expect(screen.getByText(/% of 2030 reduction target achieved/)).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <GHGBySectorChartV3 
          data={mockData}
          title="Custom GHG Title"
          subtitle="Custom subtitle text"
        />
      );
      
      expect(screen.getByText('Custom GHG Title')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle text')).toBeInTheDocument();
    });

    it('should render with custom progress percentage', () => {
      render(<GHGBySectorChartV3 data={mockData} progressPercentage={75} />);
      
      expect(screen.getByText('75% of 2030 reduction target achieved 🔺')).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<GHGBySectorChartV3 data={mockData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getAllByTestId('bar')).toHaveLength(3); // 3 stacked components
    });

    it('should render with empty data', () => {
      render(<GHGBySectorChartV3 data={[]} />);
      
      expect(screen.getByText('GHG VS 2020 BASELINE BY SECTOR')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <GHGBySectorChartV3 data={mockData} className="custom-class" />
      );
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<GHGBySectorChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('bg-white');
    });

    it('should have border and rounded corners', () => {
      const { container } = render(<GHGBySectorChartV3 data={mockData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
    });
  });

  describe('Props', () => {
    it('should accept and use data prop', () => {
      const { rerender } = render(<GHGBySectorChartV3 data={mockData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      
      const newData: GHGBySectorData[] = [
        { sector: 'Forestry', actual: 15.8, conditional: 10.5, unconditional: 3.2 },
      ];
      
      rerender(<GHGBySectorChartV3 data={newData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should use default progress percentage when not provided', () => {
      render(<GHGBySectorChartV3 data={mockData} />);
      
      expect(screen.getByText('40% of 2030 reduction target achieved 🔺')).toBeInTheDocument();
    });
  });

  describe('Chart Elements', () => {
    it('should render all chart elements', () => {
      render(<GHGBySectorChartV3 data={mockData} />);
      
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should render three stacked bars', () => {
      render(<GHGBySectorChartV3 data={mockData} />);
      
      const bars = screen.getAllByTestId('bar');
      expect(bars).toHaveLength(3); // Actual, Conditional, Unconditional
    });
  });
});

