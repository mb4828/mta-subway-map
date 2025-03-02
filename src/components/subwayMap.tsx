/* eslint-disable @typescript-eslint/no-explicit-any */
import './subwayMap.scss';
import { Map, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';

export function SubwayMap({
  lines,
  stations,
}: {
  lines: FeatureCollection | null;
  stations: FeatureCollection | null;
}) {
  /** Called when the map finishes loading */
  function onMapLoad(event: any) {
    // put lines and stations on the map
    const map = event.target;

    if (lines) {
      // lines
      map.addSource('lines', { type: 'geojson', data: lines });
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

    if (stations) {
      map.addSource('stations', { type: 'geojson', data: stations });
      // express stations
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

      // local stations
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

      // station labels
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
          'text-color': '#000',
          'text-halo-color': '#fff',
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
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken="pk.eyJ1Ijoid2Zpc2hlciIsImEiOiJjaXI2dHZ2bWUwMG5oZ2FtOTFrc21hcWI1In0.NbX5TzfTH2CtHJTxafWyGg"
      onLoad={onMapLoad}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
}
