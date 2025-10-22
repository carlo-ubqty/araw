/**
 * ARAW V3.0 Dashboard - GHG Levels Chart Tests
 * 
 * Unit tests for GHGLevelsChartV3 component
 */

import { render, screen } from '@testing-library/react';
import GHGLevelsChartV3, { GHGHistoricalData, GHGTargetData } from '../GHGLevelsChartV3';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

const mockHistoricalData: GHGHistoricalData[] = [
  { year: '1994', ghg: 180 },
  { year: '2000', ghg: 190 },
  { year: '2010', ghg: 200 },
  { year: '2020', ghg: 195 },
];

const mockTargetData: GHGTargetData = {
  year: '2024',
  target: -230.580,
  breakdown: [
    { gas: 'Carbon Dioxide (CO₂)', value: '139.194' },
    { gas: 'Methane (CH₄)', value: '70.155' },
    { gas: 'Nitrous Oxide (N₂O)', value: '17.233' },
    { gas: 'Hydrofluorocarbon (HFC)', value: '3.978' },
  ],
};

describe('GHGLevelsChartV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      expect(screen.getByText('GHG LEVELS')).toBeInTheDocument();
      expect(screen.getByText(/Includes CO₂, CH₄, N₂O, and HFCs/)).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <GHGLevelsChartV3 
          historicalData={mockHistoricalData}
          title="Custom GHG Title"
          subtitle="Custom Subtitle"
        />
      );
      
      expect(screen.getByText('Custom GHG Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('line')).toBeInTheDocument();
    });

    it('should render with empty data', () => {
      render(<GHGLevelsChartV3 historicalData={[]} />);
      
      expect(screen.getByText('GHG LEVELS')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('Target Data Table', () => {
    it('should render target data when provided', () => {
      render(
        <GHGLevelsChartV3 
          historicalData={mockHistoricalData}
          targetData={mockTargetData}
        />
      );
      
      expect(screen.getByText('2024 Target')).toBeInTheDocument();
      expect(screen.getByText('-230.58 Gg')).toBeInTheDocument();
    });

    it('should render breakdown items', () => {
      render(
        <GHGLevelsChartV3 
          historicalData={mockHistoricalData}
          targetData={mockTargetData}
        />
      );
      
      expect(screen.getByText('Carbon Dioxide (CO₂)')).toBeInTheDocument();
      expect(screen.getByText('Methane (CH₄)')).toBeInTheDocument();
      expect(screen.getByText('Nitrous Oxide (N₂O)')).toBeInTheDocument();
      expect(screen.getByText('Hydrofluorocarbon (HFC)')).toBeInTheDocument();
      
      expect(screen.getByText('139.194')).toBeInTheDocument();
      expect(screen.getByText('70.155')).toBeInTheDocument();
    });

    it('should not render target table when targetData is not provided', () => {
      render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      expect(screen.queryByText(/Target/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Breakdown:/)).not.toBeInTheDocument();
    });

    it('should handle target data with empty breakdown', () => {
      const targetWithoutBreakdown: GHGTargetData = {
        year: '2024',
        target: -230.580,
        breakdown: [],
      };
      
      render(
        <GHGLevelsChartV3 
          historicalData={mockHistoricalData}
          targetData={targetWithoutBreakdown}
        />
      );
      
      expect(screen.getByText('2024 Target')).toBeInTheDocument();
      expect(screen.queryByText('Breakdown:')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <GHGLevelsChartV3 
          historicalData={mockHistoricalData}
          className="custom-class"
        />
      );
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('bg-white');
    });

    it('should have proper layout classes', () => {
      const { container } = render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      const chartContainer = container.firstChild;
      expect(chartContainer).toHaveClass('border', 'rounded-lg', 'p-6');
    });
  });

  describe('Props', () => {
    it('should accept and use historicalData prop', () => {
      const { rerender } = render(<GHGLevelsChartV3 historicalData={mockHistoricalData} />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      
      const newData: GHGHistoricalData[] = [
        { year: '2023', ghg: 210 },
      ];
      
      rerender(<GHGLevelsChartV3 historicalData={newData} />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});

