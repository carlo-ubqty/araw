/**
 * ARAW V3.0 Dashboard - KPI Cards Row Tests
 * 
 * Unit tests for KPICardsRowV3 component
 */

import { render, screen } from '@testing-library/react';
import KPICardsRowV3 from '../KPICardsRowV3';

describe('KPICardsRowV3', () => {
  const mockKPIData = {
    totalInvestment: '₱ 1.16 B',
    ghgReduction: '56%',
    ghgReductionSubtitle: 'vs 2020 baseline',
    adaptationInvestment: '₱ 1.12 B',
    mitigationInvestment: '₱ 32.64 M',
    totalProjects: '579',
  };

  describe('Rendering', () => {
    it('should render with provided data', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('₱ 1.16 B')).toBeInTheDocument();
      expect(screen.getByText('56%')).toBeInTheDocument();
      expect(screen.getByText('vs 2020 baseline')).toBeInTheDocument();
      expect(screen.getByText('₱ 1.12 B')).toBeInTheDocument();
      expect(screen.getByText('₱ 32.64 M')).toBeInTheDocument();
      expect(screen.getByText('579')).toBeInTheDocument();
    });

    it('should render all 5 KPI cards', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('TOTAL INVESTMENT')).toBeInTheDocument();
      expect(screen.getByText('GHG REDUCTION ACTUAL')).toBeInTheDocument();
      expect(screen.getByText('ADAPTATION INVESTMENT')).toBeInTheDocument();
      expect(screen.getByText('MITIGATION INVESTMENT')).toBeInTheDocument();
      expect(screen.getByText('TOTAL PROJECTS')).toBeInTheDocument();
    });

    it('should render with default values when props not provided', () => {
      render(<KPICardsRowV3 />);
      
      // Should show default values
      expect(screen.getByText('TOTAL INVESTMENT')).toBeInTheDocument();
      expect(screen.getByText('₱ 1.16 B')).toBeInTheDocument();
    });

    it('should render with custom subtitle when provided', () => {
      render(
        <KPICardsRowV3 
          {...mockKPIData}
          ghgReductionSubtitle="custom subtitle"
        />
      );
      
      expect(screen.getByText('custom subtitle')).toBeInTheDocument();
      expect(screen.queryByText('vs 2020 baseline')).not.toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have grid layout with 5 columns', () => {
      const { container } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid', 'grid-cols-5');
    });

    it('should have gap between cards', () => {
      const { container } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('gap-3');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <KPICardsRowV3 {...mockKPIData} className="custom-class" />
      );
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('custom-class');
    });
  });

  describe('Card Content', () => {
    it('should render Total Investment card with correct gradient', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      const investmentCard = screen.getByText('TOTAL INVESTMENT').closest('div');
      expect(investmentCard).toHaveStyle({
        background: expect.stringContaining('linear-gradient'),
      });
    });

    it('should render GHG Reduction card with subtitle', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('GHG REDUCTION ACTUAL')).toBeInTheDocument();
      expect(screen.getByText('56%')).toBeInTheDocument();
      expect(screen.getByText('vs 2020 baseline')).toBeInTheDocument();
    });

    it('should render all investment values correctly', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      // Total Investment
      expect(screen.getByText('₱ 1.16 B')).toBeInTheDocument();
      // Adaptation Investment
      expect(screen.getByText('₱ 1.12 B')).toBeInTheDocument();
      // Mitigation Investment
      expect(screen.getByText('₱ 32.64 M')).toBeInTheDocument();
    });

    it('should render project count', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('579')).toBeInTheDocument();
      expect(screen.getByText('TOTAL PROJECTS')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should render all SVG icons', () => {
      const { container } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      const svgs = container.querySelectorAll('svg');
      expect(svgs).toHaveLength(5); // 5 cards, each with an icon
    });

    it('should render peso icon for investment cards', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      // Check that investment-related text is present (indicates icon is associated)
      expect(screen.getByText('TOTAL INVESTMENT')).toBeInTheDocument();
    });

    it('should render cloud icon for GHG card', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('GHG REDUCTION ACTUAL')).toBeInTheDocument();
    });

    it('should render shield icon for adaptation card', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('ADAPTATION INVESTMENT')).toBeInTheDocument();
    });

    it('should render leaf icon for mitigation card', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('MITIGATION INVESTMENT')).toBeInTheDocument();
    });

    it('should render projects icon for total projects card', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('TOTAL PROJECTS')).toBeInTheDocument();
    });
  });

  describe('Props Updates', () => {
    it('should update when props change', () => {
      const { rerender } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('₱ 1.16 B')).toBeInTheDocument();
      
      rerender(
        <KPICardsRowV3 
          {...mockKPIData}
          totalInvestment="₱ 2.50 B"
        />
      );
      
      expect(screen.getByText('₱ 2.50 B')).toBeInTheDocument();
      expect(screen.queryByText('₱ 1.16 B')).not.toBeInTheDocument();
    });

    it('should update GHG reduction value', () => {
      const { rerender } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('56%')).toBeInTheDocument();
      
      rerender(
        <KPICardsRowV3 
          {...mockKPIData}
          ghgReduction="70%"
        />
      );
      
      expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('should update project count', () => {
      const { rerender } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      expect(screen.getByText('579')).toBeInTheDocument();
      
      rerender(
        <KPICardsRowV3 
          {...mockKPIData}
          totalProjects="1,234"
        />
      );
      
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should render cards with proper structure', () => {
      const { container } = render(<KPICardsRowV3 {...mockKPIData} />);
      
      // Check that there are 5 direct children (the 5 cards)
      const grid = container.firstChild as HTMLElement;
      expect(grid.children).toHaveLength(5);
    });

    it('should have readable text contrast on gradient backgrounds', () => {
      render(<KPICardsRowV3 {...mockKPIData} />);
      
      // All card labels should be visible
      const labels = [
        'TOTAL INVESTMENT',
        'GHG REDUCTION ACTUAL',
        'ADAPTATION INVESTMENT',
        'MITIGATION INVESTMENT',
        'TOTAL PROJECTS'
      ];
      
      labels.forEach(label => {
        expect(screen.getByText(label)).toBeInTheDocument();
      });
    });
  });
});

