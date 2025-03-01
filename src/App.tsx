import './App.scss';
import { LoadingScreen } from './components/loadingScreen';
import { useLinesAtom } from './state/linesAtom';
import { useStationsAtom } from './state/stationsAtom';
import { useEffect, useState } from 'react';
import Header from './components/header';
import { SubwayMap } from './components/subwayMap';

const App = () => {
  const { data: lines, isLoading: isLoadingLines, error: linesError } = useLinesAtom();
  const { data: stations, isLoading: isLoadingStations, error: stationsError } = useStationsAtom();
  const [loading, setLoading] = useState(true);

  /** Initial load */
  useEffect(() => {
    if (!isLoadingLines && !isLoadingStations) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoadingLines, isLoadingStations]);

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <Header />
      <SubwayMap lines={lines} stations={stations} />
    </>
  );
};

export default App;
