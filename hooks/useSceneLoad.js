import { useSyncExternalStore } from 'react';

// The island is a dynamic(ssr:false) chunk that only starts fetching its
// models once it lands, so nothing outside the canvas can tell how far along
// it is. Home.jsx reports here; the intro overlay (components/IslandIntro.jsx)
// reads it to decide whether it can lift yet or has to hold a little longer.
let state = { progress: 0, ready: false };
const listeners = new Set();

export function reportSceneLoad(patch) {
  const next = { ...state, ...patch };
  if (next.progress === state.progress && next.ready === state.ready) return;
  state = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => state;
const serverState = { progress: 0, ready: false };
const getServerSnapshot = () => serverState;

export function useSceneLoad() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
