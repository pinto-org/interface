import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import ParticlesBackground, {
  ParticlesBackgroundHandle,
} from "./landing/utils/ParticlesBackground";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import CoinModel from "./landing/utils/CoinModel";
import EnvironmentSetup from "./landing/utils/EnvironmentSetup";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import SlideGroup from "./landing/SlideGroup";
import { useQuery } from "@tanstack/react-query";

// IMAGE ARRAY
export const landingImages = [
  "tree.png", // 0
  "rock.png", // 1
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

const chunkedImages = {
  initial: landingImages.slice(0, 1),
  rest: landingImages.slice(1)
} as const;

const images = landingImages;

function preloadImages(
  imageUrls: readonly string[]
): Promise<HTMLImageElement[]> {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    })
  );
}

export type PreloadImageConfig = {
  initial: HTMLImageElement[];
  rest: HTMLImageElement[];
};

const fetchChunkImages = async (imgs: readonly string[], setImgs: React.Dispatch<React.SetStateAction<HTMLImageElement[]>>) => {
  const preloadedImages = await preloadImages(imgs);
  setImgs([new Image(), ...preloadedImages]);
};

const usePreloadImages = () => {
  const [cachedImages, setCachedImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    fetchChunkImages(chunkedImages.rest, setCachedImages);
  }, []);

  const ready = !!cachedImages.length;

  return [cachedImages, ready] as const;
};

export default function Landing() {
  // DECLARATIONS FOR STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [maxAnimationTime, setMaxAnimationTime] = useState(1); // Default to 1
  const [animationTimer, setAnimationTimer] = useState(1200);
  const [opacity, setOpacity] = useState(1);
  const [showMetallicCoin, setShowMetallicCoin] = useState(false);

  // PRELOADED MODELS
  const preloadedGLTF = useLoader(GLTFLoader, "3DPinto.glb");

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

  const transitionComplete = localStorage.getItem("hasWatchedTransition");

  // TODO: add should preload prop
  const [cachedImages, imagesFetched] = usePreloadImages(); // preload images

  useEffect(() => {
    // PARSE QUERY PARAMS - MARK IF THE USER HAS VISITED THE SITE BEFORE
    const params = new URLSearchParams(location.search);
    const fromNav = params.get("fromNav");

    // If `fromNav` is not present, proceed with redirection logic
    if (!fromNav) {
      const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
      if (hasVisitedBefore) {
        // If user has visited before, navigate to "/overview" route
        navigate("/overview");
      } else {
        // Mark that the user has visited
        localStorage.setItem("hasVisitedBefore", "true");
      }
    }
  }, [navigate, location]);

  // CHECK LOCALSTORAGE TO SEE IF THE USER HAS ALREADY VIEWED THE TRANSITIONS
  useEffect(() => {
    if (transitionComplete === "true") {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
      setOpacity(0);
      setCurrentIndex(images.length - 1); // Set the current index to the last image
      setNextIndex(images.length); // Set the next index to exceed the length
    }
  }, []);

  // RESET ANIMATION STATE
  const resetCoinState = useCallback(() => {
    setCurrentIndex(0);
    setNextIndex(1);
    setShowMetallicCoin(false);
    setOpacity(1);
    zoomRef.current = false;
    particlesBackgroundRef.current?.loadTheme("default");
    localStorage.removeItem("hasWatchedTransition");
  }, []);

  // EFFECT TO UPDATE ANIMATION SPEED, PARTICLE BACKGROUND THEME, AND CAMERA ZOOM
  useEffect(() => {
    if (currentIndex === 0) {
      setAnimationTimer(1200);
    } else if (currentIndex === 1) {
      setAnimationTimer(600);
    } else if (currentIndex === 2) {
      particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
      setAnimationTimer(550);
    } else if (currentIndex === 4) {
      setAnimationTimer(500);
    } else if (currentIndex === 5) {
      particlesBackgroundRef.current?.loadTheme("1"); // Directly load the theme
    } else if (currentIndex === 6) {
      setAnimationTimer(450);
    } else if (currentIndex === 9) {
      particlesBackgroundRef.current?.loadTheme("2"); // Directly load the theme
      setAnimationTimer(400);
    } else if (currentIndex === 13) {
      particlesBackgroundRef.current?.loadTheme("3");
    } else if (currentIndex === 17) {
      particlesBackgroundRef.current?.loadTheme("4"); // Directly load the theme
    } else if (currentIndex === 21) {
      particlesBackgroundRef.current?.loadTheme("5"); // Directly load the theme
      if (transitionComplete) {
        setShowMetallicCoin(true);
        zoomRef.current = true;
      } else {
        // Delay the start of fading out of BTC
        setTimeout(() => {
          setOpacity(1); // Make sure opacity is set to fully visible initially
          let fadeOutStartTime = performance.now();
          const fadeOutDuration = 500; // Duration of fade-out

          const fadeOutAnimation = () => {
            const elapsed = performance.now() - fadeOutStartTime;
            const newOpacity = Math.max(1 - elapsed / fadeOutDuration, 0);
            setOpacity(newOpacity);

            if (newOpacity > 0) {
              requestAnimationFrame(fadeOutAnimation);
            } else {
              setShowMetallicCoin(true);
              zoomRef.current = true; // Zoom in on the metallic coin
              localStorage.setItem("hasWatchedTransition", "true"); // Mark transition as completed
            }
          };

          requestAnimationFrame(fadeOutAnimation);
        }, 200); // 200ms delay before starting the fade-out
      }
    } else {
      zoomRef.current = false; // Reset zoom flag
    }
  }, [currentIndex]);

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
          raycaster={{
            layers: (() => {
              const layers = new THREE.Layers();
              layers.set(2);
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
          <ambientLight intensity={5} />
          <directionalLight
            position={[0, 80, 80]} // Positioned above and slightly in front of the coin
            intensity={10} // Strong enough to create a noticeable gradient effect
          />
          <directionalLight
            position={[0, 20, 60]} // Positioned above and slightly in front of the coin
            intensity={1} // Strong enough to create a noticeable gradient effect
          />
          {/* Coin Model */}
          {showMetallicCoin && preloadedGLTF && (
            <CoinModel gltf={preloadedGLTF} onClick={resetCoinState} />
          )}
          {/* Adjust the position to fit in the scene */}
          <SlideGroup
            cachedImages={cachedImages}
            ready={imagesFetched}
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
            onClick={handleLaunchArticleClick}
          >
            Read Launch Article
          </Button>
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
  const targetCameraPosition = new THREE.Vector3(0, 0, 20);

  useEffect(() => {
    if (zoomRef.current) {
      camera.position.copy(initialCameraPosition);
      camera.layers.enable(2); // Enable layer 2 for rendering the Slide
      camera.layers.disable(1); // Optionally disable the default layer
    } else {
      camera.layers.enable(1); // Enable layer 1 for rendering the Slide
      camera.layers.disable(2); // Optionally disable the default layer
    }
  }, [camera, zoomRef.current]);

  useFrame(() => {
    if (zoomRef.current) {
      camera.position.lerp(targetCameraPosition, 0.07); // Smooth zoom and pan
    } else {
      camera.position.lerp(initialCameraPosition, 0.14);
    }
  });

  return null;
};
