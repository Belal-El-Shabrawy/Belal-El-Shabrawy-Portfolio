'use client';

import {Canvas} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import {useState, Suspense, useEffect} from "react";
import Loader from "./Loader";
import Island from "./models/Island";
import Sky from "./models/Sky";
import Bird from "./models/Bird";
import Plane from "./models/Plane";
import HomeInfo from "./HomeInfo";

// Warm the Contact page's fox model in the background while the user is
// already on Home, so /contact doesn't stall on model download+parse later.
useGLTF.preload("/3d/fox.glb");

const Home = () => {
    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [planeDirection, setPlaneDirection] = useState(1);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [pointerDirection, setPointerDirection] = useState(0);

    const adjustIslandForScreenSize = () => {
        let screenScale, screenPosition;
        screenPosition = [0, -6.5, -43];
        let rotation = [0.1, 4.7, 0];
        
        if (window.innerWidth < 768) {
            screenScale = [0.9, 0.9, 0.9];
        } else {
            screenScale = [1, 1, 1];
        }
        return {screenScale, screenPosition, rotation};
    };

    const {
        screenScale: islandScale, 
        screenPosition: islandPosition, 
        rotation: islandRotation
    } = adjustIslandForScreenSize();
      
    const adjustPlaneForScreenSize = () => {
        let screenScale, screenPosition;
        
        if (window.innerWidth < 768) {
            screenScale = [1.5, 1.5, 1.5];
            screenPosition = [0, -1.5, 0];
        } else {
            screenScale = [3, 3, 3];
            screenPosition = [0, -4, -4];
        }
        return {screenScale, screenPosition};
    };

    const {
        screenScale: planeScale, 
        screenPosition: planePosition
    } = adjustPlaneForScreenSize();

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
                    <directionalLight position={[1, 1, 1]} intensity={2}/>
                    <ambientLight intensity={0.5}/>
                    <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>

                    <Bird/>
                    <Sky isRotating={isRotating}/>
                    
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
                        rotation={[0, 2, 0]} 
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