import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import Slide from "./landing/Slide";
import ParticlesBackground, {
  ParticlesBackgroundHandle,
} from "./landing/utils/ParticlesBackground";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import CoinModel from "./landing/utils/CoinModel";
import EnvironmentSetup from "./landing/utils/EnvironmentSetup";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Landing() {
  // DECLARATIONS FOR STATE
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1
  const [animationTimer, setAnimationTimer] = useState(400);
  const [opacity, setOpacity] = useState(1);
  const [showMetallicCoin, setShowMetallicCoin] = useState(false);

  // SLIDE REFS
  const slideRef1 = useRef<THREE.Mesh>(null);
  const slideRef2 = useRef<THREE.Mesh>(null);
  const slidesGroupRef = useRef<THREE.Group>(null); // Reference to the group

  // PRELOADED MODELS
  const preloadedGLTF = useLoader(
    GLTFLoader,
    "src/assets/landing/pintosimple.glb"
  );

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
  const handleLaunchArticleClick = () => {
    navigate("/announcing-pinto");
  };

  // IMAGE ARRAY
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
  // EFFECT TO UPDATE ANIMATION SPEED, PARTICLE BACKGROUND THEME, AND CAMERA ZOOM
  useEffect(() => {
    if (images[currentIndex].includes("wheat.png")) {
      particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
      // setAnimationTimer(550);
      setAnimationTimer(400);
    }
    if (images[currentIndex].includes("bimetal-coins.png")) {
      particlesBackgroundRef.current?.loadTheme("2"); // Directly load the theme
      // setAnimationTimer(500);
      setAnimationTimer(400);
    }
    if (images[currentIndex].includes("banknote.png")) {
      particlesBackgroundRef.current?.loadTheme("3"); // Directly load the theme
      setAnimationTimer(400);
    }
    if (images[currentIndex].includes("nuke")) {
      particlesBackgroundRef.current?.loadTheme("4"); // Directly load the theme
    }
    if (images[currentIndex].includes("skyscraper")) {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
      setTimeout(() => {
        setShowMetallicCoin(true);
      }, 200);
    }
    if (images[currentIndex].includes("btcpinto")) {
      setOpacity(0); // Start hiding slides immediately

      // Instead of setTimeout, start animations immediately
      let fadeOutStartTime = performance.now();
      const fadeOutDuration = 1000;

      const fadeOutAnimation = () => {
        const elapsed = performance.now() - fadeOutStartTime;
        const newOpacity = Math.max(1 - elapsed / fadeOutDuration, 0);
        setOpacity(newOpacity);

        if (newOpacity > 0) {
          requestAnimationFrame(fadeOutAnimation);
        }
      };

      requestAnimationFrame(fadeOutAnimation);
    } else {
      zoomRef.current = false; // Reset zoom flag
      // setShowMetallicCoin(false); // Reset metallic coin visibility
    }
  }, [currentIndex]);

  // CAMREA ZOOM EFFECT
  const CameraZoom = () => {
    const { camera } = useThree();
    const initialPosition = new THREE.Vector3(0, 0, 160); // Initial camera position
    const targetPosition = new THREE.Vector3(9, 0, 80); // Target camera position, with x-offset for panning

    useEffect(() => {
      if (zoomRef.current) {
        camera.position.copy(initialPosition);
      }
    }, [camera]);

    useFrame(() => {
      if (zoomRef.current) {
        camera.position.lerp(targetPosition, 0.07); // Smooth zoom and pan
      }
    });

    return null;
  };

  //  EFFECT TO CONTROL ANIMATION PROGRESSION
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
      const newProgress = elapsed / adjustedDuration;
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
          <CameraZoom />
          <ambientLight intensity={0.5} />
          {/* Directional light from the front-right and above */}
          <directionalLight
            position={[0, 15, 10]} // Positioned above and slightly in front of the coin
            intensity={30} // Strong enough to create a noticeable gradient effect
          />
          <directionalLight
            position={[0, 70, 100]} // Positioned above and slightly in front of the coin
            intensity={30} // Strong enough to create a noticeable gradient effect
          />
          {/* Coin Model */}
          {showMetallicCoin && preloadedGLTF && (
            <CoinModel gltf={preloadedGLTF} />
          )}
          {/* Adjust the position to fit in the scene */}
          <group ref={slidesGroupRef}>
            <Slide
              ref={slideRef1}
              imageUrl={images[currentIndex]}
              width={60}
              height={60}
              animationPhase="out"
              progress={progress}
              opacity={opacity} // Pass opacity down
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
                opacity={opacity} // Pass opacity down
                onMaxAnimationTimeCalculated={(time) =>
                  setMaxAnimationTime(time)
                }
              />
            )}
          </group>
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
