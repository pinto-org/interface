import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { landingImages } from "../Landing";
import Slide from "../landing/Slide";

interface UseAnimationFrameProps {
  nextIndex: number;
  currentIndex: number;
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
  animationTimer,
  maxAnimationTime,
  setCurrentIndex,
  setNextIndex,
  setProgress,
}: UseAnimationFrameProps) => {
  //  EFFECT TO CONTROL ANIMATION PROGRESSION

  useEffect(() => {
    // Exit early if we've reached or surpassed the last image
    if (nextIndex >= landingImages.length) {
      return;
    }

    let animationFrameId: number;
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

        if (nextIndex < landingImages.length - 1) {
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
  }, [maxAnimationTime, currentIndex, nextIndex]);
};

const SlideGroup = ({
  // cachedImages,
  nextIndex,
  currentIndex,
  opacity,
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
    nextIndex,
    currentIndex,
    animationTimer,
    maxAnimationTime,
    setCurrentIndex,
    setNextIndex,
    setProgress,
  });

  return (
    <group ref={slidesGroupRef}>
      <Slide
        ref={slideRef1}
        imageUrl={landingImages[currentIndex]}
        width={60}
        height={60}
        animationPhase="out"
        progress={progress}
        opacity={opacity} // Pass opacity down
        onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
      />
      {nextIndex < landingImages.length && (
        <Slide
          ref={slideRef2}
          imageUrl={landingImages[nextIndex]}
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
