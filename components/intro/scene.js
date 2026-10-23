// Everything the home intro draws, on one canvas: an ASCII eye after the
// "in your eyes" terminal piece, which surfaces out of the dark shut, opens,
// blinks once, looks left and right, then the view glides into its pupil and
// out into a night sky of shining stars, where a portrait gathers.
//
// No React and no DOM, so it can run in a worker (scene.worker.js) on an
// OffscreenCanvas: the page's main thread freezes for up to a second at a
// time while the 3D island sets itself up behind the intro, and drawn from
// there the eye would stutter or skip straight past the blink. IntroCanvas.jsx
// falls back to running it on the page where workers cannot draw.
//
// It reports back through notify(type, payload):
//   'box'    where the portrait is drawn (the name goes on its chest)
//   'pupil'  the dive has swallowed the screen; the portrait starts gathering
//   'formed' the portrait has settled; time for the name

// ---- Timing ---------------------------------------------------------------

// The performance, in ms from the start. Each track is [time, value] keys,
// eased between: lid 0 is shut and 1 open; gaze is how far the iris has
// turned, in eye half-widths; dive runs 0 to 1 across the zoom.
const LID = [[0, 0], [550, 0], [1150, 1], [1500, 1], [1610, 0], [1820, 1]];
const GAZE_X = [[0, 0], [2000, 0], [2220, -0.3], [2520, -0.3], [2850, 0.3], [3150, 0.3], [3380, 0]];
const GAZE_Y = [[0, 0], [2000, 0], [2220, 0.04], [2520, 0.04], [2850, -0.04], [3150, -0.04], [3380, 0]];
const DIVE = [[0, 0], [3450, 0], [5000, 1]];
const REVEAL_MS = 700;
// The portrait starts as the pupil swallows the last of the screen, just
// before the dive ends, and counts as formed this long after.
const PORTRAIT_AT_MS = 4700;
const FORMED_MS = 1700;
// The clock never moves more than two frames' worth in one frame, so even a
// stall pauses the performance rather than skipping part of it.
const MAX_STEP_MS = 34;

// ---- The eye ----------------------------------------------------------------

// Sparse to dense: a dim cell gets a dot, a bright one a heavy glyph.
const RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const LAST = RAMP.length - 1;

// Tones per material, dark to light. The skin is the reference's own base
// colour, (0.62, 0.40, 0.29), spread either side.
const MATERIALS = [
    ['#5c3624', '#8f5838', '#c07a50', '#e9a874'], // 0 skin
    ['#2a1811', '#4d2e1f'], // 1 lashes
    ['#8d837e', '#c6bdb7', '#f1ebe6'], // 2 white of the eye
    ['#9a5856', '#c98a84'], // 3 tear duct
    ['#5a3519', '#8a5428', '#b97a3a', '#e3ab62'], // 4 iris
    ['#ffffff'], // 5 catchlight
];
const SKIN = 0, LASH = 1, SCLERA = 2, PINK = 3, IRIS = 4, GLINT = 5;
const PUPIL = -2, NONE = -1;
const ROW_OF = [];
MATERIALS.reduce((row, tones, m) => ((ROW_OF[m] = row), row + tones.length), 0);
const ATLAS_ROWS = MATERIALS.flat();

// The eye, in its own units: half its width is 1, y points down.
const IRIS_R = 0.37;
const PUPIL_R = 0.15;
const DILATE = 0.25; // the pupil widens this much more as the view goes in

// ---- The portrait -----------------------------------------------------------

// A handful of colours, so the fill style only changes a few times a frame:
// dim cells lean blue, bright ones go to near-white.
const PALETTE = ['#3346c8', '#4f63e6', '#7486f2', '#9eadf8', '#cad4fd', '#f3f5ff'];
const GATHER_DELAY_S = 0.35; // the particles hang as specks this long before they move

// Where the portrait sits for a given viewport.
const portraitBox = (vw, vh, aspect) => {
    const h = Math.min(vh * 0.74, (vw * 1.04) / aspect);
    const w = h * aspect;
    return { x: (vw - w) / 2, y: (vh - h) / 2 - vh * 0.03, w, h };
};

// ---- Helpers ----------------------------------------------------------------

