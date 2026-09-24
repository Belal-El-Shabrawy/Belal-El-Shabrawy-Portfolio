'use client';

import { useSyncExternalStore } from 'react';

// Read through useSyncExternalStore rather than setState-in-an-effect: the
// window is external state, and this keeps the 3D scene's sizing in step with
// resizes and orientation changes without a cascading render.
const subscribe = (onChange) => {
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    return () => {
        window.removeEventListener('resize', onChange);
        window.removeEventListener('orientationchange', onChange);
    };
};

// Snapshot has to be a primitive so React can compare it by value — an object
// would be a new reference every frame and loop forever.
const getSnapshot = () => `${window.innerWidth}x${window.innerHeight}`;
const getServerSnapshot = () => '0x0';

export const useViewport = () => {
    const size = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [width, height] = size.split('x').map(Number);
    // Before mount we don't know the viewport; assume a desktop-ish ratio so
    // the first frame isn't sized for a phone on a laptop.
    const aspect = width && height ? width / height : 1.6;
    return { width, height, aspect };
};
