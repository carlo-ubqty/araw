/**
 * ARAW V3.0 Dashboard - KPI Card Tests
 * 
 * Unit tests for KPICardV3 component
 */

import { render, screen } from '@testing-library/react';
import KPICardV3 from '../KPICardV3';

// Simple test icon
const TestIcon = () => <svg data-testid="test-icon">Icon</svg>;

describe('KPICardV3', () => {
  const defaultProps = {
    icon: <TestIcon />,
    label: 'TEST METRIC',
    value: '₱ 1.16 B',
    gradientFrom: '#349260',
    gradientTo: '#83BB5B',
  };

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('TEST METRIC')).toBeInTheDocument();
      expect(screen.getByText('₱ 1.16 B')).toBeInTheDocument();
    });

    it('should render with subtitle', () => {
      render(<KPICardV3 {...defaultProps} subtitle="vs 2020 baseline" />);
      
      expect(screen.getByText('vs 2020 baseline')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const subtitle = screen.queryByText(/baseline/i);
      expect(subtitle).not.toBeInTheDocument();
    });

    it('should render icon correctly', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply gradient background', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        background: 'linear-gradient(135deg, #349260 0%, #83BB5B 100%)',
      });
    });

    it('should apply minimum height', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        minHeight: '130px',
      });
    });

    it('should apply custom className', () => {
      const { container } = render(
        <KPICardV3 {...defaultProps} className="custom-class" />
      );
      
      const card = container.firstChild;
      expect(card).toHaveClass('custom-class');
    });

    it('should have rounded corners', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have proper padding', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('p-4');
    });
  });

  describe('Typography', () => {
    it('should render label with correct font size', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const label = screen.getByText('TEST METRIC');
      expect(label).toHaveStyle({ fontSize: '16px' });
    });

    it('should render value with correct font size', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const value = screen.getByText('₱ 1.16 B');
      expect(value).toHaveStyle({ fontSize: '48px' });
    });

    it('should render subtitle with correct font size', () => {
      render(<KPICardV3 {...defaultProps} subtitle="Test subtitle" />);
      
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toHaveStyle({ fontSize: '13px' });
    });

    it('should render label in uppercase', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const label = screen.getByText('TEST METRIC');
      expect(label).toHaveClass('font-medium');
    });

    it('should render value in bold', () => {
      render(<KPICardV3 {...defaultProps} />);
      
      const value = screen.getByText('₱ 1.16 B');
      expect(value).toHaveClass('font-bold');
    });
  });

  describe('Props', () => {
    it('should accept different gradients', () => {
      const { container } = render(
        <KPICardV3 
          {...defaultProps}
          gradientFrom="#FF0000"
          gradientTo="#00FF00"
        />
      );
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle({
        background: 'linear-gradient(135deg, #FF0000 0%, #00FF00 100%)',
      });
    });

    it('should render custom icon', () => {
      const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;
      
      render(
        <KPICardV3 
          {...defaultProps}
          icon={<CustomIcon />}
        />
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should render different values', () => {
      const { rerender } = render(<KPICardV3 {...defaultProps} value="100%" />);
      
      expect(screen.getByText('100%')).toBeInTheDocument();
      
      rerender(<KPICardV3 {...defaultProps} value="₱ 500 M" />);
      
      expect(screen.getByText('₱ 500 M')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should have flex layout', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('flex', 'flex-col', 'justify-between');
    });

    it('should have icon and label in same row', () => {
      const { container } = render(<KPICardV3 {...defaultProps} />);
      
      const iconLabelContainer = container.querySelector('.flex.items-center.gap-2');
      expect(iconLabelContainer).toBeInTheDocument();
    });
  });
});

