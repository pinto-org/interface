import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Slide from "./landing/Slide";
import SlideProgressSlider from "./landing/SlideProgressSlider";

export default function App() {
  const [progress, setProgress] = useState(0);
  const slideRef1 = useRef<THREE.Mesh>(null);
  const slideRef2 = useRef<THREE.Mesh>(null);

  const handleProgressChange = (value: number) => {
    setProgress(value);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 100], fov: 80 }}>
        <Slide
          ref={slideRef1}
          imageUrl="src/assets/landing/tree.png"
          width={100}
          height={100}
          animationPhase="out"
          progress={progress}
        />
        <Slide
          ref={slideRef2}
          imageUrl="src/assets/landing/rock.png"
          width={100}
          height={100}
          animationPhase="in"
          progress={progress}
        />
      </Canvas>
      <SlideProgressSlider
        progress={progress}
        onChange={handleProgressChange}
      />
    </div>
  );
}
