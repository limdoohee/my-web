"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  BakeShadows,
  Stage,
  AccumulativeShadows,
  RandomizedLight,
  Html,
  useGLTF,
} from "@react-three/drei";
import Earth from "./Earth";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas shadows camera={{ position: [5, 0, 0], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Stage
          environment="city"
          intensity={0.1}
          preset="soft"
          shadows={{
            type: "contact",
            color: "#000",
            opacity: 0.8,
          }}
          adjustCamera={1}
        >
          <Earth />
          <group position={[4.2, 3.5, 0.6]}>
            <Marker rotation={[0, Math.PI / 2, 0]}>
              <div
                style={{
                  position: "absolute",
                  fontSize: 10,
                  letterSpacing: -0.5,
                  color: "orange",
                  WebkitTextStroke: "0.2px #000",
                }}
              >
                seoul
              </div>
            </Marker>
          </group>
        </Stage>
        <OrbitControls
          autoRotate
          makeDefault
          autoRotateSpeed={0.5}
          enablePan={false}
          // minPolarAngle={Math.PI / 2.1}
          // maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}

function Marker({ children, ...props }) {
  const ref = useRef();
  // This holds the local occluded state
  const [isOccluded, setOccluded] = useState();
  const [isInRange, setInRange] = useState();
  const isVisible = isInRange && !isOccluded;
  // Test distance
  const vec = new THREE.Vector3();
  useFrame((state) => {
    const range =
      state.camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 10;
    if (range !== isInRange) setInRange(range);
  });
  return (
    <group ref={ref}>
      <Html
        // 3D-transform contents
        transform
        // Hide contents "behind" other meshes
        occlude
        // Tells us when contents are occluded (or not)
        onOcclude={setOccluded}
        // We just interpolate the visible state into css opacity and transforms
        style={{
          transition: "all 0.2s",
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.25})`,
        }}
        {...props}
      >
        {children}
      </Html>
    </group>
  );
}
