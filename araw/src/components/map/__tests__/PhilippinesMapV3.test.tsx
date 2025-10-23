/**
 * ARAW V3.0 Dashboard - Philippines Map Tests
 * 
 * Unit tests for PhilippinesMapV3 component
 */

import { render, screen } from '@testing-library/react';
import PhilippinesMapV3, { MapLocationData } from '../PhilippinesMapV3';

// Mock react-leaflet components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map-container">{children}</div>,
  GeoJSON: () => <div data-testid="geojson" />,
  CircleMarker: () => <div data-testid="circle-marker" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div data-testid="tooltip">{children}</div>,
  ZoomControl: () => <div data-testid="zoom-control" />,
  useMap: () => ({
    fitBounds: jest.fn(),
  }),
}));

// Mock leaflet
jest.mock('leaflet', () => ({
  geoJSON: jest.fn(() => ({
    getBounds: jest.fn(() => ({
      isValid: jest.fn(() => true),
    })),
  })),
}));

const mockLocations: MapLocationData[] = [
  { locationId: '1', locationName: 'Manila', regionName: 'NCR', latitude: 14.5995, longitude: 120.9842, investmentAmount: 1200, incomeClass: 5 },
  { locationId: '2', locationName: 'Davao City', regionName: 'Region XI', latitude: 7.1907, longitude: 125.4553, investmentAmount: 850, incomeClass: 4 },
  { locationId: '3', locationName: 'Cebu City', regionName: 'Region VII', latitude: 10.3157, longitude: 123.8854, investmentAmount: 720, incomeClass: 4 },
];

describe('PhilippinesMapV3', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<PhilippinesMapV3 locations={mockLocations} />);
      
      expect(screen.getByText('CLIMATE IMPACT DRIVERS/INCOME CLASS VS INVESTMENTS')).toBeInTheDocument();
      expect(screen.getByText('Mapping investments against CIDs and income class.')).toBeInTheDocument();
    });

    it('should render with custom title and subtitle', () => {
      render(
        <PhilippinesMapV3 
          locations={mockLocations}
          title="Custom Map Title"
          subtitle="Custom map subtitle"
        />
      );
      
      expect(screen.getByText('Custom Map Title')).toBeInTheDocument();
      expect(screen.getByText('Custom map subtitle')).toBeInTheDocument();
    });

    it('should render map container', () => {
      render(<PhilippinesMapV3 locations={mockLocations} />);
      
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('should render with empty locations', () => {
      render(<PhilippinesMapV3 locations={[]} />);
      
      expect(screen.getByText('CLIMATE IMPACT DRIVERS/INCOME CLASS VS INVESTMENTS')).toBeInTheDocument();
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <PhilippinesMapV3 locations={mockLocations} className="custom-class" />
      );
      
      const mapContainer = container.firstChild;
      expect(mapContainer).toHaveClass('custom-class');
    });

    it('should have white background', () => {
      const { container } = render(<PhilippinesMapV3 locations={mockLocations} />);
      
      const mapContainer = container.firstChild;
      expect(mapContainer).toHaveClass('bg-white');
    });

    it('should have border and rounded corners', () => {
      const { container } = render(<PhilippinesMapV3 locations={mockLocations} />);
      
      const mapContainer = container.firstChild;
      expect(mapContainer).toHaveClass('border', 'border-gray-200', 'rounded-lg');
    });
  });

  describe('Legend', () => {
    it('should display total investment', () => {
      render(<PhilippinesMapV3 locations={mockLocations} totalInvestment="₱15.2 B" />);
      
      expect(screen.getByText(/Total PH Mainland: ₱15.2 B/)).toBeInTheDocument();
    });

    it('should display income class legend', () => {
      render(<PhilippinesMapV3 locations={mockLocations} />);
      
      expect(screen.getByText(/Income Class/)).toBeInTheDocument();
      expect(screen.getByText(/Class 5: ₱1B\+/)).toBeInTheDocument();
      expect(screen.getByText(/Class 4: ₱600M\+/)).toBeInTheDocument();
      expect(screen.getByText(/Class 3: ₱300M\+/)).toBeInTheDocument();
    });

    it('should display bubble scale legend', () => {
      render(<PhilippinesMapV3 locations={mockLocations} />);
      
      expect(screen.getByText(/Bubble Scale/)).toBeInTheDocument();
      expect(screen.getByText(/● ₱1B\+/)).toBeInTheDocument();
      expect(screen.getByText(/● ₱600M\+/)).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should accept and use locations prop', () => {
      const { rerender } = render(<PhilippinesMapV3 locations={mockLocations} />);
      
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
      
      const newLocations: MapLocationData[] = [
        { locationId: '4', locationName: 'Zamboanga', regionName: 'Region IX', latitude: 6.9214, longitude: 122.0790, investmentAmount: 450, incomeClass: 3 },
      ];
      
      rerender(<PhilippinesMapV3 locations={newLocations} />);
      
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('should use custom total investment', () => {
      render(<PhilippinesMapV3 locations={mockLocations} totalInvestment="₱20.5 B" />);
      
      expect(screen.getByText(/Total PH Mainland: ₱20.5 B/)).toBeInTheDocument();
    });
  });
});


