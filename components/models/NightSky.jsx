'use client';

import { Stars } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, CanvasTexture } from 'three';

// The night sky is generated rather than loaded. drei builds the starfield as a
// single points mesh at runtime, so it costs a few KB of JS instead of another
// .glb alongside sky.glb — and it can't get out of sync with the theme the way
// a baked texture would.
//
// The moon sits inside the same rotating group as the stars, so the whole sky
// turns together when the island is dragged, exactly as the daytime sky does.
// It is placed up and to the right to agree with the directional light in
// Home.jsx, which comes from [1, 1, 1] — so the lit side of the island faces
// the moon instead of contradicting it.
const MOON_POSITION = [60, 40, -70];

// A glow needs a radial falloff. A sphere with a flat material just renders as
// a hard-edged disc, so the halo is a camera-facing sprite with a gradient
// painted once into a canvas at mount.
const useGlowTexture = () => {
    const texture = useMemo(() => {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        const half = size / 2;
        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0, 'rgba(198, 218, 255, 0.55)');
        gradient.addColorStop(0.3, 'rgba(150, 180, 240, 0.16)');
        gradient.addColorStop(1, 'rgba(120, 150, 220, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return new CanvasTexture(canvas);
    }, []);

    // The component unmounts every time the theme flips, so release the GPU
    // texture rather than leaking one per toggle.
    useEffect(() => () => texture.dispose(), [texture]);

    return texture;
};

const NightSky = ({ isRotating }) => {
    const group = useRef();
    const glow = useGlowTexture();

    useFrame((_, delta) => {
        if (!group.current) return;
        // Matches the daytime sky's drag speed, but keeps a slow drift when
        // the island is at rest so the sky doesn't look frozen.
        group.current.rotation.y += (isRotating ? 0.2 : 0.006) * delta;
    });

    return (
        <group ref={group}>
            <Stars
                radius={120}
                depth={60}
                count={6000}
                factor={5}
                saturation={0}
                fade
                speed={0.8}
            />

            <group position={MOON_POSITION}>
                {/* Unlit on purpose — the moon is the light source here, so it
                    shouldn't darken along with everything the light falls on. */}
                <mesh>
                    <sphereGeometry args={[4, 48, 48]} />
                    <meshBasicMaterial color="#f4f1e4" toneMapped={false} />
                </mesh>

                <sprite scale={[22, 22, 1]}>
                    <spriteMaterial
                        map={glow}
                        blending={AdditiveBlending}
                        depthWrite={false}
                        transparent
                        toneMapped={false}
                    />
                </sprite>
            </group>
        </group>
    );
};

export default NightSky;
