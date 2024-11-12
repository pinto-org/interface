import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Slide from "./landing/Slide";
import ParticlesBackground, {
  ParticlesBackgroundHandle,
} from "./landing/utils/ParticlesBackground";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import CoinModel from "./landing/utils/CoinModel";
import EnvironmentSetup from "./landing/utils/EnvironmentSetup";

export default function Landing() {
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1
  const [theme, setTheme] = useState("default");
  const [animationTimer, setAnimationTimer] = useState(800);

  const particlesBackgroundRef = useRef<ParticlesBackgroundHandle>(null);
  const zoomRef = useRef(false);

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
    "src/assets/landing/idols.png",
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

  // update speed & particle background
  useEffect(() => {
    if (images[currentIndex].includes("wheat.png") && theme !== "1") {
      particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
      setAnimationTimer(550);
    }
    if (images[currentIndex].includes("bimetal-coins.png") && theme !== "2") {
      particlesBackgroundRef.current?.loadTheme("2"); // Directly load the theme
      setAnimationTimer(500);
    }
    if (images[currentIndex].includes("banknote.png") && theme !== "3") {
      particlesBackgroundRef.current?.loadTheme("3"); // Directly load the theme
      setAnimationTimer(400);
    }
    if (images[currentIndex].includes("nuke") && theme !== "4") {
      particlesBackgroundRef.current?.loadTheme("4"); // Directly load the theme
    }
    if (images[currentIndex].includes("skyscraper") && theme !== "5") {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
    }
  }, [currentIndex]);

  // Trigger zoom effect when btcpinto is active
  useEffect(() => {
    if (images[currentIndex].includes("btcpinto")) {
      zoomRef.current = true; // Set zoom flag
    } else {
      zoomRef.current = false; // Reset zoom flag
    }
  }, [currentIndex]);

  // Three.js canvas with Camera Control
  const CameraZoom = () => {
    const { camera } = useThree();
    const initialPosition = new THREE.Vector3(0, 0, 100); // Initial camera position
    const targetPosition = new THREE.Vector3(0, 0, 40); // Target camera position, with x-offset for panning

    useEffect(() => {
      if (zoomRef.current) {
        // Reset to initial camera and look-at positions
        camera.position.copy(initialPosition);
      }
    }, [camera]);

    useFrame(() => {
      if (zoomRef.current) {
        // Smoothly interpolate camera position and look-at target
        camera.position.lerp(targetPosition, 0.02); // Smooth zoom and pan
      }
    });

    return null;
  };

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
      const totalDuration = animationTimer;
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
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxAnimationTime, currentIndex, nextIndex]);

  // navigation for buttons
  const navigate = useNavigate();
  const handleLaunchAppClick = () => {
    navigate("/overview");
  };
  const handleLaunchArticleClick = () => {
    navigate("/announcing-pinto");
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
          }}
        >
          <EnvironmentSetup />
          <CameraZoom /> {/* Add CameraZoom inside Canvas */}
          <ambientLight intensity={0.5} />
          {/* Directional light from the front-right and above */}
          <directionalLight
            position={[0, 15, 10]} // Positioned above and slightly in front of the coin
            intensity={20} // Strong enough to create a noticeable gradient effect
          />
          {/* Coin Model */}
          {images[currentIndex].includes("btcpinto") && (
            <CoinModel position={[0, 0, 0]} />
          )}
          {/* Adjust the position to fit in the scene */}
          <Slide
            ref={slideRef1}
            imageUrl={images[currentIndex]}
            width={60}
            height={60}
            animationPhase="out"
            progress={progress}
            // cameraPosition={camera.position}
            onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
            shouldFadeBitcoin={images[currentIndex].includes("btcpinto")}
          />
          {nextIndex < images.length && (
            <Slide
              ref={slideRef2}
              imageUrl={images[nextIndex]}
              width={60}
              height={60}
              animationPhase="in"
              progress={progress}
              // cameraPosition={Camera.position}
              onMaxAnimationTimeCalculated={(time) => setMaxAnimationTime(time)}
              shouldFadeBitcoin={images[currentIndex].includes("btcpinto")}
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
            onClick={handleLaunchArticleClick}
          >
            Read Launch Article
          </Button>
        </div>
      </div>
    </div>
  );
}
