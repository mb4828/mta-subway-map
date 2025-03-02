/* eslint-disable @typescript-eslint/no-explicit-any */
import './SubwayMap.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, NavigationControl } from 'react-map-gl';
import { themeAtom } from '@state/theme';
import { useAtom } from 'jotai';
import { useLinesAtom } from '@state/lines';
import { useStationsAtom } from '@state/stations';

export default function SubwayMap() {
  const { data: lines } = useLinesAtom();
  const { data: stations } = useStationsAtom();
  const [theme] = useAtom(themeAtom);

  /** Called when the map finishes loading */
  function onMapLoad(event: any) {
    // put lines and stations on the map
    if (!lines || !stations) {
      return;
    }
    const map = event.target;

    // sources
    if (!map.getSource('lines')) {
      map.addSource('lines', { type: 'geojson', data: lines });
    }
    if (!map.getSource('stations')) {
      map.addSource('stations', { type: 'geojson', data: stations });
    }

    // lines
    if (!map.getLayer('lines')) {
      map.addLayer({
        id: 'lines',
        type: 'line',
        source: 'lines',
        paint: {
          'line-width': 3.5,
          'line-color': ['get', 'COLOR'],
        },
      });
    }

    // express stations
    if (!map.getLayer('express-stations')) {
      map.addLayer({
        id: 'express-stations',
        type: 'circle',
        source: 'stations',
        filter: ['==', 'STATION_TYPE', 'EXPRESS'],
        paint: {
          'circle-radius': 3,
          'circle-color': '#fff',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#000',
        },
      });
    }

    // local stations
    if (!map.getLayer('local-stations')) {
      map.addLayer({
        id: 'local-stations',
        type: 'circle',
        source: 'stations',
        filter: ['==', 'STATION_TYPE', 'LOCAL'],
        paint: {
          'circle-radius': 3,
          'circle-color': '#000',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });
    }

    // station labels
    if (!map.getLayer('station-labels')) {
      map.addLayer({
        id: 'station-labels',
        type: 'symbol',
        source: 'stations',
        layout: {
          'text-field': ['step', ['zoom'], '', 13, ['get', 'STATION_FULL_NAME']], // hide labels below zoom level 13
          'text-font': ['Arial Unicode MS Bold'],
          'text-size': 12,
          'text-offset': ['get', 'TEXT_OFFSET'],
          'text-justify': ['get', 'TEXT_JUSTIFY'],
          'text-anchor': ['get', 'TEXT_JUSTIFY'],
          'symbol-sort-key': ['case', ['==', ['get', 'STATION_TYPE'], 'EXPRESS'], 1, 100], // prioritize drawing express stations
        },
        paint: {
          'text-color': theme === 'light' ? '#000' : '#fff',
          'text-halo-color': theme === 'light' ? '#fff' : '#000',
          'text-halo-width': 2,
          'text-halo-blur': 0.5,
        },
      });
    }
  }

  return (
    <Map
      initialViewState={{
        longitude: -73.9908113934543,
        latitude: 40.74469746964272,
        zoom: 13.5,
        bearing: 29,
      }}
      style={{ width: '100vw', height: 'calc(100vh - 80px)' }}
      mapStyle={theme === 'light' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11'}
      mapboxAccessToken="pk.eyJ1Ijoid2Zpc2hlciIsImEiOiJjaXI2dHZ2bWUwMG5oZ2FtOTFrc21hcWI1In0.NbX5TzfTH2CtHJTxafWyGg"
      onLoad={onMapLoad}
      onStyleData={onMapLoad}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
}
