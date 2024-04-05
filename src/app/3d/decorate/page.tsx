"use client";

import { animated, useSpring } from "@react-spring/three";
import { Environment, Loader, useCursor, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { Suspense } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import { useStore } from "./store";

export default function App() {
  const click = useStore((state) => state.click);
  return (
    <div className="canvas-wrapper">
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 22, near: 1 }}>
        <color attach="background" args={[click ? "pink" : "#fff"]} />
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
        {/* <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} /> */}
      </Canvas>
      <Loader />
      <Html />
    </div>
  );
}

const bottleMaterial = new THREE.MeshPhysicalMaterial({
  color: "#fff",
});

const capMaterial = new THREE.MeshStandardMaterial({
  color: "#fff",
});

const Bottles = () => {
  return (
    <group dispose={null} scale={[0.1, 0.1, 0.1]}>
      <Bottle positionX={140} glas="Untitled018" cap="Untitled018_1" />
      <Bottle positionX={80} glas="Untitled078" cap="Untitled078_1" />
      <Bottle positionX={-2} glas="Untitled064" cap="Untitled064_1" />
      <Bottle positionX={-90} glas="Untitled052" cap="Untitled052_1" />
      <Bottle positionX={-140} glas="Untitled072" cap="Untitled072_1" />
      <Bottle positionX={-180} glas="Untitled007" cap="Untitled007_1" />
    </group>
  );
};

type bottleType = {
  positionX: number;
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

const Bottle = ({ positionX, glas, cap }: bottleType) => {
  const click = useStore((state) => state.click);
  const setClick = useStore((state) => state.setClick);
  const clickedName = useStore((state) => state.clickedName);
  const setClickedName = useStore((state) => state.setClickedName);
  const { nodes } = useGLTF("/models/bottles.glb") as GLTFResult;
  const [hovered, set] = useState(0);
  useCursor(Boolean(hovered));

  const { scale } = useSpring({ scale: click ? 0 : 1 });
  const { x } = useSpring({
    x: click ? -180 : positionX,
  });
  return (
    <animated.group
      name={glas}
      scale={clickedName === glas ? 1.5 : scale}
      rotation={[Math.PI / 2, 0, 3]}
      position-x={x}
      onPointerOver={(e) => {
        e.stopPropagation();
        set(1);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        set(0);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!click) {
          setClick(true);
          setClickedName(glas);
        }
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
    </animated.group>
  );
};

const Html = () => {
  const click = useStore((state) => state.click);
  const setClick = useStore((state) => state.setClick);
  const setClickedName = useStore((state) => state.setClickedName);

  return (
    <>
      {!click && (
        <div className="canvas-center-text">
          <p>Choose Your favorite</p>
        </div>
      )}
      {click && (
        <div
          className="canvas-left-text"
          onClick={() => {
            setClick(false);
            setClickedName("");
          }}
        >
          <p>Back</p>
        </div>
      )}
    </>
  );
};

useGLTF.preload("/models/bottles.glb");
