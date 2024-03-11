"use client";

import * as THREE from "three";
import React, { forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, ScrollControls, useScroll } from "@react-three/drei";
import useRefs from "react-use-refs";
import styles from "./scroll.module.css";

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
        <ScrollControls pages={5}>
          <Composition />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

function Composition({ ...props }) {
  const scroll = useScroll();
  const { width, height } = useThree((state) => state.viewport);
  const [group, mbp16, keyLight, stripLight, fillLight, text] = useRefs();

  useFrame((state, delta) => {
    const r1 = scroll.range(0 / 4, 1 / 4);
    const r2 = scroll.range(1 / 4, 2 / 4);
    const r3 = scroll.visible(1 / 32, 3 / 32);

    mbp16.current.rotation.x = Math.PI - (Math.PI / 2) * rsqw(r1) + r2 * 0.33;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      (-Math.PI / 1.45) * r2,
      4,
      delta
    );
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      (-width / 7) * r2,
      4,
      delta
    );
    group.current.scale.x =
      group.current.scale.y =
      group.current.scale.z =
        THREE.MathUtils.damp(
          group.current.scale.z,
          1 + 0.24 * (1 - rsqw(r1)),
          4,
          delta
        );
    keyLight.current.position.set(
      0.25 + -15 * (1 - r1),
      4 + 11 * (1 - r1),
      3 + 2 * (1 - r1)
    );
    text.current?.classList.toggle(styles.show, r3);
  });
  return (
    <>
      <spotLight position={[0, -width * 0.7, 0]} intensity={0.5} />
      <directionalLight ref={keyLight} castShadow intensity={6}>
        <orthographicCamera
          attachObject={["shadow", "camera"]}
          args={[-10, 10, 10, -10, 0.5, 30]}
        />
      </directionalLight>
      <group ref={group} position={[0, -height / 2.65, 0]} {...props}>
        <spotLight
          ref={stripLight}
          position={[width * 2.5, 0, width]}
          angle={0.19}
          penumbra={1}
          intensity={0.25}
        />
        <spotLight
          ref={fillLight}
          position={[0, -width / 2.4, -width * 2.2]}
          angle={0.2}
          penumbra={1}
          intensity={2}
          distance={width * 3}
        />
        <Mac ref={mbp16} scale={width / 67} />
        <Text
          ref={text}
          head="Scroll Down."
          stat="And"
          expl="explore in Macbook Screen"
        />
      </group>
    </>
  );
}

const Text = React.forwardRef(({ head, stat, expl, ...props }, ref) => {
  return (
    <Html
      position={[0, 1, 1]}
      center
      ref={ref}
      occlude
      // transform
      className={styles["text-wrapper"]}
      {...props}
    >
      <div>{head}</div>
      <h1>{stat}</h1>
      <h2>{expl}</h2>
    </Html>
  );
});

const Mac = React.forwardRef(({ ...props }, ref) => {
  const { nodes, materials } = useGLTF("/models/mbp-v1-pipe.glb");
  return (
    <group {...props} dispose={null}>
      <group
        ref={ref}
        position={[0, -0.43, -11.35]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <mesh
          geometry={nodes.back_1.geometry}
          material={materials.blackmatte}
        />
        <mesh
          receiveShadow
          castShadow
          geometry={nodes.back_2.geometry}
          material={materials.aluminium}
        />
        <mesh geometry={nodes.matte.geometry}>
          <meshLambertMaterial color={"#fff"} toneMapped={false} />
        </mesh>
      </group>
      <mesh
        geometry={nodes.body_1.geometry}
        material={materials.aluminium}
        material-color="#aaaaaf"
        material-envMapIntensity={0.2}
      />
      <mesh geometry={nodes.body_2.geometry} material={materials.blackmatte} />
    </group>
  );
});
