"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  DragControls,
  Environment,
  Html,
  OrbitControls,
  useCursor,
  useGLTF,
  AccumulativeShadows,
  RandomizedLight,
  Environment as EnvironmentImpl,
} from "@react-three/drei";
import Image from "next/image";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import styles from "./positioning.module.css";
import { MeshBasicMaterial } from "three";

export default function Positioning() {
  const [models, setModels] = useState([]);
  const [controls, setControls] = useState(false);
  const [positionX, setPositionX] = useState(0);
  const [positionZ, setPositionZ] = useState(0);

  return (
    <div className="canvas-wrapper">
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ alpha: false }}
        camera={{ position: [0, 6, 10], fov: 50 }}
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
        <Plane />
      </Canvas>
      <div className="canvas-left-text">
        <p>Left Click And Drag - Rotate</p>
        <p>Right Click And Drag - Pan</p>
        <p>Scroll - Zoom</p>
        <div className="products">
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
                    controls={controls}
                    setControls={setControls}
                  />,
                ]);
              }}
            />
          ))}
        </div>
      </div>
      {/* <div className="canvas-right-text">
        <p
          className="pointer"
          onClick={() => {
            if (selected) {
              const newData = models.filter((e) => +e.key !== selected);
              setModels(newData);
              setSelected(null);
            } else {
              alert("모델 선택 후 삭제하세요!");
            }
          }}
        >
          Delete model
        </p>
      </div> */}
    </div>
  );
}

const Plane = () => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={"#ccc"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <shadowMaterial transparent opacity={0.25} color={"#000"} />
      </mesh>
    </group>
  );
};

const Model = ({ file, positionX, setControls, id }) => {
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
        dragLimits={[[-3.5 - positionX, 3.5 - positionX], 0, [-3.5, 3.5]]}
        onDragStart={(e) => setControls(true)}
        onDragEnd={(e) => setControls(false)}
      >
        <primitive
          castShadow
          receiveShadow
          object={glb.scene.clone()}
          onPointerOver={() => {
            set(true);
          }}
          onPointerOut={() => {
            set(false);
          }}
          onPointerMissed={(e) => {
            setSelected(false);
          }}
          onClick={(e) => {
            setSelected(id);
          }}
          position={[positionX, 0, 0]}
          rotation={[0, rotate * (Math.PI / 180), 0]}
        >
          {selected && (
            <Html distanceFactor={10} className={styles["action-panel"]}>
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
              {/* <div>
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
          </div> */}
            </Html>
          )}
        </primitive>
      </DragControls>
    </Select>
  );
};
