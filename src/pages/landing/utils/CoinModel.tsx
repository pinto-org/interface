import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Color, MeshStandardMaterial, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type CoinModelProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  onScaleSet: () => void;
  onClick: () => void;
};

const defaultPosition = [0, 0, 0] as [number, number, number];
const initialScale = [4, 4, 4] as [number, number, number];
const defaultRotation = [0, 0, 0] as [number, number, number];

const CoinModel: React.FC<CoinModelProps> = ({
  position = defaultPosition,
  scale = initialScale,
  rotation = defaultRotation,
  onScaleSet,
  onClick,
}) => {
  // Load the model using GLTFLoader
  const gltf = useLoader(GLTFLoader, "3DPinto.glb");
  const modelRef = useRef<any>();
  const currentPosition = new Vector3(0, 0, 0);
  const targetPosition = useRef(new Vector3(20, 0, 0));
  const scaleSetRef = useRef(false); // Tracks if scaling is complete
  const [rotateDirection, setRotateDirection] = useState(-0.005);
  const [isInitialized, setIsInitialized] = useState(false);
  const rotationEnabled = useRef(false); // Track if rotation is allowed

  // Use an effect to replace the materials after the model is loaded
  useEffect(() => {
    if (modelRef.current) {
      // Traverse the loaded model and replace materials

      modelRef.current.traverse((child: any) => {
        if (child.isMesh) {
          // Replace with a MeshStandardMaterial
          // Access the material by name
          if (child.material.name === "coinouterring") {
            // Replace material for first part
            child.material = new MeshStandardMaterial({
              name: "coinouterring",
              color: new Color(0x45906a), // Use the exact green color from Blender
              metalness: 1.0, // Set metalness to 1.0 to match the fully metallic look
              roughness: 0.1, // Keep roughness at 0.2 to match the same level of shininess
              transparent: true,
              opacity: 1.0, // Start fully transparent
            });
            child.layers.set(1); // Layer 1 for the coin
          } else if (child.material.name === "coininnerring") {
            child.material = new MeshStandardMaterial({
              name: "coininnerring",
              color: new Color(0x68ad8b),
              metalness: 1.0,
              roughness: 0.1,
              transparent: true,
              opacity: 1.0, // Start fully transparent
            });
            child.layers.set(1); // Layer 1 for the coin
          } else if (child.material.name === "coinface") {
            child.material = new MeshStandardMaterial({
              name: "coinface",
              color: new Color(0x45906a),
              metalness: 1.0,
              roughness: 0.2,
              transparent: true,
              opacity: 1.0, // Start fully transparent
            });
            child.layers.set(1); // Layer 1 for the coin
          } else if (child.material.name === "icon") {
            child.material = new MeshStandardMaterial({
              name: "icon",
              color: new Color(0xade0c7),
              metalness: 0.7,
              roughness: 0.3,
              emissive: new Color(0x2f7150),
              emissiveIntensity: 2.0,
              transparent: true,
              opacity: 0.02, // Start fully transparent
            });
            child.layers.set(1); // Layer 1 for the coin
          }
        }
      });
      setIsInitialized(true); // Mark initialization as complete
    }
  }, [gltf]);

  useFrame(() => {
    if (!modelRef.current || !isInitialized) return;

    // Ensure the model moves to the target position
    const positionReached = modelRef.current.position.distanceTo(targetPosition.current) < 0.2;
    if (!positionReached) {
      modelRef.current.position.lerp(targetPosition.current, 0.1);
    } else {
      // Scale up the model
      const targetScale = new Vector3(12, 12, 12); // Desired scale
      const currentScale = modelRef.current.scale;
      const targetRotation = new Vector3(0, Math.PI * 10, 0); // 360 degrees in Y-axis

      if (currentScale.distanceTo(targetScale) > 0.06) {
        // Lerp the scale
        currentScale.lerp(targetScale, 0.14);
        onScaleSet();

        //  Lerp rotation
        // const currentRotation = modelRef.current.rotation;
        // currentRotation.x += (targetRotation.x - currentRotation.x) * 0.02;
        // currentRotation.y += (targetRotation.y - currentRotation.y) * 0.02;
        // currentRotation.z += (targetRotation.z - currentRotation.z) * 0.02;
      } else if (!scaleSetRef.current) {
        // Finalize material properties and enable rotation
        scaleSetRef.current = true;
        setMaterialProperties(modelRef.current);
        rotationEnabled.current = true; // Enable rotation
      }

      // Lerp colors
      modelRef.current.traverse((child: any) => {
        if (child.isMesh && child.material) {
          // const startColor = new Color(0xF7931A); // Orange
          // const endColorOuterRing = new Color(0x45906a); // Outer ring and face
          // const endColorInnerRing = new Color(0x68ad8b); // Inner ring

          const progress = Math.min(Math.max((currentScale.x - 10) / (12 - 10), 0), 1);

          if (child.material.name === "coinouterring") {
            // child.material.color.lerpColors(startColor, endColorOuterRing, progress);
          } else if (child.material.name === "coininnerring") {
            // child.material.color.lerpColors(startColor, endColorInnerRing, progress);
          } else if (child.material.name === "coinface") {
            // child.material.color.lerpColors(startColor, endColorOuterRing, progress);
          } else if (child.material.name === "icon") {
            const newOpacity = Math.min(child.material.opacity + 0.015, 0.99);
            child.material.opacity = newOpacity;
          }

          child.material.needsUpdate = true;
        }
      });
    }

    // Add rotation logic after scaling, colors, and materials are done
    if (rotationEnabled.current) {
      // Current rotation value in radians
      const currentRotation = modelRef.current.rotation.y % (2 * Math.PI);

      // Define thresholds for slowing down near edges
      const preSideThreshold = Math.PI / 2 - 0.35; // 90 degrees - 20 degrees
      const postSideThreshold = Math.PI / 2 + 0.35; // 90 degrees + 20 degrees
      const negPreSideThreshold = -Math.PI / 2 + 0.35;
      const negPostSideThreshold = -Math.PI / 2 - 0.35;

      // Gradually slow down rotation as it approaches thresholds
      const speedFactor = 1; // Default speed multiplier
      if (
        (currentRotation > preSideThreshold && currentRotation < postSideThreshold) ||
        (currentRotation < negPreSideThreshold && currentRotation > negPostSideThreshold)
      ) {
        const distanceToThreshold = Math.min(
          Math.abs(currentRotation - preSideThreshold),
          Math.abs(currentRotation - negPreSideThreshold),
        );
      }

      // Adjust rotation speed
      modelRef.current.rotation.y += rotateDirection * speedFactor;

      // Detect when to switch rotation direction
      if (currentRotation > preSideThreshold && currentRotation < preSideThreshold + 0.1) {
        setRotateDirection(-0.005); // Start rotating to the left earlier
      } else if (currentRotation < negPreSideThreshold && currentRotation > negPreSideThreshold - 0.1) {
        setRotateDirection(0.005); // Start rotating to the right earlier
      }
    }
  });

  const setMaterialProperties = (model: any) => {
    model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const finalProperties = {
          coinouterring: { metalness: 1.0, roughness: 0.1 },
          coininnerring: { metalness: 1.0, roughness: 0.1 },
          coinface: { metalness: 1.0, roughness: 0.2 },
          icon: { metalness: 0.7, roughness: 0.3, emissiveIntensity: 2.0, emissive: 0x2f7150 },
        };

        const props = finalProperties[child.material.name];
        if (props) {
          child.material.metalness = props.metalness;
          child.material.roughness = props.roughness;
          child.material.needsUpdate = true; // Ensure updates are applied
        }
      }
    });
  };

  const handlePointerOver = useCallback(() => {
    if (targetPosition.current) {
      targetPosition.current.set(20, position[1], position[2] + 2); // Move closer on Z-axis
    }
  }, [targetPosition.current]);

  const handlePointerOut = useCallback(() => {
    if (targetPosition.current) {
      targetPosition.current.set(20, position[1], position[2]); // Reset to original position
    }
  }, [targetPosition.current]);

  const handleClick = useCallback(() => {
    onClick();
  }, []);

  return (
    <>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        position={position}
        scale={scale}
        rotation={rotation}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </>
  );
};

export default CoinModel;
