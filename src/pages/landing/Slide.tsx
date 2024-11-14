import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame, Object3DNode } from "@react-three/fiber";
import SlideShaderMaterial from "./utils/SlideShaderMaterial";
import { createSlideGeometry } from "./utils/createSlideGeometry";
import { landingImages } from "../Landing";

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
  imageObject: HTMLImageElement;
  imageUrl?: string;
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
      imageObject,
      imageUrl,
      width,
      height,
      animationPhase,
      progress,
      opacity,
      onMaxAnimationTimeCalculated,
    },
    ref
  ) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);

    // Texture setup
    const texture = useMemo(() => {
      const isFirst = imageUrl && imageUrl === landingImages[0];
      // const tex = isFirst
      let tex: THREE.Texture;

      if (imageUrl && imageUrl === landingImages[0]) {
        tex = new THREE.TextureLoader().load(imageUrl);
      } else {
        tex = new THREE.Texture(imageObject);
        tex.needsUpdate = true;
      }

      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }, [imageObject]);

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

    useEffect(() => {
      if (meshRef.current) {
        meshRef.current.layers.set(1); // Set the mesh to layer 1
      }
    }, []);

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
