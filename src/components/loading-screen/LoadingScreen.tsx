import './LoadingScreen.scss';

export default function LoadingScreen() {
  return (
    <div className="logo-container">
      <img src="images/mta-white.svg" alt="MTA" className="pulsing-logo" />
      <p>Loading&hellip;</p>
    </div>
  );
}
