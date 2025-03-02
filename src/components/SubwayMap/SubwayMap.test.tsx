/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SubwayMap from './SubwayMap';
import { FeatureCollection } from 'geojson';

let mockOnLoad: (event: { target: any }) => void = () => {};

vi.mock('react-map-gl', () => ({
  Map: (props: any) => {
    mockOnLoad = props.onLoad; // Capture onLoad so we can call it in the test
    return <div data-testid="map">{props.children}</div>;
  },
  NavigationControl: () => <div data-testid="navigation-control" />,
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the map and navigation control', () => {
    render(<SubwayMap lines={null} stations={null} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-control')).toBeInTheDocument();
  });

  it('calls onMapLoad and adds sources/layers when data is provided', () => {
    const addSource = vi.fn();
    const addLayer = vi.fn();

    render(<SubwayMap lines={mockLines} stations={mockStations} />);

    // Simulate mapbox's `onLoad` event
    mockOnLoad({ target: { addSource, addLayer } });

    expect(addSource).toHaveBeenCalledWith('lines', { type: 'geojson', data: mockLines });
    expect(addSource).toHaveBeenCalledWith('stations', { type: 'geojson', data: mockStations });
    expect(addLayer).toHaveBeenCalledTimes(4); // Line layer + 3 station layers
  });

  it('does not add sources/layers if no data is provided', () => {
    const addSource = vi.fn();
    const addLayer = vi.fn();

    render(<SubwayMap lines={null} stations={null} />);

    // Simulate mapbox's `onLoad` event
    mockOnLoad({ target: { addSource, addLayer } });

    expect(addSource).not.toHaveBeenCalled();
    expect(addLayer).not.toHaveBeenCalled();
  });
});
