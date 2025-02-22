'use client'
import styles from "./page.module.css"
import { Typography } from "@mui/material"
import { Canvas, useLoader, useFrame } from "@react-three/fiber"
import { Suspense } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, PerspectiveCamera, ScrollControls, useScroll, Scroll } from '@react-three/drei'
import * as THREE from "three"

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const cameraPath = [
  {position: new THREE.Vector3(0,3,2.5), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0))},
  {position: new THREE.Vector3(0,3.5,0.1), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.PI/2,0))},
  {position: new THREE.Vector3(3,3.5,0.1), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0))}
]

function CameraScroller() {
  const scroll = useScroll()
  //const pathIndex = Math.floor(scroll.offset * (cameraPath.length))
  useFrame(({ camera }) => {
    const pathIndex = Math.min(Math.floor(scroll.offset * (cameraPath.length-1)), cameraPath.length-2)
    const lerpFactor = easeInOutCubic((scroll.offset * (cameraPath.length-1)) - pathIndex)
    camera.quaternion.slerpQuaternions(cameraPath[pathIndex].rotation, cameraPath[pathIndex+1].rotation, lerpFactor)
    camera.position.lerpVectors(cameraPath[pathIndex].position, cameraPath[pathIndex+1].position, lerpFactor)
  });
  return null;
}

export default function Home() {
  const gltf = useLoader(GLTFLoader, '/ThreeJSPortfolioOptimized.glb')

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{fov: 50}}>
        <Suspense fallback={null}>
          <ScrollControls pages={6}>
            <CameraScroller/>
          </ScrollControls>
          {/* <OrbitControls/> */}
          <ambientLight/>
          <primitive object={gltf.scene}/>
        </Suspense>
      </Canvas>
    </div>
  )
}
