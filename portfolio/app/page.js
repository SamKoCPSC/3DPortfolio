'use client'
import styles from "./page.module.css";
import { Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";

export default function Home() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry/>
        <meshStandardMaterial/>
      </mesh>
    </Canvas>
  )
}
