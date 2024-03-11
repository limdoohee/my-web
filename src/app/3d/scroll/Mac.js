import React, { forwardRef } from "react";
import { Html, useGLTF, ScrollControls, useScroll } from "@react-three/drei";

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

Mac.displayName = "Mac";

export default Mac;
