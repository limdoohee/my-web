import { DragControls, Html, useCursor, useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import { useState } from "react";

import styles from "./positioning.module.css";
import { useModelStore, useSpaceStore } from "./store";

const Model = ({ file, id, positionX }) => {
  const models = useModelStore((state) => state.models);
  const setModels = useModelStore((state) => state.setModels);

  const sizeX = useSpaceStore((state) => state.sizeX);
  const sizeZ = useSpaceStore((state) => state.sizeZ);
  const setControls = useSpaceStore((state) => state.setControls);

  const [hovered, set] = useState(false);
  const [selected, setSelected] = useState(false);
  const [rotate, setRotate] = useState(0);
  useCursor(hovered);

  const glb = useGLTF(`/models/furniture/${file}.glb`, true);
  glb.scene.children.forEach((mesh, i) => {
    mesh.castShadow = true;
    mesh.children && mesh.children.forEach((e) => (e.castShadow = true));
  });

  return (
    <Select enabled={hovered}>
      <DragControls
        autoTransform={true}
        axisLock="y"
        dragLimits={[
          [-((sizeX - 1) / 2) - positionX, (sizeX - 1) / 2 - positionX],
          0,
          [-((sizeZ - 1) / 2), (sizeZ - 1) / 2],
        ]}
        onDragStart={(e) => setControls(true)}
        onDragEnd={(e) => setControls(false)}
      >
        <primitive
          castShadow
          receiveShadow
          object={glb.scene.clone()}
          onPointerOver={() => set(true)}
          onPointerOut={() => {
            set(false);
          }}
          onPointerMissed={(e) => setSelected(false)}
          onClick={(e) => setSelected(id)}
          position={[positionX, 0, 0]}
          rotation={[0, rotate * (Math.PI / 180), 0]}
        >
          {selected && (
            <Html distanceFactor={10} className={styles["action-panel"]}>
              <div
                className="pointer"
                onClick={(e) => {
                  const newData = models.filter((e) => +e.key !== selected);
                  setModels(newData);
                  setSelected(null);
                }}
              >
                <svg
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
                  <line x1="10" y1="11" x2="10" y2="17" />{" "}
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div>
                <svg
                  className="h-6 w-6 text-gray-700"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16.3 5h.7a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h5l-2.82 -2.82m0 5.64l2.82 -2.82"
                    transform="rotate(-45 12 12)"
                  />
                </svg>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotate}
                onChange={(e) => setRotate(e.target.value)}
                onPointerOver={() => setControls(true)}
                onPointerOut={(e) => setControls(false)}
                list="marker"
              />
              <datalist id="marker">
                <option value={-180}></option>
                <option value={-90}></option>
                <option value={0}></option>
                <option value={90}></option>
                <option value={180}></option>
              </datalist>
            </Html>
          )}
        </primitive>
      </DragControls>
    </Select>
  );
};

export default Model;
