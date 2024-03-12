"use client";

import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Image,
  Environment,
  ScrollControls,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { easing } from "maath";
import "./util";
import { useRouter } from "next/navigation";
import styles from "./main.module.css";

const pageList = [
  { id: 1, url: "/ui/carousel/progress" },
  { id: 2, url: "/3d/scroll" },
  { id: 3, url: "/3d/earth" },
  { id: 4, url: "https://web-diary-e3eb7.web.app/" },
  { id: 5, url: "/3d/compare" },
];

export default function Home() {
  return (
    <div className={styles["canvas-wrapper"]}>
      <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
        <fog attach="fog" args={["#a79", 8.5, 12]} />
        <ScrollControls pages={4} infinite>
          <Rig rotation={[0, 0, 0.15]}>
            <Carousel />
          </Rig>
        </ScrollControls>
        <Environment preset="night" background blur={0.5} />
      </Canvas>
      <div className="canvas-upper-text">Scroll up & down</div>
    </div>
  );
}

function Rig(props) {
  const ref = useRef();
  const scroll = useScroll();
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2); // Rotate contents
    state.events.update(); // Raycasts every frame rather than on pointer-move
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta
    ); // Move camera
    state.camera.lookAt(0, 0, 0); // Look at center
  });
  return <group ref={ref} {...props} />;
}

function Carousel({ radius = 1.4, count = 5 }) {
  return (
    <>
      {pageList.map((e, i) => (
        <Card
          key={e.id}
          src={`/images/${e.id}.png`}
          url={e.url}
          position={[
            Math.sin((i / count) * Math.PI * 2) * radius,
            0,
            Math.cos((i / count) * Math.PI * 2) * radius,
          ]}
          rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
        />
      ))}
    </>
  );
}

function Card({ src, url, ...props }) {
  const router = useRouter();
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.25 : 1, 0.1, delta);
    easing.damp(
      ref.current.material,
      "radius",
      hovered ? 0.25 : 0.1,
      0.2,
      delta
    );
    easing.damp(ref.current.material, "zoom", hovered ? 0.8 : 1.2, 0.2, delta);
  });
  return (
    <Image
      ref={ref}
      url={src}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      onClick={() => router.push(url)}
      {...props}
    >
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  );
}
