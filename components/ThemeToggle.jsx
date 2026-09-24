'use client';

import { useEffect, useSyncExternalStore } from 'react';

// The <html> class is set before first paint by the inline script in
// app/layout.jsx. This component treats that class as the source of truth and
// subscribes to it, rather than keeping a second copy of the state in React —
// which also means no setState during an effect, and no hydration mismatch
// (useSyncExternalStore renders the server snapshot, then re-syncs).
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

const ThemeToggle = () => {
    const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Follow the OS setting for as long as the visitor hasn't chosen for
    // themselves. Touches the DOM only; the observer above picks the change up.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onChange = (e) => {
            try {
                if (localStorage.getItem('theme')) return;
            } catch {
                // storage can throw in private mode — fall through to the OS
            }
            document.documentElement.classList.toggle('dark', e.matches);
        };
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    const toggle = () => {
        const next = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem('theme', next ? 'dark' : 'light');
        } catch {
            // not remembering the choice shouldn't break the toggle
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDark}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white/70 text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
        >
            {/* Both icons ship in the markup and are swapped with CSS, so the
                correct one is already showing at first paint. */}
            <svg
                className="h-5 w-5 dark:hidden"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg
                className="hidden h-5 w-5 dark:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
        </button>
    );
};

export default ThemeToggle;
