'use client'
import { useRef, useState, createRef } from "react"
import dynamic from "next/dynamic"
import styles from "./page.module.css"
import { Button, Typography, Box } from "@mui/material"
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Outline } from "@react-three/postprocessing"
import { useEffect, Suspense } from "react"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { OrbitControls, PerspectiveCamera, ScrollControls, useScroll, Html } from '@react-three/drei'
import * as THREE from "three"
import Navbar from "./components/Navbar"
import Modal from "./components/Modal"
import Carousel from "./components/Carousel"

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
      if(intervalCount === 150) {
        clearInterval(interval)
        intervalCount = 0
        isNavigating = false
      }
      const lerpFactor = easeInOutCubic(intervalCount/150)
      camera.quaternion.slerpQuaternions(camera.quaternion, cameraPath[navigateTo].rotation, lerpFactor)
      camera.position.lerpVectors(camera.position, cameraPath[navigateTo].position, lerpFactor)
      intervalCount += 1
      const scrollContainer = scroll.el;
      const totalScrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight; // Account for viewport height
      scroll.el.scrollTop = (totalScrollHeight / (cameraPath.length - 1)) * navigateTo;
    }, 10)
  }
  return null
}

function GLBModels({onClickEvents, setOutlined}) {
  const modelList = [
    'NonInteractables', 
    'Noms', 
    'AWExpress', 
    'Sorter', 
    'Pathfinder',
    'Projektor',
    'Lovbot',
    'Blenz'
  ]
  const objects = useLoader(GLTFLoader, modelList.map((model) => {
    return `${model}.glb`
  }), (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  return objects.map((object, index) => {return <primitive key={index} object={object.scene} onClick={onClickEvents[index]} onPointerEnter={()=>{setOutlined(objects[index].scene.children)}} onPointerLeave={()=>{setOutlined([])}}/>})
}
export default function Home() {
  // const objects = useLoader(GLTFLoader, modelList.map((model) => {
  //   return `${model}.glb`
  // }), (loader) => {
  //   const dracoLoader = new DRACOLoader()
  //   dracoLoader.setDecoderPath('/draco-gltf/')
  //   loader.setDRACOLoader(dracoLoader)
  // })
  const [outlined, setOutlined] = useState([])
  const [triggerNavigator, setTriggerNavigator] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({
    Welcome: true,
    Noms: false,
    AWExpress: false,
    Sorter: false,
    Pathfinder: false,
    Projektor: false,
    Lovbot: false,
    Blenz: false
  })
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
  const onClickEvents = [
    () => {},
    () => {handleModalOpen('Noms', true)},
    () => {handleModalOpen('AWExpress', true)},
    () => {handleModalOpen('Sorter', true)},
    () => {handleModalOpen('Pathfinder', true)},
    () => {handleModalOpen('Projektor', true)},
    () => {handleModalOpen('Lovbot', true)},
    () => {handleModalOpen('Blenz', true)},
  ]
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
          <GLBModels onClickEvents={onClickEvents} setOutlined={setOutlined}/>
          {/* {objects.map((object, index) => {return <primitive key={index} object={object.scene} onClick={onClickEvents[index]} onPointerEnter={()=>{setOutlined(objects[index].scene.children)}} onPointerLeave={()=>{setOutlined([])}}/>})} */}
          <EffectComposer autoClear={false}>
            <Outline
              selection={outlined}
              blur={true}
              xRay={false}
              pulseSpeed={0.2}
              edgeStrength={3}
              visibleEdgeColor={'white'}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <Modal open={isModalOpen.Welcome} setOpen={(isOpen) =>{handleModalOpen('Welcome', isOpen)}} width={1000} height={500}>
        <Typography sx={{fontSize: '3.5rem', marginBottom: '30px'}}>Hi there! Welcome to my Portfolio</Typography>
        <Typography sx={{fontSize: '2rem', marginBottom: '20px'}}>This is a fun project I created to showcase some of my work and introduce some things about myself</Typography>
        <Typography sx={{fontSize: '2rem'}}>To navigate through the scene, simply scroll up and down, or use the navigation bar at the top of the page</Typography>
      </Modal>
      <Modal open={isModalOpen.Noms} setOpen={(isOpen) => {handleModalOpen('Noms', isOpen)}} width={1000} height={1200}>
        <Typography sx={{fontSize: '4rem', alignSelf: 'center'}}>Noms - Recipe Management App</Typography>
        <Carousel slidesPerView={1} height={500} slides={['Noms/Home1.png', 'Noms/Home2.png', 'Noms/Create1.png', 'Noms/Recipe1.png', 'Noms/Recipe2.png', 'Noms/Branch1.png'].map((imageURL) => {
            return (
              <Box 
                component={'img'}
                alt="image"
                src={imageURL}
                height='90%'
              />
            )
          }
        )}
        />
        <Box sx={{height: 475, overflow: 'auto'}}>
          <Typography sx={{fontSize: '1.5rem'}}>
            <h2>Description</h2>
            <b>Noms</b> is a full-stack application designed to help cooks develop, manage, and share recipes. As a cooking enthusiast myself I found that I often didn't
            have a convenient place to store recipes, and in addition I found that as I adjusted recipes over time, I didn't have to good way to track what changes
            I was making and how they affected the final result. <br/><br/>
            Inspired by GitHub's version control system, I wanted to create a similar system that would make recipe development more convenient, allowing users to iterate 
            on their own and other's existing recipes while keeping a record of what changes have been made overtime. <b>Noms</b> supports a branching system, where on top of 
            being able to create new versions, you can also create new variations. Overtime, different users may create branches off of other branches resulting in a recipe tree. <br/>
            <h2>Technologies</h2>
            <b>Noms</b> was developed with <b>NextJS 14</b> and <b>AWS</b> services such as Lambda, RDS, S3, API Gateway, and Amplify. The frontend UI is implemented using MaterialUI, and most 
            of the backend logic such as data validation, authentication, and processing is implemented within NextJS's API Routes. For better security, a <b>Python 3</b> lambda function triggered via API Gateway 
            is used to connect to a <b>PostgreSQL</b> RDS instance to minimize the risk of exposing the database publicly. Authentication is handled with Google OAuth and NextAuth.js<b/><b/>
            <h2>Challenges</h2>
            As this was the first experience I had managing my own AWS account, it took some time to learn how to properly set up the various AWS services I would need, for example setting up
            the bucket policies for S3, triggering Lambda via API Gateway, configuring my .yml file when deploying on Amplify etc. In particular, configuring Amplify to deploy a NextJS app was 
            quite tricky as it's not immediately obvious you have to use the CloudShell terminal to manually change the WEB_COMPUTE value in Amplify, which took a bit of Googling to eventually 
            figure out.<br/><br/>
            This was also my first time setting up a database myself. As I knew the app would require a lot of relational data, I figured that RDS would be appropriate. I also wanted to take my 
            time on the database's architecture as I knew some good planning would mitigate the need to rearrange large amounts of data in the future. Creating an RDS instance 
            was relatively simple, and I used the DBeaver SQL client to connect. I had to learn the basics of relational databases and SQL, for example, familiarizing myself with SQL syntax, 
            learning how tables, rows, and columns worked, understanding normalization etc.<br/><br/>
            Constructing SQL queries turned out to be more complicated than I thought. One complication was my design for storing ingredient data for recipes. A future feature I anticipated was 
            searching for recipes based on specific ingredients, and I realized that simply storing ingredient data as an array would be inefficient. As recipes might be related through ingredients 
            I created an ingredients table. As such when a new recipe is created, I would potentially also need to create new rows for ingredients while preventing duplicates, and when recipes are 
            requested I would need to join the ingredient data with recipe data. This complicated the SQL queries significantly, and I had to learn how to use Common Table Expressions to handle more 
            complicated queries.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isModalOpen.AWExpress} setOpen={(isOpen) => {handleModalOpen('AWExpress', isOpen)}} width={1000} height={1200}>
        <Typography sx={{fontSize: '4rem', alignSelf: 'center'}}>AWExpress - Marketplace Platform</Typography>
        <Carousel slidesPerView={1} height={500} slides={['AWExpress/Home1.png', 'AWExpress/Search1.png', 'AWExpress/Product1.png', 'AWExpress/Create1.png', 'AWExpress/Cart1.png', 'AWExpress/Cart2.png', 'AWExpress/Checkout1.png', 'AWExpress/Success1.png', 'AWExpress/Account1.png'].map((imageURL) => {
            return (
              <Box 
                component={'img'}
                alt="image"
                src={imageURL}
                height='90%'
              />
            )
          }
        )}
        />
        <Box sx={{height: 475, overflow: 'auto'}}>
          <Typography sx={{fontSize: '1.5rem'}}>
            <h2>Description</h2>
            <b>AWExpress</b> was a team project I created with a group of 7 for a project-based Software Engineering class at UBC. We were given a set of requirmented features for a marketplace app 
            at the beginning of the course, and we were allowed to make our own decisions on implementation. To simulate a more realistic experience, the teaching staff would act as stakeholders for 
            the project, requiring documentation, and imposing intermediate deadlines for certain features, approving them as they were implemented.<br/><br/>
            The app was designed as a marketplace where invdividuals would be able to buy and sell items from other individuals. Features included, order tracking, email notifications, admin moderation 
            tools, mobile responsive UI, and advanced search filtering. As one of the more experienced developers on the team, I was invovlved with both frontend and backend work. I was in charge of 
            desgining most of the frontend UI, and most of the core backend APIs.
            <h2>Technologies</h2>
            <b>AWExpress</b> was developed with <b>NextJS 13</b> and <b>AWS</b> services such as Lambda, Step Functions, RDS, S3, API Gateway, and Amplify. We also used MaterialUI as our UI component library, Redux for state management, 
            and NextAuth.js and Google OAuth for authentication. We utilized a <b>MySQL</b> database connected via Lambda and API Gateway. Most of the backend logic was implemented with <b>Python 3</b> within several 
            Lambda functions.
            <h2>Challenges</h2>
            As this was many of our first experiences working with a relatively large team of other developers, communication was one of the key components of success. By communicating with each other 
            effectively, the team was able to meet deadlines efficiently by properly prioritizing and distributing the workload. We regularly scheduled out-of-class meetings, both in-person and online, and 
            regularly updated each other on progress. With this strategy, every team member was able to clearly identify what needed to be done, and the team was able to reduce the amount of time fixing 
            bugs and adapting to unexpected challenges.<br/><br/>
            This was my first experience working on a full-stack application. Prior to this project, although I had previous experience with React, I had not worked with NextJS, AWS, or databases. NextJS was 
            relatively intuitive, as it was a React framework, but I had to take some time to learn about some of NextJS's features such as file routing, pages API system, and client vs server rendering. 
            Although challenging I was able to learn the core concepts of NextJS quickly. <br/><br/>
            This was also my first experience using a cloud computing service such as AWS. For this project, I primarily worked with and learned about Lambda. At first I wasn't sure what so-called severless 
            functions were about, but as I learned more I understood the advantages, and was able to seemlessly integrate our Lambda APIs into our project.<br/><br/>
            SQL was another challenge. Prior to this project, I didn't have experience in relational databases, and as one of the team's main backend developers, I had to quickly learn about the fundamentals.
            At first database architecture seemed unintuitive, but as I practiced writing SQL queries, and as I learned more about relational databases, I understood the advantages in organizing data 
            in a relational structure.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isModalOpen.Sorter} setOpen={(isOpen) => {handleModalOpen('Sorter', isOpen)}} width={1000} height={1200}>
        <Typography sx={{fontSize: '4rem', alignSelf: 'center'}}>Sorting Visualizer</Typography>
        <Carousel slidesPerView={1} height={500} slides={['Sorter/Home1.png', 'Sorter/Shuffled1.png', 'Sorter/Sorted1.png', 'Sorter/InsertionMid1.png', 'Sorter/MergeMid1.png', 'Sorter/MergeMid2.png', 'Sorter/QuickMid1.png', 'Sorter/HeapMid1.png'].map((imageURL) => {
            return (
              <Box 
                component={'img'}
                alt="image"
                src={imageURL}
                height='90%'
              />
            )
          }
        )}
        />
        <Box sx={{height: 475, overflow: 'auto'}}>
          <Typography sx={{fontSize: '1.5rem'}}>
            <h2>Description</h2>
            This project was the first project I created using React. At the time, I was learning a lot about algorithms in school, and so I was motivated to apply what I had learned. Sorting visualization 
            is a relatively common project idea, and so to make it a bit more unique, I also designed a UI that lets the user change certain variables in the visualization such as the sorting speed, the set 
            size, the sorting direction, and the algorithm. In addition, I also decided to include some statistical information to more clearly compare different algorithms.
            <h2>Technologies</h2>
            <b>The Sorting Visualizer</b> only used <b>React 16</b>. All of the algorithms run client-side, and the app doesn't store any information between sessions. The algorithms are implemented from 
            scratch in JavaScript without any other libraries. 
            <h2>Challenges</h2>
            As this was my first time using React, the primary challenge learning about and implementing the fundamentals, such as understanding components, state and props, JSX etc. In partciular, state and 
            props were concepts that were very different from coding in pure JavaScript where the DOM is directly manipulated to create visualizations.<br/><br/>
            Another challenge was the implementation of the various algorithms. The O(nlogn) algorithms, Quick Sort, Merge Sort, and Heap Sort were, as one would expect, more complex than the more basic algorithms 
            such as Selection Sort, and required quite a bit of thinking to understand how they worked.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isModalOpen.Pathfinder} setOpen={(isOpen) => {handleModalOpen('Pathfinder', isOpen)}} width={1000} height={1200}>
        <Typography sx={{fontSize: '4rem', alignSelf: 'center'}}>Pathfinding Visualizer</Typography>
        <Carousel slidesPerView={1} height={500} slides={['Pathfinder/Home1.png', 'Pathfinder/Basic1.png', 'Pathfinder/Wall1.png', 'Pathfinder/Multi1.png', 'Pathfinder/Weight1.png'].map((imageURL) => {
            return (
              <Box 
                component={'img'}
                alt="image"
                src={imageURL}
                height='90%'
              />
            )
          }
        )}
        />
        <Box sx={{height: 475, overflow: 'auto'}}>
          <Typography sx={{fontSize: '1.5rem'}}>
            <h2>Description</h2>
            A <b>Pathfinder</b> was my first attempt at creating a web project on my own, without following a tutorial. Prior to this project, I had only worked on example projects uploaded on YouTube. The basic idea 
            of the project was to visualize Dijkstra's Algorithm on a grid-based graph, complete with the ability to add weighted edges. In addition, I also added the functionality of being able to add multiple destination 
            nodes, and multiple source nodes.
            <h2>Technologies</h2>
            As this was my first attempt at a web project, the entire project was coded in vanilla JavaScript, CSS, and HTML with no libraries. Dijkstra's was implemented from scratch, and is calculated client-side.
            <h2>Challenges</h2>
            Since this was my first real project, the main challenge was learning the basics of web development, particulary JavaScript, HTML, and CSS. As I had prior programming experience, JavaScript itself wasn't too much 
            a challenge since many skills are interchangeable between different programming languages. However HTML and CSS proved to be challenging intially, and it took a while to grasp how to work with the tree-like 
            structure of HTML, and the very many CSS properties. Something as simple as positioning a div was difficult, and I often had to rely on trial and error without really understanding how the elements were interacting 
            with the many positional properties.<br/><br/>
            Because I was working in basic JavaScript I didn't have the conveniences afforded by any frameworks or libraries. It wasn't obvious at the time, since I wasn't aware of the existence of JavaScript frameworks, but 
            learning how to manually manipulate the DOM was tricky especially in the context of creating a moderately animated visualization due to the many moving parts that needed to be synchronized.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isModalOpen.Projektor} setOpen={(isOpen) => {handleModalOpen('Projektor', isOpen)}} width={1000} height={1200}>
        <Typography sx={{fontSize: '4rem', alignSelf: 'center'}}>Projektor - Technical Support</Typography>
        <Carousel slidesPerView={1} height={500} slides={['Projektor/Home1.png', 'Projektor/Home2.png', 'Projektor/Home3.png', 'Projektor/Home4.png', 'Projektor/Help1.png'].map((imageURL) => {
            return (
              <Box 
                component={'img'}
                alt="image"
                src={imageURL}
                height='90%'
              />
            )
          }
        )}
        />
        <Box sx={{height: 475, overflow: 'auto'}}>
          <Typography sx={{fontSize: '1.5rem'}}>
          I was employed at <b>Projektor</b> as a <b>Technical Support Agent</b> from May 2019 to December 2023. I was hired through the University of British Colombia's Co-op Program, and was retained after the term ended, 
          continuing to work part-time remotely while taking classes.<br/><br/>
          Projektor is a media sharing platform for independent filmmakers and movie-watchers looking to sell and buy independent film content. The platform is a free-to-use transaction-based system, where filmmakers can freely 
          upload content on their own, paying a small fee per customer transaction.<br/><br/>
          My primary responsbilities included responding to technical support requests from users through email and our helpdesk software Zendesk. My secondary responsibilities included assisting with user testing, documentating bugs, 
          creating and managing the FAQ page, data entry, and working with partners to expand content beyond Projektor.
          </Typography>
        </Box>
      </Modal>
      <Modal open={isModalOpen.Lovbot} setOpen={(isOpen) => {handleModalOpen('Lovbot', isOpen)}} width={1000} height={1200}>
        <Typography>Lovbot</Typography>
      </Modal>
      <Modal open={isModalOpen.Blenz} setOpen={(isOpen) => {handleModalOpen('Blenz', isOpen)}} width={1000} height={1200}>
        <Typography>Blenz</Typography>
      </Modal>
    </div>
  )
}
