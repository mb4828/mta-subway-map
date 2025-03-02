import { FeatureCollection } from 'geojson';
import { atom } from 'jotai';
import { useGeoJsonLoader } from './useGeoJsonLoader';
import { LINES_FILE } from '../constants';

/** Base atom */
export const linesAtom = atom<FeatureCollection | null>(null);

/** Custom hook to load and return the lines */
export function useLinesAtom() {
  return useGeoJsonLoader(linesAtom, LINES_FILE);
}
