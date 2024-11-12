import React, { useRef, useMemo, forwardRef, useEffect } from "react";
import * as THREE from "three";
import { extend, useFrame, Object3DNode, RootState } from "@react-three/fiber";
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
  // cameraPosition: THREE.Vector3;
  onMaxAnimationTimeCalculated?: (time: number) => void;
  shouldFadeBitcoin: boolean;
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
      shouldFadeBitcoin,
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

    // updates the material every rendered frame to animate the transition
    useFrame((state: RootState) => {
      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = progress;
        materialRef.current.uniforms.uAnimationPhase.value =
          animationPhaseValue;
      }
    });

    // effect to set the uShouldFadeBitcoin uniform if it's the last image
    useEffect(() => {
      if (
        materialRef.current &&
        materialRef.current.uniforms.uShouldFadeBitcoin
      ) {
        // Set the uShouldFadeBitcoin uniform when shouldFadeBitcoin changes
        materialRef.current.uniforms.uShouldFadeBitcoin.value =
          shouldFadeBitcoin ? 1.0 : 0.0;
      }
    }, [shouldFadeBitcoin]);

    return (
      <mesh ref={meshRef} geometry={geometry}>
        <slideShaderMaterial
          ref={materialRef}
          uMap={texture}
          uProgress={progress}
          uAnimationPhase={animationPhaseValue}
          transparent
        />
      </mesh>
    );
  }
);

export default Slide;
