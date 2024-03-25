import React, { useRef } from "react";
import { Html, useGLTF, ScrollControls, useScroll } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import useRefs from "react-use-refs";
import * as THREE from "three";

const Mac = ({ ...props }) => {
  const { nodes, materials } = useGLTF("/models/mbp-v1-pipe.glb");
  const scroll = useScroll();
  const { width, height } = useThree((state) => state.viewport);
  const [macRef, mbp16, keyLight, stripLight, fillLight] = useRefs();

  const rsqw = (t, delta = 0.1, a = 1, f = 1 / (2 * Math.PI)) =>
    (a / Math.atan(1 / delta)) *
    Math.atan(Math.sin(2 * Math.PI * t * f) / delta);

  useFrame((state, delta) => {
    const r1 = scroll.range(0 / 4, 1 / 4);
    const r2 = scroll.range(1 / 4, 2 / 4);
    const r3 = scroll.range(2 / 4, 1);

    mbp16.current.rotation.x = Math.PI - (Math.PI / 2) * rsqw(r1) + r2 * 0.33;

    macRef.current.rotation.y = THREE.MathUtils.damp(
      macRef.current.rotation.y,
      -(Math.PI / 2) * r2,
      4,
      delta
    );

    macRef.current.rotation.y = THREE.MathUtils.damp(
      macRef.current.rotation.y,
      -Math.PI * r3 * 6.8,
      4,
      delta
    );
    keyLight.current.position.set(
      0.25 + -15 * (1 - r1),
      4 + 11 * (1 - r1),
      3 + 2 * (1 - r1)
    );
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
      <group
        scale={width / 67}
        position={[0, -height / 2.65, 0]}
        dispose={null}
        ref={macRef}
      >
        <group
          ref={mbp16}
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
        <mesh
          geometry={nodes.body_2.geometry}
          material={materials.blackmatte}
        />
      </group>
    </>
  );
};

export default Mac;
