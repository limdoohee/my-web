"use client";

import { Scroll, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import Mac from "./Mac";
import Text from "./Text";

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
