"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useCursor } from "@react-three/drei";

export default function Positioning() {
  const [cubes, setCubes] = useState([]);
  const [positionX, setPositionX] = useState(0);
  const [positionZ, setPositionZ] = useState(0);

  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ alpha: false }}
        camera={{ position: [2, 5, 7], fov: 50 }}
      >
        <Environment preset="apartment" background blur={1} />
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
        <Plane
          setPositionX={setPositionX}
          setPositionZ={setPositionZ}
          cubes={cubes}
          setCubes={setCubes}
        />
        <gridHelper position={[0, 0, -2]} args={[8, 8]} />
        {positionX && <Rollover position={[positionX, 0.5, positionZ]} />}
        {[...cubes]}
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          minDistance={6}
          maxDistance={13}
        />
      </Canvas>
      <div className="canvas-upper-text">
        <p>Left Click And Drag - Rotate</p>
        <p>Right Click And Drag - Pan</p>
        <p>Scroll - Zoom</p>
      </div>
    </div>
  );
}

const Plane = ({ setPositionX, setPositionZ, cubes, setCubes }) => {
  const [hovered, set] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, -2]}
      onPointerOut={() => set(false)}
      onPointerMove={(e) => {
        set(true);
        setPositionX(Math.floor(e.point.x) + 0.5);
        setPositionZ(Math.floor(e.point.z) + 0.5);
      }}
      onClick={(e) => {
        setCubes([
          ...cubes,
          <Cube
            key={cubes.length + 1}
            id={cubes.length + 1}
            position={[
              Math.floor(e.point.x) + 0.5,
              0.5,
              Math.floor(e.point.z) + 0.5,
            ]}
          />,
        ]);
      }}
    >
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const Cube = ({ position, id }) => {
  return (
    <mesh receiveShadow castShadow position={position} key={id}>
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
