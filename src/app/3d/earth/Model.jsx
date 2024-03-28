import { useGLTF } from "@react-three/drei";
import React from "react";

export default function Model(props) {
  const { nodes, materials } = useGLTF("/models/Earth.glb");
  return (
    <mesh
      rotation={[0.6, Math.PI / 3.3, 0]}
      scale={0.01}
      castShadow
      geometry={nodes.Cube001.geometry}
      material={materials["Default OBJ"]}
    />
  );
}

useGLTF.preload("/models/Earth.glb");
