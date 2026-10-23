'use client';

import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {useGLTF, useProgress} from "@react-three/drei";
import {useState, Suspense, useMemo, useEffect, useRef, useCallback} from "react";
import Loader from "./Loader";
import Island from "./models/Island";
import Sky from "./models/Sky";
import NightSky from "./models/NightSky";
import Bird from "./models/Bird";
import Plane from "./models/Plane";
import HomeInfo from "./HomeInfo";
import { useIsDark } from "../hooks/useIsDark";
import { useViewport } from "../hooks/useViewport";
import { reportSceneLoad, useSceneLoad } from "../hooks/useSceneLoad";

// Warm the Contact page's fox model while the user is already on Home, so
// /contact doesn't stall on model download+parse later. Only worth doing where
// bandwidth is cheap: on a phone it is 97 KB spent on a page they may never
// open, competing with the models this page actually needs right now.
if (typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    useGLTF.preload("/3d/fox.glb");
}

// The intro overlay (components/IslandIntro.jsx) holds until the island is
// really there. Its own component because useProgress re-renders on every
// file that arrives, and re-rendering Home re-renders the whole Canvas.
const LoadProgress = () => {
    const { progress } = useProgress();
    useEffect(() => {
        reportSceneLoad({ progress });
    }, [progress]);
    return null;
};

// Sits in the same Suspense as the models, so it only mounts once every one of
// them has loaded; useFrame means it only runs once the canvas is drawing.
// Its first frame draws everything, in view or not: it compiles every
// material, uploads every texture, and switches off frustum culling for that
// one frame, so even the plane and bird the intro's raised camera cannot see
// yet send their geometry to the GPU. Left alone, all of that happens
// mid-exit, the moment they swing into view, and the tilt down to the island
// stutters. A couple of frames later the island has really been drawn, which
// is what the intro waits for.
const SceneReady = () => {
    const frames = useRef(0);
    const unculled = useRef([]);
    useFrame(({ gl, scene, camera }) => {
        frames.current += 1;
        if (frames.current === 1) {
            scene.traverse((object) => {
                if (object.frustumCulled) {
                    object.frustumCulled = false;
                    unculled.current.push(object);
                }
                for (const material of [].concat(object.material || [])) {
                    for (const value of Object.values(material)) {
                        if (value && value.isTexture) gl.initTexture(value);
                    }
                }
            });
            // Already compiled by Warmup when the intro ran; otherwise this
            // is the one place it happens.
            gl.compile(scene, camera);
        } else if (frames.current === 2) {
            for (const object of unculled.current) object.frustumCulled = true;
            unculled.current = [];
        } else if (frames.current === 4) {
            reportSceneLoad({ ready: true });
        }
    });
    useEffect(() => () => reportSceneLoad({ ready: false }), []);
    return null;
};

// When the intro lets the island go, its shaders are compiled with
// compileAsync before anything is drawn: the GPU driver builds them in the
// background, where plain compile() - or simply drawing - makes the page wait
// for each one in turn, a freeze of most of a second. Home keeps the canvas
// from drawing until this reports back.
const Warmup = ({ enabled, onWarm }) => {
    const get = useThree((state) => state.get);
    useEffect(() => {
        if (!enabled) return;
        let cancelled = false;
        const finish = () => {
            if (!cancelled) onWarm();
        };
        const { gl, scene, camera } = get();
        gl.compileAsync(scene, camera).catch(() => {}).then(finish);
        // Never left waiting on a driver that does not report back.
        const fallback = setTimeout(finish, 3000);
        return () => {
            cancelled = true;
            clearTimeout(fallback);
        };
    }, [enabled, get, onWarm]);
    return null;
};

// While the intro covers the page the camera looks up into the sky, and as the
// intro tilts away it pitches down onto the island, so the visitor lands on it
// rather than having it uncovered. This is done on the camera, not with a CSS
// transform on the page: R3F sizes the canvas from getBoundingClientRect, which
// a transform skews, and nothing re-measures once the transform is gone - the
// island was left rendering off-centre in an oversized canvas.
const INTRO_PITCH = 0.6; // radians: the island sits just below the frame
const INTRO_TILT_S = 1.2; // matches EXIT_MS in IslandIntro.jsx
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const IntroCamera = () => {
    const phase = useRef("idle"); // idle → up → tilting → done
    const since = useRef(0);

    useFrame(({ clock, camera }) => {
        if (phase.current === "done") return;
        const { introStarted, intro } = document.documentElement.dataset;

        if (phase.current !== "tilting") {
            if (introStarted && !intro &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                phase.current = "up";
                camera.rotation.x = INTRO_PITCH;
                return;
            }
            if (phase.current === "up" && intro) {
                phase.current = "tilting";
                since.current = clock.elapsedTime;
            } else {
                // No intro this visit, or it was skipped before the island
                // had even drawn: nothing to tilt.
                phase.current = "done";
                camera.rotation.x = 0;
                return;
            }
        }

        const t = Math.min(1, (clock.elapsedTime - since.current) / INTRO_TILT_S);
        camera.rotation.x = INTRO_PITCH * (1 - easeInOutCubic(t));
        if (t === 1) phase.current = "done";
    });

    return null;
};

