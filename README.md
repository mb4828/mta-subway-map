# NYCT Subway Map

A NYCT subway map using [Vite](https://vite.dev) and [Mapbox](https://www.mapbox.com)

By: Matt Brauner (contact@mattbrauner.com)

## Repo tour

[🖿 public](public) — Location of all static assets

[🖿 src](src) — Location of all source code

&nbsp;&nbsp;[🖿 components](src/components) — Reusable [React components](https://react.dev/learn/your-first-component)

&nbsp;&nbsp;[🖿 state](src/state) — App state stored using [Jotai](https://jotai.org/)

&nbsp;&nbsp;[🖿 utils](src/utils) — Utility functions and constants

&nbsp;&nbsp;[🗎 App.tsx](src/App.tsx) — Root React component

&nbsp;&nbsp;[🗎 index.css](src/index.css) — Root app styles

&nbsp;&nbsp;[🗎 main.tsx](src/main.tsx) — Root of the app and the main entry point

[🗎 index.html](index.html) — Main HTML file

## Getting started

Run the following to install dependencies and start the development server:

```
yarn install
yarn dev
```

Go to http://localhost:5173/

## Tests & coverage

Tests and coverage are available using [vitest](https://vitest.dev/). To run:

```
yarn test
```

## Build

Run the build command to build. The built app will be written to [/dist](/dist)

```
yarn build
```
