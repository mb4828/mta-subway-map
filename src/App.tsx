import './App.scss';
import Header from '@components/header2';
import LoadingScreen from '@components/loading-screen';
import SubwayMap from '@components/subway-map';
import { useLinesAtom } from '@state/lines';
import { useStationsAtom } from '@state/stations';
import { useEffect, useState } from 'react';

const App = () => {
  const { isLoading: isLoadingLines } = useLinesAtom();
  const { isLoading: isLoadingStations } = useStationsAtom();
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
      <SubwayMap />
    </>
  );
};

export default App;
