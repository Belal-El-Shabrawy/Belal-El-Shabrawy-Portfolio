'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { createIntroScene } from './intro/scene';

// Hosts the intro's drawing (intro/scene.js: the eye, the stars, the
// portrait). Where the browser allows, the canvas is handed to a worker, so
// the 3D island loading on the main thread behind the intro - context
// creation, model parsing, each a freeze of up to a second - cannot make the
// eye stutter or skip its blink. Anywhere that fails, it draws from here.
//
// onBox, onPupilOpen and onFormed relay what the scene reports.
const IntroCanvas = ({ play, still, frozen, onBox, onPupilOpen, onFormed, className }) => {
    const hostRef = useRef(null);
    const handlers = useRef({});
    const controls = useRef(null);

    useLayoutEffect(() => {
        handlers.current = { box: onBox, pupil: onPupilOpen, formed: onFormed };
    });

    useEffect(() => {
        if (!play) return;
        const host = hostRef.current;
        const notify = (type, payload) => handlers.current[type]?.(payload);
        const options = () => ({
            width: window.innerWidth,
            height: window.innerHeight,
            dpr: window.devicePixelRatio || 1,
            still,
            particlesUrl: new URL('/intro/belal-particles.bin', window.location.href).href,
        });
        // A fresh canvas every time: one handed to a worker can never be drawn
        // on from here again, which also rules out reusing it.
        const freshCanvas = () => {
            host.replaceChildren();
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'display:block;width:100%;height:100%';
            host.appendChild(canvas);
            return canvas;
        };

        let worker = null;
        let scene = null;
        const onPage = () => {
            worker?.terminate();
            worker = null;
            scene = createIntroScene(freshCanvas(), options(), notify);
        };

        const canvas = freshCanvas();
        if (typeof canvas.transferControlToOffscreen === 'function' && typeof Worker === 'function') {
            try {
                worker = new Worker(new URL('./intro/scene.worker.js', import.meta.url), { type: 'module' });
                worker.onmessage = ({ data }) => notify(data.type, data.payload);
                worker.onerror = onPage;
                const offscreen = canvas.transferControlToOffscreen();
                worker.postMessage({ type: 'init', canvas: offscreen, options: options() }, [offscreen]);
            } catch {
                onPage();
            }
        } else {
            onPage();
        }

        controls.current = {
            resize() {
                const { width, height, dpr } = options();
                if (worker) worker.postMessage({ type: 'resize', width, height, dpr });
                else scene?.resize(width, height, dpr);
            },
            freeze() {
                if (worker) worker.postMessage({ type: 'freeze' });
                else scene?.freeze();
            },
        };
        const onResize = () => controls.current?.resize();
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            worker?.terminate();
            scene?.freeze();
            controls.current = null;
            host.replaceChildren();
        };
    }, [play, still]);

    useEffect(() => {
        if (frozen) controls.current?.freeze();
    }, [frozen]);

    return <div ref={hostRef} className={className} aria-hidden="true" />;
};

export default IntroCanvas;
