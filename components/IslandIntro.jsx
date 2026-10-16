'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import InlineScript from './InlineScript';
import ParticlePortrait from './ParticlePortrait';
import { useSceneLoad } from '../hooks/useSceneLoad';
import styles from './IslandIntro.module.css';

// The opening titles, played once per visit while the island loads behind
// them: a dot drops and bounces, an L lands on it, the rest of the name
// tumbles out of that L, the dot hops into place as a full stop, then the
// name settles onto a portrait that gathers out of a field of stars. If the
// models are still not in by then, it holds there with a progress line rather
// than opening onto an empty sky. To leave, the view tilts down out of the
// night sky and onto the island, which rises and levels out underneath.
//
// The name is plain CSS keyframes on purpose: those run on the compositor, so
// they stay smooth while three.js is busy parsing models on the main thread.

const NAME = 'BELAL.';
const PIVOT = 2; // the middle L lands first; the other letters unfold out of it
const DOT = NAME.length - 1;
const PLAYED_KEY = 'intro-played';
const SCROLL_KEYS = new Set([' ', 'PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp']);

const BUILD_MS = 2750; // name assembled and the dot has hopped into place
const PORTRAIT_MS = 1700; // stars gather into the portrait
const TITLE_HOLD_MS = 1900; // the finished frame stays up at least this long
const EXIT_MS = 1200;
const GIVE_UP_MS = 20000; // past this the island's own spinner takes over
const FAILSAFE_MS = 10000; // no hydration by then: drop the overlay entirely

// Where the name lands on the portrait, as a fraction of its height: the chest.
const NAME_ON_PORTRAIT = 0.8;

