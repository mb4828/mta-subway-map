/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useLinesAtom } from '@state/lines';
import { useStationsAtom } from '@state/stations';
import { useAtom } from 'jotai';
import SubwayMap from './SubwayMap';
import { FeatureCollection } from 'geojson';

// Handlers we can trigger during tests
let mockOnLoad: (event: any) => void = () => {};

// Mock Jotai hooks and react-map-gl components
vi.mock('react-map-gl', () => ({
  Map: (props: any) => {
    // Capture the onLoad handler to manually trigger it in tests
    mockOnLoad = props.onLoad;
    return (
      <div data-testid="map" style={props.style}>
        {props.children}
      </div>
    );
  },
  NavigationControl: () => <div data-testid="navigation-control" />,
}));

vi.mock('@state/lines', () => ({
  useLinesAtom: vi.fn(),
}));

vi.mock('@state/stations', () => ({
  useStationsAtom: vi.fn(),
}));

vi.mock('jotai', () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

describe('SubwayMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(useLinesAtom).mockReturnValue({ data: null, isLoading: false, error: null });
    vi.mocked(useStationsAtom).mockReturnValue({ data: null, isLoading: false, error: null });
    vi.mocked(useAtom).mockReturnValue(['light'] as unknown as [unknown, never]);
  });

  it('renders map and navigation control', () => {
    render(<SubwayMap />);

    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('navigation-control')).toBeInTheDocument();
  });

  it('does nothing if lines or stations are null', () => {
    const addSource = vi.fn();
    const addLayer = vi.fn();
    const getSource = vi.fn();
    const getLayer = vi.fn();

    render(<SubwayMap />);

    // Simulate map load with empty data
    mockOnLoad({ target: { addSource, addLayer, getSource, getLayer } });

    expect(addSource).not.toHaveBeenCalled();
    expect(addLayer).not.toHaveBeenCalled();
  });

  it('adds sources and layers when lines and stations exist', () => {
    vi.mocked(useLinesAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });
    vi.mocked(useStationsAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });

    const addSource = vi.fn();
    const addLayer = vi.fn();
    const getSource = vi.fn().mockReturnValue(undefined); // Simulate missing sources
    const getLayer = vi.fn().mockReturnValue(undefined); // Simulate missing layers

    render(<SubwayMap />);

    // Trigger onLoad
    mockOnLoad({ target: { addSource, addLayer, getSource, getLayer } });

    expect(addSource).toHaveBeenCalledWith('lines', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });
    expect(addSource).toHaveBeenCalledWith('stations', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    expect(addLayer).toHaveBeenCalledTimes(4); // lines + express-stations + local-stations + station-labels
    expect(addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'lines' }));
    expect(addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'express-stations' }));
    expect(addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'local-stations' }));
    expect(addLayer).toHaveBeenCalledWith(expect.objectContaining({ id: 'station-labels' }));
  });

  it('does not re-add sources or layers if they already exist', () => {
    vi.mocked(useLinesAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });
    vi.mocked(useStationsAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });

    const addSource = vi.fn();
    const addLayer = vi.fn();
    const getSource = vi.fn().mockReturnValue({}); // Simulate existing sources
    const getLayer = vi.fn().mockReturnValue({}); // Simulate existing layers

    render(<SubwayMap />);

    mockOnLoad({ target: { addSource, addLayer, getSource, getLayer } });

    expect(addSource).not.toHaveBeenCalled();
    expect(addLayer).not.toHaveBeenCalled();
  });

  it('applies correct text-halo and text-color based on theme', () => {
    vi.mocked(useLinesAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });
    vi.mocked(useStationsAtom).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: false,
      error: '',
    });

    const addLayer = vi.fn();
    const getSource = vi.fn().mockReturnValue(undefined);
    const getLayer = vi.fn().mockReturnValue(undefined);

    vi.mocked(useAtom).mockReturnValue(['dark'] as unknown as [unknown, never]);
    render(<SubwayMap />);

    mockOnLoad({ target: { addLayer, addSource: vi.fn(), getSource, getLayer } });

    const stationLabelLayer = addLayer.mock.calls.find(([layer]) => layer.id === 'station-labels')?.[0];

    expect(stationLabelLayer).toBeDefined();
    expect(stationLabelLayer.paint['text-color']).toBe('#fff');
    expect(stationLabelLayer.paint['text-halo-color']).toBe('#000');
  });
});
