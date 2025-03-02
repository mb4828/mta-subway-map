import { atom } from 'jotai';

export const themeAtom = atom<'dark' | 'light'>(getSystemTheme());

/** Check system preference */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && !!window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}
