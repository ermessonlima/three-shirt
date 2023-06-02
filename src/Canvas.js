import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import {
  useGLTF,
  Environment,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  useTexture,
  Decal, 
} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "./store";

 

function AudioPlayer({ src }) {
  const audioRef = useRef(); 

  useEffect(() => {
    const audio = audioRef.current;  
    audio.src = src; 

   console.log(audio.src);
    audio.play().catch((error) => console.error('Falha ao reproduzir o áudio:', error));

   
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src]);

  return <audio ref={audioRef} />;
}


export const App = ({ position = [0, 0, 2.5], fov = 25, imagePath, fullimagePath }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    function playAudio() {
      setIsPlaying(true);
    }

    document.body.addEventListener('click', playAudio);

    return () => {
      document.body.removeEventListener('click', playAudio);
    };
  }, []);

  return (
    <>
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position, fov }}
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        <CameraRig>
          <Backdrop />
          <Center>
            <Shirt imagePath={imagePath} fullimagePath={fullimagePath} />
            <Speaker imagePath={imagePath} fullimagePath={fullimagePath} />
          </Center>
        </CameraRig>
      </Canvas>
      {isPlaying && (
        <AudioPlayer src={'./decrypto.mp3'} />
      )}
    </>
  );
};


function Shirt(props) {
  const snap = useSnapshot(state);
  
  const texture = useTexture(
    props.imagePath ? props.imagePath : `/${snap.selectedDecal}.png`
  );
 
  const { nodes, materials } = useGLTF("/shirt_baked_collapsed.glb");

 

  useFrame((state, delta) =>
    easing.dampC(materials.lambert1.color, snap.selectedColor, 0.25, delta)
  );


  materials.lambert1.color = new THREE.Color(snap.selectedColor);
 
  const material = new THREE.MeshStandardMaterial({
    color: snap.selectedColor,
  });
 
  materials.lambert1 = material;

  return (
    <>
     

    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      position={[0, 0, 0.1]}
      material-roughness={1}
      {...props}
      dispose={null}
    > 
      <Decal
        position={[0, 0.04, 0.15]}
        rotation={[0, 0, 0]}
        scale={  [0.2, 0.15, 0.2]}
        opacity={ 0.7}
        map={texture}
        map-anisotropy={16}
      />
    </mesh>
 
 
 
      </>
  );
}

function Speaker(props) {
  const snap = useSnapshot(state);
  
 

  const { nodes, materials } = useGLTF("/untitled.glb");
 

  useFrame((state, delta) =>
    easing.dampC(materials[""].color, "white", 0.25, delta)
  );


  materials[""].color = new THREE.Color("white");
 
  const material = new THREE.MeshStandardMaterial({
    color: "white",
  });
 
  materials[""] = material;
 
  return (
    <>
     
           
     <mesh
      castShadow
      shadows={false}
      geometry={nodes.box001.geometry}
      scale={[0.001,0.001,0.001]}
      material={materials[""]}
      rotation={[4.7,-3,0]}
      position={[0.5,0,- 0.2]}
      material-roughness={1}
      {...props}
      dispose={null}
    >
  
    </mesh>

           
    <mesh
      castShadow
      shadows={false}
      geometry={nodes.box001.geometry}
      scale={[0.001,0.001,0.001]}
      material={materials[""]}
      rotation={[4.7, 3,0]}
      position={[-0.5,0,- 0.2]}
      material-roughness={1}
      {...props}
      dispose={null}
    >
  
    </mesh>

      </>
  );
}

function Backdrop() {
  const shadows = useRef();

  useFrame((state, delta) =>
    easing.dampC(
      shadows.current.getMesh().material.color,
      state.selectedColor,
      0.25,
      delta
    )
  );

  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, -0.14]}
    >
      <RandomizedLight
        amount={4}
        radius={9}
        intensity={0.55}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  );
}

function CameraRig({ children }) {
  const group = useRef();

  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [snap.intro ? -state.viewport.width / 4 : 0, 0, 2],
      0.25,
      delta
    );
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
}

useGLTF.preload("/shirt_baked_collapsed.glb");
["/decrypto.png"].forEach(
  useTexture.preload
);
 
useGLTF.preload("/untitled.glb");