import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Slide from "./landing/Slide";
import ParticlesBackground, {
  ParticlesBackgroundHandle,
} from "./landing/ParticlesBackground";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1
  const [theme, setTheme] = useState("default");

  const particlesBackgroundRef = useRef<ParticlesBackgroundHandle>(null);

  // Images to animate through
  const images = [
    "src/assets/landing/tree.png",
    "src/assets/landing/tree.png",
    "src/assets/landing/rock.png",
    "src/assets/landing/gold.png",
    "src/assets/landing/pickaxe.png",
    "src/assets/landing/teepee.png",
    "src/assets/landing/wheat.png",
    "src/assets/landing/cow.png",
    "src/assets/landing/abacus.png",
    "src/assets/landing/ark.png",
    "src/assets/landing/bimetal-coins.png",
    "src/assets/landing/clayledger.png",
    "src/assets/landing/aqueduct.png",
    "src/assets/landing/parthenon.png",
    "src/assets/landing/banknote.png",
    "src/assets/landing/steamengine.png",
    "src/assets/landing/lightbulb.png",
    "src/assets/landing/church.png",
    "src/assets/landing/nuke.png",
    "src/assets/landing/USD.png",
    "src/assets/landing/computer.png",
    "src/assets/landing/skyscraper.png",
    // "src/assets/landing/peace.png",
    "src/assets/landing/btcpinto.png",
  ];

  // if the image is wheat, load in themes
  useEffect(() => {
    if (images[currentIndex].includes("wheat.png") && theme !== "1") {
      particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
    }
    if (images[currentIndex].includes("bimetal-coins.png") && theme !== "2") {
      particlesBackgroundRef.current?.loadTheme("2"); // Directly load the theme
    }
    if (images[currentIndex].includes("banknote.png") && theme !== "3") {
      particlesBackgroundRef.current?.loadTheme("3"); // Directly load the theme
    }
    if (images[currentIndex].includes("nuke") && theme !== "4") {
      particlesBackgroundRef.current?.loadTheme("4"); // Directly load the theme
    }
    if (images[currentIndex].includes("skyscraper") && theme !== "5") {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
    }
  }, [currentIndex]);

  // Refs to Slides - forwardRef for Mesh (we can manipulate the mesh here if we want - not necessary)
  const slideRef1 = useRef<THREE.Mesh>(null);
  const slideRef2 = useRef<THREE.Mesh>(null);

  // UseEffect - Animation
  // This UseEffect will run every time the maxAnimationTime, currentIndex or nextIndex changes
  useEffect(() => {
    // Exit early if we've reached or surpassed the last image
    if (nextIndex >= images.length) {
      return;
    }

    let animationFrameId;
    let startTime = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const totalDuration = 400;
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
          setNextIndex(nextIndex + 1); // Increment nextIndex to exceed images.length
          // Do not request another animation frame
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxAnimationTime, currentIndex, nextIndex]);

  const navigate = useNavigate();
  const handleLaunchAppClick = () => {
    navigate("/overview");
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Main Section with Canvas and Button */}
      <div
        style={{
          width: "100vw",
          height: "80vh",
          position: "relative", // relative positioning for the container
          display: "flex",
          backgroundColor: "#FEFDF4",
        }}
      >
        {/* Memoized Particles Background */}
        <ParticlesBackground ref={particlesBackgroundRef} />

        {/* Three.js Canvas with Transparent Background */}
        <Canvas
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1, // Lower z-index to ensure the button and content are on top
          }}
          camera={{ position: [0, 0, 100] }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.NoToneMapping;
            gl.setClearColor(0x000000, 0); // Transparent background
          }}
        >
          <Slide
            ref={slideRef1}
            imageUrl={images[currentIndex]}
            width={60}
            height={60}
            animationPhase="out"
            progress={progress}
            onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
          />
          {nextIndex < images.length && (
            <Slide
              ref={slideRef2}
              imageUrl={images[nextIndex]}
              width={60}
              height={60}
              animationPhase="in"
              progress={progress}
              onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
            />
          )}
        </Canvas>

        {/* Wrapper div for button positioned at the bottom of the view */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex flex-row items-center space-x-4">
          {/* Launch Button */}
          <Button
            rounded="full"
            className="shadow-sm"
            onClick={handleLaunchAppClick}
          >
            Launch App
          </Button>
          <Button
            rounded="full"
            variant="outline-secondary"
            // className={}
            onClick={handleLaunchAppClick}
          >
            Read Blog
          </Button>
        </div>
      </div>
    </div>
  );
}
