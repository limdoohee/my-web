"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
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
  const [model, setModel] = useState([]);
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
        <gridHelper position={[0, 0, -2]} args={[8, 8]} />
        <Selection>
          <EffectComposer multisampling={8} autoClear={false} enabled={true}>
            <Outline
              visibleEdgeColor="green"
              hiddenEdgeColor="red"
              blur
              edgeStrength={5}
            />
          </EffectComposer>
          {[...model]}
        </Selection>
        <OrbitControls
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={6}
          maxDistance={13}
        />
        <Plane />
      </Canvas>
      <div className="canvas-left-text">
        <p>Left Click And Drag - Rotate</p>
        <p>Right Click And Drag - Pan</p>
        <p>Scroll - Zoom</p>
        <div className="products">
          {Array.from({ length: 2 }, (_, i) => i + 1).map((e, i) => (
            <Image
              key={i}
              width={150}
              height={150}
              src={`/images/furniture/${i + 1}.avif`}
              alt={i + 1}
              onClick={() => {
                setModel([
                  ...model,
                  <Model
                    key={model.length + 1}
                    id={i + 1}
                    position={[0, 0.5, 0]}
                  />,
                ]);
              }}
            />
          ))}
        </div>
      </div>
      <div className="canvas-right-text">
        <p>Click - Rotate 90 degree</p>
      </div>
    </div>
  );
}

const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

const Model = ({ id }) => {
  const [hovered, set] = useState(false);
  useCursor(hovered);

  const glb = useGLTF(`/models/furniture/${id}.glb`, true);

  return (
    <Select enabled={hovered}>
      <primitive
        object={glb.scene}
        onPointerOver={() => set(true)}
        onPointerOut={() => set(false)}
      />
    </Select>
  );
};
