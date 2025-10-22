/**
 * ARAW V3.0 Dashboard - Header Component Tests
 * 
 * Unit tests for HeaderV3 component
 * JIRA: ARAW-311
 */

import { render, screen, act } from '@testing-library/react';
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

    it('should display real-time clock when showDateTime is true', () => {
      render(<HeaderV3 showDateTime={true} />);
      
      expect(screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/)).toBeInTheDocument();
    });

    it('should not display clock when showDateTime is false', () => {
      render(<HeaderV3 showDateTime={false} />);
      
      const timeElements = screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(timeElements).not.toBeInTheDocument();
    });

    it('should render notification and settings buttons', () => {
      render(<HeaderV3 />);
      
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
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

    it('should apply correct text color', () => {
      const { container } = render(<HeaderV3 />);
      const header = container.querySelector('header');
      
      expect(header).toHaveStyle({
        color: HEADER.textColor
      });
    });

    it('should apply custom className', () => {
      const { container } = render(<HeaderV3 className="custom-class" />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('Clock Functionality', () => {
    it('should update time every second', () => {
      render(<HeaderV3 showDateTime={true} />);
      
      const initialTime = screen.getByText(/10\/22\/2025 03:30:00 PM/);
      expect(initialTime).toBeInTheDocument();
      
      // Advance time by 1 second
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      const updatedTime = screen.getByText(/10\/22\/2025 03:30:01 PM/);
      expect(updatedTime).toBeInTheDocument();
    });

    it('should clear interval on unmount', () => {
      const { unmount } = render(<HeaderV3 showDateTime={true} />);
      
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      
      clearIntervalSpy.mockRestore();
    });
  });

  describe('Props', () => {
    it('should use custom logo source', () => {
      render(<HeaderV3 logoSrc="/custom-logo.svg" />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toHaveAttribute('src', '/custom-logo.svg');
    });

    it('should render heading element for title', () => {
      render(<HeaderV3 />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Climate Finance Dashboard');
    });
  });

  describe('Layout', () => {
    it('should have max-width container', () => {
      const { container } = render(<HeaderV3 />);
      
      const maxWidthContainer = container.querySelector('.max-w-\\[1920px\\]');
      expect(maxWidthContainer).toBeInTheDocument();
    });

    it('should have left and right sections', () => {
      const { container } = render(<HeaderV3 />);
      
      const header = container.querySelector('header');
      const sections = header?.querySelectorAll(':scope > div > div');
      
      expect(sections?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive alt text for logo', () => {
      render(<HeaderV3 />);
      
      const logo = screen.getByAltText('Department of Finance Logo');
      expect(logo).toBeInTheDocument();
    });

    it('should have aria-labels for icon buttons', () => {
      render(<HeaderV3 />);
      
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });

    it('should have proper button types', () => {
      render(<HeaderV3 />);
      
      const notificationBtn = screen.getByLabelText('Notifications');
      const settingsBtn = screen.getByLabelText('Settings');
      
      expect(notificationBtn).toHaveAttribute('type', 'button');
      expect(settingsBtn).toHaveAttribute('type', 'button');
    });
  });
});
