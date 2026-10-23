import { useSyncExternalStore } from 'react';

// The island is a dynamic(ssr:false) chunk that only starts fetching its
// models once it lands, so nothing outside the canvas can tell how far along
// it is. Home.jsx reports here; the intro overlay (components/IslandIntro.jsx)
// reads it to decide whether it can lift yet or has to hold a little longer.
//
// It also works the other way: while the intro has `held` set, the island does
// not draw at all. Its first draw compiles every shader and uploads every
// texture - a freeze of half a second or more - and the intro decides when
// that may happen, so it lands on a still frame instead of mid-animation.
let state = { progress: 0, ready: false, held: false };
const listeners = new Set();

export function reportSceneLoad(patch) {
  const next = { ...state, ...patch };
  if (next.progress === state.progress && next.ready === state.ready && next.held === state.held) return;
  state = next;
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => state;
const serverState = { progress: 0, ready: false, held: false };
const getServerSnapshot = () => serverState;

export function useSceneLoad() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
