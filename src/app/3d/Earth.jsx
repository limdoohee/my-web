import React, { useRef } from "react";
import { useGLTF, Edges } from "@react-three/drei";
import * as THREE from "three";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/models/Earth.glb");

  return (
    <mesh
      rotation={[0, Math.PI / 1.3, 0]}
      scale={0.01}
      castShadow
      geometry={nodes.Cube001.geometry}
      material={materials["Default OBJ"]}
    />
  );
}

useGLTF.preload("/models/Earth.glb");
