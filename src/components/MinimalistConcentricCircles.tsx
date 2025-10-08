import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface MinimalistConcentricCirclesProps {
  canvasHeight?: number;
  beginAnimation?: boolean;
}

const MinimalistConcentricCircles: React.FC<MinimalistConcentricCirclesProps> = ({
  canvasHeight = 1600,
  beginAnimation = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const animationStartTimeRef = useRef<number | null>(null);
  const sceneInitializedRef = useRef(false);

  // Direct reference to objects we need for animation
  const ringsDataRef = useRef<any[]>([]); // Now storing data per ring instead of per circle
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // CONFIGURATION - All settings hardcoded here
  // ==========================================

  // Surface curvature settings
  const surfaceCurvature = 0.001; // Controls how much the overall surface curves

  // Circle arrangement settings
  const rings = 50; // Number of concentric rings
  const baseRadius = 3; // Radius of innermost ring
  const radiusStep = 3; // Space between rings

  // Per-ring density (number of circles in each ring)
  const ringDensities = [
    8, 12, 18, 20, 26, 32, 40, 50, 61, 76, 85, 91, 102, 112, 120, 132, 142, 143, 144, 143, 144, 143, 144, 153, 154, 153,
    164, 163, 164, 173, 174, 183, 184, 193, 202, 211, 220, 231, 242, 253, 264, 273, 282,
  ]; // Must match length of 'rings'

  // Texture quality
  const anisotropyLevel = 16; // Level of anisotropic filtering (typical values: 1-16)

  // Circle appearance
  const circleWidth = 2.4; // Width of each circle
  const circleHeight = 2; // Height of each circle (creates elliptical shapes when different from width)

  // Animation settings
  const fadeInDuration = 1.2; // Time in seconds for each ring to fade in
  const fadeInStaggering = 0.1; // Time between each ring starting to fade in

  // Camera position
  const cameraDistance = 20; // How far camera is from the center
  const cameraAngleX = 60; // Camera angle (up/down) in degrees
  const cameraAngleY = 0; // Camera angle (left/right) in degrees
  // ==========================================

  // Initial scene setup
  useEffect(() => {
    if (!mountRef.current || sceneInitializedRef.current) return;

    console.log("Initializing scene...");

    // Clear rings data array
    ringsDataRef.current = [];

    // Basic Three.js setup
    const width = mountRef.current.clientWidth;
    const height = canvasHeight;

    // Initialize renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Get the maximum anisotropy level supported by the GPU
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const actualAnisotropy = Math.min(anisotropyLevel, maxAnisotropy);

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera with fixed position
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    cameraRef.current = camera;

    // Set camera position
    const radians = cameraAngleY * (Math.PI / 180);
    const radiansX = cameraAngleX * (Math.PI / 180);
    camera.position.x = cameraDistance * Math.sin(radians);
    camera.position.z = cameraDistance * Math.cos(radians);
    camera.position.y = cameraDistance * Math.sin(radiansX);
    camera.lookAt(0, 0, 0);

    // Create group for all circles
    const circlesGroup = new THREE.Group();
    scene.add(circlesGroup);

    // Create ellipse texture with higher quality
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D context for canvas");
      return;
    }

    const size = 256; // Increased texture size for better quality
    canvas.width = size;
    canvas.height = size;

    // Draw the circle with a smoother edge
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Create texture with anisotropic filtering
    const circleTexture = new THREE.CanvasTexture(canvas);
    circleTexture.anisotropy = actualAnisotropy;
    circleTexture.wrapS = THREE.ClampToEdgeWrapping;
    circleTexture.wrapT = THREE.ClampToEdgeWrapping;
    circleTexture.minFilter = THREE.LinearMipmapLinearFilter;
    circleTexture.magFilter = THREE.LinearFilter;
    circleTexture.needsUpdate = true;

    // Create the visualization
    const createCircles = () => {
      for (let i = 0; i < Math.min(rings, ringDensities.length); i++) {
        const radius = baseRadius + i * radiusStep;
        const dotsCount = ringDensities[i] || 16; // Fallback to 16 if not specified
        const circlesInRing: THREE.Mesh[] = []; // Store all circles in this ring
        const materialsInRing: THREE.MeshBasicMaterial[] = []; // Store all materials in this ring

        for (let j = 0; j < dotsCount; j++) {
          const angle = (j / dotsCount) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);

          // Apply curvature to the position - this creates a curved surface arrangement
          // Calculate distance from center for curvature
          const distanceFromCenter = Math.sqrt(x * x + z * z);
          // Apply quadratic curve: y = -curvature * distance²
          const y = -surfaceCurvature * distanceFromCenter * distanceFromCenter;

          // Get color for this circle
          const circleColor = new THREE.Color().setHex(0x387f5c); // pinto-green-4

          // Create a flat circle/ellipse as a plane with texture
          const planeGeometry = new THREE.PlaneGeometry(circleWidth, circleHeight);

          // Create material with flat shading and no lighting effects - now single-sided
          const circleMaterial = new THREE.MeshBasicMaterial({
            color: circleColor,
            map: circleTexture,
            transparent: true,
            opacity: 0, // Start invisible
            depthWrite: false,
            side: THREE.FrontSide, // Only visible from the front side
            alphaTest: 0.1, // Slightly improved edge quality
          });

          const circle = new THREE.Mesh(planeGeometry, circleMaterial);
          circle.position.set(x, y, z);

          // Calculate the surface normal at this point based on curvature
          const normalX = 2 * surfaceCurvature * x;
          const normalZ = 2 * surfaceCurvature * z;
          const normalY = 1;
          const surfaceNormal = new THREE.Vector3(normalX, normalY, normalZ).normalize();

          // Circle position vector
          const circlePosition = new THREE.Vector3(x, y, z);

          const t = y + (surfaceNormal.x * x + surfaceNormal.z * z) / surfaceNormal.y;
          const intersectionPoint = new THREE.Vector3(0, t, 0);

          // Direction vector from circle position to intersection point
          // This will be our X-axis direction (new forward direction)
          const dirToIntersection = new THREE.Vector3().subVectors(intersectionPoint, circlePosition).normalize();

          // The right vector (our Y-axis) should be perpendicular to both the
          // direction to intersection and the surface normal
          const rightVector = new THREE.Vector3().crossVectors(surfaceNormal, dirToIntersection).normalize();

          // Re-calculate an up vector to ensure it's perfectly aligned with the surface normal
          // This ensures the circles follow the surface curvature correctly
          const upVector = new THREE.Vector3().crossVectors(dirToIntersection, rightVector).normalize();

          // Create rotation matrix from these vectors, following the curvature of the surface
          const rotationMatrix = new THREE.Matrix4().makeBasis(
            dirToIntersection, // X-axis points to intersection point (new forward direction)
            rightVector, // Y-axis points to the right along surface
            upVector, // Z-axis follows the surface normal
          );

          // Apply this rotation to the circle
          circle.setRotationFromMatrix(rotationMatrix);

          circlesGroup.add(circle);

          // Add to our collections for this ring
          circlesInRing.push(circle);
          materialsInRing.push(circleMaterial);
        }

        // Store data for this entire ring
        const startDelay = i * fadeInStaggering; // Delay based on ring index

        ringsDataRef.current.push({
          circles: circlesInRing,
          materials: materialsInRing,
          startDelay: startDelay,
          ringIndex: i,
        });
      }
    };

    // Create all the circles
    createCircles();
    console.log(`Created ${ringsDataRef.current.length} rings`);

    // Initial render (all circles invisible)
    renderer.render(scene, camera);

    // Mark scene as initialized
    sceneInitializedRef.current = true;

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      camera.aspect = width / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, canvasHeight);
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material.map) object.material.map.dispose();
          object.material.dispose();
        }
      });

      // Reset initialization flag
      sceneInitializedRef.current = false;
    };
  }, [canvasHeight]);

  // Handle animation based on beginAnimation prop
  useEffect(() => {
    // Stop any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Don't start animation if scene isn't initialized or beginAnimation is false
    if (!sceneInitializedRef.current || !beginAnimation) {
      // Reset start time if animation is stopped
      if (!beginAnimation) {
        animationStartTimeRef.current = null;

        // If we have a valid scene setup, render all circles as invisible
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          ringsDataRef.current.forEach((ringData) => {
            ringData.materials.forEach((material: THREE.MeshBasicMaterial) => {
              material.opacity = 0;
            });
          });
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
      return;
    }

    console.log("Starting animation...");

    // Make sure we have all required objects
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const ringsData = ringsDataRef.current;

    if (!renderer || !scene || !camera || !ringsData || ringsData.length === 0) {
      console.error("Missing required objects for animation");
      return;
    }

    // Record animation start time if beginning for the first time
    if (animationStartTimeRef.current === null) {
      animationStartTimeRef.current = performance.now() / 1000;
      console.log("Animation start time set:", animationStartTimeRef.current);
    }

    // Animation function
    const animate = (time: number) => {
      const currentTime = time / 1000; // Convert to seconds
      const startTime = animationStartTimeRef.current || currentTime;
      const elapsed = currentTime - startTime;

      // Update each ring's opacity
      let allComplete = true;

      ringsData.forEach((ringData) => {
        const { materials, startDelay } = ringData;

        // Calculate normalized time for this ring's fade-in
        const normalizedTime = Math.max(0, Math.min(1, (elapsed - startDelay) / fadeInDuration));

        // If any ring is still fading in, animation isn't complete
        if (normalizedTime < 1) {
          allComplete = false;
        }

        // Ease-in-out function for smoother fade
        const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
        const fadeValue = easeInOut(normalizedTime);

        // Apply the same opacity to all circles in this ring
        materials.forEach((material: THREE.MeshBasicMaterial) => {
          material.opacity = fadeValue;
        });
      });

      // Render the scene
      renderer.render(scene, camera);

      // Continue animation if not all rings are fully visible and animation should continue
      if (!allComplete && beginAnimation) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation is complete or should stop
        animationRef.current = null;
      }
    };

    // Start the animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup animation on unmount or when beginAnimation becomes false
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [beginAnimation]);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default MinimalistConcentricCircles;
