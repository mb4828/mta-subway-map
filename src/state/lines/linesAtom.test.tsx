import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { LINES_FILE } from '@utils/constants';
import { useGeoJsonLoader } from '@utils/useGeoJsonLoader';
import { useLinesAtom, linesAtom } from './linesAtom';
import { FeatureCollection } from 'geojson';

vi.mock('@utils/useGeoJsonLoader');

describe('useLinesAtom', () => {
  it('calls useGeoJsonLoader with the correct arguments', () => {
    vi.mocked(useGeoJsonLoader).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useLinesAtom());

    expect(useGeoJsonLoader).toHaveBeenCalledWith(linesAtom, LINES_FILE);
    expect(result.current).toEqual({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it('passes through data, loading, and error state', () => {
    const mockState = {
      data: { type: 'FeatureCollection', features: [] } as FeatureCollection,
      isLoading: true,
      error: 'Something went wrong',
    };

    vi.mocked(useGeoJsonLoader).mockReturnValue(mockState);

    const { result } = renderHook(() => useLinesAtom());

    expect(result.current).toEqual(mockState);
  });
});
