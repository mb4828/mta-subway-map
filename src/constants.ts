/** Lines file path */
export const LINES_FILE = '/nyct-station-line-with-color-updated.geojson';

/** Stations file path */
export const STATIONS_FILE = '/nyct-station-point-filtered.geojson';

/** List of express lines for station styling */
export const EXPRESS_LINES = ['2', '3', '4', '5', 'A', 'D', 'Q'];

/** Station offset overrides for different stations */
export const STATION_OFFSET_OVERRIDES = new Map<string, string>([
  ['011-TIMESSQ-42ST-BWY-N/R/Q', 'right'],
  ['012-34ST-HERALDSQ-BWY-M/N/R/Q', 'right'],
  ['013-28ST-BWY-N/R', 'right'],
  ['115-8AV-CNR-L', 'bottom_left'],
  ['116-6AV-CNR-L', 'bottom_right'],
  ['117-14ST-UNIONSQ-CNR-L', 'bottom_left'],
  ['118-3AV-CNR-L', 'bottom'],
  ['119-1AV-CNR-L', 'bottom'],
  ['163-42ST/PORTAUTHORITY-BUSTERMINAL-8AV-A/C/E', 'top_left'],
  ['164-34ST-PENNSTATION-8AV-A/C/E', 'top_left'],
  ['226-42ST-BRYANTPK-6AV-B/D/F/M', 'bottom_right'],
  ['227-34ST-HERALDSQ-6AV-B/D/F', 'top_right'],
  ['317-TIMESSQ-42ST-7AV-1/2/3', 'bottom_left'],
  ['322-14ST-7AV-1/2/3', 'right'],
  ['402-GRANDCENTRAL-42ST-LEX-4/5/6', 'top_left'],
  ['403-33ST-LEX-6', 'right'],
  ['404-28ST-LEX-6', 'right'],
  ['405-23ST-LEX-6', 'right'],
  ['406-14ST-UNIONSQ-LEX-4/5/6', 'top_right'],
  ['465-GRANDCENTRAL-42ST-FLS-7', 'bottom'],
  ['466-5AV-FLS-7', 'top'],
  ['467-TIMESSQ-42ST-FLS-7', 'top_left'],
  ['468-TIMESSQ-42ST-LEX-S', 'top_right'],
  ['469-GRANDCENTRAL-42ST-LEX-S', 'top'],
]);

/** Text offset values for different directions */
export const TEXT_OFFSETS = {
  top: [0, -1.5],
  right: [0.75, 0],
  bottom: [0, 1.5],
  left: [-0.75, 0],
  top_right: [0.75, -1.5],
  top_left: [-0.75, -1.75],
  bottom_right: [0.75, 1.5],
  bottom_left: [-0.75, 1.75],
};
