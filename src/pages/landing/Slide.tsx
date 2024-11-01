import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { extend, useFrame, Object3DNode } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

// Shader material definition
interface SlideShaderMaterialUniforms {
  uProgress: { value: number };
  uAnimationPhase: { value: number };
  uMap: { value: THREE.Texture | null };
}

const SlideShaderMaterial = shaderMaterial(
  {
    uProgress: 0,
    uAnimationPhase: 1.0, // 1.0 for 'in', 0.0 for 'out'
    uMap: null,
  },
  // vertex shader
  `
    uniform float uProgress;
    uniform float uAnimationPhase;
    attribute vec2 aAnimation;
    attribute vec3 aStartPosition;
    attribute vec3 aControl0;
    attribute vec3 aControl1;
    attribute vec3 aEndPosition;
    varying vec2 vUv;

    vec3 cubicBezier(vec3 p0, vec3 c0, vec3 c1, vec3 p1, float t) {
      float tn = 1.0 - t;
      return tn * tn * tn * p0 + 3.0 * tn * tn * t * c0 + 3.0 * tn * t * t * c1 + t * t * t * p1;
    }

    float easeInOutCubic(float t) {
      return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    }

    void main() {
      vUv = uv;

      float tDelay = aAnimation.x;
      float tDuration = aAnimation.y;
      float tTime = clamp(uProgress - tDelay, 0.0, tDuration);
      float tProgress = tTime / tDuration;
      tProgress = easeInOutCubic(tProgress);

      vec3 newPosition = position;

      if (uAnimationPhase == 1.0) {
        newPosition *= tProgress;
      } else {
        newPosition *= (1.0 - tProgress);
      }

      newPosition += cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // fragment shader
  `
    uniform sampler2D uMap;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(uMap, vUv);
      gl_FragColor = texColor;
    }
  `
);

// Extend so that the material is recognized
extend({ SlideShaderMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      slideShaderMaterial: Object3DNode<
        THREE.ShaderMaterial & {
          uniforms: SlideShaderMaterialUniforms & {
            uMap: { value: THREE.Texture | null };
          };
        },
        typeof SlideShaderMaterial
      >;
    }
  }
}

interface SlideProps {
  imageUrl: string;
  width: number;
  height: number;
  animationPhase: "in" | "out";
  progress: number;
}

const Slide = forwardRef<THREE.Mesh, SlideProps>(
  ({ imageUrl, width, height, animationPhase, progress }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<any>(null);

    useImperativeHandle(ref, () => meshRef.current as THREE.Mesh, []);

    // Texture setup
    const texture = useMemo(() => {
      const loader = new THREE.TextureLoader();
      const tex = loader.load(imageUrl);
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      return tex;
    }, [imageUrl]);

    const animationPhaseValue = animationPhase === "in" ? 1.0 : 0.0;

    // Geometry setup
    const geometry = useMemo(() => {
      const plane = new THREE.PlaneGeometry(
        width,
        height,
        width * 2,
        height * 2
      );

      // Convert to non-indexed geometry
      const nonIndexedPlane = plane.toNonIndexed();

      const positionAttribute = nonIndexedPlane.attributes.position;
      const positions = positionAttribute.array as Float32Array;
      const vertexCount = positionAttribute.count;
      const faceCount = vertexCount / 3;

      const aAnimation = new Float32Array(vertexCount * 2);
      const aStartPosition = new Float32Array(vertexCount * 3);
      const aControl0 = new Float32Array(vertexCount * 3);
      const aControl1 = new Float32Array(vertexCount * 3);
      const aEndPosition = new Float32Array(vertexCount * 3);

      const minDuration = 0.8;
      const maxDuration = 1.2;
      const maxDelayX = 0.9;
      const maxDelayY = 0.125;
      const stretch = 0.11;

      const startPosition = new THREE.Vector3();
      const control0 = new THREE.Vector3();
      const control1 = new THREE.Vector3();
      const endPosition = new THREE.Vector3();

      // Adjust positions by subtracting centroid
      for (let f = 0; f < faceCount; f++) {
        const faceOffset = f * 3;
        const a = new THREE.Vector3(
          positions[(faceOffset + 0) * 3],
          positions[(faceOffset + 0) * 3 + 1],
          positions[(faceOffset + 0) * 3 + 2]
        );
        const b = new THREE.Vector3(
          positions[(faceOffset + 1) * 3],
          positions[(faceOffset + 1) * 3 + 1],
          positions[(faceOffset + 1) * 3 + 2]
        );
        const c = new THREE.Vector3(
          positions[(faceOffset + 2) * 3],
          positions[(faceOffset + 2) * 3 + 1],
          positions[(faceOffset + 2) * 3 + 2]
        );
        const centroid = new THREE.Vector3()
          .add(a)
          .add(b)
          .add(c)
          .divideScalar(3);

        // Adjust positions to be centered around the centroid
        for (let v = 0; v < 3; v++) {
          positions[(faceOffset + v) * 3] -= centroid.x;
          positions[(faceOffset + v) * 3 + 1] -= centroid.y;
          positions[(faceOffset + v) * 3 + 2] -= centroid.z;
        }

        // Animation timings
        const duration = THREE.MathUtils.randFloat(minDuration, maxDuration);
        const delayX = THREE.MathUtils.mapLinear(
          centroid.x,
          -width * 0.5,
          width * 0.5,
          0.0,
          maxDelayX
        );
        const delayY =
          animationPhase === "in"
            ? THREE.MathUtils.mapLinear(
                Math.abs(centroid.y),
                0,
                height * 0.5,
                0.0,
                maxDelayY
              )
            : THREE.MathUtils.mapLinear(
                Math.abs(centroid.y),
                0,
                height * 0.5,
                maxDelayY,
                0.0
              );

        for (let v = 0; v < 3; v++) {
          const vIndex = faceOffset + v;
          aAnimation[vIndex * 2] =
            delayX + delayY + Math.random() * stretch * duration;
          aAnimation[vIndex * 2 + 1] = duration;
        }

        // Positions
        endPosition.copy(centroid);
        startPosition.copy(centroid);

        if (animationPhase === "in") {
          control0.copy(centroid).sub(getControlPoint0(centroid));
          control1.copy(centroid).sub(getControlPoint1(centroid));
        } else {
          control0.copy(centroid).add(getControlPoint0(centroid));
          control1.copy(centroid).add(getControlPoint1(centroid));
        }

        for (let v = 0; v < 3; v++) {
          const vIndex = faceOffset + v;
          aStartPosition.set(
            [startPosition.x, startPosition.y, startPosition.z],
            vIndex * 3
          );
          aControl0.set([control0.x, control0.y, control0.z], vIndex * 3);
          aControl1.set([control1.x, control1.y, control1.z], vIndex * 3);
          aEndPosition.set(
            [endPosition.x, endPosition.y, endPosition.z],
            vIndex * 3
          );
        }
      }

      positionAttribute.needsUpdate = true;

      nonIndexedPlane.setAttribute(
        "aAnimation",
        new THREE.BufferAttribute(aAnimation, 2)
      );
      nonIndexedPlane.setAttribute(
        "aStartPosition",
        new THREE.BufferAttribute(aStartPosition, 3)
      );
      nonIndexedPlane.setAttribute(
        "aControl0",
        new THREE.BufferAttribute(aControl0, 3)
      );
      nonIndexedPlane.setAttribute(
        "aControl1",
        new THREE.BufferAttribute(aControl1, 3)
      );
      nonIndexedPlane.setAttribute(
        "aEndPosition",
        new THREE.BufferAttribute(aEndPosition, 3)
      );

      return nonIndexedPlane;
    }, [width, height, animationPhase]);

    useFrame(() => {
      if (materialRef.current) {
        materialRef.current.uniforms.uProgress.value = progress;
        materialRef.current.uniforms.uAnimationPhase.value =
          animationPhaseValue;
      }
    });

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

function getControlPoint0(centroid: THREE.Vector3) {
  const signY = Math.sign(centroid.y);
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(0.1, 0.3) * 50,
    signY * THREE.MathUtils.randFloat(0.1, 0.3) * 70,
    THREE.MathUtils.randFloatSpread(20)
  );
}

function getControlPoint1(centroid: THREE.Vector3) {
  const signY = Math.sign(centroid.y);
  return new THREE.Vector3(
    THREE.MathUtils.randFloat(0.3, 0.6) * 50,
    -signY * THREE.MathUtils.randFloat(0.3, 0.6) * 70,
    THREE.MathUtils.randFloatSpread(20)
  );
}

export default Slide;
