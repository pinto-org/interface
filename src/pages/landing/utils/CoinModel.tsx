import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader, MeshStandardMaterial, Color } from "three";
import * as THREE from "three";

type CoinModelProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
};

const CoinModel: React.FC<CoinModelProps> = ({
  position = [0, 0, 0],
  scale = [20, 20, 20],
}) => {
  // Load the model using GLTFLoader
  const gltf = useLoader(GLTFLoader, "src/assets/landing/pintosimple.glb");
  const modelRef = useRef<any>();

  const iconTexture = useLoader(
    TextureLoader,
    "src/assets/landing/pintoPDVnoDrop.png"
  );
  const iconPlaneRef = useRef<any>();

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
              color: new Color(0x2f7150), // Use the exact green color from Blender
              metalness: 1.0, // Set metalness to 1.0 to match the fully metallic look
              roughness: 0.1, // Keep roughness at 0.2 to match the same level of shininess
            });
          } else if (child.material.name === "coininnerring") {
            // Replace material for second part
            child.material = new MeshStandardMaterial({
              color: new Color(0x68ad8b), // Silver-like color
              metalness: 1.0,
              roughness: 0.1,
            });
          } else if (child.material.name === "coinface") {
            // Replace material for third part
            child.material = new MeshStandardMaterial({
              color: new Color(0x45906a), // Bronze-like color
              metalness: 1.0,
              roughness: 0.17,
            });
            if (iconPlaneRef.current) {
              // Calculate the bounding box to center the icon plane over the coin face
              const box = new THREE.Box3().setFromObject(child);
              const size = box.getSize(new THREE.Vector3());
              const center = box.getCenter(new THREE.Vector3());

              iconPlaneRef.current.position.set(
                center.x,
                center.y,
                center.z + 1
              ); // Slightly offset on the z-axis to avoid z-fighting
              const scaleMultiplier = 18; // Scale down the icon plane to fit the coin face
              iconPlaneRef.current.scale.set(
                size.x * scaleMultiplier,
                size.y * scaleMultiplier,
                1
              ); // Match the size of the coin face
            }
          }
        }
      });
    }
  }, [gltf]); // Ensure the effect runs after the model is loaded

  // Use `useFrame` to rotate the model on every frame
  useFrame(() => {
    if (modelRef.current) {
      // Rotate the model around its y-axis (you can adjust to rotate around other axes)
      modelRef.current.rotation.y += 0.003; // Adjust the speed of rotation by changing the value
    }
  });

  return (
    <>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        position={position as any}
        scale={scale}
      />

      <mesh ref={iconPlaneRef} position={[0, 0, 0]}>
        <planeGeometry args={[1, 1]} />{" "}
        {/* Initial size, will be adjusted in useEffect */}
        <meshPhongMaterial
          map={iconTexture} // Use your PNG texture
          emissiveMap={iconTexture} // Use emissive map to define which parts should glow
          transparent={true} // Maintain the transparency of your PNG texture
          shininess={150} // High shininess for glossy look
        />
      </mesh>
    </>
  );
};

export default CoinModel;
