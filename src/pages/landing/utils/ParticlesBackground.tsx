import React, { useEffect, useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import particleConfig from "./particleConfig";
import { Container } from "@tsparticles/engine";

export interface ParticlesBackgroundHandle {
  loadTheme: (theme: string) => void;
}

// Memoize ParticlesBackground to prevent unnecessary re-renders
const ParticlesBackground = React.memo(
  forwardRef<ParticlesBackgroundHandle>((_, ref) => {
    const containerRef = useRef<Container | null>(null);
    const [init, setInit] = useState(false);

    // Expose `loadTheme` to the parent using `useImperativeHandle`
    useImperativeHandle(
      ref,
      () => ({
        loadTheme: (theme: string) => {
          if (containerRef.current) {
            containerRef.current?.loadTheme(theme);
          }
        },
      }),
      [],
    );

    // this should be run only once per application lifetime
    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadFull(engine);
      }).then(() => {
        setInit(true);
      });
    }, []);

    const particlesLoaded = useCallback(async (container?: Container) => {
      if (!container) {
        console.error("Particles container is undefined");
        return;
      }
      console.log("Particles container loaded");
      containerRef.current = container;
      if (localStorage.getItem("hasWatchedTransition")) {
        container.loadTheme("5");
      } else {
        container.loadTheme("default");
      }
    }, []);

    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={particleConfig}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    );
  }),
);

export default ParticlesBackground;
