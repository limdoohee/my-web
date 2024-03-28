"use client";

import { Html, OrbitControls, Stage } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import data from "./data.json";
import styles from "./earth.module.css";
import Model from "./Model";

export default function Earth() {
  const cameraControlRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [polarAngle, setPolarAngle] = useState();
  const [azimuthalAngle, setAzimuthalAngle] = useState();

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
          <Model />
          {data.map((e) => (
            <group position={e.position} key={e.city}>
              <Marker rotation={[0, `${e.angle[1]}`, 0]} city={e.city} />
            </group>
          ))}
        </Stage>
        <OrbitControls
          ref={cameraControlRef}
          autoRotate={autoRotate}
          makeDefault
          autoRotateSpeed={0.5}
          enablePan={false}
          enableZoom={false}
        />
      </Canvas>
      <div className={styles.cities}>
        {data.map((e) => (
          <button
            key={e.city}
            onClick={() => {
              cameraControlRef.current?.setPolarAngle(e.angle[0]);
              cameraControlRef.current?.setAzimuthalAngle(e.angle[1]);
            }}
          >
            {e.city}
          </button>
        ))}
      </div>
      <div>
        <ul className={styles.functions}>
          <li
            onClick={() => {
              setAutoRotate(!autoRotate);
            }}
          >
            Rotate {autoRotate ? "pause" : "play"}
          </li>
        </ul>
      </div>
    </div>
  );
}

function Marker({ ...props }) {
  const ref = useRef();
  const [isOccluded, setOccluded] = useState();
  const [isInRange, setInRange] = useState();
  const isVisible = isInRange && !isOccluded;
  const vec = new THREE.Vector3();
  useFrame((state) => {
    const range =
      state.camera.position.distanceTo(ref.current.getWorldPosition(vec)) <= 10;
    if (range !== isInRange) setInRange(range);
  });
  return (
    <group ref={ref}>
      <Html
        transform
        occlude
        onOcclude={setOccluded}
        style={{
          transition: "all 0.2s",
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.25})`,
        }}
        {...props}
      >
        <div
          style={{
            position: "absolute",
            fontSize: 7,
            letterSpacing: -0.5,
            color: "orange",
            textShadow: "0px 0px 2px #fff",
          }}
        >
          {props.city}
        </div>
      </Html>
    </group>
  );
}