const Home = () => {
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [planeDirection, setPlaneDirection] = useState(1);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [pointerDirection, setPointerDirection] = useState(0);

    // The island also turns with the arrow keys, which never reaches the
    // pointer handler below. Both paths set isRotating, so deriving from it
    // covers every way in - mouse, touch and keyboard. Adjusting state during
    // render like this is the supported pattern; an effect would trip
    // react-hooks/set-state-in-effect and cost an extra frame.
    if (isRotating && !hasInteracted) {
        setHasInteracted(true);
    }

    const isDark = useIsDark();
    // Held back while the intro is mid-animation; see hooks/useSceneLoad.js.
    const { held } = useSceneLoad();
    // Once an intro has held the island, it also waits for Warmup before its
    // first draw. Without an intro it draws straight away, as it always has.
    const [introRan, setIntroRan] = useState(false);
    const [warm, setWarm] = useState(false);
    if (held && !introRan) {
        setIntroRan(true);
    }
    const onWarm = useCallback(() => setWarm(true), []);
    const { aspect } = useViewport();

    // three.js `fov` is vertical, so a tall narrow screen has a *much* smaller
    // horizontal field of view. The island is wide and flat, so on a phone it
    // used to run off both edges. Sizing off the aspect ratio keeps the whole
    // island in frame at any shape of screen, instead of a mobile/desktop flag
    // that only has two answers.
    //
    // 1.5 is roughly the aspect a laptop gives, where scale 1 framed well; the
    // floor stops the island shrinking to a speck on very tall viewports.
    // The floor is deliberately past the point where the island fits edge to
    // edge: on a phone it overhangs by roughly a tenth of the screen on each
    // side, which reads far better than a fully-contained miniature. Only the
    // outer rim is lost, never the house.
    const fit = useMemo(
        () => Math.min(1, Math.max(0.62, aspect / 1.5)),
        [aspect]
    );

    // 0 on the narrowest screens, 1 once there is desktop room. The plane is
    // interpolated across it so both ends land exactly on the values this
    // scene was originally tuned to.
    const t = useMemo(() => (fit - 0.62) / (1 - 0.62), [fit]);

    const islandScale = useMemo(() => [fit, fit, fit], [fit]);
    // Drop the island a little as it shrinks, so it sits in the middle of a
    // tall screen instead of riding up with a dead band underneath.
    const islandPosition = useMemo(() => [0, -6.5 * fit, -43], [fit]);
    const islandRotation = useMemo(() => [0.1, 4.7, 0], []);

    const planeScale = useMemo(() => {
        const p = 1.5 + 1.5 * t;
        return [p, p, p];
    }, [t]);
    const planePosition = useMemo(() => [0, -1.5 - 2.5 * t, -4 * t], [t]);
    const planeRotation = useMemo(() => [0, 2, 0], []);

    // The hero is a Server Component sitting above this canvas, so it cannot be
    // passed `hasInteracted`. CSS in globals.css fades it out off this flag.
    useEffect(() => {
        const root = document.documentElement;
        root.dataset.exploring = hasInteracted ? "true" : "false";
        return () => { delete root.dataset.exploring; };
    }, [hasInteracted]);

    return (
        <div className="absolute inset-0">
            {/* Only once they have started exploring: before that the static
                hero in app/page.jsx occupies this spot, and stacking both would
                put two cards on top of each other. */}
            {hasInteracted && currentStage && <HomeInfo currentStage={currentStage} />}
            <LoadProgress />
            <Canvas
                className={`w-full h-full bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`} 
                onPointerDown={(e) => {
                    setIsRotating(true);
                    const clientX = e.nativeEvent?.touches
                        ? e.nativeEvent.touches[0].clientX
                        : e.clientX;
                    const direction = clientX > window.innerWidth / 2 ? -1 : 1;
                    setPointerDirection(direction);
                    setPlaneDirection(direction);
                }} 
                onPointerUp={() => {
                    setIsRotating(false);
                    setPointerDirection(0);
                }}
                camera={{near: 0.1, far: 1000}}
                frameloop={held || (introRan && !warm) ? "never" : "always"}
            >
                {/* Outside the Suspense so it holds the camera up from the
                    very first frame, while the models are still loading. */}
                <IntroCamera />
                <Suspense fallback={<Loader />}>
                    {/* Moonlight at night: the same rig, turned down, so the
                        island reads as lit from a cold sky rather than the sun. */}
                    <directionalLight position={[1, 1, 1]} intensity={isDark ? 0.7 : 2}/>
                    <ambientLight intensity={isDark ? 0.22 : 0.5}/>
                    <hemisphereLight
                        skyColor={isDark ? "#2b3c63" : "#b1e1ff"}
                        groundColor="#000000"
                        intensity={isDark ? 0.45 : 1}
                    />

                    {/* Kept, but rebuilt: 1,409 KB -> 437 KB. See the note in
                        scratchpad/optimize_bird.py - the flap keyframes are
                        untouched, the waste was constant channels, 264 copies
                        of 2 timelines, and PNGs that had no transparency. */}
                    <Bird/>
                    {isDark ? <NightSky isRotating={isRotating}/> : <Sky isRotating={isRotating}/>}
                    
                    <Island 
                        position={islandPosition} 
                        scale={islandScale} 
                        rotation={islandRotation}
                        isRotating={isRotating}
                        setIsRotating={setIsRotating}
                        setCurrentStage={setCurrentStage}
                        setPlaneDirection={setPlaneDirection}
                        pointerDirection={pointerDirection}
                    />
                    
                    <Plane 
                        position={planePosition} 
                        scale={planeScale} 
                        isRotating={isRotating}
                        rotation={planeRotation} 
                        planeDirection={planeDirection}
                    />
                    <Warmup enabled={introRan && !held && !warm} onWarm={onWarm} />
                    <SceneReady />
                </Suspense>
            </Canvas>
            {!hasInteracted && (
                <div className="absolute right-5 lg:right-10 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10 pointer-events-none animate-pulse">
                    <p className="bg-black/30 text-white font-semibold px-4 py-2 rounded-2xl backdrop-blur-sm hidden sm:block text-sm">
                        Press to explore
                    </p>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex justify-center items-center shadow-lg border border-white/30">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;