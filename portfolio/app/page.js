'use client'
import styles from "./page.module.css"
import { Typography } from "@mui/material"
import { Canvas, useLoader } from "@react-three/fiber"
import { Suspense } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, ScrollControls } from '@react-three/drei'

export default function Home() {
  const gltf = useLoader(GLTFLoader, '/ThreeJSPortfolioOptimized.glb')

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{fov: 60, position: [0, 5, 3], rotation: [0, 0, 0]}}>
        <Suspense fallback={null}>
          <ambientLight/>
          {/* <OrbitControls/> */}
          <primitive object={gltf.scene}/>
        </Suspense>
      </Canvas>
    </div>
  )
}
