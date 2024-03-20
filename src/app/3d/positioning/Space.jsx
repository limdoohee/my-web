import { useSpaceStore } from "./store";
import {
  DragControls,
  Environment,
  Html,
  OrbitControls,
  useCursor,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { BackSide } from "three";
import * as THREE from "three";

const Space = () => {
  const sizeX = useSpaceStore((state) => state.sizeX);
  const sizeY = useSpaceStore((state) => state.sizeY);
  const sizeZ = useSpaceStore((state) => state.sizeZ);
  const wallColor = useSpaceStore((state) => state.wallColor);
  const floorColor = useSpaceStore((state) => state.floorColor);
  const texture = useTexture(floorColor);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(sizeX / 2, sizeZ / 2);
  return (
    <>
      <group>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeZ]} />
          <meshBasicMaterial map={texture} />
        </mesh>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeZ]} />
          <shadowMaterial transparent opacity={0.25} color={"#000"} />
        </mesh>
      </group>
      <group>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[-sizeX / 2, sizeY / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeZ, sizeY]} />
          <meshStandardMaterial color={wallColor} side={BackSide} />
        </mesh>
        <mesh
          rotation={[0, -Math.PI / 2, 0]}
          position={[-sizeX / 2, sizeY / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[sizeZ, sizeY]} />
          <shadowMaterial
            transparent
            opacity={0.25}
            color={"#000"}
            side={BackSide}
          />
        </mesh>
      </group>
      <group>
        <mesh
          rotation={[0, Math.PI, 0]}
          position={[0, sizeY / 2, -sizeZ / 2]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeY]} />
          <meshStandardMaterial color={wallColor} side={BackSide} />
        </mesh>
        <mesh
          rotation={[0, Math.PI, 0]}
          position={[0, sizeY / 2, -sizeZ / 2]}
          receiveShadow
        >
          <planeGeometry args={[sizeX, sizeY]} />
          <shadowMaterial
            transparent
            opacity={0.25}
            color={"#000"}
            side={BackSide}
          />
        </mesh>
      </group>
    </>
  );
};

export default Space;
