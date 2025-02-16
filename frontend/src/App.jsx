
import './App.css'

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';

export default function App() {
  

  return (
    <section className='app'>
      <Leva hidden={true} />
      <Canvas
        shadows
        camera={{
          position: [0, 0, 1],
          fov: 50,
        }}
      >
      </Canvas>
    </section>

  )
}
