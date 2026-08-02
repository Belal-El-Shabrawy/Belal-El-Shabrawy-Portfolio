'use client';

import { useAnimations, useGLTF } from "@react-three/drei";
import { useRef, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";

const Plane = ({ isRotating, planeDirection, ...props }) => {
    const ref = useRef();
    const { scene, animations } = useGLTF("/3d/plane.glb");
    const { actions } = useAnimations(animations, ref);

    useEffect(() => {
        if(isRotating){
            actions['Take 001'].play();
        } else {
            actions['Take 001'].stop();
        }
    }, [actions, isRotating]);

// Inside Plane.jsx
    useFrame((state, delta) => {
        const targetY = planeDirection === 1 ? 2 + Math.PI : 2;
        
        const targetZ = isRotating ? (planeDirection === 1 ? 0.2 : -0.2) : 0;

        ref.current.rotation.y += (targetY - ref.current.rotation.y) * 5 * delta;
        ref.current.rotation.z += (targetZ - ref.current.rotation.z) * 5 * delta;
    });

    return (
        <mesh {...props} ref={ref}>
            <primitive object={scene} />
        </mesh>
    );
};

export default Plane;
