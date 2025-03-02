/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { atom } from 'jotai';
import { useGeoJsonLoader } from './useGeoJsonLoader';
import { vi } from 'vitest';
import { FeatureCollection } from 'geojson';

// Mock valid GeoJSON response
const mockGeoJson = {
  type: 'FeatureCollection',
  features: [],
};

describe('useGeoJsonLoader', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads GeoJSON data successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockGeoJson,
    });

    const geoJsonAtom = atom<FeatureCollection | null>(null);

    const { result } = renderHook(() => useGeoJsonLoader(geoJsonAtom, 'https://example.com/geojson'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toEqual(mockGeoJson);
      expect(result.current.error).toBeNull();
    });
  });

  it('handles fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const geoJsonAtom = atom<FeatureCollection | null>(null);

    const { result } = renderHook(() => useGeoJsonLoader(geoJsonAtom, 'https://example.com/geojson'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Network error');
    });
  });

  it('handles invalid GeoJSON response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ type: 'InvalidType' }), // Not a FeatureCollection
    });

    const geoJsonAtom = atom<FeatureCollection | null>(null);

    const { result } = renderHook(() => useGeoJsonLoader(geoJsonAtom, 'https://example.com/geojson'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Invalid GeoJSON: Expected a FeatureCollection');
    });
  });

  it('does not refetch if data is already set', async () => {
    const geoJsonAtom = atom<FeatureCollection | null>(mockGeoJson as any);

    const { result } = renderHook(() => useGeoJsonLoader(geoJsonAtom, 'https://example.com/geojson'));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockGeoJson);
    expect(result.current.error).toBeNull();

    // Fetch should not be called because data already exists
    expect(fetch).not.toHaveBeenCalled();
  });
});
