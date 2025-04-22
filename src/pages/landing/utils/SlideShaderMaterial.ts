import { shaderMaterial } from "@react-three/drei";
import fragmentShader from "./slideFragmentShader";
import vertexShader from "./slideVertexShader";

// Shader material definition
const SlideShaderMaterial = shaderMaterial(
  {
    uProgress: 0,
    uAnimationPhase: 1.0, // 1.0 for 'in', 0.0 for 'out'
    uMap: null,
    uShouldFadeBitcoin: 0,
    uTime: 0,
    opacity: 1,
  },
  vertexShader,
  fragmentShader,
);

export default SlideShaderMaterial;
