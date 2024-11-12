import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame, Object3DNode } from "@react-three/fiber";
import SlideShaderMaterial from "./utils/SlideShaderMaterial";
import { createSlideGeometry } from "./utils/createSlideGeometry";

// Typescript Declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      slideShaderMaterial: Object3DNode<
        typeof SlideShaderMaterial,
        typeof SlideShaderMaterial
      > & {
        uMap?: THREE.Texture;
        uProgress?: number;
        uAnimationPhase?: number;
        transparent?: boolean;
        opacity: number;
        onMaxAnimationTimeCalculated?: (time: number) => void;
      };
    }
  }
}

extend({ SlideShaderMaterial });

// SlideProps interface
interface SlideProps {
  imageUrl: string;
  width: number;
  height: number;
  animationPhase: "in" | "out";
  progress: number;
  opacity: number;
  onMaxAnimationTimeCalculated?: (time: number) => void;
}

// functional slide react component
const Slide = forwardRef<THREE.Mesh, SlideProps>(
  (
    {
      imageUrl,
      width,
      height,
      animationPhase,
      progress,
      onMaxAnimationTimeCalculated,
      opacity,
    },
    ref
  ) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);

    // Texture setup
    const texture = useMemo(() => {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(imageUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }, [imageUrl]);

    const animationPhaseValue = animationPhase === "in" ? 1.0 : 0.0;

    // Geometry setup
    const geometry = useMemo(
      () =>
        createSlideGeometry(
          width,
          height,
          animationPhase,
          onMaxAnimationTimeCalculated
        ),
      [width, height, animationPhase]
    );

    // Update material properties on each frame
    useFrame(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = progress;
        materialRef.current.uniforms.uAnimationPhase.value =
          animationPhaseValue;
        materialRef.current.transparent = true; // Ensure transparency
        materialRef.current.opacity = opacity; // Update opacity value
      }
    });

    // Use effect to initialize opacity properly
    useEffect(() => {
      if (materialRef.current) {
        materialRef.current.opacity = opacity;
        materialRef.current.transparent = true; // Make sure transparency is enabled
      }
    }, [opacity]);

    return (
      <mesh ref={meshRef} geometry={geometry}>
        <slideShaderMaterial
          opacity={opacity}
          ref={materialRef}
          uMap={texture}
          uProgress={progress}
          uAnimationPhase={animationPhaseValue}
          transparent={true}
        />
      </mesh>
    );
  }
);

export default Slide;
