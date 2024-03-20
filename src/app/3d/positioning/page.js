"use client";

import { useState } from "react";
import { useModelStore, useSpaceStore } from "./store";
import { Canvas } from "@react-three/fiber";
import {
  DragControls,
  Environment,
  Html,
  OrbitControls,
  useCursor,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import Image from "next/image";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import styles from "./positioning.module.css";
import { BackSide } from "three";
import * as THREE from "three";

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
  const [positionX, setPositionX] = useState(0);

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

const Space = () => {
  const sizeX = useSpaceStore((state) => state.sizeX);
  const sizeY = useSpaceStore((state) => state.sizeY);
  const sizeZ = useSpaceStore((state) => state.sizeZ);
  const wallColor = useSpaceStore((state) => state.wallColor);
  const floorColor = useSpaceStore((state) => state.floorColor);
  const texture = useTexture(floorColor);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(sizeX / 2, sizeZ / 2);
  return (
    <>
      <group>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeZ]} />
          <meshBasicMaterial map={texture} />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeZ]} />
          <shadowMaterial transparent opacity={0.25} color={"#000"} />
        </mesh>
      </group>
      <group>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[-sizeX / 2, sizeY / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeZ, sizeY]} />
          <meshStandardMaterial color={wallColor} side={BackSide} />
        </mesh>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[-sizeX / 2, sizeY / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeZ, sizeY]} />
          <shadowMaterial
            transparent
            opacity={0.25}
            color={"#000"}
            side={BackSide}
          />
        </mesh>
      </group>
      <group>
        <mesh
          rotation={[0, Math.PI, 0]}
          position={[0, sizeY / 2, -sizeZ / 2]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeY]} />
          <meshStandardMaterial color={wallColor} side={BackSide} />
        </mesh>
        <mesh
          rotation={[0, Math.PI, 0]}
          position={[0, sizeY / 2, -sizeZ / 2]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeY]} />
          <shadowMaterial
            transparent
            opacity={0.25}
            color={"#000"}
            side={BackSide}
          />
        </mesh>
      </group>
    </>
  );
};

const Model = ({ file, id, positionX }) => {
  const models = useModelStore((state) => state.models);
  const setModels = useModelStore((state) => state.setModels);

  const sizeX = useSpaceStore((state) => state.sizeX);
  const sizeZ = useSpaceStore((state) => state.sizeZ);
  const setControls = useSpaceStore((state) => state.setControls);

  const [hovered, set] = useState(false);
  const [selected, setSelected] = useState(false);
  const [rotate, setRotate] = useState(0);
  useCursor(hovered);

  const glb = useGLTF(`/models/furniture/${file}.glb`, true);
  glb.scene.children.forEach((mesh, i) => {
    mesh.castShadow = true;
    mesh.children && mesh.children.forEach((e) => (e.castShadow = true));
  });

  return (
    <Select enabled={hovered}>
      <DragControls
        autoTransform={true}
        axisLock="y"
        dragLimits={[
          [-((sizeX - 1) / 2) - positionX, (sizeX - 1) / 2 - positionX],
          0,
          [-((sizeZ - 1) / 2), (sizeZ - 1) / 2],
        ]}
        onDragStart={(e) => setControls(true)}
        onDragEnd={(e) => setControls(false)}
      >
        <primitive
          castShadow
          receiveShadow
          object={glb.scene.clone()}
          onPointerOver={() => set(true)}
          onPointerOut={() => {
            set(false);
          }}
          onPointerMissed={(e) => setSelected(false)}
          onClick={(e) => setSelected(id)}
          position={[positionX, 0, 0]}
          rotation={[0, rotate * (Math.PI / 180), 0]}
        >
          {selected && (
            <Html distanceFactor={10} className={styles["action-panel"]}>
              <div
                className="pointer"
                onClick={(e) => {
                  const newData = models.filter((e) => +e.key !== selected);
                  setModels(newData);
                  setSelected(null);
                }}
              >
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
                  <line x1="10" y1="11" x2="10" y2="17" />{" "}
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div>
                <svg
                  className="h-6 w-6 text-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16.3 5h.7a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h5l-2.82 -2.82m0 5.64l2.82 -2.82"
                    transform="rotate(-45 12 12)"
                  />
                </svg>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotate}
                onChange={(e) => setRotate(e.target.value)}
                onPointerOver={() => setControls(true)}
                onPointerOut={(e) => setControls(false)}
                list="marker"
              />
              <datalist id="marker">
                <option value={-180}></option>
                <option value={-90}></option>
                <option value={0}></option>
                <option value={90}></option>
                <option value={180}></option>
              </datalist>
            </Html>
          )}
        </primitive>
      </DragControls>
    </Select>
  );
};
