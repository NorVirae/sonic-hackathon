
import './App.css'

import { Canvas } from "@react-three/fiber"

import { Leva } from 'leva';
import { OrbitControls, Sparkles } from '@react-three/drei'
import Portal from './components/Portal';
import Environment from './components/Environment';
import ChatScreen from './pages/ChatScreen';

export default function App() {

  return (
    <section  className='app'>
      <Leva hidden={true} />
      <ChatScreen/>
      <Canvas
      
        shadows
        camera={{
          position: [0, 0, 1],
          fov: 100,
        }}
      >
        <Environment/>
      </Canvas>


    </section>

  )
}

