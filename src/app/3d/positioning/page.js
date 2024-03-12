"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";

export default function Positioning() {
  const [positionX, setPositionX] = useState(0);
  const [positionZ, setPositionZ] = useState(0);

  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      gl={{ alpha: false }}
      camera={{ position: [0, 5, 7], fov: 50 }}
    >
      <color attach="background" args={["#f6d186"]} />
      <hemisphereLight intensity={1} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.75}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={1028}
        shadow-mapSize-height={1028}
      />
      <Plane setPositionX={setPositionX} setPositionZ={setPositionZ} />
      <gridHelper
        args={[8, 8, 0xff0000]}
        // onPointerMove={(e) => console.log(e)}
      />
      <Cube />
      {positionX && <Rollover position={[positionX, 0.5, positionZ]} />}
      <OrbitControls />
    </Canvas>
  );
}

const Plane = ({ setPositionX, setPositionZ }) => {
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e) => {
        setPositionX(Math.floor(e.point.x) + 0.5);
        setPositionZ(Math.floor(e.point.z) + 0.5);
      }}
    >
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="pink" />
    </mesh>
  );
};

const Cube = () => {
  return (
    <mesh receiveShadow castShadow position={[-3.5, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const Rollover = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" opacity={0.5} transparent />
    </mesh>
  );
};