const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smoothstep = (a, b, t) => {
    const x = clamp01((t - a) / (b - a));
    return x * x * (3 - 2 * x);
};
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const track = (keys, t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
        const [t1, v1] = keys[i];
        if (t <= t1) {
            const [t0, v0] = keys[i - 1];
            return v0 + (v1 - v0) * easeInOut((t - t0) / (t1 - t0));
        }
    }
    return keys[keys.length - 1][1];
};
const hash = (x, y, z) => {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const seeded = (seed) => {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
};
const makeCanvas = (w, h) => {
    if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
};
const nextFrame =
    typeof requestAnimationFrame === 'function'
        ? (fn) => requestAnimationFrame(fn)
        : (fn) => setTimeout(() => fn(performance.now()), 16);
const cancelFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : clearTimeout;

// ---- Shading ----------------------------------------------------------------

// Where the eye is this frame; set once per frame before any shade() call.
let lid = 0;
let irisX = 0.03;
let irisY = 0.02;
let pupilR = PUPIL_R;

// shade() reports through these rather than allocating an object per cell.
let M = NONE; // material
let V = 0; // brightness, 0..1
let E = 0; // 1 on an outline: lid edges, crease, rim of the iris

const shade = (u, v) => {
    E = 0;
    const ax = Math.abs(u);
    const open = ax < 1 ? (1 - u * u) ** 0.9 : 0;
    // Shut, both lids meet on a line just above where the lower one rests;
    // the upper lid does almost all of the travelling, as a real one does.
    const fullTop = -0.47 * open - 0.035 * u;
    const fullBottom = 0.33 * open + 0.03 * u;
    const shut = 0.27 * open + 0.03 * u;
    const top = shut + (fullTop - shut) * lid;
    const bottom = shut + (fullBottom - shut) * lid;
    const grain = 0.5 + 0.25 * Math.sin(u * 6.3 + v * 2.1) + 0.25 * Math.sin(u * 2.3 - v * 7.7);

    if (open > 0 && v > top && v < bottom) {
        const fromTop = v - top;
        const fromBottom = bottom - v;
        if (fromTop < 0.05 || fromBottom < 0.04) E = 1;
        const lidShadow = Math.exp(-fromTop / 0.1) * 0.55;
        const dx = u - irisX;
        const dy = v - irisY;
        const d = Math.hypot(dx, dy);

        if (d < IRIS_R) {
            if (d < pupilR) {
                M = PUPIL;
                V = 0;
                return;
            }
            // A small catchlight: any bigger and the dive turns it into a
            // solid white disc sliding past.
            const gx = dx + 0.13;
            const gy = dy + 0.13;
            if (gx * gx + gy * gy < 0.0012) {
                M = GLINT;
                V = 1;
                return;
            }
            if (IRIS_R - d < 0.025) E = 1;
            const a = Math.atan2(dy, dx);
            const rr = (d - pupilR) / (IRIS_R - pupilR); // 0 at the pupil, 1 at the rim
            const fibres = 0.5 + 0.5 * Math.sin(a * 23 + Math.sin(a * 5) * 2 + rr * 3);
            let val = 0.3 + 0.45 * fibres * (0.5 + 0.5 * rr);
            val += 0.18 * Math.exp(-(((rr - 0.25) / 0.12) ** 2)); // the bright ring round the pupil
            val *= 1 - 0.55 * smoothstep(0.82, 1, rr); // the dark outer rim
            M = IRIS;
            V = val * (1 - lidShadow);
            return;
        }

        const val = 0.82 - lidShadow - 0.35 * smoothstep(0.65, 1, ax) - 0.15 * Math.exp(-fromBottom / 0.06);
        if (u < -0.8) {
            M = PINK;
            V = clamp01(val * 0.9);
            return;
        }
        M = SCLERA;
        V = Math.max(0.15, val + 0.05 * grain);
        return;
    }

    // Skin, fading out into the dark so the eye seems to surface from it.
    const fade = 1 - smoothstep(0.5, 1, Math.hypot(u / 1.85, v / 1.2));
    if (fade <= 0) {
        M = NONE;
        V = 0;
        return;
    }
    const above = top - v;
    if (open > 0 && above >= 0 && above < 0.09 + 0.04 * open) {
        M = LASH;
        V = (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(u * 60 + above * 40))) * fade;
        if (above < 0.03) E = 1;
        return;
    }
    // The fold of the upper lid stays put and flattens out as the lid drops.
    const crease = fullTop - 0.2 * (0.4 + open);
    let val = 0.38 + 0.32 * grain;
    if (ax < 1.2) val -= 0.3 * lid * Math.exp(-(((v - crease) / 0.05) ** 2));
    if (ax < 0.95 && Math.abs(v - crease) < 0.03) E = 1;
    val += 0.18 * Math.exp(-(((v + 0.95) / 0.25) ** 2)); // brow bone
    val -= 0.15 * Math.exp(-(((v - fullBottom - 0.12) / 0.1) ** 2)); // under the eye
    M = SKIN;
    V = clamp01(val) * fade;
};

