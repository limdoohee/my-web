"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  DragControls,
  Environment,
  OrbitControls,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import Image from "next/image";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

export default function Positioning() {
  const [models, setModels] = useState([]);
  const [selected, setSelected] = useState();
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
        <gridHelper position={[0, 0, 0]} args={[8, 8]} />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false} enabled={true}>
            <Outline
              visibleEdgeColor="green"
              hiddenEdgeColor="#377637"
              blur
              edgeStrength={5}
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
                    positionX={positionX}
                    setSelected={setSelected}
                    controls={controls}
                    setControls={setControls}
                  />,
                ]);
              }}
            />
          ))}
        </div>
      </div>
      <div className="canvas-right-text">
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
      </div>
    </div>
  );
}

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshDepthMaterial opacity={0} />
    </mesh>
  );
};

const Model = ({ file, setSelected, positionX, controls, setControls, id }) => {
  const [hovered, set] = useState(false);
  useCursor(hovered);

  const glb = useGLTF(`/models/furniture/${file}.glb`, true);

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
          object={glb.scene.clone()}
          onPointerOver={() => {
            set(true);
          }}
          onPointerOut={() => {
            set(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(id);
          }}
          position={[positionX, 0, 0]}
        />
      </DragControls>
    </Select>
  );
};
