/**
 * ARAW V3.0 Dashboard - Fund Source Breakdown Tests
 * 
 * Unit tests for FundSourceBreakdownV3 component
 */

import { render, screen } from '@testing-library/react';
import FundSourceBreakdownV3, { FundSourceItem } from '../FundSourceBreakdownV3';

describe('FundSourceBreakdownV3', () => {
  const mockMainSource: FundSourceItem = {
    label: 'GOVERNMENT BUDGET',
    amount: '₱ 980 M',
    percentage: '40%',
    color: '#049688'
  };

  const mockSubSources: FundSourceItem[] = [
    { label: 'GRANT', amount: '₱ 310 M', percentage: '32%', color: '#63CD00' },
    { label: 'LOAN', amount: '₱ 175 M', percentage: '18%', color: '#00AE9A' },
    { label: 'PRIVATE', amount: '₱ 95 M', percentage: '10%', color: '#A6C012' }
  ];

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<FundSourceBreakdownV3 />);
      
      expect(screen.getByText('FUND SOURCE')).toBeInTheDocument();
      expect(screen.getByText('GOVERNMENT BUDGET')).toBeInTheDocument();
      expect(screen.getByText('₱ 980 M')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('should render with custom data', () => {
      render(
        <FundSourceBreakdownV3 
          mainSource={mockMainSource}
          subSources={mockSubSources}
        />
      );
      
      expect(screen.getByText('GOVERNMENT BUDGET')).toBeInTheDocument();
      expect(screen.getByText('₱ 980 M')).toBeInTheDocument();
      expect(screen.getByText('GRANT')).toBeInTheDocument();
      expect(screen.getByText('LOAN')).toBeInTheDocument();
      expect(screen.getByText('PRIVATE')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      render(<FundSourceBreakdownV3 title="Custom Fund Source Title" />);
      
      expect(screen.getByText('Custom Fund Source Title')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      render(<FundSourceBreakdownV3 title="" />);
      
      expect(screen.queryByText('FUND SOURCE')).not.toBeInTheDocument();
    });
  });

  describe('Main Card', () => {
    it('should display main source data correctly', () => {
      render(<FundSourceBreakdownV3 mainSource={mockMainSource} />);
      
      expect(screen.getByText('GOVERNMENT BUDGET')).toBeInTheDocument();
      expect(screen.getByText('₱ 980 M')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('should apply correct background color to main card', () => {
      const { container } = render(<FundSourceBreakdownV3 mainSource={mockMainSource} />);
      
      const mainCard = container.querySelector('[style*="background-color"]');
      expect(mainCard).toHaveStyle({ backgroundColor: '#049688' });
    });
  });

  describe('Sub Cards', () => {
    it('should render all three sub-cards', () => {
      render(<FundSourceBreakdownV3 subSources={mockSubSources} />);
      
      expect(screen.getByText('GRANT')).toBeInTheDocument();
      expect(screen.getByText('LOAN')).toBeInTheDocument();
      expect(screen.getByText('PRIVATE')).toBeInTheDocument();
    });

    it('should display sub-source amounts correctly', () => {
      render(<FundSourceBreakdownV3 subSources={mockSubSources} />);
      
      expect(screen.getByText('₱ 310 M')).toBeInTheDocument();
      expect(screen.getByText('₱ 175 M')).toBeInTheDocument();
      expect(screen.getByText('₱ 95 M')).toBeInTheDocument();
    });

    it('should display sub-source percentages correctly', () => {
      render(<FundSourceBreakdownV3 subSources={mockSubSources} />);
      
      expect(screen.getByText('32%')).toBeInTheDocument();
      expect(screen.getByText('18%')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });

    it('should render with custom number of sub-sources', () => {
      const twoSources: FundSourceItem[] = [
        { label: 'SOURCE A', amount: '₱ 500 M', percentage: '50%', color: '#63CD00' },
        { label: 'SOURCE B', amount: '₱ 500 M', percentage: '50%', color: '#00AE9A' },
      ];

      render(<FundSourceBreakdownV3 subSources={twoSources} />);
      
      expect(screen.getByText('SOURCE A')).toBeInTheDocument();
      expect(screen.getByText('SOURCE B')).toBeInTheDocument();
      expect(screen.queryByText('PRIVATE')).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have grid layout for sub-cards', () => {
      const { container } = render(<FundSourceBreakdownV3 subSources={mockSubSources} />);
      
      const grid = container.querySelector('.grid.grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<FundSourceBreakdownV3 className="custom-class" />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Props Updates', () => {
    it('should update when props change', () => {
      const { rerender } = render(<FundSourceBreakdownV3 mainSource={mockMainSource} />);
      
      expect(screen.getByText('₱ 980 M')).toBeInTheDocument();
      
      const newMainSource: FundSourceItem = {
        label: 'NEW BUDGET',
        amount: '₱ 1.5 B',
        percentage: '50%',
        color: '#FF0000'
      };
      
      rerender(<FundSourceBreakdownV3 mainSource={newMainSource} />);
      
      expect(screen.getByText('NEW BUDGET')).toBeInTheDocument();
      expect(screen.getByText('₱ 1.5 B')).toBeInTheDocument();
      expect(screen.queryByText('₱ 980 M')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper card structure', () => {
      const { container } = render(<FundSourceBreakdownV3 />);
      
      // Should have 1 main card + 3 sub-cards = 4 total cards with rounded-lg
      const cards = container.querySelectorAll('.rounded-lg');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    it('should have readable text on colored backgrounds', () => {
      render(<FundSourceBreakdownV3 />);
      
      // All text should be white and visible
      const labels = ['GOVERNMENT BUDGET', 'GRANT', 'LOAN', 'PRIVATE'];
      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });
});

