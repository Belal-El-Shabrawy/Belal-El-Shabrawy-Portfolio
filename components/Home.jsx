'use client';

import {Canvas} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import {useState, Suspense, useEffect, useMemo} from "react";
import Loader from "./Loader";
import Island from "./models/Island";
import Sky from "./models/Sky";
import NightSky from "./models/NightSky";
import Bird from "./models/Bird";
import Plane from "./models/Plane";
import HomeInfo from "./HomeInfo";
import { useIsDark } from "../hooks/useIsDark";

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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Sizes used to be read straight off window.innerWidth during render,
        // so the scene never reacted to a resize or a phone rotating.
        const query = window.matchMedia("(max-width: 767px)");
        const sync = (e) => setIsMobile(e.matches);
        sync(query);
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);

    // Memoised so Island and Plane don't get fresh array props every render.
    const islandPosition = useMemo(() => [0, -6.5, -43], []);
    const islandRotation = useMemo(() => [0.1, 4.7, 0], []);
    const islandScale = useMemo(() => (isMobile ? [0.9, 0.9, 0.9] : [1, 1, 1]), [isMobile]);
    const planeScale = useMemo(() => (isMobile ? [1.5, 1.5, 1.5] : [3, 3, 3]), [isMobile]);
    const planePosition = useMemo(() => (isMobile ? [0, -1.5, 0] : [0, -4, -4]), [isMobile]);
    const planeRotation = useMemo(() => [0, 2, 0], []);

    return (
        <section className="w-full h-screen relative">
            {<div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
                {currentStage && <HomeInfo currentStage={currentStage} />}
            </div>}
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