"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, Scroll } from "@react-three/drei";
import Mac from "./Mac";
import Text from "./Text";

const rsqw = (t, delta = 0.1, a = 1, f = 1 / (2 * Math.PI)) =>
  (a / Math.atan(1 / delta)) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);

export default function App() {
  return (
    <div className="canvas-wrapper">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, -3.2, 40], fov: 12 }}
      >
        <color attach="background" args={["#000"]} />
        <Text
          position={[0, 0, 0]}
          head="Scroll Down."
          stat="And"
          expl="explore in Macbook"
        />
        <ScrollControls pages={5}>
          <Mac />
          <Scroll html>
            <h1
              style={{
                width: "100vw",
                fontSize: "10vw",
                position: "absolute",
                top: "475vh",
                left: "10vw",
                color: "#fff",
                textShadow: "0 0 20px #000",
              }}
            >
              Mac Pro
            </h1>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}
