/**
 * ARAW V3.0 Dashboard - Header Component Tests
 * 
 * Unit tests for HeaderV3 component
 * JIRA: ARAW-311
 */

import { render, screen, waitFor } from '@testing-library/react';
import HeaderV3 from '../HeaderV3';
import { HEADER } from '@/lib/design-system-v3';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  }
}));

describe('HeaderV3', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-10-22T15:30:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<HeaderV3 />);
      
      expect(screen.getByText('Climate Finance Dashboard')).toBeInTheDocument();
      expect(screen.getByAltText('Department of Finance Logo')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(<HeaderV3 title="Custom Title" />);
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render with custom logo', () => {
      render(<HeaderV3 logoSrc="/custom-logo.svg" />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toHaveAttribute('src', '/custom-logo.svg');
    });

    it('should apply custom className', () => {
      const { container } = render(<HeaderV3 className="custom-class" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('Styling', () => {
    it('should apply correct background color', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      expect(header).toHaveStyle({
        backgroundColor: HEADER.backgroundColor
      });
    });

    it('should apply correct height', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      expect(header).toHaveStyle({
        height: HEADER.height
      });
    });

    it('should apply correct text color', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      expect(header).toHaveStyle({
        color: HEADER.textColor
      });
    });
  });

  describe('Clock functionality', () => {
    it('should display clock when showDateTime is true', async () => {
      render(<HeaderV3 showDateTime={true} />);
      
      await waitFor(() => {
        const timeElement = screen.queryByText(/\d{2}\/\d{2}\/\d{4}/);
        expect(timeElement).toBeInTheDocument();
      });
    });

    it('should not display clock when showDateTime is false', () => {
      render(<HeaderV3 showDateTime={false} />);
      
      const timeElement = screen.queryByText(/\d{2}\/\d{2}\/\d{4}/);
      expect(timeElement).not.toBeInTheDocument();
    });

    it('should update time every second', async () => {
      render(<HeaderV3 showDateTime={true} />);
      
      // Wait for initial render
      await waitFor(() => {
        expect(screen.queryByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
      });

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date('2025-10-22T15:30:01'));
      
      await waitFor(() => {
        const timeElement = screen.queryByText(/\d{2}\/\d{2}\/\d{4}/);
        expect(timeElement).toBeInTheDocument();
      });
    });

    it('should render clock icon when showDateTime is true', async () => {
      const { container } = render(<HeaderV3 showDateTime={true} />);
      
      await waitFor(() => {
        const clockIcon = container.querySelector('svg');
        expect(clockIcon).toBeInTheDocument();
      });
    });
  });

  describe('Logo', () => {
    it('should render logo with correct size', () => {
      render(<HeaderV3 />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toHaveAttribute('width', '32');
      expect(logo).toHaveAttribute('height', '32');
    });

    it('should prioritize logo loading', () => {
      render(<HeaderV3 />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toHaveAttribute('priority');
    });
  });

  describe('Layout', () => {
    it('should have three main sections (logo, title, clock)', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      // Header should have 3 direct children divs
      const sections = header?.querySelectorAll(':scope > div');
      expect(sections).toHaveLength(3);
    });

    it('should center the title', () => {
      const { container } = render(<HeaderV3 />);
      const titleContainer = container.querySelector('.flex-1');
      
      expect(titleContainer).toHaveClass('flex', 'justify-center');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic header element', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      expect(header).toBeInTheDocument();
      expect(header?.tagName).toBe('HEADER');
    });

    it('should have heading element for title', () => {
      render(<HeaderV3 />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('ARAW: Climate Finance Dashboard');
    });

    it('should have descriptive alt text for logo', () => {
      render(<HeaderV3 />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('should clear interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      const { unmount } = render(<HeaderV3 showDateTime={true} />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});

