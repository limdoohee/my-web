"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  BakeShadows,
  Stage,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import Earth from "./Earth";

export default function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 75 }}>
        <Stage
          environment="city"
          intensity={0.1}
          preset="soft"
          shadows={{
            type: "contact",
            color: "#000",
            opacity: 0.8,
          }}
          adjustCamera={1.5}
        >
          <Earth />
        </Stage>
        <OrbitControls
          // autoRotate
          makeDefault
          autoRotateSpeed={0.5}
          enablePan={false}
          // minPolarAngle={Math.PI / 2.1}
          // maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </div>
  );
}
