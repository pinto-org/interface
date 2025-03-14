import { Object3DNode, extend, useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import SlideShaderMaterial from "./utils/SlideShaderMaterial";
import { createSlideGeometry } from "./utils/createSlideGeometry";

// Typescript Declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      slideShaderMaterial: Object3DNode<typeof SlideShaderMaterial, typeof SlideShaderMaterial> & {
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
  preloadedTexture: THREE.Texture;
  imageUrl: string;
  width: number;
  height: number;
  animationPhase: "in" | "out";
  progress: number;
  opacity: number;
  showPinto: boolean;
  onMaxAnimationTimeCalculated?: (time: number) => void;
}

// functional slide react component
const Slide = forwardRef<THREE.Mesh, SlideProps>(
  (
    {
      // imageObject,
      preloadedTexture,
      imageUrl,
      width,
      height,
      animationPhase,
      progress,
      opacity,
      showPinto,
      onMaxAnimationTimeCalculated,
    },
    ref,
  ) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);
    const positionRef = useRef(new THREE.Vector3(0, 0, 0));
    const targetPosition = useRef(new THREE.Vector3(-20, 0, -10));

    // Texture setup
    const texture = useMemo(() => {
      let tex: THREE.Texture;

      if (!preloadedTexture) {
        tex = new THREE.TextureLoader().load(imageUrl);
      } else {
        tex = preloadedTexture;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }, [imageUrl]);

    const animationPhaseValue = animationPhase === "in" ? 1.0 : 0.0;

    // Geometry setup
    const geometry = useMemo(
      () => createSlideGeometry(width, height, animationPhase, onMaxAnimationTimeCalculated),
      [width, height, animationPhase],
    );

    // Update material properties on each frame
    useFrame(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = progress;
        materialRef.current.uniforms.uAnimationPhase.value = animationPhaseValue;
        materialRef.current.transparent = true; // Ensure transparency
        materialRef.current.opacity = opacity; // Update opacity value
      }
      if (showPinto) {
        meshRef.current?.position.lerp(targetPosition.current, 0.1);
      } else {
        meshRef.current?.position.lerp(positionRef.current, 0.1);
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
      <mesh ref={meshRef} geometry={geometry} position={positionRef.current}>
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
  },
);

export default Slide;
