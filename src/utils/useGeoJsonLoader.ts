import { PrimitiveAtom, useAtom } from 'jotai';
import { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';

/**
 * Custom hook to load GeoJSON data from a URL
 * @param atom The atom to store the loaded data
 * @param url The URL to fetch the GeoJSON data from
 */
export function useGeoJsonLoader(atm: PrimitiveAtom<FeatureCollection | null>, url: string) {
  const [data, setData] = useAtom(atm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data !== null) {
      return; // Avoid refetching if already loaded
    }
    setIsLoading(true);
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const json = await response.json();
        if (json.type !== 'FeatureCollection') {
          throw new Error('Invalid GeoJSON: Expected a FeatureCollection');
        }
        setData(json);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false));
  }, [data, setData, url]);

  return { data, isLoading, error };
}
