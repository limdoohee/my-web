import Image from "next/image";
import styles from "./page.module.css";
import { TextGenerateEffectDemo } from "./TextGenerateEffectDemo";
import { HeroParallaxDemo } from "./Parallax";

export default function Home() {
  return (
    <main>
      <TextGenerateEffectDemo />
      <HeroParallaxDemo />
    </main>
  );
}
