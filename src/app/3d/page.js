"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage, Html, useGLTF } from "@react-three/drei";
import Earth from "./Earth";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./earth.module.css";

export default function App() {
  const cameraControlRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [polarAngle, setPolarAngle] = useState();
  const [azimuthalAngle, setAzimuthalAngle] = useState();

  const PauseControls = () => {
    // console.log("PauseControls");
    setAutoRotate(false);
    setTimeout(() => {
      // console.log("setTimeout", autoRotate);
      setAutoRotate(true);
    }, 3000);
  };

  return (
    <div className="canvas-wrapper">
      <Canvas frameloop="demand">
        <ambientLight intensity={1} />
        <Stage
          environment="city"
          intensity={0.1}
          preset="soft"
          shadows={{
            type: "contact",
            color: "#000",
            opacity: 0.8,
          }}
          adjustCamera={0.7}
        >
          <Earth />
          <group position={[-0.1, 0.4, 5.3]}>
            <Marker rotation={[0, 0, 0]}>
              <div
                style={{
                  position: "absolute",
                  fontSize: 7,
                  letterSpacing: -0.5,
                  color: "orange",
                  textShadow: "0px 0px 2px #fff",
                }}
              >
                Seoul
              </div>
            </Marker>
          </group>
        </Stage>
        <OrbitControls
          ref={cameraControlRef}
          autoRotate={autoRotate}
          makeDefault
          autoRotateSpeed={0.5}
          enablePan={false}
          onUpdate={(e) => {}}
        />
      </Canvas>
      <div className={styles.cities}>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.setPolarAngle(1.5);
            cameraControlRef.current?.setAzimuthalAngle(0);
            PauseControls();
          }}
        >
          Seoul
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.setPolarAngle(1.61);
            cameraControlRef.current?.setAzimuthalAngle(0.2);
            PauseControls();
          }}
        >
          Tokyo
        </button>
        <button
          type="button"
          onClick={() => {
            cameraControlRef.current?.setPolarAngle(0.8);
            cameraControlRef.current?.setAzimuthalAngle(1.5);
            PauseControls();
          }}
        >
          Los Angeles
        </button>
      </div>
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
