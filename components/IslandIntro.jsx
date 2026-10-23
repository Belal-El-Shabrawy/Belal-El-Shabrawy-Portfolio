'use client';

import { useCallback, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import InlineScript from './InlineScript';
import IntroCanvas from './IntroCanvas';
import { reportSceneLoad, useSceneLoad } from '../hooks/useSceneLoad';
import styles from './IslandIntro.module.css';

// The opening titles, played once per visit while the island loads behind
// them: an eye drawn in ASCII surfaces out of the dark, opens, blinks, looks
// around, and the view glides into its pupil, which opens onto a sky of
// shining stars where a portrait gathers (all drawn by intro/scene.js, through
// IntroCanvas.jsx). The name then decodes onto the portrait's chest. If the
// models are still not in by then, it holds there with a progress line rather
// than opening onto an empty sky. To leave, the view tilts down out of the
// night sky and onto the island.
//
// Each step starts when the one before reports it has got there (the eye's
// pupil has opened, the portrait has formed), not on a timer: the page stalls
// while the island loads, and a timer would cut a step short.

const NAME = 'BELAL.';
const PLAYED_KEY = 'intro-played';
const SCROLL_KEYS = new Set([' ', 'PageDown', 'PageUp', 'Home', 'End', 'ArrowDown', 'ArrowUp']);

const TITLE_HOLD_MS = 1900; // the finished frame stays up at least this long
const EXIT_MS = 1200;
const GIVE_UP_MS = 20000; // past this the island's own spinner takes over
// Should the drawing never report back (a broken worker, say), the name
// comes up anyway rather than the intro sitting on a blank sky.
const TITLE_BY_MS = 14000;
// How long after the name has settled the island may draw for the first time.
const RELEASE_AFTER_NAME_MS = 400;
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

// The name decodes in the eye's own terms: each letter churns through dense
// ASCII glyphs, left to right, then settles.
const DECODE_GLYPHS = 'XYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
const DECODE_START_MS = 150;
const DECODE_STEP_MS = 85;
const DECODE_CHURN_MS = 320;
const DECODE_MS = DECODE_START_MS + NAME.length * DECODE_STEP_MS;
const SETTLED = true;

export default function IslandIntro() {
    const skip = useSyncExternalStore(noSubscribe, shouldSkip, () => false);
    const { progress, ready } = useSceneLoad();

    const [stage, setStage] = useState('wait'); // wait → eye → portrait → title
    const [still, setStill] = useState(false);
    // Per letter: '' not shown yet, a glyph while it churns, SETTLED when done.
    const [glyphs, setGlyphs] = useState(() => NAME.split('').map(() => ''));
    const [shift, setShift] = useState(0);
    const [holdDone, setHoldDone] = useState(false);
    const [gaveUp, setGaveUp] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [done, setDone] = useState(false);

    const leaving = skipped || (stage === 'title' && holdDone && (ready || gaveUp));
    const waiting = stage === 'title' && holdDone && !leaving;
    const decoded = glyphs.every((glyph) => glyph === SETTLED);

    // Runs the timeline. Reduced motion skips straight to the finished frame.
    useEffect(() => {
        if (shouldSkip()) return;
        const root = document.documentElement;
        root.dataset.introStarted = '1';
        reportSceneLoad({ held: true });

        const timers = [];
        const later = (fn, ms) => timers.push(setTimeout(fn, ms));
        later(() => setGaveUp(true), GIVE_UP_MS);
        later(() => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                setStill(true);
                setGlyphs(NAME.split('').map(() => SETTLED));
                setStage('title');
                return;
            }
            setStage('eye');
            later(() => setStage('title'), TITLE_BY_MS);
        }, 0);

        return () => {
            timers.forEach(clearTimeout);
            delete root.dataset.introStarted;
            reportSceneLoad({ held: false });
        };
    }, []);

    const openPupil = useCallback(() => setStage((s) => (s === 'eye' ? 'portrait' : s)), []);
    const portraitFormed = useCallback(() => setStage((s) => (s === 'eye' || s === 'portrait' ? 'title' : s)), []);

    // The island's first draw freezes the page for a moment (shaders,
    // textures), so it is held back until the name has settled and nothing on
    // screen is moving but the portrait's shimmer - a beat after the full stop
    // lands, or the freeze swallows it being typed. Sooner if the visitor
    // skips, or the wait has gone on too long.
    useEffect(() => {
        if (leaving || gaveUp) {
            reportSceneLoad({ held: false });
            return;
        }
        if (!decoded) return;
        const timer = setTimeout(() => reportSceneLoad({ held: false }), RELEASE_AFTER_NAME_MS);
        return () => clearTimeout(timer);
    }, [decoded, leaving, gaveUp]);

    useEffect(() => {
        if (stage !== 'title' || still) return;
        const start = performance.now();
        let last = 0;
        let frame;
        const tick = (now) => {
            const t = now - start;
            if (t >= DECODE_MS) {
                setGlyphs(NAME.split('').map(() => SETTLED));
                return;
            }
            // ~20 changes a second: any faster and the glyphs are just noise.
            if (now - last > 50) {
                last = now;
                setGlyphs(
                    NAME.split('').map((_, i) => {
                        const settle = DECODE_START_MS + (i + 1) * DECODE_STEP_MS;
                        if (t >= settle) return SETTLED;
                        if (t < settle - DECODE_CHURN_MS) return '';
                        return DECODE_GLYPHS[Math.floor(Math.random() * DECODE_GLYPHS.length)];
                    })
                );
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [stage, still]);

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
                {/* Every glyph the name will use, painted once in the background
                    colour as the page first appears, so the GPU has them cached
                    before the decode needs them. Drawn cold, the first churning
                    glyphs took over 100ms and froze the portrait with them. */}
                <span className={styles.warm} aria-hidden="true">
                    {NAME + DECODE_GLYPHS}
                </span>

                {/* Everything that tilts away on the way out; the skip button stays put. */}
                <div className={styles.sky}>
                    <IntroCanvas
                        play={stage !== 'wait'}
                        still={still}
                        frozen={leaving}
                        onBox={placeName}
                        onPupilOpen={openPupil}
                        onFormed={portraitFormed}
                        className={styles.layer}
                    />

                    <div className={styles.centre} aria-hidden="true">
                        {/* The real letters always hold their place, so the name
                            does not jitter in width while it decodes; a churning
                            glyph is drawn over a hidden letter. */}
                        <p className={styles.word}>
                            {NAME.split('').map((ch, i) => {
                                const glyph = glyphs[i];
                                const kind = ch === '.' ? styles.dot : styles.letter;
                                if (glyph === SETTLED) {
                                    return (
                                        <span key={i} className={kind}>
                                            {ch}
                                        </span>
                                    );
                                }
                                return (
                                    <span key={i} className={`${kind} ${styles.pending}`}>
                                        {ch}
                                        {glyph && <span className={`${styles.letter} ${styles.glyph}`}>{glyph}</span>}
                                    </span>
                                );
                            })}
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
