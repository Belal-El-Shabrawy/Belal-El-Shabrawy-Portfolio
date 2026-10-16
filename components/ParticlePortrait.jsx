'use client';

import { useEffect, useRef } from 'react';

// The portrait at the end of the intro, drawn as particles rather than shown as
// a photo. The data is a brightness grid built by scripts/make-intro-particles.py;
// every non-zero cell becomes a particle that starts somewhere in the star field
// and flies to its spot.
//
// A handful of colours, so the fill style only changes a few times a frame:
// dim cells lean blue, bright ones go to near-white, like the reference.
const PALETTE = ['#3346c8', '#4f63e6', '#7486f2', '#9eadf8', '#cad4fd', '#f3f5ff'];
const FREE_STARS = 150;
const GATHER_DELAY = 0.35; // stars hang in place this long before they move
const MAX_DPR = 2;

// Where the portrait sits for a given viewport. Also used by the intro to drop
// the name onto the chest, so both agree on the same box.
export const portraitBox = (vw, vh, aspect) => {
    const h = Math.min(vh * 0.74, (vw * 1.04) / aspect);
    const w = h * aspect;
    return { x: (vw - w) / 2, y: (vh - h) / 2 - vh * 0.03, w, h };
};

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);

const build = (data, vw, vh, seed) => {
    let s = seed;
    const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const cols = data[0];
    const rows = data[1];
    const box = portraitBox(vw, vh, cols / rows);
    const cell = box.h / rows;
    const groups = PALETTE.map(() => []);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const v = data[2 + r * cols + c];
            if (!v) continue;
            const b = v / 255;
            // The face forms first and the shoulders follow, rather than all
            // at once: delay grows with distance from the face.
            const dx = c / cols - 0.5;
            const dy = r / rows - 0.32;
            const far = Math.min(1, Math.hypot(dx, dy) * 1.6);
            const tone = Math.round(b ** 0.8 * (PALETTE.length - 1) + (rand() - 0.5) * 1.2);
            groups[Math.max(0, Math.min(PALETTE.length - 1, tone))].push({
                sx: rand() * vw,
                sy: rand() * vh,
                tx: box.x + (c + 0.5) * cell,
                ty: box.y + (r + 0.5) * cell,
                size: cell * (0.5 + 0.38 * b),
                alpha: Math.min(1, 0.1 + b * 1.25),
                starSize: 0.8 + rand() * 0.9,
                starAlpha: 0.25 + rand() * 0.5,
                delay: far * 0.35 + rand() * 0.45,
                dur: 1 + rand() * 0.5,
                curve: (rand() - 0.5) * 120,
                phase: rand() * Math.PI * 2,
                speed: 1.5 + rand() * 3,
            });
        }
    }

    const stars = Array.from({ length: FREE_STARS }, () => ({
        x: rand() * vw,
        y: rand() * vh,
        size: 0.6 + rand() * 1.2,
        alpha: 0.2 + rand() * 0.55,
        phase: rand() * Math.PI * 2,
        speed: 0.8 + rand() * 2,
    }));

    return { box, groups, stars };
};

const ParticlePortrait = ({ src, play, still, onBox, className }) => {
    const canvasRef = useRef(null);
    const dataRef = useRef(null);
    const sceneRef = useRef(null);

    // Fetch the grid at once, well before it is needed, and keep the layout in
    // step with the viewport.
    useEffect(() => {
        let cancelled = false;
        const layout = () => {
            const data = dataRef.current;
            const canvas = canvasRef.current;
            if (!data || !canvas) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            canvas.width = Math.round(vw * dpr);
            canvas.height = Math.round(vh * dpr);
            canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
            sceneRef.current = build(data, vw, vh, 11);
            onBox?.(sceneRef.current.box);
        };
        fetch(src)
            .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(res.status)))
            .then((buffer) => {
                if (cancelled) return;
                dataRef.current = new Uint8Array(buffer);
                layout();
            })
            .catch(() => {
                // No portrait: the intro still plays, the name just stays centred.
            });
        window.addEventListener('resize', layout);
        return () => {
            cancelled = true;
            window.removeEventListener('resize', layout);
        };
    }, [src, onBox]);

    useEffect(() => {
        if (!play) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const start = performance.now();
        let frame;

        const draw = (now) => {
            frame = requestAnimationFrame(draw);
            const scene = sceneRef.current;
            if (!scene) return;
            const t = still ? 10 : (now - start) / 1000;
            const appear = clamp01(t / 0.4);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#dfe6ff';
            for (const star of scene.stars) {
                ctx.globalAlpha = appear * star.alpha * (0.6 + 0.4 * Math.sin(t * star.speed + star.phase));
                ctx.fillRect(star.x, star.y, star.size, star.size);
            }

            for (let k = 0; k < scene.groups.length; k++) {
                ctx.fillStyle = PALETTE[k];
                for (const p of scene.groups[k]) {
                    const e = easeInOutCubic(clamp01((t - GATHER_DELAY - p.delay) / p.dur));
                    const bend = Math.sin(e * Math.PI) * p.curve;
                    const x = p.sx + (p.tx - p.sx) * e + bend;
                    const y = p.sy + (p.ty - p.sy) * e - bend * 0.4;
                    const size = p.starSize + (p.size - p.starSize) * e;
                    const shimmer = 0.8 + 0.2 * Math.sin(t * p.speed + p.phase);
                    ctx.globalAlpha = appear * shimmer * (p.starAlpha + (p.alpha - p.starAlpha) * e);
                    ctx.fillRect(x - size / 2, y - size / 2, size, size);
                }
            }
            ctx.globalAlpha = 1;
        };

        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, [play, still]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default ParticlePortrait;
