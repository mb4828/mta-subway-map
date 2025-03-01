import './loadingScreen.scss';

export function LoadingScreen() {
  return (
    <div className="logo-container">
      <img src="mta-white.svg" alt="MTA" className="pulsing-logo" />
      <p>Loading&hellip;</p>
    </div>
  );
}
