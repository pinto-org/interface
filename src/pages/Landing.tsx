import FrameAnimator from "@/components/LoadingSpinner";
import useFarmerStatus from "@/hooks/useFarmerStatus";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { Button } from "../components/ui/Button";
import SlideGroup from "./landing/SlideGroup";
import CoinModel from "./landing/utils/CoinModel";
import EnvironmentSetup from "./landing/utils/EnvironmentSetup";
import ParticlesBackground, { ParticlesBackgroundHandle } from "./landing/utils/ParticlesBackground";

// IMAGE ARRAY
export const landingImages = [
  "rock.png", // 0
  "tree.png", // 1
  "gold.png", // 2
  "pickaxe.png", // 3
  "teepee.png", // 4
  "wheat.png", // 5
  "cow.png", // 6
  "abacus.png", // 7
  "idols.png", // 8
  "bimetal-coins.png", // 9
  "clayledger.png", // 10
  "aqueduct.png", // 11
  "parthenon.png", // 12
  "banknote.png", // 13
  "steamengine.png", // 14
  "lightbulb.png", // 15
  "church.png", // 16
  "nuke.png", // 17
  "USD.png", // 18
  "computer.png", // 19
  "skyscraper.png", // 20
  "BTC.png", // 21
] as const;

export default function Landing() {
  // DECLARATIONS FOR STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1
  const [animationTimer, setAnimationTimer] = useState(1600);
  const [opacity, setOpacity] = useState(1);
  const [showPinto, setShowPinto] = useState(false);
  const farmerStatus = useFarmerStatus();

  // TS PARTICLES BACKGROUND REF
  const particlesBackgroundRef = useRef<ParticlesBackgroundHandle>(null);

  // ZOOM FLAG
  const zoomRef = useRef(false);

  // NAVIGATION HOOK
  const navigate = useNavigate();

  // NAVIATION HANDLERS
  const handleLaunchAppClick = () => {
    navigate("/overview");
  };
  const handleLearnPintoClick = () => {
    navigate("/how-pinto-works");
  };

  const transitionComplete = localStorage.getItem("hasWatchedTransition");

  useEffect(() => {
    // PARSE QUERY PARAMS - MARK IF THE USER HAS VISITED THE SITE BEFORE
    const params = new URLSearchParams(location.search);
    const fromNav = params.get("fromNav");

    // If `fromNav` is not present, proceed with redirection logic
    if (!fromNav) {
      const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
      if (hasVisitedBefore) {
        navigate("/overview");
      } else {
        localStorage.setItem("hasVisitedBefore", "true");
      }
    }
  }, [navigate, location]);

  // CHECK LOCALSTORAGE TO SEE IF THE USER HAS ALREADY VIEWED THE TRANSITIONS
  useEffect(() => {
    if (transitionComplete === "true") {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
      setCurrentIndex(landingImages.length - 1); // Set the current index to the last image
      setNextIndex(landingImages.length); // Set the next index to exceed the length
    }
  }, []);

  // RESET ANIMATION STATE
  const resetCoinState = useCallback(() => {
    setCurrentIndex(0);
    setNextIndex(1);
    setShowPinto(false);
    setOpacity(1);
    zoomRef.current = false;
    particlesBackgroundRef.current?.loadTheme("default");
    localStorage.removeItem("hasWatchedTransition");
  }, []);

  // EFFECT TO UPDATE ANIMATION SPEED, PARTICLE BACKGROUND THEME, AND CAMERA ZOOM
  useEffect(() => {
    switch (currentIndex) {
      case 0:
        setAnimationTimer(1600);
        break;
      case 1:
        setAnimationTimer(1200);
        break;
      case 2:
        setAnimationTimer(900);
        break;
      case 4:
        setAnimationTimer(800);
        break;
      case 5:
        particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
        break;
      case 6:
        setAnimationTimer(700);
        break;
      case 9:
        particlesBackgroundRef.current?.loadTheme("2"); // Directly load the theme
        setAnimationTimer(600);
        break;
      case 13:
        particlesBackgroundRef.current?.loadTheme("3");
        setAnimationTimer(500);
        break;
      case 17:
        particlesBackgroundRef.current?.loadTheme("4"); // Directly load the theme
        setAnimationTimer(400);
        break;
      case 21:
        particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
        setTimeout(() => {
          setShowPinto(true);
          setOpacity(0.4);
          localStorage.setItem("hasWatchedTransition", "true"); // Mark transition as completed
        }, 200);
        break;
    }
  }, [currentIndex]);

  const onCoinScaleSet = () => {
    zoomRef.current = true;
  };

  return (
    <div className="space-y-8 relative z-10">
      <div
        style={{
          width: "100vw",
          height: "80vh",
          position: "relative",
          display: "flex",
          backgroundColor: "#FEFDF4",
        }}
      >
        {/* Memoized TSParticles Background */}
        <ParticlesBackground ref={particlesBackgroundRef} />

        {/* Three.js Canvas with Transparent Background */}
        <Suspense fallback={<FrameAnimator />}>
          <Canvas
            raycaster={{
              layers: (() => {
                const layers = new THREE.Layers();
                layers.set(1);
                return layers;
              })(), // Ensure the raycaster checks layer 2
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1, // Lower z-index to ensure the button and content are on top
            }}
            camera={{ position: [0, 0, 100] }}
          >
            <EnvironmentSetup />
            <CameraZoom zoomRef={zoomRef} />
            <EnvironmentLighting />
            {showPinto && <CoinModel onClick={resetCoinState} onScaleSet={() => onCoinScaleSet()} />}
            <SlideGroup
              showPinto={showPinto}
              nextIndex={nextIndex}
              currentIndex={currentIndex}
              opacity={opacity}
              animationTimer={animationTimer}
              maxAnimationTime={maxAnimationTime}
              setMaxAnimationTime={setMaxAnimationTime}
              setCurrentIndex={setCurrentIndex}
              setNextIndex={setNextIndex}
            />
          </Canvas>
        </Suspense>
        {/* Wrapper div for button positioned at the bottom of the view */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex flex-col sm:flex-row items-center gap-4">
          {farmerStatus.hasDeposits || farmerStatus.hasPlots ? (
            <>
              <Button rounded="full" className="shadow-sm" onClick={handleLaunchAppClick}>
                See account overview
              </Button>
              <Button rounded="full" variant="outline-secondary" onClick={handleLearnPintoClick}>
                Learn how Pinto works
              </Button>
            </>
          ) : (
            <Button rounded="full" className="shadow-sm" onClick={handleLaunchAppClick}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

type CameraZoomProps = {
  zoomRef: React.RefObject<boolean>;
};

const CameraZoom: React.FC<CameraZoomProps> = ({ zoomRef }) => {
  const { camera } = useThree();

  // CAMERA POSITIONS
  const initialCameraPosition = new THREE.Vector3(0, 0, 100);
  const targetCameraPosition = new THREE.Vector3(20, 0, 50);

  useEffect(() => {
    camera.layers.enable(1);

    // Explicitly reset camera position if zoomRef is false
    if (zoomRef.current === false) {
      camera.position.copy(initialCameraPosition); // Snap to the initial position
    }
  }, [camera, zoomRef.current]);

  useFrame(() => {
    if (zoomRef.current) {
      camera.position.lerp(targetCameraPosition, 0.1);
    } else {
      camera.position.lerp(initialCameraPosition, 0.06);
    }
  });

  return null;
};

const EnvironmentLighting = () => {
  return (
    <>
      <ambientLight intensity={5} />
      <directionalLight
        position={[20, 80, 80]} // Positioned above and slightly in front of the coin
        intensity={10} // Strong enough to create a noticeable gradient effect
      />
      <directionalLight
        position={[20, 20, 60]} // Positioned above and slightly in front of the coin
        intensity={1} // Strong enough to create a noticeable gradient effect
      />
      <directionalLight
        position={[20, 20, 30]} // Positioned above and slightly in front of the coin
        intensity={3} // Strong enough to create a noticeable gradient effect
      />
    </>
  );
};
