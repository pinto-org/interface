import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial, Color, ShaderMaterial, Vector3 } from "three";

type CoinModelProps = {
  gltf: any;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  onClick: () => void;
};

const CoinModel: React.FC<CoinModelProps> = ({
  gltf,
  position = [7.7, 0, 50],
  scale = [6.65, 6.65, 6.65],
  rotation = [0, 0, 0],
  onClick,
}) => {
  // Load the model using GLTFLoader
  const modelRef = useRef<any>();
  const [rotateDirection, setRotateDirection] = useState(-0.005);

  const targetPosition = useRef(new Vector3(...position)); // Mutable reference for position

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
              color: new Color(0x45906a), // Use the exact green color from Blender
              metalness: 1.0, // Set metalness to 1.0 to match the fully metallic look
              roughness: 0.1, // Keep roughness at 0.2 to match the same level of shininess
            });
          } else if (child.material.name === "coininnerring") {
            child.material = new MeshStandardMaterial({
              color: new Color(0x68ad8b),
              metalness: 1.0,
              roughness: 0.1,
            });
          } else if (child.material.name === "coinface") {
            // Replace material for third part
            child.material = new MeshStandardMaterial({
              color: new Color(0x45906a),
              metalness: 1.0,
              roughness: 0.2,
            });
          } else if (child.material.name === "icon") {
            // Replace material for the icon plane
            child.material = new MeshStandardMaterial({
              color: new Color(0xffffff),
              metalness: 0.65,
              roughness: 0.35,
              emissive: new Color(0x2f7150),
            });
          }
        }
      });
    }
  }, [gltf]);

  // Rotation
  useFrame(() => {
    if (modelRef.current) {
      // Update rotation
      modelRef.current.rotation.y += rotateDirection;
      modelRef.current.position.lerp(targetPosition.current, 0.1);

      // Current rotation value in radians
      const currentRotation = modelRef.current.rotation.y % (2 * Math.PI);

      // Define a point before reaching the side, about 20 degrees (~0.35 radians) before it’s exactly on its side
      const preSideThreshold = Math.PI / 2 - 0.35; // 90 degrees - 20 degrees
      const negPreSideThreshold = -Math.PI / 2 + 0.35;

      // Detect if the rotation is approaching its side, approximately at ±π/2 (90 degrees) but with an offset
      if (
        currentRotation > preSideThreshold &&
        currentRotation < preSideThreshold + 0.1 // Add a bit of range for gradual detection
      ) {
        setRotateDirection(-0.005); // Start rotating to the left earlier
      } else if (
        currentRotation < negPreSideThreshold &&
        currentRotation > negPreSideThreshold - 0.1 // Add a bit of range for gradual detection
      ) {
        setRotateDirection(0.005); // Start rotating to the right earlier
      }
    }
  });

  const handlePointerOver = () => {
    if (targetPosition.current) {
      targetPosition.current.set(position[0], position[1], position[2] + 5); // Move closer on Z-axis
    }
  };

  const handlePointerOut = () => {
    if (targetPosition.current) {
      targetPosition.current.set(...position); // Reset to original position
    }
  };

  const handleClick = () => {
    onClick();
  };

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
