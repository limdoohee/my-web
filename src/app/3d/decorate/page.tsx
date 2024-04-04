"use client";

import {
  Environment,
  Loader,
  OrbitControls,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree, Vector3 } from "@react-three/fiber";
import React, { useState } from "react";
import { Suspense } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

export default function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 0, 100], fov: 22 }}
      >
        <color attach="background" args={["#fff"]} />
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
              <shadowMaterial transparent color="#666" opacity={0.25} />
            </mesh>
          </group>
          <hemisphereLight intensity={0.2} />
          <ambientLight intensity={0.5} />
          <Environment preset="warehouse" />
        </Suspense>
        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <Loader />
      <div className="canvas-center-text">
        <p>Choose Your favorite</p>
      </div>
    </div>
  );
}

const bottleMaterial = new THREE.MeshPhysicalMaterial({
  color: "pink",
});

const capMaterial = new THREE.MeshStandardMaterial({
  color: "pink",
});

const Bottles = () => {
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
};

type bottleType = {
  position: Vector3;
  glas: string;
  cap: string;
};

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    ["default"]: THREE.MeshStandardMaterial;
  };
};

const Bottle = ({ position, glas, cap }: bottleType) => {
  const { nodes } = useGLTF("/models/bottles.glb") as GLTFResult;
  const { scene } = useThree();
  const group = scene.children.filter((e) => e.type === "Group");
  const [hovered, set] = useState(0);
  const [scale, setScale] = useState(1);
  useCursor(Boolean(hovered));

  return (
    <group
      name={glas}
      scale={scale}
      rotation={[Math.PI / 2, 0, 3]}
      position={position}
      onPointerOver={() => set(1)}
      onPointerOut={() => set(0)}
      onClick={(e) => {
        group["0"].children
          .filter((e) => e.type === "Group")[0]
          .children.map((e) => (e.visible = e.name === glas ? true : false));
        setScale(1.5);
      }}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes[glas].geometry}
        material={bottleMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes[cap].geometry}
        material={capMaterial}
      />
    </group>
  );
};

useGLTF.preload("/models/bottles.glb");
