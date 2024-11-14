import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import Slide from "../landing/Slide";
import { landingImages } from "../Landing";


interface UseAnimationFrameProps {
  nextIndex: number;
  currentIndex: number;
  cachedImages: HTMLImageElement[];
  ready: boolean;
  animationTimer: number;
  maxAnimationTime: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setNextIndex: React.Dispatch<React.SetStateAction<number>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface SlideGroupProps extends Omit<UseAnimationFrameProps, "setProgress"> {
  opacity: number;
  setMaxAnimationTime: React.Dispatch<React.SetStateAction<number>>;
}

const useAnimationFrame = ({
  nextIndex,
  currentIndex,
  cachedImages,
  ready,
  animationTimer,
  maxAnimationTime,
  setCurrentIndex,
  setNextIndex,
  setProgress,
}: UseAnimationFrameProps) => {
  //  EFFECT TO CONTROL ANIMATION PROGRESSION
  
  useEffect(() => {
    if (!ready) return;
    // Exit early if we've reached or surpassed the last image
    if (nextIndex >= cachedImages.length) {
      return;
    }

    let animationFrameId;
    let startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const totalDuration = animationTimer;
      const adjustedDuration = totalDuration * maxAnimationTime;
      const newProgress = elapsed / adjustedDuration;
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Transition complete
        setProgress(0);

        if (nextIndex < cachedImages.length - 1) {
          // More images to show
          setCurrentIndex(nextIndex);
          setNextIndex(nextIndex + 1);
          startTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Last image reached, stop animation
          setCurrentIndex(nextIndex);
          setNextIndex(nextIndex + 1); // Increment nextIndex to exceed images.length
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxAnimationTime, currentIndex, nextIndex, ready]);
};

const SlideGroup = ({
  cachedImages,
  nextIndex,
  currentIndex,
  opacity,
  ready,
  animationTimer,
  maxAnimationTime,
  setMaxAnimationTime,
  setNextIndex,
  setCurrentIndex,
}: SlideGroupProps) => {
  // Progress
  const [progress, setProgress] = useState(0);
  // SLIDE REFS
  const slideRef1 = useRef<THREE.Mesh>(null);
  const slideRef2 = useRef<THREE.Mesh>(null);
  const slidesGroupRef = useRef<THREE.Group>(null); // Reference to the group

  useAnimationFrame({
    ready,
    nextIndex,
    currentIndex,
    cachedImages,
    animationTimer,
    maxAnimationTime,
    setCurrentIndex,
    setNextIndex,
    setProgress,
  });

  // useEffect(() => {
  //   if (cachedImages) {
  //     const TreeImage = new Image();
  //     TreeImage.src = "tree.png";
  //     console.log("Loading images...");      
  //   } else {
  //     console.log("Images loaded!");
  //   }
  // }, [cachedImages]);

  return (
    <group ref={slidesGroupRef}>
      <Slide
        ref={slideRef1}
        imageObject={cachedImages[currentIndex]}
        imageUrl={landingImages[currentIndex]}
        width={60}
        height={60}
        animationPhase="out"
        progress={progress}
        opacity={opacity} // Pass opacity down
        onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
      />
      {nextIndex < cachedImages.length && (
        <Slide
          ref={slideRef2}
          imageObject={cachedImages[nextIndex]}
          width={60}
          height={60}
          animationPhase="in"
          progress={progress}
          opacity={opacity} // Pass opacity down
          onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
        />
      )}
    </group>
  );
};

export default SlideGroup;