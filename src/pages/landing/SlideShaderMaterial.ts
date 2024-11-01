import * as THREE from "three";
import { extend } from "@react-three/fiber";
import BaseAnimationMaterial from "./BaseAnimationMaterial";

export interface SlideShaderUniforms {
  uTime: number;
  map: THREE.Texture;
}

export interface SlideShaderProps {
  uniforms: SlideShaderUniforms;
  vertexShader: string;
  fragmentShader: string;
}

const slideShaderProps: SlideShaderProps = {
  uniforms: {
    uTime: 0,
    map: new THREE.Texture(),
  },
  vertexShader: `
    uniform float uTime;
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
      float tTime = clamp(uTime - tDelay, 0.0, tDuration);
      float tProgress = easeInOutCubic(tTime / tDuration);

      vec3 newPosition = cubicBezier(aStartPosition, aControl0, aControl1, aEndPosition, tProgress);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D map;
    varying vec2 vUv;

    void main() {
      gl_FragColor = texture2D(map, vUv);
    }
  `,
};

class SlideShaderMaterial extends BaseAnimationMaterial {
  constructor(parameters: Partial<SlideShaderProps>) {
    super(parameters, slideShaderProps);
  }
}

extend({ SlideShaderMaterial });

export default SlideShaderMaterial;