// ---- Stars ------------------------------------------------------------------

// Drawn as light, not characters: a soft glow with a hot core, and on the
// brightest few a faint tapering glint, so they read as stars shining rather
// than as plus signs. Positions are in the pupil's own unit disc and spread
// with it as it grows, out to filling the screen.
const makeStars = () => {
    const rand = seeded(5);
    return Array.from({ length: 150 }, () => {
        const r = Math.sqrt(rand());
        const a = rand() * Math.PI * 2;
        const bright = rand() < 0.1;
        return {
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            bright,
            size: bright ? 22 + rand() * 12 : 3 + rand() * 5,
            phase: rand() * Math.PI * 2,
            speed: 1 + rand() * 2.5,
        };
    });
};

const starSprite = (glint) => {
    const size = 64;
    const c = makeCanvas(size, size);
    const g = c.getContext('2d');
    const mid = size / 2;
    const glow = g.createRadialGradient(mid, mid, 0, mid, mid, mid);
    glow.addColorStop(0, 'rgba(255,255,255,1)');
    glow.addColorStop(0.12, 'rgba(235,241,255,0.9)');
    glow.addColorStop(0.35, 'rgba(170,192,255,0.28)');
    glow.addColorStop(1, 'rgba(140,165,255,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, size, size);
    if (glint) {
        // Hairline rays that fade to nothing at both ends: a twinkle, not a cross.
        for (const [dx, dy] of [[1, 0], [0, 1]]) {
            const ray = g.createLinearGradient(mid - dx * mid, mid - dy * mid, mid + dx * mid, mid + dy * mid);
            ray.addColorStop(0, 'rgba(220,230,255,0)');
            ray.addColorStop(0.5, 'rgba(240,245,255,0.75)');
            ray.addColorStop(1, 'rgba(220,230,255,0)');
            g.fillStyle = ray;
            if (dx) g.fillRect(0, mid - 0.6, size, 1.2);
            else g.fillRect(mid - 0.6, 0, 1.2, size);
        }
    }
    return c;
};

// ---- Portrait particles -----------------------------------------------------

// The grid is built by scripts/make-intro-particles.py: byte 0 columns, byte 1
// rows, then one brightness byte per cell. Every non-zero cell becomes a
// particle that starts as a speck somewhere in the sky and flies to its spot.
const buildPortrait = (data, vw, vh) => {
    const rand = seeded(11);
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
            // The face forms first and the shoulders follow: delay grows with
            // distance from the face.
            const far = Math.min(1, Math.hypot(c / cols - 0.5, r / rows - 0.32) * 1.6);
            const tone = Math.round(b ** 0.8 * (PALETTE.length - 1) + (rand() - 0.5) * 1.2);
            groups[Math.max(0, Math.min(PALETTE.length - 1, tone))].push({
                sx: rand() * vw,
                sy: rand() * vh,
                tx: box.x + (c + 0.5) * cell,
                ty: box.y + (r + 0.5) * cell,
                size: cell * (0.5 + 0.38 * b),
                alpha: Math.min(1, 0.1 + b * 1.25),
                specSize: 0.8 + rand() * 0.9,
                specAlpha: 0.25 + rand() * 0.5,
                delay: far * 0.35 + rand() * 0.45,
                dur: 1 + rand() * 0.5,
                curve: (rand() - 0.5) * 120,
                phase: rand() * Math.PI * 2,
                speed: 1.5 + rand() * 3,
            });
        }
    }
    return { box, groups };
};

// ---- The scene --------------------------------------------------------------

