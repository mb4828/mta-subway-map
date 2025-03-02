/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from '@testing-library/react';
import { FeatureCollection } from 'geojson';
import { SubwayMap } from './subwayMap';
import { vi } from 'vitest';

// Mock react-map-gl
vi.mock('react-map-gl', () => ({
  Map: ({ onLoad }: { onLoad: (evt: any) => void }) => {
    // Set up a mock map object with spy methods
    const mockMap = {
      addSource: vi.fn(),
      addLayer: vi.fn(),
    };

    // Trigger the onLoad callback with the mock map
    setTimeout(() => onLoad({ target: mockMap }), 0);

    return <div data-testid="mock-map" />;
  },
  NavigationControl: () => <div data-testid="mock-navigation-control" />,
}));

describe('SubwayMap', () => {
  const mockLines: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  const mockStations: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  it('renders map and navigation control', () => {
    render(<SubwayMap lines={null} stations={null} />);
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    expect(screen.getByTestId('mock-navigation-control')).toBeInTheDocument();
  });

  it('adds stations sources and layers on load', async () => {
    let mockMap: any = null;

    // Intercept the mock map so we can use it in assertions
    vi.mocked(vi.importMock('react-map-gl')).Map.mockImplementation(({ onLoad }) => {
      mockMap = {
        addSource: vi.fn(),
        addLayer: vi.fn(),
      };

      setTimeout(() => onLoad({ target: mockMap }), 0);
      return <div data-testid="mock-map" />;
    });

    render(<SubwayMap lines={null} stations={mockStations} />);

    // Wait for the map load event
    await waitFor(() => {
      expect(mockMap).not.toBeNull();
      expect(mockMap.addSource).toHaveBeenCalledWith('stations', {
        type: 'geojson',
        data: mockStations,
      });

      expect(mockMap.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'express-stations' }));

      expect(mockMap.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'local-stations' }));

      expect(mockMap.addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'station-labels' }));
    });
  });
});
