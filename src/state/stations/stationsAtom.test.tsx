import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { STATIONS_FILE, EXPRESS_LINES, TEXT_OFFSETS, STATION_OFFSET_OVERRIDES } from '@utils/constants';
import { useGeoJsonLoader } from '@utils/useGeoJsonLoader';
import { FeatureCollection, Feature } from 'geojson';
import { useStationsAtom, stationsAtom } from './stationsAtom';

// Mock useGeoJsonLoader
vi.mock('@utils/useGeoJsonLoader');

describe('useStationsAtom', () => {
  const mockFeature: Feature = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-73.991, 40.735] },
    properties: {
      OBG_DESC: 'STA: 226 - 42 St-Bryant Pk - Station',
      OBG_IN_NEA: '226-42ST-BRYANTPK-6AV-B/D/F/M',
    },
  };

  const mockFeatureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [mockFeature],
  };

  it('calls useGeoJsonLoader with correct atom and URL', () => {
    vi.mocked(useGeoJsonLoader).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useStationsAtom());

    expect(useGeoJsonLoader).toHaveBeenCalledWith(stationsAtom, STATIONS_FILE);
    expect(result.current).toEqual({
      data: null,
      isLoading: true,
      error: null,
    });
  });

  it('processes station data correctly', () => {
    vi.mocked(useGeoJsonLoader).mockReturnValue({
      data: mockFeatureCollection,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useStationsAtom());

    const processedFeature = result.current.data?.features[0];

    expect(processedFeature).toBeDefined();
    expect(processedFeature?.properties).toBeDefined();

    const props = processedFeature!.properties!;

    expect(props.STATION_NAME).toBe('42 St-Bryant Pk');
    expect(props.STATION_LINES).toEqual(['B', 'D', 'F', 'M']);
    expect(props.STATION_FULL_NAME).toBe('42 St-Bryant Pk\nB·D·F·M');
    expect(props.STATION_TYPE).toBe(
      props.STATION_LINES.some((line: string) => EXPRESS_LINES.includes(line)) ? 'EXPRESS' : 'LOCAL'
    );

    expect(props.OFFSET).toBe(STATION_OFFSET_OVERRIDES.get(props.OBG_IN_NEA));
    expect(props.TEXT_OFFSET).toEqual(TEXT_OFFSETS[props.OFFSET as 'left' | 'right' | 'top' | 'bottom']);

    if (['top', 'bottom'].includes(props.OFFSET)) {
      expect(props.TEXT_JUSTIFY).toBe('center');
    } else if (props.OFFSET.includes('left')) {
      expect(props.TEXT_JUSTIFY).toBe('right');
    } else {
      expect(props.TEXT_JUSTIFY).toBe('left');
    }
  });

  it('handles empty feature collection', () => {
    vi.mocked(useGeoJsonLoader).mockReturnValue({
      data: { type: 'FeatureCollection', features: [] },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useStationsAtom());

    expect(result.current.data?.features).toHaveLength(0);
  });

  it('passes loading and error states correctly', () => {
    vi.mocked(useGeoJsonLoader).mockReturnValue({
      data: null,
      isLoading: true,
      error: 'Failed to load data',
    });

    const { result } = renderHook(() => useStationsAtom());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe('Failed to load data');
  });
});
