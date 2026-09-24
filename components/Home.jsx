'use client';

import {Canvas} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import {useState, Suspense, useMemo} from "react";
import Loader from "./Loader";
import Island from "./models/Island";
import Sky from "./models/Sky";
import NightSky from "./models/NightSky";
import Bird from "./models/Bird";
import Plane from "./models/Plane";
import HomeInfo from "./HomeInfo";
import { useIsDark } from "../hooks/useIsDark";
import { useViewport } from "../hooks/useViewport";

// Warm the Contact page's fox model in the background while the user is
// already on Home, so /contact doesn't stall on model download+parse later.
useGLTF.preload("/3d/fox.glb");

const Home = () => {
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [planeDirection, setPlaneDirection] = useState(1);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [pointerDirection, setPointerDirection] = useState(0);

    const isDark = useIsDark();
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

    return (
        <section className="w-full h-screen-safe overflow-hidden relative">
            {/* HomeInfo positions itself; a second absolute wrapper here just
                added its top offset on top of HomeInfo's own. */}
            {currentStage && <HomeInfo currentStage={currentStage} />}
            <Canvas 
                className={`w-full h-full bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`} 
                onPointerDown={(e) => {
                    setIsRotating(true);
                    setHasInteracted(true);
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
            >
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
        </section>
    );
}

export default Home;