import './Header.scss';
import '@theme-toggles/react/css/Expand.css';
import { themeAtom } from '@state/theme';
import { Expand } from '@theme-toggles/react/dist';
import { useAtom } from 'jotai';

export default function Header() {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <header>
      <div className="header-contents">
        <img src="images/mta-white.svg" alt="MTA" />
        <h1>Subway Map</h1>
        <Expand
          toggled={theme === 'dark'}
          toggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          duration={750}
          className="theme-toggle"
          placeholder="Light/Dark"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
    </header>
  );
}
