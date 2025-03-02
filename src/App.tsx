import './App.scss';
import Header from '@components/Header';
import LoadingScreen from '@components/LoadingScreen';
import SubwayMap from '@components/SubwayMap';
import { useLinesAtom } from '@state/lines';
import { useStationsAtom } from '@state/stations';
import { useEffect, useState } from 'react';

const App = () => {
  const { data: lines, isLoading: isLoadingLines } = useLinesAtom();
  const { data: stations, isLoading: isLoadingStations } = useStationsAtom();
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
