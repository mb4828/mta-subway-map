import { FeatureCollection } from 'geojson';
import { atom } from 'jotai';
import { useGeoJsonLoader } from '@utils/useGeoJsonLoader';
import { EXPRESS_LINES, TEXT_OFFSETS, STATIONS_FILE, STATION_OFFSET_OVERRIDES } from '@utils/constants';

/** Base atom */
export const stationsAtom = atom<FeatureCollection | null>(null);

/** Custom hook to load and return the stations */
export function useStationsAtom() {
  const { data, isLoading, error } = useGeoJsonLoader(stationsAtom, STATIONS_FILE);

  // pre-process the data
  for (const feature of data?.features || []) {
    if (feature && feature.properties) {
      const props = feature.properties;

      // logic for station points
      props.STATION_NAME = feature.properties.OBG_DESC.split(' - ')[1].trim();
      props.STATION_LINES = feature.properties.OBG_IN_NEA.slice(
        feature.properties.OBG_IN_NEA.lastIndexOf('-') + 1
      ).split('/');
      props.STATION_FULL_NAME = `${props.STATION_NAME}\n${props.STATION_LINES.join('·')}`;
      props.STATION_TYPE = props.STATION_LINES.some((line: string) => EXPRESS_LINES.includes(line))
        ? 'EXPRESS'
        : 'LOCAL';

      // logic for station labels
      props.OFFSET = STATION_OFFSET_OVERRIDES.get(props.OBG_IN_NEA) || 'left';
      props.TEXT_OFFSET = TEXT_OFFSETS[props.OFFSET as 'left' | 'right' | 'top' | 'bottom'];
      props.TEXT_JUSTIFY = ['top', 'bottom'].includes(props.OFFSET)
        ? 'center'
        : props.OFFSET.includes('left')
        ? 'right'
        : 'left';
    }
  }

  return { data, isLoading, error };
}