export function createIntroScene(canvas, { width, height, dpr, still, particlesUrl }, notify) {
    const ctx = canvas.getContext('2d');
    const stars = makeStars();
    const glowSprite = starSprite(false);
    const glintSprite = starSprite(true);
    let grid = null;
    let particles = null;
    let portrait = null;

    const layout = (w, h, ratio) => {
        const r = Math.min(ratio || 1, 2);
        canvas.width = Math.round(w * r);
        canvas.height = Math.round(h * r);
        ctx.setTransform(r, 0, 0, r, 0, 0);

        // At most 150 characters across: a wide screen gets bigger characters
        // rather than more of them, which keeps a frame cheap - the cost is
        // one drawImage per cell.
        const cw = Math.max(5.4, w / 150);
        const font = cw / 0.6;
        const ch = font * 1.1;
        const atlas = makeCanvas(Math.ceil(RAMP.length * cw * r), Math.ceil(ATLAS_ROWS.length * ch * r));
        const a = atlas.getContext('2d');
        a.scale(r, r);
        a.font = `${font}px ui-monospace, "Cascadia Mono", Consolas, Menlo, monospace`;
        a.textBaseline = 'middle';
        a.textAlign = 'center';
        ATLAS_ROWS.forEach((colour, row) => {
            a.fillStyle = colour;
            for (let i = 1; i < RAMP.length; i++) a.fillText(RAMP[i], (i + 0.5) * cw, (row + 0.5) * ch);
        });

        // Eye half-width on screen: wider on a phone, where width is short.
        const s0 = Math.min(w * (w < h ? 0.48 : 0.33), h * 0.6);
        const halfDiag = Math.hypot(w, h) / 2;
        grid = {
            w, h, cw, ch, atlas, dpr: r, s0, halfDiag,
            cols: Math.ceil(w / cw),
            rows: Math.ceil(h / ch),
            // Far enough in that the widened pupil swallows the screen.
            zoom: (halfDiag * 1.1) / (PUPIL_R * (1 + DILATE) * s0),
        };
        if (particles) {
            portrait = buildPortrait(particles, w, h);
            notify('box', portrait.box);
        }
    };
    layout(width, height, dpr);

    fetch(particlesUrl)
        .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(res.status)))
        .then((buffer) => {
            particles = new Uint8Array(buffer);
            portrait = buildPortrait(particles, grid.w, grid.h);
            notify('box', portrait.box);
        })
        .catch(() => {
            // No portrait: the intro still plays, the name just stays centred.
        });

    const drawEye = (t, scale, fx, fy) => {
        const { w, h, cw, ch, cols, rows, atlas, dpr: r } = grid;
        const reveal = clamp01(t / REVEAL_MS);
        const flickerSlot = Math.floor(t / 90);
        for (let row = 0; row < rows; row++) {
            const v = fy + (row * ch + ch / 2 - h / 2) / scale;
            for (let col = 0; col < cols; col++) {
                const u = fx + (col * cw + cw / 2 - w / 2) / scale;
                shade(u, v);
                if (M < 0) continue;
                let value = V;
                if (reveal < 1) {
                    // Outline first, then the skin comes up around it.
                    const h0 = hash(col, row, 7);
                    const at = E ? 0.42 * h0 : 0.3 + 0.7 * h0;
                    value *= clamp01((reveal - at) / 0.2);
                }
                let index = Math.round(value * LAST);
                // A few cells change character every tick, so it reads as
                // live terminal output rather than a still image.
                if (hash(col, row, flickerSlot) < 0.06) index += hash(row, col, flickerSlot) < 0.5 ? -2 : 2;
                if (index < 1) continue;
                if (index > LAST) index = LAST;
                const tones = MATERIALS[M].length;
                const tone = ROW_OF[M] + Math.min(tones - 1, Math.floor(value * tones));
                ctx.drawImage(atlas, index * cw * r, tone * ch * r, cw * r, ch * r, col * cw, row * ch, cw, ch);
            }
        }
    };

    const drawStars = (t, cx, cy, radius, amount, grow) => {
        const { w, h } = grid;
        const kx = Math.min(radius * 0.95, w * 0.62);
        const ky = Math.min(radius * 0.95, h * 0.62);
        ctx.globalCompositeOperation = 'lighter';
        for (const star of stars) {
            const x = cx + star.x * kx;
            const y = cy + star.y * ky;
            if (Math.hypot(x - cx, y - cy) > radius * 0.97) continue;
            const twinkle = 0.5 + 0.5 * Math.sin((t / 1000) * star.speed + star.phase);
            const size = star.size * grow * (star.bright ? 0.85 + 0.3 * twinkle : 1);
            ctx.globalAlpha = amount * (0.35 + 0.65 * twinkle);
            ctx.drawImage(star.bright ? glintSprite : glowSprite, x - size / 2, y - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    };

    const drawPortrait = (seconds) => {
        if (!portrait) return;
        const appear = clamp01(seconds / 0.4);
        for (let k = 0; k < portrait.groups.length; k++) {
            ctx.fillStyle = PALETTE[k];
            for (const p of portrait.groups[k]) {
                const e = easeInOut(clamp01((seconds - GATHER_DELAY_S - p.delay) / p.dur));
                const bend = Math.sin(e * Math.PI) * p.curve;
                const x = p.sx + (p.tx - p.sx) * e + bend;
                const y = p.sy + (p.ty - p.sy) * e - bend * 0.4;
                const size = p.specSize + (p.size - p.specSize) * e;
                const shimmer = 0.8 + 0.2 * Math.sin(seconds * p.speed + p.phase);
                ctx.globalAlpha = appear * shimmer * (p.specAlpha + (p.alpha - p.specAlpha) * e);
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
            }
        }
        ctx.globalAlpha = 1;
    };

    // On the very first frame, while the screen is still dark, draw one of
    // each kind of mark the intro will need later - a particle square, a star
    // in additive blend - almost invisibly. The GPU sets up each new kind of
    // drawing the first time it sees it, and doing that mid-dive cost a
    // visible hitch as the portrait began.
    const warmUp = () => {
        ctx.globalAlpha = 0.004;
        ctx.fillStyle = PALETTE[0];
        ctx.fillRect(0, 0, 2, 2);
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(glowSprite, 0, 0, 4, 4);
        ctx.drawImage(glintSprite, 0, 0, 8, 8);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
    };
    let warmed = false;

    let t = 0;
    let last = null;
    let cuedPupil = false;
    let cuedFormed = false;
    let frame = null;
    let stopped = false;

    const draw = (now) => {
        if (stopped) return;
        const { w, h, s0, halfDiag, zoom } = grid;
        ctx.clearRect(0, 0, w, h);

        if (still) {
            // Reduced motion: the finished frame, once - no eye, no shimmer.
            drawStars(0, w / 2, h / 2, halfDiag * 2, 1, 1);
            drawPortrait(10);
            if (!cuedFormed) {
                cuedFormed = true;
                notify('formed');
            }
            if (!portrait) frame = nextFrame(draw); // try again once the grid is in
            return;
        }

        frame = nextFrame(draw);
        t += last === null ? 0 : Math.min(now - last, MAX_STEP_MS);
        last = now;
        if (!warmed) {
            warmed = true;
            warmUp();
        }

        lid = track(LID, t);
        irisX = 0.03 + track(GAZE_X, t);
        irisY = 0.02 + track(GAZE_Y, t);
        const dive = track(DIVE, t);
        pupilR = PUPIL_R * (1 + DILATE * dive);

        // On a log scale so the speed feels even all the way in, and the view
        // drifts over to centre on the pupil as it goes.
        const scale = s0 * zoom ** dive;
        const pull = smoothstep(0, 0.6, dive);
        const fx = irisX * pull;
        const fy = irisY * pull;
        const pcx = w / 2 + (irisX - fx) * scale;
        const pcy = h / 2 + (irisY - fy) * scale;
        const pupilPx = pupilR * scale;

        // Once the pupil covers the whole screen there is only the sky.
        if (pupilPx < halfDiag * 1.05) drawEye(t, scale, fx, fy);

        // The sky is small and far away while the pupil is: the stars grow
        // into their full size as it opens up around them.
        const starsIn = smoothstep(0.05, 0.4, dive);
        if (starsIn > 0) drawStars(t, pcx, pcy, pupilPx, starsIn, 0.35 + 0.65 * smoothstep(0.3, 1, dive));

        if (t >= PORTRAIT_AT_MS) {
            if (!cuedPupil) {
                cuedPupil = true;
                notify('pupil');
            }
            const since = t - PORTRAIT_AT_MS;
            drawPortrait(since / 1000);
            if (!cuedFormed && since >= FORMED_MS) {
                cuedFormed = true;
                notify('formed');
            }
        }
    };
    frame = nextFrame(draw);

    return {
        resize(w, h, ratio) {
            layout(w, h, ratio);
            // The still frame is only drawn once, so it has to be redrawn.
            if (still && !stopped) frame = nextFrame(draw);
        },
        // Stop drawing and leave the last frame up: the exit moves the whole
        // overlay, and a still canvas costs nothing to move.
        freeze() {
            stopped = true;
            if (frame !== null) cancelFrame(frame);
        },
    };
}
