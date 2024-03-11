import React, { forwardRef } from "react";
import { Html, useGLTF, ScrollControls, useScroll } from "@react-three/drei";
import styles from "./scroll.module.css";

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

Text.displayName = "Text";

export default Text;
