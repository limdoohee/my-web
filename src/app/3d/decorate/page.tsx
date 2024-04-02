"use client";

import {
  Environment,
  Loader,
  OrbitControls,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Suspense, useState } from "react";
import * as THREE from "three";

export default function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0, 100], fov: 22 }}
      >
        <fog attach="fog" args={["#f0f0f0", 100, 150]} />
        <color attach="background" args={["#f0f0f0"]} />
        <spotLight
          penumbra={1}
          angle={1}
          castShadow
          position={[10, 60, -5]}
          intensity={8}
          shadow-mapSize={[512, 512]}
        />
        <Suspense fallback={null}>
          <group position={[2.5, -12, 0]}>
            <Bottles />
            <mesh
              rotation-x={-Math.PI / 2}
              position={[0, 0.01, 0]}
              scale={[200, 200, 200]}
              receiveShadow
              renderOrder={100000}
            >
              <planeGeometry />
              <shadowMaterial transparent color="#251005" opacity={0.25} />
            </mesh>
          </group>
          <hemisphereLight intensity={0.2} />
          <ambientLight intensity={0.5} />
          <Environment preset="warehouse" />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Loader />
    </div>
  );
}

const bottleMaterial = new THREE.MeshPhysicalMaterial({
  color: "pink",
});

const capMaterial = new THREE.MeshStandardMaterial({
  color: "pink",
});

function Bottles() {
  return (
    <group dispose={null} scale={[0.1, 0.1, 0.1]}>
      <Bottle position={[140, 0, 0]} glas="Untitled018" cap="Untitled018_1" />
      <Bottle position={[80, 0, 0]} glas="Untitled078" cap="Untitled078_1" />
      <Bottle position={[-2, 0, 0]} glas="Untitled064" cap="Untitled064_1" />
      <Bottle position={[-90, 0, 0]} glas="Untitled052" cap="Untitled052_1" />
      <Bottle position={[-140, 0, 0]} glas="Untitled072" cap="Untitled072_1" />
      <Bottle position={[-180, 0, 0]} glas="Untitled007" cap="Untitled007_1" />
    </group>
  );
}

function Bottle({ glas, cap, ...props }) {
  const { nodes } = useGLTF("/models/bottles.glb");
  const [hovered, set] = useState(false);
  useCursor(hovered);

  return (
    <group
      rotation={[Math.PI / 2, 0, 3]}
      {...props}
      onPointerOver={() => set(true)}
      onPointerOut={() => set(false)}
    >
      <group>
        <mesh
          castShadow
          geometry={nodes[glas].geometry}
          material={bottleMaterial}
        />
        <mesh
          castShadow
          geometry={nodes[cap].geometry}
          material={capMaterial}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/bottles.glb");
