import React, { useRef } from "react";
import { useGLTF, Edges } from "@react-three/drei";
import * as THREE from "three";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/models/Earth.glb");

  return (
    <mesh
      castShadow
      geometry={nodes.Cube001.geometry}
      material={materials["Default OBJ"]}
    />
  );
}

useGLTF.preload("/models/Earth.glb");