// Runs during HTML parsing, so a repeat visit (or a crawler, which would
// otherwise index a black screen) never paints the overlay at all. It also
// lifts the overlay if the JavaScript never arrives to play it.
const GATE = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('${PLAYED_KEY}')||/bot|crawler|spider|slurp|inspectiontool/i.test(navigator.userAgent)){d.dataset.intro='skip';return}}catch(e){}setTimeout(function(){if(!d.dataset.introStarted)d.dataset.intro='skip'},${FAILSAFE_MS})})()`;

// The same decision for client-side navigations, where the gate never runs.
const shouldSkip = () => {
    if (document.documentElement.dataset.intro === 'skip') return true;
    try {
        return sessionStorage.getItem(PLAYED_KEY) === '1';
    } catch {
        return false;
    }
};
const noSubscribe = () => () => {};

const letterStyle = (i, offsets) => {
    const side = Math.sign(i - PIVOT);
    const reach = Math.abs(i - PIVOT);
    return {
        '--dx': offsets ? `${offsets[i]}px` : '0px',
        '--spin': `${side * -110}deg`,
        '--delay': `${1.08 + (reach - 1) * 0.22 + (side > 0 ? 0.06 : 0)}s`,
    };
};

export default function IslandIntro() {
    const skip = useSyncExternalStore(noSubscribe, shouldSkip, () => false);
    const { progress, ready } = useSceneLoad();

    const [stage, setStage] = useState('measure'); // measure → build → portrait → title
    const [still, setStill] = useState(false);
    const [offsets, setOffsets] = useState(null);
    const [shift, setShift] = useState(0);
    const [holdDone, setHoldDone] = useState(false);
    const [gaveUp, setGaveUp] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [done, setDone] = useState(false);
    const letters = useRef([]);

    const leaving = skipped || (stage === 'title' && holdDone && (ready || gaveUp));
    const waiting = stage === 'title' && holdDone && !leaving;

    // Measure where each letter will sit, then start the build. Fonts first:
    // measuring the fallback face would send every letter to the wrong spot.
    useEffect(() => {
        if (shouldSkip()) return;
        const root = document.documentElement;
        root.dataset.introStarted = '1';

        let cancelled = false;
        const timers = [];
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));
        later(() => setGaveUp(true), GIVE_UP_MS);

        const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
        Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(() => {
            if (cancelled) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setStill(true);
                setStage('title');
                return;
            }
            const centre = (el) => {
                const box = el.getBoundingClientRect();
                return box.left + box.width / 2;
            };
            const pivot = centre(letters.current[PIVOT]);
            setOffsets(letters.current.map((el) => pivot - centre(el)));
            setStage('build');
            later(() => setStage('portrait'), BUILD_MS);
            later(() => setStage('title'), BUILD_MS + PORTRAIT_MS);
        });

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
            delete root.dataset.introStarted;
        };
    }, []);

    // The portrait reports where it will be drawn; the name drops to its chest.
    const placeName = useCallback((box) => {
        setShift(box.y + box.h * NAME_ON_PORTRAIT - window.innerHeight / 2);
    }, []);

    useEffect(() => {
        if (stage !== 'title') return;
        const timer = setTimeout(() => setHoldDone(true), TITLE_HOLD_MS);
        return () => clearTimeout(timer);
    }, [stage]);

    // data-intro="leaving" tells the island's camera (IntroCamera in Home.jsx)
    // to pitch down in step with the overlay tilting away. A layout effect so
    // both start on the same frame.
    useLayoutEffect(() => {
        if (!leaving) return;
        const root = document.documentElement;
        root.dataset.intro = 'leaving';
        const timer = setTimeout(() => {
            try {
                sessionStorage.setItem(PLAYED_KEY, '1');
            } catch {
                // Private mode: it just plays again next time.
            }
            root.dataset.intro = 'skip';
            setDone(true);
        }, EXIT_MS);
        return () => {
            clearTimeout(timer);
            if (root.dataset.intro === 'leaving') delete root.dataset.intro;
        };
    }, [leaving]);

    // Escape skips. Everything else that would scroll the page out from under
    // the overlay is swallowed until it is gone (see the scrollbar note in
    // IslandIntro.module.css for why this is not overflow: hidden).
    useEffect(() => {
        if (skip || done) return;
        const stop = (e) => e.preventDefault();
        const onKey = (e) => {
            if (e.key === 'Escape') setSkipped(true);
            // Space still has to press the Skip button when that has focus.
            else if (SCROLL_KEYS.has(e.key) && e.target.tagName !== 'BUTTON') e.preventDefault();
        };
        // Catches the scrollbar being dragged, and anything scrolled before
        // the page was interactive. Instant: html has scroll-behavior: smooth.
        const pin = () => {
            if (window.scrollY) window.scrollTo({ top: 0, behavior: 'instant' });
        };
        pin();
        window.addEventListener('wheel', stop, { passive: false });
        window.addEventListener('touchmove', stop, { passive: false });
        window.addEventListener('keydown', onKey);
        window.addEventListener('scroll', pin);
        return () => {
            window.removeEventListener('wheel', stop);
            window.removeEventListener('touchmove', stop);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', pin);
        };
    }, [skip, done]);

    if (skip || done) return null;

    const shown = Math.round(progress);

    return (
        <>
            <InlineScript html={GATE} />
            <div
                id="island-intro"
                className={`${styles.intro} ${leaving ? styles.leaving : ''}`}
                data-stage={stage}
                style={{ '--shift': `${shift}px` }}
            >
                {/* Everything that tilts away on the way out; the skip button stays put. */}
                <div className={styles.sky}>
                    <div className={styles.glow} aria-hidden="true" />
                    <ParticlePortrait
                        src="/intro/belal-particles.bin"
                        play={stage === 'portrait' || stage === 'title'}
                        still={still}
                        onBox={placeName}
                        className={styles.portrait}
                    />

                    <div className={styles.centre} aria-hidden="true">
                        <p className={styles.word}>
                            {NAME.split('').map((ch, i) => (
                                <span
                                    key={i}
                                    ref={(el) => {
                                        letters.current[i] = el;
                                    }}
                                    className={
                                        i === DOT
                                            ? styles.dot
                                            : `${styles.letter} ${i === PIVOT ? styles.pivot : ''}`
                                    }
                                    style={letterStyle(i, offsets)}
                                >
                                    {ch}
                                </span>
                            ))}
                        </p>

                        <div className={styles.below}>
                            <p className={styles.role}>
                                <b>Belal Alaa El-Shabrawy</b> <i>Full-Stack Developer</i>
                            </p>
                            <div className={styles.loading} data-on={waiting}>
                                <div className={styles.track}>
                                    <div
                                        className={`${styles.bar} ${shown < 1 ? styles.unknown : ''}`}
                                        style={{ '--p': shown / 100 }}
                                    />
                                </div>
                                <p className={styles.status}>
                                    Loading the island{shown > 0 ? ` · ${shown}%` : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" className={styles.skip} onClick={() => setSkipped(true)}>
                    Skip intro
                </button>
            </div>
        </>
    );
}
