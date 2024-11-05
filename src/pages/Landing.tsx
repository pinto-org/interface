import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Slide from "./landing/Slide";

export default function App() {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1

  const images = [
    "src/assets/landing/tree.png",
    "src/assets/landing/tree.png",
    "src/assets/landing/rock.png",
    "src/assets/landing/gold.png",
    "src/assets/landing/pickaxe.png",
  ];

  const slideRef1 = useRef<THREE.Mesh>(null);
  const slideRef2 = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let animationFrameId;
    let startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const totalDuration = 333; //
      const adjustedDuration = totalDuration * maxAnimationTime;
      const newProgress = Math.min(elapsed / adjustedDuration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Transition complete
        setProgress(0);

        if (nextIndex < images.length - 1) {
          // More images to show
          setCurrentIndex(nextIndex);
          setNextIndex(nextIndex + 1);
          startTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Last image reached, stop animation
          setCurrentIndex(nextIndex);
          // Do not request another animation frame
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxAnimationTime, currentIndex, nextIndex]);

  // we'll need to control zooming into the pinto when we reach the last image in the array
  // I think it could be confusing to enter the application immediately afterwards? - but perhaps not
  // this is simply camera control.
  return (
    <div style={{ width: "100vw", height: "80vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 80 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace; // Ensure sRGB is used
          gl.toneMapping = THREE.NoToneMapping; // Disable tone mapping
        }}
      >
        <Slide
          ref={slideRef1}
          imageUrl={images[currentIndex]}
          width={150}
          height={150}
          animationPhase="out"
          progress={progress}
          onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
        />
        {nextIndex < images.length && (
          <Slide
            ref={slideRef2}
            imageUrl={images[nextIndex]}
            width={150}
            height={150}
            animationPhase="in"
            progress={progress}
            onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
          />
        )}
      </Canvas>
    </div>
  );
}
