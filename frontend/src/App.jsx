
import './App.css'

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';
import { OrbitControls, Sparkles } from '@react-three/drei'
import Portal from './components/Portal';

export default function App({ scale = Array.from({ length: 50 }, () => 0.5 + Math.random() * 4) }) {

  return (
    <section  className='app'>
      <Leva hidden={true} />
      <Canvas
      
        shadows
        camera={{
          position: [0, 0, 1],
          fov: 100,
        }}
      >
        <Sparkles count={scale.length}  position={[0, 0.9, 0]} scale={[4, 1.5, 4]} speed={0.3} />
        <Portal />
        <OrbitControls />
      </Canvas>


    </section>

  )
}

