"use client";

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Outline,
  Selection,
} from "@react-three/postprocessing";
import Image from "next/image";
import { useState } from "react";

import Model from "./Model";
import styles from "./positioning.module.css";
import Space from "./Space";
import { useModelStore, useSpaceStore } from "./store";

export default function Positioning() {
  const models = useModelStore((state) => state.models);
  const setModels = useModelStore((state) => state.setModels);
  const sizeX = useSpaceStore((state) => state.sizeX);
  const setSizeX = useSpaceStore((state) => state.setSizeX);
  const sizeY = useSpaceStore((state) => state.sizeY);
  const setSizeY = useSpaceStore((state) => state.setSizeY);
  const sizeZ = useSpaceStore((state) => state.sizeZ);
  const setSizeZ = useSpaceStore((state) => state.setSizeZ);
  const setWallColor = useSpaceStore((state) => state.setWallColor);
  const setFloorColor = useSpaceStore((state) => state.setFloorColor);
  const controls = useSpaceStore((state) => state.controls);
  const [_, setPositionX] = useState(0);

  const wall = ["#ccc", "#d8d2b3", "#b3d0e9", "#5a7966", "#f6d3d9"];

  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ alpha: false }}
        camera={{ position: [5, 4, 5], fov: 75 }}
      >
        <Environment preset="night" background blur={1} />
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
        <directionalLight position={[5, 5, 5]} intensity={4} />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false} enabled={true}>
            <Outline
              visibleEdgeColor="green"
              hiddenEdgeColor="#377637"
              blur
              edgeStrength={100}
            />
          </EffectComposer>
          {[...models]}
        </Selection>
        {!controls && (
          <OrbitControls
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            minDistance={6}
            maxDistance={13}
          />
        )}
        <Space />
      </Canvas>
      <div className="canvas-left-text">
        <div>
          <p>Left Click And Drag - Rotate</p>
          <p>Right Click And Drag - Pan</p>
          <p>Scroll - Zoom</p>
        </div>
        <div className={styles.size}>
          <h1>방 크기</h1>
          <p>
            가로
            <input
              type="number"
              value={sizeX}
              onChange={(e) => setSizeX(e.target.value)}
            />
          </p>
          <p>
            세로
            <input
              type="number"
              value={sizeZ}
              onChange={(e) => setSizeZ(e.target.value)}
            />
          </p>
          <p>
            높이
            <input
              type="number"
              value={sizeY}
              onChange={(e) => {
                setSizeY(e.target.value);
              }}
            />
          </p>
        </div>
        <div className={styles["wall-color"]}>
          <h1>벽 색상</h1>
          <ul>
            {wall.map((e) => (
              <li
                key={e}
                style={{ backgroundColor: e }}
                onClick={() => setWallColor(e)}
              ></li>
            ))}
          </ul>
        </div>
        <div className={styles["floor-color"]}>
          <h1>바닥 종류</h1>
          <ul>
            {Array.from({ length: 4 }, (_, i) => i + 1).map((e, i) => (
              <li key={i}>
                <Image
                  width={50}
                  height={50}
                  src={`/images/floor_${i + 1}.png`}
                  alt={"floor_" + i + 1}
                  onClick={() => setFloorColor(`/images/floor_${i + 1}.png`)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.products}>
          <h1>상품 목록</h1>
          {Array.from({ length: 2 }, (_, i) => i + 1).map((e, i) => (
            <Image
              className="pointer"
              key={i}
              width={150}
              height={150}
              src={`/images/furniture/${i + 1}.avif`}
              alt={i + 1}
              onClick={() => {
                setPositionX(models.length);
                setModels([
                  ...models,
                  <Model
                    key={models.length + 1}
                    id={models.length + 1}
                    file={i + 1}
                    positionX={models.length}
                  />,
                ]);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
