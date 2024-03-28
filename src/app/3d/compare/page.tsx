"use client";
import React from "react";
import { CopyBlock, dracula } from "react-code-blocks";

import Cube2 from "../../component/3d/r3f/cube";
import Cube1 from "../../component/3d/threejs/cube";

export default function Page() {
  return (
    <div className="flex gap-20">
      <div>
        <Cube1 />
        <ThreeJSCode />
      </div>
      <div>
        <Cube2 />
        <R3FCode />
      </div>
    </div>
  );
}

const ThreeJSCode = () => {
  return (
    <CopyBlock
      text={`
      import React, { useEffect } from "react";
      import * as THREE from "three";
      
      export default function Cube() {
        useEffect(() => {
          const scene = new THREE.Scene();
          const raycaster = new THREE.Raycaster();
          const pointer = new THREE.Vector2();
          let currentIntersect = null;
      
          const canvas = document.getElementById("canvas");
          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
          });
          renderer.setSize(window.innerWidth / 2, 500);
          renderer.setPixelRatio(window.devicePixelRatio);
      
          const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 2 / 500,
            0.01,
            1000
          );
          camera.position.set(0, 0, 5);
      
          scene.add(new THREE.AmbientLight(0xffffff, Math.PI / 2));
          const spotLight = new THREE.SpotLight(0xffffff, Math.PI, "", 0.15, 1, 0);
          spotLight.position.set(10, 10, 10);
          scene.add(spotLight);
          const pointLight = new THREE.PointLight(0xffffff, Math.PI, "", 0);
          pointLight.position.set(-10, -10, -10);
          scene.add(pointLight);
      
          var geometry1 = new THREE.BoxGeometry(1, 1, 1);
          var material1 = new THREE.MeshStandardMaterial({ color: "orange" });
          var cube1 = new THREE.Mesh(geometry1, material1);
          cube1.position.set(-1.2, 0, 0);
          scene.add(cube1);
      
          var geometry2 = new THREE.BoxGeometry(1, 1, 1);
          var material2 = new THREE.MeshStandardMaterial({ color: "orange" });
          var cube2 = new THREE.Mesh(geometry2, material2);
          cube2.position.set(1.2, 0, 0);
          scene.add(cube2);
      
          canvas.addEventListener("mousemove", onMouseMove);
          canvas.addEventListener("click", onClick);
      
          function onMouseMove(event) {
            event.preventDefault();
            pointer.x = (event.clientX / canvas.clientWidth) * 2 - 1;
            pointer.y = -(event.clientY / 500) * 2 + 1;
          }
      
          function onClick(event) {
            if (currentIntersect) {
              if (currentIntersect.object.scale.x == 1) {
                currentIntersect.object.scale.set(1.5, 1.5, 1.5);
                return;
              }
              if (currentIntersect.object.scale.x == 1.5) {
                currentIntersect.object.scale.set(1, 1, 1);
                return;
              }
            }
          }
      
          const objectsToTest = [cube1, cube2];
      
          function render() {
            requestAnimationFrame(render);
      
            raycaster.setFromCamera(pointer, camera);
      
            const intersects = raycaster.intersectObjects(objectsToTest);
            if (intersects.length) {
              if (!currentIntersect) {
                intersects[0].object.material.color.set("hotpink");
              }
              currentIntersect = intersects[0];
            } else {
              if (currentIntersect) {
                for (const object of objectsToTest) {
                  if (!intersects.find((intersect) => intersect.object === object)) {
                    object.material.color.set("orange");
                  }
                }
              }
              currentIntersect = null;
            }
      
            cube1.rotation.x += 0.01;
            cube2.rotation.x += 0.01;
            renderer.render(scene, camera);
          }
      
          render();
        }, []);
      
        return (
          <div style={{ height: "500px" }}>
            <canvas id="canvas"></canvas>
          </div>
        );
      }
      
      // 유용한 사이트 : https://sbcode.net/threejs/
      `}
      language="jsx"
      showLineNumbers={true}
      theme={dracula}
    />
  );
};

const R3FCode = () => {
  return (
    <CopyBlock
      text={`
      "use client";

      import * as THREE from "three";
      import * as React from "react";
      import { useRef, useState } from "react";
      import { Canvas, useFrame } from "@react-three/fiber";
      
      const Box = (props: JSX.IntrinsicElements["mesh"]) => {
        const ref = useRef<THREE.Mesh>(null!);
        const [hovered, hover] = useState(false);
        const [clicked, click] = useState(false);
        useFrame((state, delta) => (ref.current.rotation.x += 0.01));
      
        return (
          <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
          </mesh>
        );
      };
      
      export default function Cube() {
        return (
          <>
            <div style={{ height: "500px" }}>
              <Canvas>
                <ambientLight intensity={Math.PI / 2} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  decay={0}
                  intensity={Math.PI}
                />
                <pointLight
                  position={[-10, -10, -10]}
                  decay={0}
                  intensity={Math.PI}
                />
                <Box position={[-1.2, 0, 0]} />
                <Box position={[1.2, 0, 0]} />
              </Canvas>
            </div>
          </>
        );
      }
      
`}
      language="jsx"
      showLineNumbers={true}
      theme={dracula}
    />
  );
};
