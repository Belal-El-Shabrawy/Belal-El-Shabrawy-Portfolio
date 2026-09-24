'use client';

import { useSyncExternalStore } from 'react';

// The <html> class set by the inline script in app/layout.jsx is the single
// source of truth for the theme. Anything that needs to react to it subscribes
// here rather than keeping its own copy of the state.
const subscribe = (onChange) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', onChange);
    return () => {
        observer.disconnect();
        media.removeEventListener('change', onChange);
    };
};

const getSnapshot = () => document.documentElement.classList.contains('dark');
const getServerSnapshot = () => false;

export const useIsDark = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
