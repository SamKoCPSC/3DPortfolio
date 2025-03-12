'use client'
import { useState } from "react"
import dynamic from "next/dynamic"
import styles from "./page.module.css"
import { Button, Typography } from "@mui/material"
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber"
import { useEffect, Suspense } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { OrbitControls, PerspectiveCamera, ScrollControls, useScroll, Html } from '@react-three/drei'
import * as THREE from "three"
import Navbar from "./components/Navbar"
import Modal from "./components/Modal"

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const cameraPath = [
  {position: new THREE.Vector3(-0.5,1.5,0.5), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0))},
  {position: new THREE.Vector3(-1.3,2,-1.0), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.PI/2,0))},
  {position: new THREE.Vector3(-2.2,2.3,-0.8), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,Math.PI/2))},
  {position: new THREE.Vector3(-2,1.35,-1.33), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.PI/2.8,0))},
  {position: new THREE.Vector3(-0.5,1.5,-0.6), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,Math.PI/5,0))},
  {position: new THREE.Vector3(-0.5,2.5,-4.2), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,Math.PI/2.4,Math.PI/2))},
  {position: new THREE.Vector3(-0.5,1.5,-1.2), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-Math.PI/2,0))},
  {position: new THREE.Vector3(0.5,1.1,-1.2), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,-Math.PI/2.4,-Math.PI/2))},
  {position: new THREE.Vector3(0.5,0.9,-2.8), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,-Math.PI/2,-Math.PI/2))},
  {position: new THREE.Vector3(2.25,0.69,-2.919), rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/18,-Math.PI/1.5,Math.PI/20))}
]

let intervalCount = 0
let isNavigating = false
let navigateTo = null

function CameraScroller() {
  const scroll = useScroll()
  useFrame(({camera}) => {
    if(!isNavigating) {
      const pathIndex = Math.min(Math.floor(scroll.offset * (cameraPath.length-1)), cameraPath.length-2)
      const lerpFactor = easeInOutCubic((scroll.offset * (cameraPath.length-1)) - pathIndex)
      camera.quaternion.slerpQuaternions(cameraPath[pathIndex].rotation, cameraPath[pathIndex+1].rotation, lerpFactor)
      camera.position.lerpVectors(cameraPath[pathIndex].position, cameraPath[pathIndex+1].position, lerpFactor) 
    }
  });
  return null
}

function CameraNavigator() {
  const scroll = useScroll()
  const camera = useThree(state => state.camera)
  if(isNavigating) {
    let interval = setInterval(() => {
      if(intervalCount === 100) {
        clearInterval(interval)
        intervalCount = 0
        isNavigating = false
      }
      const lerpFactor = easeInOutCubic(intervalCount/100)
      camera.quaternion.slerpQuaternions(camera.quaternion, cameraPath[navigateTo].rotation, lerpFactor)
      camera.position.lerpVectors(camera.position, cameraPath[navigateTo].position, lerpFactor)
      intervalCount += 1
      // scroll.el.scrollTop = (scroll.el.scrollHeight/10)*navigateTo
      const scrollContainer = scroll.el;
      const totalScrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight; // Account for viewport height
      scroll.el.scrollTop = (totalScrollHeight / (cameraPath.length - 1)) * navigateTo;
    }, 15)
  }
  return null
}

const onClickEvents = [
  () => {console.log('room')},
  () => {window.open('https://google.com', '_blank')},
  () => {console.log('awexpress')},
  () => {console.log('sorter')},
  () => {console.log('pathfinder')},
  () => {console.log('projektor')},
  () => {console.log('lovbot')},
  () => {console.log('blenz')},
]

function PortfolioModel() {
  const objects = useLoader(GLTFLoader, [
      '/NonInteractables.glb', 
      '/Noms.glb', 
      '/AWExpress.glb', 
      '/Sorter.glb', 
      '/Pathfinder.glb',
      '/Projektor.glb',
      '/Lovbot.glb',
      '/Blenz.glb'
    ], (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  return (
    <>
      {objects.map((object, index) => <primitive key={index} object={object.scene} onClick={onClickEvents[index]}/>)}
    </>
  )
}

export default function Home() {
  const [triggerNavigator, setTriggerNavigator] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({welcome: true})
  const handleNavigate = (destination) => {
    navigateTo = destination
    isNavigating = true
    setTriggerNavigator(!triggerNavigator)
  }
  const handleModalOpen = (modalName, isOpen) => {
    const newObj = {...isModalOpen}
    newObj[modalName] = isOpen
    setIsModalOpen(newObj)
  }
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Navbar handleNavigate={handleNavigate}/>
      <Canvas camera={{fov: 50}}>
        <Suspense fallback={null}>
          <ScrollControls pages={cameraPath.length * 1.2}>
            <CameraNavigator triggerNavigator={triggerNavigator}/>  
            <CameraScroller/>
          </ScrollControls>
          <ambientLight/>
          <PortfolioModel/>
        </Suspense>
      </Canvas>
      <Modal open={isModalOpen.welcome} setOpen={(isOpen) =>{handleModalOpen('welcome', isOpen)}} width={1000} height={500}>
        <Typography sx={{fontSize: '3.5rem', marginBottom: '30px'}}>Hi there! Welcome to my Portfolio</Typography>
        <Typography sx={{fontSize: '2rem', marginBottom: '20px'}}>This is a fun project I created to showcase some of my work and introduce some things about myself</Typography>
        <Typography sx={{fontSize: '2rem'}}>To navigate through the scene, simply scroll up and down, or use the navigation bar at the top of the page</Typography>
      </Modal>
    </div>
  )
}
