import { a } from "@react-spring/three";
import { useEffect, useRef, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import islandScene from "../../assets/3d/island.glb";

const Island = ({ isRotating, setIsRotating, setCurrentStage,setPlaneDirection, ...props }) => {
    const islandRef = useRef();
    const { nodes, materials } = useGLTF(islandScene);

    const rotationSpeed = useRef(0);
    
    const rotationDirection = useRef(0); 
    
    const dampingFactor = 0.95;

    const handlePointerDown = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsRotating(true);

        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        
        if (clientX > window.innerWidth / 2) {
            rotationDirection.current = -1;
            setPlaneDirection(-1);         
        } else {
            rotationDirection.current = 1; 
            setPlaneDirection(1);          
        }
    }, [setIsRotating, setPlaneDirection]);

    const handlePointerUp = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsRotating(false);
        rotationDirection.current = 0;
    }, [setIsRotating]);


    const handleKeyDown = useCallback((event) => {
        if (event.key === "ArrowLeft") {
            if (!isRotating) setIsRotating(true);
            islandRef.current.rotation.y += 0.01 * Math.PI;
            rotationSpeed.current = 0.0125;
            setPlaneDirection(1);
        } else if (event.key === "ArrowRight") {
            if (!isRotating) setIsRotating(true);
            islandRef.current.rotation.y -= 0.01 * Math.PI;
            rotationSpeed.current = -0.0125;
            setPlaneDirection(-1);
        }
    }, [isRotating, setIsRotating, setPlaneDirection]);

    const handleKeyUp = useCallback((event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            setIsRotating(false);
        }
    }, [setIsRotating]);

    useFrame(() => {
        if (!islandRef.current) return;

        if (isRotating && rotationDirection.current !== 0) {
            const continuousSpeed = 0.004 * Math.PI; 
            islandRef.current.rotation.y += rotationDirection.current * continuousSpeed;
            rotationSpeed.current = rotationDirection.current * continuousSpeed; 
        }

        if (!isRotating) {
            rotationSpeed.current *= dampingFactor;

            if (Math.abs(rotationSpeed.current) < 0.001) {
                rotationSpeed.current = 0;
            }
            islandRef.current.rotation.y += rotationSpeed.current;
        } else {
            const rotation = islandRef.current.rotation.y;
            const normalizedRotation = ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

            switch (true) {
                case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
                    setCurrentStage(4);
                    break;
                case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
                    setCurrentStage(3);
                    break;
                case normalizedRotation >= 2.2 && normalizedRotation <= 2.8:
                    setCurrentStage(2);
                    break;
                case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
                    setCurrentStage(1);
                    break;
                default:
                    setCurrentStage(null);
            }
        }
    });

    useEffect(() => {
        // We removed handlePointerMove from the event listeners
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("pointerup", handlePointerUp);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handlePointerDown, handlePointerUp, handleKeyDown, handleKeyUp]);

    return (
        <a.group ref={islandRef} {...props}>
            <mesh geometry={nodes.polySurface944_tree_body_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.polySurface945_tree1_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.polySurface946_tree2_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.polySurface947_tree1_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.polySurface948_tree_body_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.polySurface949_tree_body_0.geometry} material={materials.PaletteMaterial001} />
            <mesh geometry={nodes.pCube11_rocks1_0.geometry} material={materials.PaletteMaterial001} />
        </a.group>
    );
};

export default Island;